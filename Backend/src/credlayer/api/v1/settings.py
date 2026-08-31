"""User settings persistence endpoints."""
from __future__ import annotations

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

router = APIRouter(prefix="/settings", tags=["settings"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class SettingsDB(Base):
    __tablename__ = "settings"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    wallet_address = Column(String(64), nullable=False, unique=True, index=True)
    preferences = Column(JSONB, nullable=False)
    notifications = Column(JSONB, nullable=False)
    privacy = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class Settings(CamelModel):
    """User settings with preferences, notifications, and privacy."""
    
    id: UUID
    wallet_address: str
    preferences: dict
    notifications: dict
    privacy: dict
    created_at: datetime
    updated_at: datetime


class UpdateSettingsRequest(CamelModel):
    """Request body to update settings."""
    
    preferences: dict | None = None
    notifications: dict | None = None
    privacy: dict | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/{wallet}",
    response_model=Envelope[Settings],
    summary="Get user settings",
    description="Retrieve persisted settings for a wallet",
)
async def get_settings(
    wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Settings]:
    """Get user settings from database."""
    
    logger.info("get_settings", wallet=wallet)
    
    result = await db.execute(
        select(SettingsDB).where(SettingsDB.wallet_address == wallet)
    )
    settings = result.scalar_one_or_none()
    
    if not settings:
        # Return default settings if none exist
        default_settings = Settings(
            id=UUID('00000000-0000-0000-0000-000000000000'),
            wallet_address=wallet,
            preferences={},
            notifications={"email": False, "push": False, "webhook": False},
            privacy={"public_profile": False, "show_connections": True},
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
        return ok(default_settings)
    
    return ok(Settings.model_validate(settings, from_attributes=True))


@router.put(
    "/{wallet}",
    response_model=Envelope[Settings],
    summary="Update user settings",
    description="Persist settings to database (not just accept and drop)",
)
async def update_settings(
    wallet: str,
    body: UpdateSettingsRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Settings]:
    """Update and persist user settings."""
    
    logger.info("update_settings", wallet=wallet)
    
    result = await db.execute(
        select(SettingsDB).where(SettingsDB.wallet_address == wallet)
    )
    settings = result.scalar_one_or_none()
    
    if settings:
        # Update existing settings
        if body.preferences is not None:
            settings.preferences = body.preferences
        if body.notifications is not None:
            settings.notifications = body.notifications
        if body.privacy is not None:
            settings.privacy = body.privacy
        settings.updated_at = datetime.now(UTC)
    else:
        # Create new settings
        settings = SettingsDB(
            wallet_address=wallet,
            preferences=body.preferences or {},
            notifications=body.notifications or {"email": False, "push": False, "webhook": False},
            privacy=body.privacy or {"public_profile": False, "show_connections": True},
        )
        db.add(settings)
    
    await db.commit()
    await db.refresh(settings)
    
    logger.info("settings_updated", wallet=wallet, id=str(settings.id))
    
    return ok(Settings.model_validate(settings, from_attributes=True))
