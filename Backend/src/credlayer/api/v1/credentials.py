"""Credential verification and management endpoints."""
from __future__ import annotations

from datetime import UTC, datetime
from typing import Literal
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
from credlayer.api.envelope import Envelope, ok
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/credentials", tags=["credentials"])


# ---------------------------------------------------------------------------
# Database models (inline for now, move to models/ if growing)
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class CredentialDB(Base):
    __tablename__ = "credentials"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    wallet_address = Column(String(64), nullable=False, index=True)
    credential_type = Column(String(64), nullable=False)
    credential_value = Column(Text, nullable=False)
    verification_status = Column(String(32), nullable=False, default="pending")
    verified_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    credential_metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

VerificationStatus = Literal["pending", "verified", "failed", "expired"]


class Credential(CamelModel):
    """Single credential with verification status."""
    
    id: UUID
    wallet_address: str
    credential_type: str
    credential_value: str
    verification_status: VerificationStatus
    verified_at: datetime | None = None
    expires_at: datetime | None = None
    metadata: dict | None = None
    created_at: datetime
    updated_at: datetime


class TriggerVerificationRequest(CamelModel):
    """Request body to trigger credential re-verification."""
    
    credential_id: UUID


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/{wallet}",
    response_model=Envelope[list[Credential]],
    summary="List credentials for wallet",
    description="Retrieve all credentials associated with a wallet address",
)
async def list_credentials(
    wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[Credential]]:
    """List all credentials for a given wallet with their verification status."""
    
    logger.info("list_credentials", wallet=wallet)
    
    result = await db.execute(
        select(CredentialDB)
        .where(CredentialDB.wallet_address == wallet)
        .order_by(CredentialDB.created_at.desc())
    )
    credentials = result.scalars().all()
    
    return ok([Credential.model_validate(c, from_attributes=True) for c in credentials])


@router.post(
    "/verify",
    response_model=Envelope[Credential],
    summary="Trigger credential verification",
    description="Trigger re-verification of a specific credential",
)
async def trigger_verification(
    body: TriggerVerificationRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Credential]:
    """Trigger verification/re-verification of a credential."""
    
    logger.info("trigger_verification", credential_id=str(body.credential_id))
    
    result = await db.execute(
        select(CredentialDB).where(CredentialDB.id == body.credential_id)
    )
    credential = result.scalar_one_or_none()
    
    if not credential:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Credential {body.credential_id} not found"
        )
    
    # Update verification status to pending
    credential.verification_status = "pending"
    credential.updated_at = datetime.now(UTC)
    await db.commit()
    await db.refresh(credential)
    
    # TODO: Trigger async verification job (Celery/background task)
    logger.info("verification_triggered", credential_id=str(credential.id), type=credential.credential_type)
    
    return ok(Credential.model_validate(credential, from_attributes=True))
