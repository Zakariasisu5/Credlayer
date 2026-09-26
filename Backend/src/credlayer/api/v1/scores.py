"""Wallet reputation scoring endpoints."""
from __future__ import annotations

from datetime import datetime, UTC
from typing import Literal
from uuid import UUID

import httpx
import structlog
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
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
        ml_service_url = f"{self.settings.ml_service_url.rstrip('/')}/api/v1/scores/{address}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                # Explicit GET request to the ML service
                response = await client.get(ml_service_url)
                response.raise_for_status()
                
            except httpx.RequestError as exc:
                logger.error("ml_service_unreachable", address=address, error=repr(exc))
                raise HTTPException(
                    status_code=503,
                    detail="GNN scoring engine is currently unreachable."
                )
            except httpx.HTTPStatusError as exc:
                logger.error("ml_service_http_error", address=address, status=exc.response.status_code)
                raise HTTPException(
                    status_code=502,
                    detail=f"GNN scoring engine returned an error: {exc.response.status_code}"
                )

            try:
                ml_response = response.json()
                score_data = ml_response.get("data")
                
                if not score_data:
                    raise ValueError("Missing 'data' object in ML service response")
                    
                return score_data
                    
            except Exception as exc:
                logger.error("ml_service_malformed_response", address=address, error=repr(exc))
                raise HTTPException(
                    status_code=500,
                    detail="Received invalid payload from the GNN scoring engine."
                )

    async def score_batch(self, addresses: list[str]) -> list[dict]:
        """
        Batch scoring via the GNN microservice.
        """
        ml_service_url = f"{self.settings.ml_service_url.rstrip('/')}/api/v1/scores/batch"
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(ml_service_url, json={"addresses": addresses})
                response.raise_for_status()
            except httpx.RequestError as exc:
                logger.error("ml_service_unreachable", addresses=addresses, error=repr(exc))
                raise HTTPException(
                    status_code=503,
                    detail="GNN scoring engine is currently unreachable."
                )
            except httpx.HTTPStatusError as exc:
                logger.error("ml_service_http_error", addresses=addresses, status=exc.response.status_code)
                raise HTTPException(
                    status_code=502,
                    detail=f"GNN scoring engine returned an error: {exc.response.status_code}"
                )

            try:
                ml_response = response.json()
                score_data = ml_response.get("data")
                
                if not score_data:
                    raise ValueError("Missing 'data' object in ML service response")
                    
                return score_data
            except Exception as exc:
                logger.error("ml_service_malformed_response", addresses=addresses, error=repr(exc))
                raise HTTPException(
                    status_code=500,
                    detail="Received invalid payload from the GNN scoring engine."
                )


def get_scorer() -> WalletScorer:
    return WalletScorer()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/{address}",
    response_model=Envelope[WalletScore],
    summary="Score a single wallet",
    description="Query the standalone ML microservice for the GNN-derived trust score.",
)
async def score_wallet(address: str, scorer: WalletScorer = Depends(get_scorer)) -> Envelope[WalletScore]:
    # The service layer now handles the HTTP call and exception raising
    result = await scorer.score_address(address)
    validated_score = WalletScore.model_validate(result)

    # --- Post the relayer to mint on-chain attestation ---
    settings = scorer.settings
    relayer_url = f"{settings.relayer_service_url.rstrip('/')}/api/v1/attestations/issue"

    # the relayer expects the riskLevel as uppercase (LOW, MEDIUM, HIGH)
    risk_level_upper = validated_score.risk_level.upper()

    relayer_payload = {
        "targetWallet": validated_score.address,
        "trustScore": validated_score.trust_score,
        "riskLevel": risk_level_upper,
    }

    tx_hash = None
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            relayer_resp = await client.post(relayer_url, json=relayer_payload)
            if relayer_resp.status_code == 200:
                tx_hash = relayer_resp.json().get("txHash")
                logger.info("attestation_minted", tx_hash=tx_hash)
            else:
                logger.error("relayer_mint_failed", status=relayer_resp.status_code, error=relayer_resp.text)
    except Exception as e:
        logger.error("relayer_unreachable", url=relayer_url, error=str(e))

    return ok(validated_score, meta={"txHash": tx_hash} if tx_hash else None)


@router.post(
    "/batch",
    response_model=Envelope[list[WalletScore]],
    summary="Score multiple wallets in batch",
    description="Batch scoring via the standalone ML microservice.",
)
async def score_batch(body: BatchScoreRequest, scorer: WalletScorer = Depends(get_scorer)) -> Envelope[list[WalletScore]]:
    results = await scorer.score_batch(body.addresses)
    scores = [WalletScore.model_validate(item) for item in results]
    return ok(scores)
