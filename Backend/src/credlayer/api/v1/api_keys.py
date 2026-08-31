"""API key management endpoints."""
from __future__ import annotations

import secrets
from datetime import datetime, UTC
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
from credlayer.api.envelope import Envelope, ok
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class ApiKeyDB(Base):
    __tablename__ = "api_keys"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    key_hash = Column(String(128), nullable=False, unique=True, index=True)
    key_prefix = Column(String(16), nullable=False)
    owner_wallet = Column(String(64), nullable=False, index=True)
    name = Column(String(256), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    permissions = Column(JSONB, nullable=True)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    expires_at = Column(DateTime(timezone=True), nullable=True)


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class ApiKey(CamelModel):
    """API key information (without exposing full key)."""
    
    id: UUID
    key_prefix: str
    owner_wallet: str
    name: str
    is_active: bool
    permissions: dict | None = None
    last_used_at: datetime | None = None
    created_at: datetime
    expires_at: datetime | None = None


class ApiKeyWithSecret(CamelModel):
    """API key with full secret (only returned on creation)."""
    
    id: UUID
    key: str  # Full API key, only shown once
    key_prefix: str
    owner_wallet: str
    name: str
    is_active: bool
    permissions: dict | None = None
    created_at: datetime
    expires_at: datetime | None = None


class CreateApiKeyRequest(CamelModel):
    """Request body to create API key."""
    
    owner_wallet: str
    name: str
    permissions: dict | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=Envelope[ApiKeyWithSecret],
    summary="Generate new API key",
    description="Create API key tied to owner wallet (supports multiple keys per wallet)",
    status_code=status.HTTP_201_CREATED,
)
async def create_api_key(
    body: CreateApiKeyRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[ApiKeyWithSecret]:
    """Generate new API key for a wallet."""
    
    logger.info("create_api_key", owner=body.owner_wallet, name=body.name)
    
    # Generate secure random key
    api_key = f"sk_{secrets.token_urlsafe(32)}"
    key_prefix = api_key[:10]
    key_hash = secrets.token_hex(64)  # In production, hash the actual key
    
    api_key_db = ApiKeyDB(
        key_hash=key_hash,
        key_prefix=key_prefix,
        owner_wallet=body.owner_wallet,
        name=body.name,
        is_active=True,
        permissions=body.permissions or {},
    )
    
    db.add(api_key_db)
    await db.commit()
    await db.refresh(api_key_db)
    
    logger.info("api_key_created", id=str(api_key_db.id), owner=body.owner_wallet)
    
    return ok(ApiKeyWithSecret(
        id=api_key_db.id,
        key=api_key,  # Only time we return the full key
        key_prefix=api_key_db.key_prefix,
        owner_wallet=api_key_db.owner_wallet,
        name=api_key_db.name,
        is_active=api_key_db.is_active,
        permissions=api_key_db.permissions,
        created_at=api_key_db.created_at,
        expires_at=api_key_db.expires_at,
    ))


@router.get(
    "",
    response_model=Envelope[list[ApiKey]],
    summary="List API keys",
    description="List all API keys for authenticated user",
)
async def list_api_keys(
    owner_wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[ApiKey]]:
    """List all API keys for a wallet."""
    
    logger.info("list_api_keys", owner=owner_wallet)
    
    result = await db.execute(
        select(ApiKeyDB)
        .where(ApiKeyDB.owner_wallet == owner_wallet)
        .order_by(ApiKeyDB.created_at.desc())
    )
    keys = result.scalars().all()
    
    return ok([ApiKey.model_validate(k, from_attributes=True) for k in keys])


@router.delete(
    "/{key_id}",
    response_model=Envelope[dict],
    summary="Revoke API key",
    description="Soft delete (set is_active=False) for an API key",
)
async def revoke_api_key(
    key_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[dict]:
    """Revoke an API key."""
    
    logger.info("revoke_api_key", key_id=str(key_id))
    
    result = await db.execute(
        select(ApiKeyDB).where(ApiKeyDB.id == key_id)
    )
    api_key = result.scalar_one_or_none()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"API key {key_id} not found"
        )
    
    api_key.is_active = False
    api_key.updated_at = datetime.now(UTC)
    await db.commit()
    
    logger.info("api_key_revoked", key_id=str(key_id))
    
    return ok({"revoked": True, "key_id": str(key_id)})
