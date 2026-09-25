"""API key management endpoints."""
from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import Boolean, Column, DateTime, String, select
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
from credlayer.api.envelope import Envelope, ok
from credlayer.db.base import Base
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


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


class ApiKey(CamelModel):
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
    id: UUID
    key: str
    key_prefix: str
    owner_wallet: str
    name: str
    is_active: bool
    permissions: dict | None = None
    created_at: datetime
    expires_at: datetime | None = None


class CreateApiKeyRequest(CamelModel):
    owner_wallet: str
    name: str
    permissions: dict | None = None


@router.post(
    "",
    response_model=Envelope[ApiKeyWithSecret],
    summary="Generate new API key",
    description="Create API key tied to owner wallet",
    status_code=status.HTTP_201_CREATED,
)
async def create_api_key(
    body: CreateApiKeyRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[ApiKeyWithSecret]:
    logger.info("create_api_key", owner=body.owner_wallet, name=body.name)

    api_key = f"sk_{secrets.token_urlsafe(32)}"
    key_prefix = api_key[:10]
    # Store a one-way hash of the actual secret so revocation and validation
    # work without ever storing the full API key.
    key_hash = hashlib.sha256(api_key.encode("utf-8")).hexdigest()

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
    return ok(
        ApiKeyWithSecret(
            id=api_key_db.id,
            key=api_key,
            key_prefix=api_key_db.key_prefix,
            owner_wallet=api_key_db.owner_wallet,
            name=api_key_db.name,
            is_active=api_key_db.is_active,
            permissions=api_key_db.permissions,
            created_at=api_key_db.created_at,
            expires_at=api_key_db.expires_at,
        )
    )


@router.get("", response_model=Envelope[list[ApiKey]])
async def list_api_keys(
    owner_wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[ApiKey]]:
    result = await db.execute(
        select(ApiKeyDB)
        .where(ApiKeyDB.owner_wallet == owner_wallet)
        .order_by(ApiKeyDB.created_at.desc())
    )
    return ok([ApiKey.model_validate(key, from_attributes=True) for key in result.scalars().all()])


@router.delete("/{key_id}", response_model=Envelope[dict])
async def revoke_api_key(
    key_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[dict]:
    result = await db.execute(select(ApiKeyDB).where(ApiKeyDB.id == key_id))
    api_key = result.scalar_one_or_none()
    if api_key is None:
        raise HTTPException(status_code=404, detail=f"API key {key_id} not found")

    api_key.is_active = False
    await db.commit()
    logger.info("api_key_revoked", key_id=str(key_id))
    return ok({"revoked": True, "key_id": str(key_id)})
