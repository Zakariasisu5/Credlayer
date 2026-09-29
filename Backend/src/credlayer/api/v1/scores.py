"""Wallet reputation scoring endpoints."""

from __future__ import annotations

import json
import re
from typing import Annotated

import httpx
import structlog
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from credlayer.api.envelope import Envelope, ok
from credlayer.core.config import get_settings
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/scores", tags=["scores"])


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class WalletScore(CamelModel):
    """Single wallet reputation score returned by the scoring endpoint."""

    address: str
    trust_score: int = Field(..., ge=0, le=1000)
    trust_level: str
    risk_level: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    fraud_probability: float = Field(..., ge=0.0, le=1.0)
    network: str = "solana"
    explanation: str


class BatchScoreRequest(BaseModel):
    """Request body for batch scoring."""

    addresses: list[str] = Field(..., min_length=1, max_length=100)


# ---------------------------------------------------------------------------
# Service Layer
# ---------------------------------------------------------------------------


class WalletScorer:
    def __init__(self):
        self.settings = get_settings()

    async def score_address(self, address: str) -> dict:
        """
        Fetches the wallet score from the GNN microservice.
        Returns a dictionary matching the WalletScore schema.
        """
        if not self.settings.ml_service_url:
            logger.error("ml_service_url_not_configured", address=address)
            raise HTTPException(status_code=503, detail="Scoring service is not configured.")

        ml_service_url = f"{self.settings.ml_service_url.rstrip('/')}/api/v1/scores/{address}"

        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                # Explicit GET request to the ML service
                response = await client.get(ml_service_url)
                response.raise_for_status()

            except httpx.RequestError as exc:
                logger.error("ml_service_unreachable", address=address, error=repr(exc))
                raise HTTPException(
                    status_code=503, detail="GNN scoring engine is currently unreachable."
                ) from exc
            except httpx.HTTPStatusError as exc:
                logger.error(
                    "ml_service_http_error", address=address, status=exc.response.status_code
                )
                raise HTTPException(
                    status_code=502,
                    detail=f"GNN scoring engine returned an error: {exc.response.status_code}",
                ) from exc

            try:
                ml_response = response.json()
                score_data = ml_response.get("data")

                if not score_data:
                    raise ValueError("Missing 'data' object in ML service response")

                return score_data

            except Exception as exc:
                logger.error("ml_service_malformed_response", address=address, error=repr(exc))
                raise HTTPException(
                    status_code=500, detail="Received invalid payload from the GNN scoring engine."
                ) from exc

    async def score_batch(self, addresses: list[str]) -> list[dict]:
        """
        Batch scoring via the GNN microservice.
        """
        if not self.settings.ml_service_url:
            logger.error("ml_service_url_not_configured", addresses=addresses)
            raise HTTPException(status_code=503, detail="Scoring service is not configured.")

        ml_service_url = f"{self.settings.ml_service_url.rstrip('/')}/api/v1/scores/batch"

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(ml_service_url, json={"addresses": addresses})
                response.raise_for_status()
            except httpx.RequestError as exc:
                logger.error("ml_service_unreachable", addresses=addresses, error=repr(exc))
                raise HTTPException(
                    status_code=503, detail="GNN scoring engine is currently unreachable."
                ) from exc
            except httpx.HTTPStatusError as exc:
                logger.error(
                    "ml_service_http_error", addresses=addresses, status=exc.response.status_code
                )
                raise HTTPException(
                    status_code=502,
                    detail=f"GNN scoring engine returned an error: {exc.response.status_code}",
                ) from exc

            try:
                ml_response = response.json()
                score_data = ml_response.get("data")

                if not score_data:
                    raise ValueError("Missing 'data' object in ML service response")

                return score_data
            except Exception as exc:
                logger.error("ml_service_malformed_response", addresses=addresses, error=repr(exc))
                raise HTTPException(
                    status_code=500, detail="Received invalid payload from the GNN scoring engine."
                ) from exc


def get_scorer() -> WalletScorer:
    return WalletScorer()


ScorerDependency = Annotated[WalletScorer, Depends(get_scorer)]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get(
    "/{address}",
    response_model=Envelope[WalletScore],
    summary="Score a single wallet",
    description="Query the standalone ML microservice for the GNN-derived trust score.",
)
async def score_wallet(address: str, scorer: ScorerDependency) -> Envelope[WalletScore]:
    result = await scorer.score_address(address)
    validated_score = WalletScore.model_validate(result)
    return ok(validated_score)


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(payload, separators=(',', ':'))}\n\n"


@router.get("/dev/relayer-status", include_in_schema=False)
async def relayer_status(scorer: ScorerDependency) -> dict:
    relayer_base = scorer.settings.relayer_service_url
    if not relayer_base:
        return {"available": False}
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{relayer_base.rstrip('/')}/health")
            response.raise_for_status()
        return {"available": True}
    except Exception as exc:
        logger.warning("relayer_health_check_failed", error=repr(exc))
        return {"available": False}


