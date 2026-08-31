"""Webhook registration and management endpoints."""
from __future__ import annotations

from datetime import datetime, UTC
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

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID, ARRAY
from credlayer.db.base import Base


class WebhookDB(Base):
    __tablename__ = "webhooks"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    owner_wallet = Column(String(64), nullable=False, index=True)
    url = Column(String(512), nullable=False)
    event_types = Column(ARRAY(String), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    secret = Column(String(128), nullable=True)
    metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

EventType = Literal["score_change", "credential_verified", "risk_flag", "connection_added"]


class Webhook(CamelModel):
    """Registered webhook configuration."""
    
    id: UUID
    owner_wallet: str
    url: str
    event_types: list[str]
    is_active: bool
    secret: str | None = None
    metadata: dict | None = None
    created_at: datetime
    updated_at: datetime


class RegisterWebhookRequest(CamelModel):
    """Request body to register webhook."""
    
    owner_wallet: str
    url: str
    event_types: list[EventType]
    secret: str | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=Envelope[Webhook],
    summary="Register webhook",
    description="Register webhook URL with event types",
    status_code=status.HTTP_201_CREATED,
)
async def register_webhook(
    body: RegisterWebhookRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Webhook]:
    """Register a new webhook."""
    
    logger.info("register_webhook", owner=body.owner_wallet, url=body.url)
    
    webhook = WebhookDB(
        owner_wallet=body.owner_wallet,
        url=body.url,
        event_types=body.event_types,
        is_active=True,
        secret=body.secret,
    )
    
    db.add(webhook)
    await db.commit()
    await db.refresh(webhook)
    
    logger.info("webhook_registered", id=str(webhook.id), owner=body.owner_wallet)
    
    return ok(Webhook.model_validate(webhook, from_attributes=True))


@router.get(
    "",
    response_model=Envelope[list[Webhook]],
    summary="List webhooks",
    description="List all webhooks for authenticated user",
)
async def list_webhooks(
    owner_wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[Webhook]]:
    """List all webhooks for a wallet."""
    
    logger.info("list_webhooks", owner=owner_wallet)
    
    result = await db.execute(
        select(WebhookDB)
        .where(WebhookDB.owner_wallet == owner_wallet)
        .order_by(WebhookDB.created_at.desc())
    )
    webhooks = result.scalars().all()
    
    return ok([Webhook.model_validate(w, from_attributes=True) for w in webhooks])


@router.delete(
    "/{webhook_id}",
    response_model=Envelope[dict],
    summary="Delete webhook",
    description="Remove webhook registration",
)
async def delete_webhook(
    webhook_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[dict]:
    """Delete a webhook."""
    
    logger.info("delete_webhook", webhook_id=str(webhook_id))
    
    result = await db.execute(
        select(WebhookDB).where(WebhookDB.id == webhook_id)
    )
    webhook = result.scalar_one_or_none()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Webhook {webhook_id} not found"
        )
    
    await db.delete(webhook)
    await db.commit()
    
    logger.info("webhook_deleted", webhook_id=str(webhook_id))
    
    return ok({"deleted": True, "webhook_id": str(webhook_id)})
