"""Wallet reputation scoring endpoints."""

from __future__ import annotations

import json
import re
import asyncio
from typing import Annotated

import httpx
import structlog
from fastapi import APIRouter, Depends, HTTPException
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
            # Retry loop for transient failures (429 / network errors)
            attempt = 0
            MAX_RETRIES = 3
            BASE_BACKOFF = 1.0
            while True:
                try:
                    response = await client.get(ml_service_url)

                    if response.status_code == 429 and attempt < MAX_RETRIES:
                        retry_after = 0
                        try:
                            retry_after = int(response.headers.get("Retry-After", "0"))
                        except Exception:
                            retry_after = 0
                        backoff = retry_after or (BASE_BACKOFF * (2 ** attempt))
                        logger.warning(
                            "ml_service_rate_limited",
                            address=address,
                            attempt=attempt,
                            backoff=backoff,
                        )
                        await asyncio.sleep(backoff)
                        attempt += 1
                        continue

                    response.raise_for_status()
                    break

                except httpx.RequestError as exc:
                    logger.error("ml_service_unreachable", address=address, error=repr(exc), attempt=attempt)
                    if attempt < MAX_RETRIES:
                        await asyncio.sleep(BASE_BACKOFF * (2 ** attempt))
                        attempt += 1
                        continue
                    raise HTTPException(
                        status_code=503, detail="GNN scoring engine is currently unreachable."
                    ) from exc

                except httpx.HTTPStatusError as exc:
                    status = exc.response.status_code
                    logger.error("ml_service_http_error", address=address, status=status, attempt=attempt)
                    if status == 429 and attempt < MAX_RETRIES:
                        retry_after = 0
                        try:
                            retry_after = int(exc.response.headers.get("Retry-After", "0"))
                        except Exception:
                            retry_after = 0
                        backoff = retry_after or (BASE_BACKOFF * (2 ** attempt))
                        await asyncio.sleep(backoff)
                        attempt += 1
                        continue
                    raise HTTPException(
                        status_code=502,
                        detail=f"GNN scoring engine returned an error: {status}",
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


@router.get("/dev/relayer-status", include_in_schema=False)
async def relayer_status(scorer: ScorerDependency) -> dict:
    relayer_base = scorer.settings.relayer_url or scorer.settings.relayer_service_url
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
    relayer_base = scorer.settings.relayer_url or scorer.settings.relayer_service_url
    if not relayer_base:
        logger.error("relayer_url_not_configured", address=address)
        raise HTTPException(status_code=503, detail="Attestation service is unavailable.")

    try:
        score = WalletScore.model_validate(await scorer.score_address(address))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("score_address_failed_in_debug", address=address, error=repr(exc))
        raise HTTPException(status_code=502, detail="Failed to score wallet.") from exc

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


@router.get(
    "/{address}/attestation/check",
    summary="Check if an attestation exists for a wallet",
    description="Query the relayer to check if an attestation already exists on-chain.",
)
async def check_attestation(address: str, scorer: ScorerDependency) -> dict:
    """
    Check if an attestation exists for a wallet without creating one.
    Returns the existing attestation data if found.
    """
    if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{32,44}", address):
        logger.warning("invalid_wallet_address_check", address=address)
        raise HTTPException(status_code=422, detail="Invalid Solana wallet address.")

    relayer_base = scorer.settings.relayer_url or scorer.settings.relayer_service_url
    if not relayer_base:
        logger.error("relayer_url_not_configured_check", address=address)
        raise HTTPException(status_code=503, detail="Attestation service is unavailable.")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            relayer_url = f"{relayer_base.rstrip('/')}/api/v1/attestations/{address}"
            logger.info("checking_attestation_existence", address=address, relayer_url=relayer_url)
            
            response = await client.get(relayer_url)
            
            try:
                response_payload = response.json()
            except ValueError:
                logger.error(
                    "relayer_check_invalid_json",
                    address=address,
                    status=response.status_code,
                )
                return {"success": True, "exists": False}

            if response.is_error:
                logger.warning("attestation_check_failed", address=address, status=response.status_code)
                return {"success": True, "exists": False}

            data = response_payload.get("data", {})
            verified = data.get("verified", False)
            attestation = data.get("attestation")

            if verified and attestation:
                logger.info("attestation_found", address=address, attestation=attestation)
                return {
                    "success": True,
                    "exists": True,
                    "attestation": {
                        "trustScore": attestation.get("trustScore"),
                        "riskLevel": attestation.get("riskLevel"),
                        "verified": True,
                    },
                }

            logger.info("no_attestation_found", address=address)
            return {"success": True, "exists": False}

    except httpx.RequestError as exc:
        logger.warning("relayer_unreachable_check", address=address, error=repr(exc))
        return {"success": True, "exists": False}
    except Exception as exc:
        logger.exception("attestation_check_error", address=address, error=repr(exc))
        return {"success": True, "exists": False}


@router.post(
    "/{address}/attestation",
    summary="Create an attestation for a wallet",
    description="Fetch the wallet score and request a relayer attestation explicitly.",
)
async def issue_attestation(address: str, scorer: ScorerDependency) -> dict:
    """
    Issue an attestation for a wallet by:
    1. Validating the wallet address format
    2. Checking if an attestation already exists (idempotency)
    3. Scoring it via the ML service
    4. Posting to the relayer service if needed
    """
    import uuid
    request_id = str(uuid.uuid4())[:8]
    logger.info(f"TRACE[{request_id}] POST /attestation START", address=address)
    
    if not re.fullmatch(r"[1-9A-HJ-NP-Za-km-z]{32,44}", address):
        logger.warning("invalid_wallet_address", address=address)
        raise HTTPException(status_code=422, detail="Invalid Solana wallet address.")

    logger.info(f"TRACE[{request_id}] Wallet address validated", address=address)
    relayer_base = scorer.settings.relayer_url or scorer.settings.relayer_service_url
    if not relayer_base:
        logger.error("relayer_url_not_configured", address=address)
        raise HTTPException(status_code=503, detail="Attestation service is unavailable.")
    
    logger.info(f"TRACE[{request_id}] Relayer base URL resolved", relayer_base=relayer_base)

    # Step 0: Check if attestation already exists (idempotency check)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            check_url = f"{relayer_base.rstrip('/')}/api/v1/attestations/{address}"
            logger.info("checking_existing_attestation", address=address)
            
            check_response = await client.get(check_url)
            
            if check_response.is_success:
                try:
                    check_payload = check_response.json()
                    data = check_payload.get("data", {})
                    if data.get("verified") and data.get("attestation"):
                        attestation = data["attestation"]
                        trust_score = attestation.get("trustScore")
                        risk_level = attestation.get("riskLevel")
                        
                        if trust_score is not None and risk_level:
                            logger.info(
                                "attestation_already_exists",
                                address=address,
                                trust_score=trust_score,
                                risk_level=risk_level,
                            )
                            return {
                                "success": True,
                                "alreadyExists": True,
                                "txHash": None,
                                "attestation": {
                                    "trustScore": trust_score,
                                    "riskLevel": risk_level,
                                },
                                "score": {
                                    "trustScore": trust_score,
                                    "riskLevel": risk_level,
                                },
                            }
                except (ValueError, KeyError) as exc:
                    logger.warning("existing_attestation_check_parse_failed", address=address, error=repr(exc))
    except Exception as exc:
        logger.warning("existing_attestation_check_failed", address=address, error=repr(exc))
        # Continue with creation attempt if check fails

    # Step 1: Score the wallet
    try:
        score_data = await scorer.score_address(address)
        score = WalletScore.model_validate(score_data)
        logger.info("wallet_scored", address=address, trust_score=score.trust_score)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("score_address_failed", address=address, error=repr(exc))
        raise HTTPException(status_code=502, detail="Failed to score wallet.") from exc

    # Step 2: Post to relayer
    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            relayer_url = f"{relayer_base.rstrip('/')}/api/v1/attestations/issue"
            payload = {
                "targetWallet": address,
                "trustScore": score.trust_score,
                "riskLevel": score.risk_level.upper(),
            }
            logger.info("posting_to_relayer", address=address, relayer_url=relayer_url, payload=payload)
            logger.info(f"TRACE[{request_id}] Sending POST to relayer", 
                       targetWallet=payload.get("targetWallet"),
                       trustScore=payload.get("trustScore"),
                       riskLevel=payload.get("riskLevel"))

            response = await client.post(relayer_url, json=payload)
            logger.info(f"TRACE[{request_id}] Relayer response received", status=response.status_code)

            try:
                response_payload = response.json()
            except ValueError:
                logger.error(
                    "relayer_invalid_json",
                    address=address,
                    status=response.status_code,
                    body=response.text[:500],
                )
                response_payload = {}

            if response.is_error:
                detail = (
                    response_payload.get("detail")
                    or response_payload.get("error")
                    or response_payload.get("message")
                )
                logger.error(
                    "relayer_http_error",
                    address=address,
                    status=response.status_code,
                    detail=detail,
                )
                raise HTTPException(
                    status_code=response.status_code,
                    detail=str(detail) if detail else "Attestation service rejected the request.",
                )

            if response_payload.get("success") is not True:
                detail = (
                    response_payload.get("detail")
                    or response_payload.get("error")
                    or response_payload.get("message")
                )
                logger.error(
                    "relayer_success_false",
                    address=address,
                    detail=detail,
                    payload=response_payload,
                )
                raise HTTPException(
                    status_code=502,
                    detail=str(detail) if detail else "Attestation creation failed.",
                )

            data_payload = (
                response_payload.get("data")
                if isinstance(response_payload.get("data"), dict)
                else {}
            )
            tx_hash = (
                response_payload.get("txHash")
                or response_payload.get("tx_hash")
                or response_payload.get("transactionHash")
                or data_payload.get("txHash")
            )
            attestation_pda = response_payload.get("attestationPda") or data_payload.get("attestationPda")
            already_exists = bool(
                response_payload.get("alreadyExists") or response_payload.get("already_exists")
            )

            # Extract attestation data from relayer response
            attestation_trust_score = response_payload.get("trustScore")
            attestation_risk_level = response_payload.get("riskLevel")

            logger.info(
                "attestation_issued",
                address=address,
                tx_hash=tx_hash,
                already_exists=already_exists,
                attestation_pda=attestation_pda,
            )

            return {
                "success": True,
                "txHash": tx_hash,
                "alreadyExists": already_exists,
                "attestationPda": attestation_pda,
                "attestation": {
                    "trustScore": attestation_trust_score or score.trust_score,
                    "riskLevel": attestation_risk_level or score.risk_level.upper(),
                },
                "score": score.model_dump(by_alias=True),
            }

    except HTTPException:
        raise
    except httpx.RequestError as exc:
        logger.exception("relayer_unreachable", address=address, error=repr(exc))
        raise HTTPException(
            status_code=503, detail="Attestation service is currently unreachable."
        ) from exc
    except Exception as exc:
        logger.exception("attestation_issue_failed", address=address, error=repr(exc))
        raise HTTPException(status_code=502, detail="Attestation creation failed.") from exc


score_and_attest = issue_attestation


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