@router.post("/{address}/attestation/issue", include_in_schema=False)
async def issue_attestation_debug(address: str, scorer: ScorerDependency) -> dict:
    if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{32,44}", address):
        raise HTTPException(status_code=422, detail="Invalid Solana wallet address.")
    relayer_base = scorer.settings.relayer_service_url
    if not relayer_base:
        raise HTTPException(status_code=503, detail="Attestation service is unavailable.")

    score = WalletScore.model_validate(await scorer.score_address(address))
    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            response = await client.post(
                f"{relayer_base.rstrip('/')}/api/v1/attestations/issue",
                json={
                    "targetWallet": address,
                    "trustScore": score.trust_score,
                    "riskLevel": score.risk_level.upper(),
                },
            )
            response.raise_for_status()
            return {"score": score.model_dump(by_alias=True), "relayer": response.json()}
    except Exception as exc:
        logger.exception("debug_attestation_issue_failed", address=address, error=repr(exc))
        raise HTTPException(status_code=502, detail="Attestation issuance failed.") from exc


@router.post(
    "/{address}/attestation",
    summary="Calculate a real score and verify a wallet attestation",
    description=(
        "Streams user-safe progress while scoring, issuing when needed, and verifying on-chain."
    ),
)
async def score_and_attest(address: str, scorer: ScorerDependency) -> StreamingResponse:
    if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{32,44}", address):
        raise HTTPException(status_code=422, detail="Invalid Solana wallet address.")

    async def event_stream():
        relayer_base = scorer.settings.relayer_service_url
        if not relayer_base:
            logger.error("relayer_service_url_not_configured", address=address)
            yield _sse("error", {"code": "attestation"})
            return

        relayer_base = relayer_base.rstrip("/")
        verify_url = f"{relayer_base}/api/v1/attestations/{address}"
        yield _sse("progress", {"stage": "preparing"})
        failure_code = "attestation"

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                existing_response = await client.get(verify_url)
                existing_response.raise_for_status()
                existing_data = existing_response.json().get("data", {})
                already_exists = existing_data.get("verified") is True

                if already_exists:
                    yield _sse(
                        "progress",
                        {
                            "stage": "already_verified",
                            "message": (
                                "Your wallet is already verified. We're checking "
                                "your existing attestation."
                            ),
                        },
                    )
                else:
                    yield _sse("progress", {"stage": "scoring"})
                    try:
                        score = WalletScore.model_validate(await scorer.score_address(address))
                    except Exception as exc:
                        logger.exception(
                            "wallet_score_workflow_failed", address=address, error=repr(exc)
                        )
                        yield _sse("error", {"code": "scoring"})
                        return

                    yield _sse("progress", {"stage": "issuing"})
                    issue_response = await client.post(
                        f"{relayer_base}/api/v1/attestations/issue",
                        json={
                            "targetWallet": address,
                            "trustScore": score.trust_score,
                            "riskLevel": score.risk_level.upper(),
                        },
                    )
                    issue_response.raise_for_status()
                    issue_data = issue_response.json()
                    if issue_data.get("success") is not True:
                        raise ValueError("Relayer did not confirm attestation issuance")
                    already_exists = issue_data.get("alreadyExists") is True

                yield _sse("progress", {"stage": "verifying"})
                failure_code = "verification"
                if already_exists and existing_data.get("verified") is True:
                    verification_data = existing_data
                else:
                    verification_response = await client.get(verify_url)
                    verification_response.raise_for_status()
                    verification_data = verification_response.json().get("data", {})
                if verification_data.get("verified") is not True:
                    logger.error("attestation_verification_missing", address=address)
                    yield _sse("error", {"code": "verification"})
                    return
                verified_score = verification_data.get("attestation") or {}
                verified_trust_score = verified_score.get("trustScore")
                verified_risk_level = verified_score.get("riskLevel")
                if not isinstance(verified_trust_score, int) or not isinstance(
                    verified_risk_level, str
                ):
                    logger.error("attestation_payload_invalid", address=address)
                    yield _sse("error", {"code": "verification"})
                    return

            yield _sse(
                "result",
                {
                    "score": {
                        "trustScore": verified_trust_score,
                        "riskLevel": verified_risk_level,
                    },
                    "attestation": {
                        "verified": True,
                        "alreadyExisted": already_exists,
                        "trustScore": verified_trust_score,
                        "riskLevel": verified_risk_level,
                    },
                },
            )
        except Exception as exc:
            logger.exception("attestation_workflow_failed", address=address, error=repr(exc))
            yield _sse("error", {"code": failure_code})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post(
    "/batch",
    response_model=Envelope[list[WalletScore]],
    summary="Score multiple wallets in batch",
    description="Batch scoring via the standalone ML microservice.",
)
async def score_batch(
    body: BatchScoreRequest, scorer: ScorerDependency
) -> Envelope[list[WalletScore]]:
    results = await scorer.score_batch(body.addresses)
    scores = [WalletScore.model_validate(item) for item in results]
    return ok(scores)
