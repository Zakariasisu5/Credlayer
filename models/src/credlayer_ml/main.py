"""Standalone FastAPI service for CredLayer GNN Reputation & Fraud Scoring.
"""
from __future__ import annotations

from datetime import UTC, datetime
from typing import Generic, TypeVar

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from credlayer_ml.config import ServerSettings
from credlayer_ml.inference import get_scorer

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

    @app.get("/healthz", tags=["infra"])
    async def healthz() -> dict[str, str]:
        return {"status": "ok", "service": "credlayer-ml"}

    @app.get("/readyz", tags=["infra"])
    async def readyz() -> dict[str, str]:
        scorer = get_scorer()
        is_ready = scorer.config.paths.graph_path.exists()
        return {
            "status": "ok" if is_ready else "not_trained",
            "graph_exists": str(is_ready)
        }

    @app.get(
        "/api/v1/scores/{address}",
        response_model=Envelope[WalletScore],
        tags=["scores"],
        summary="Score a single wallet address",
    )
    async def score_wallet(address: str) -> Envelope[WalletScore]:
        scorer = get_scorer()
        result = scorer.score_address(address)
        return ok(WalletScore(**result))

    @app.post(
        "/api/v1/scores/batch",
        response_model=Envelope[list[WalletScore]],
        tags=["scores"],
        summary="Score multiple wallet addresses in batch",
    )
    async def score_batch(body: BatchScoreRequest) -> Envelope[list[WalletScore]]:
        scorer = get_scorer()
        results = scorer.score_batch(body.addresses)
        return ok([WalletScore(**r) for r in results])

    return app


app = create_app()

if __name__ == "__main__":
    settings = ServerSettings()
    uvicorn.run(
        "credlayer_ml.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
