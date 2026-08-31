"""Developer request logs endpoints."""
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

router = APIRouter(prefix="/developer", tags=["developer"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class RequestLogDB(Base):
    __tablename__ = "request_logs"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    api_key_id = Column(PGUUID, nullable=True, index=True)
    owner_wallet = Column(String(64), nullable=False, index=True)
    method = Column(String(16), nullable=False)
    endpoint = Column(String(512), nullable=False)
    status_code = Column(Integer, nullable=False)
    request_headers = Column(JSONB, nullable=True)
    request_body = Column(JSONB, nullable=True)
    response_body = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

RequestStatus = Literal["success", "error", "unauthorized", "rate_limited", "invalid"]


class RequestLog(CamelModel):
    """Single API request log entry with real error responses."""
    
    id: UUID
    api_key_id: UUID | None = None
    owner_wallet: str
    method: str
    endpoint: str
    status_code: int
    request_headers: dict | None = None
    request_body: dict | None = None
    response_body: dict | None = None
    error_message: str | None = None
    duration_ms: int | None = None
    ip_address: str | None = None
    created_at: datetime
    
    @property
    def status(self) -> RequestStatus:
        """Derive status from status_code."""
        if self.status_code == 401 or self.status_code == 403:
            return "unauthorized"
        elif self.status_code == 429:
            return "rate_limited"
        elif 400 <= self.status_code < 500:
            return "invalid"
        elif self.status_code >= 500:
            return "error"
        else:
            return "success"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/requests",
    response_model=Envelope[list[RequestLog]],
    summary="Get API request log",
    description="Real API call log including 401/429/invalid key errors",
)
async def get_request_logs(
    owner_wallet: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[RequestLog]]:
    """Get API request logs with real error responses."""
    
    logger.info("get_request_logs", owner=owner_wallet, limit=limit)
    
    result = await db.execute(
        select(RequestLogDB)
        .where(RequestLogDB.owner_wallet == owner_wallet)
        .order_by(RequestLogDB.created_at.desc())
        .limit(limit)
    )
    logs = result.scalars().all()
    
    return ok([RequestLog.model_validate(log, from_attributes=True) for log in logs])
