"""Standalone FastAPI service for CredLayer GNN Reputation & Fraud Scoring.
"""
from __future__ import annotations

import re
from datetime import UTC, datetime
from typing import Any, Generic, TypeVar

import httpx
import structlog
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from credlayer_ml.config import ServerSettings, get_default_config
from credlayer_ml.inference import get_scorer
from credlayer_ml.model_manager import download_model_artifacts, verify_artifacts

logger = structlog.get_logger(__name__)

T = TypeVar("T")


def _now_iso() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Envelope(BaseModel, Generic[T]):
    success: bool = True
    data: T
    message: str | None = None
    timestamp: str


def ok(data: T, message: str | None = None) -> Envelope[T]:
    return Envelope(data=data, message=message, timestamp=_now_iso())


class WalletScore(CamelModel):
    address: str
    trust_score: int = Field(..., ge=0, le=1000)
    trust_level: str
    risk_level: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    fraud_probability: float = Field(..., ge=0.0, le=1.0)
    network: str = "solana"
    explanation: str


class BatchScoreRequest(BaseModel):
    addresses: list[str] = Field(..., min_length=1, max_length=100)


class AttestationResponse(CamelModel):
    """Result of issuing an on-chain attestation for a wallet score.

    The attestation states that CredLayer, as a registered issuer, claims the
    wallet has this score. It does not prove the score is accurate.
    """

    success: bool
    tx_hash: str | None = None
    attestation_address: str | None = None
    score: WalletScore | None = None
    error: str | None = None


# Solana addresses are 32-byte public keys, base58-encoded (32-44 characters).
_BASE58_ADDRESS_RE = re.compile(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$")
_RELAYER_TIMEOUT_SECONDS = 30.0


def _attestation_error(status_code: int, error: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"success": False, "error": error})


def _extract(payload: Any, *keys: str) -> str | None:
    """Look up the first matching key in a relayer payload, top-level or under ``data``."""
    if not isinstance(payload, dict):
        return None
    containers = [payload]
    if isinstance(payload.get("data"), dict):
        containers.append(payload["data"])
    for container in containers:
        for key in keys:
            value = container.get(key)
            if isinstance(value, str) and value:
                return value
    return None


def create_app() -> FastAPI:
    server_settings = ServerSettings()
    
    app = FastAPI(
        title="CredLayer ML Scoring Service",
        version="0.1.0",
        description="Standalone microservice providing GNN-based wallet reputation scores and fraud intelligence.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=server_settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup_event():
        """Download model artifacts from Hugging Face if not present locally."""
        logger.info("Starting up ML service, checking model artifacts...")
        config = get_default_config()
        
        try:
            model_success, graph_success = download_model_artifacts(config.paths)
            if model_success and graph_success:
                logger.info("Model artifacts ready for inference")
            else:
                logger.warning(
                    "Model artifacts partially available",
                    model_success=model_success,
                    graph_success=graph_success,
                )
        except RuntimeError as exc:
            logger.error(
                "CRITICAL: Failed to initialize model artifacts at startup",
                error=str(exc),
            )
            # Allow service to start but /readyz will report not ready
            # This makes the failure visible in Railway deployment status
            pass

    @app.get("/healthz", tags=["infra"])
    async def healthz() -> dict[str, str]:
        return {"status": "ok", "service": "credlayer-ml"}

    @app.get("/readyz", tags=["infra"])
    async def readyz() -> dict[str, str]:
        scorer = get_scorer()
        model_exists, graph_exists = verify_artifacts(scorer.config.paths)
        
        # Also verify the scorer actually loaded the artifacts
        scorer._load()
        models_loaded = scorer.model is not None and scorer.graph is not None
        
        is_ready = model_exists and graph_exists and models_loaded
        return {
            "status": "ok" if is_ready else "not_ready",
            "graph_exists": str(graph_exists),
            "model_exists": str(model_exists),
            "models_loaded": str(models_loaded),
        }

    @app.get(
        "/api/v1/scores/{address}",
        response_model=Envelope[WalletScore],
        tags=["scores"],
        summary="Score a single wallet address",
    )
    async def score_wallet(address: str) -> Envelope[WalletScore]:
        scorer = get_scorer()
        result = await scorer.score_address(address)
        return ok(WalletScore(**result))

    @app.post(
        "/api/v1/scores/batch",
        response_model=Envelope[list[WalletScore]],
        tags=["scores"],
        summary="Score multiple wallet addresses in batch",
    )
    async def score_batch(body: BatchScoreRequest) -> Envelope[list[WalletScore]]:
        scorer = get_scorer()
        results = await scorer.score_batch(body.addresses)
        return ok([WalletScore(**r) for r in results])

    @app.post(
        "/api/v1/scores/{address}/attestation",
        response_model=AttestationResponse,
        response_model_exclude_none=True,
        tags=["scores"],
        summary="Score a wallet and issue an on-chain attestation via the relayer",
    )
    async def attest_score(address: str):
        if not _BASE58_ADDRESS_RE.match(address):
            return _attestation_error(400, "Invalid Solana address")

        relayer_url = server_settings.relayer_url
        if not relayer_url:
            logger.error("RELAYER_URL is not configured")
            return _attestation_error(503, "Attestation relayer is not configured")

        scorer = get_scorer()
        try:
            result = await scorer.score_address(address)
            score = WalletScore(**result)
        except RuntimeError as exc:
            logger.error("Scoring unavailable for attestation", address=address, error=str(exc))
            return _attestation_error(503, "Scoring service unavailable")
        except Exception as exc:
            logger.error("Scoring failed for attestation", address=address, error=str(exc))
            return _attestation_error(500, "Failed to score wallet")

        url = f"{relayer_url.rstrip('/')}/api/v1/attestations/issue"
        payload = {
            "targetWallet": address,
            "trustScore": score.trust_score,
            "riskLevel": score.risk_level,
        }

        try:
            async with httpx.AsyncClient(timeout=_RELAYER_TIMEOUT_SECONDS) as client:
                response = await client.post(url, json=payload)
        except httpx.RequestError as exc:
            logger.error("Relayer unavailable", address=address, error=str(exc))
            return _attestation_error(503, "Attestation relayer unavailable")

        if response.status_code >= 400:
            logger.error(
                "Relayer rejected attestation",
                address=address,
                status=response.status_code,
                body=response.text[:500],
            )
            return _attestation_error(
                502, f"Attestation relayer rejected the request (status {response.status_code})"
            )

        try:
            body = response.json()
        except ValueError:
            logger.error("Relayer returned non-JSON response", address=address)
            return _attestation_error(502, "Attestation relayer returned an invalid response")

        if isinstance(body, dict) and body.get("success") is False:
            reason = _extract(body, "error", "message") or "Attestation relayer reported failure"
            return _attestation_error(502, reason)

        tx_hash = _extract(body, "txHash", "signature", "transactionHash", "tx_hash")
        if not tx_hash:
            logger.error("Relayer response missing transaction hash", address=address)
            return _attestation_error(502, "Attestation relayer returned no transaction hash")

        return AttestationResponse(
            success=True,
            tx_hash=tx_hash,
            attestation_address=_extract(
                body, "attestationAddress", "attestationPda", "attestation_address"
            ),
            score=score,
        )

    return app


app = create_app()

if __name__ == "__main__":
    import os
    settings = ServerSettings()
    uvicorn.run(
        "credlayer_ml.main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8001)),
        reload=True
    )
