"""Unified activity feed endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
from credlayer.api.envelope import Envelope, ok
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/activity", tags=["activity"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class ActivityDB(Base):
    __tablename__ = "activity"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    wallet_address = Column(String(64), nullable=False, index=True)
    event_type = Column(String(64), nullable=False)
    event_category = Column(String(32), nullable=False)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(32), nullable=False)
    metadata = Column(JSONB, nullable=True)
    error_details = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

EventCategory = Literal["signal", "credential", "connection", "score", "system"]
EventStatus = Literal["success", "pending", "failed", "error"]


class ActivityEvent(CamelModel):
    """Single activity event with status."""
    
    id: UUID
    wallet_address: str
    event_type: str
    event_category: EventCategory
    title: str
    description: str | None = None
    status: EventStatus
    metadata: dict | None = None
    error_details: dict | None = None
    created_at: datetime


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/{wallet}",
    response_model=Envelope[list[ActivityEvent]],
    summary="Get activity feed",
    description="Unified event feed including errors and failures, not just successes",
)
async def get_activity(
    wallet: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[ActivityEvent]]:
    """Get unified activity feed for a wallet with real error states."""
    
    logger.info("get_activity", wallet=wallet, limit=limit)
    
    result = await db.execute(
        select(ActivityDB)
        .where(ActivityDB.wallet_address == wallet)
        .order_by(ActivityDB.created_at.desc())
        .limit(limit)
    )
    activities = result.scalars().all()
    
    return ok([ActivityEvent.model_validate(a, from_attributes=True) for a in activities])
