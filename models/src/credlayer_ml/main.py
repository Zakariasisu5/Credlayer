"""Standalone FastAPI service for CredLayer GNN Reputation & Fraud Scoring.
"""
from __future__ import annotations

from datetime import UTC, datetime
from typing import Generic, TypeVar

import structlog
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
