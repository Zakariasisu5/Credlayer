"""Trust connections graph endpoints."""
from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session
from credlayer.api.envelope import Envelope, ok
from credlayer.schemas.common import CamelModel

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/connections", tags=["connections"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class ConnectionDB(Base):
    __tablename__ = "connections"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    from_wallet = Column(String(64), nullable=False, index=True)
    to_wallet = Column(String(64), nullable=False, index=True)
    connection_type = Column(String(32), nullable=False)
    trust_weight = Column(Float, nullable=False, default=0.5)
    status = Column(String(32), nullable=False, default="active")
    metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

ConnectionType = Literal["direct_transaction", "multi_hop", "shared_protocol", "social"]
ConnectionStatus = Literal["active", "inactive", "flagged"]


class Connection(CamelModel):
    """Single trust connection in the graph."""
    
    id: UUID
    from_wallet: str
    to_wallet: str
    connection_type: ConnectionType
    trust_weight: float
    status: ConnectionStatus
    metadata: dict | None = None
    created_at: datetime
    updated_at: datetime


class ConnectionsGraph(CamelModel):
    """Trust connections graph for a wallet."""
    
    wallet: str
    total_connections: int
    outgoing: list[Connection]
    incoming: list[Connection]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/{wallet}",
    response_model=Envelope[ConnectionsGraph],
    summary="Get trust connections graph",
    description="Retrieve all trust connections (incoming and outgoing) for a wallet",
)
async def get_connections(
    wallet: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[ConnectionsGraph]:
    """Get the trust connections graph for a wallet."""
    
    logger.info("get_connections", wallet=wallet)
    
    # Get outgoing connections
    outgoing_result = await db.execute(
        select(ConnectionDB)
        .where(ConnectionDB.from_wallet == wallet)
        .where(ConnectionDB.status == "active")
        .order_by(ConnectionDB.trust_weight.desc())
    )
    outgoing = outgoing_result.scalars().all()
    
    # Get incoming connections
    incoming_result = await db.execute(
        select(ConnectionDB)
        .where(ConnectionDB.to_wallet == wallet)
        .where(ConnectionDB.status == "active")
        .order_by(ConnectionDB.trust_weight.desc())
    )
    incoming = incoming_result.scalars().all()
    
    total = len(outgoing) + len(incoming)
    
    graph = ConnectionsGraph(
        wallet=wallet,
        total_connections=total,
        outgoing=[Connection.model_validate(c, from_attributes=True) for c in outgoing],
        incoming=[Connection.model_validate(c, from_attributes=True) for c in incoming],
    )
    
    return ok(graph)
