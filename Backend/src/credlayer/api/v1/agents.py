"""Agent registration and activity tracking endpoints."""
from __future__ import annotations

from datetime import datetime
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

router = APIRouter(prefix="/agents", tags=["agents"])


# ---------------------------------------------------------------------------
# Database models
# ---------------------------------------------------------------------------
from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from credlayer.db.base import Base


class AgentDB(Base):
    __tablename__ = "agents"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    agent_id = Column(String(128), nullable=False, unique=True, index=True)
    owner_wallet = Column(String(64), nullable=False, index=True)
    name = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    permissions = Column(JSONB, nullable=False)
    status = Column(String(32), nullable=False, default="active")
    metadata = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


class AgentActivityDB(Base):
    __tablename__ = "agent_activity"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    agent_id = Column(String(128), nullable=False, index=True)
    activity_type = Column(String(64), nullable=False)
    endpoint = Column(String(256), nullable=False)
    method = Column(String(16), nullable=False)
    status_code = Column(Integer, nullable=False)
    request_data = Column(JSONB, nullable=True)
    response_data = Column(JSONB, nullable=True)
    error_message = Column(Text, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

AgentStatus = Literal["active", "suspended", "revoked"]


class Agent(CamelModel):
    """Registered agent with permissions."""
    
    id: UUID
    agent_id: str
    owner_wallet: str
    name: str
    description: str | None = None
    permissions: dict
    status: AgentStatus
    metadata: dict | None = None
    created_at: datetime
    updated_at: datetime


class AgentActivity(CamelModel):
    """Single agent activity log entry."""
    
    id: UUID
    agent_id: str
    activity_type: str
    endpoint: str
    method: str
    status_code: int
    request_data: dict | None = None
    response_data: dict | None = None
    error_message: str | None = None
    duration_ms: int | None = None
    created_at: datetime


class RegisterAgentRequest(CamelModel):
    """Request body to register a new agent."""
    
    agent_id: str
    owner_wallet: str
    name: str
    description: str | None = None
    permissions: dict


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=Envelope[Agent],
    summary="Register a new agent",
    description="Register an agent with owner wallet and permissions",
    status_code=status.HTTP_201_CREATED,
)
async def register_agent(
    body: RegisterAgentRequest,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Agent]:
    """Register a new agent."""
    
    logger.info("register_agent", agent_id=body.agent_id, owner=body.owner_wallet)
    
    # Check if agent_id already exists
    existing = await db.execute(
        select(AgentDB).where(AgentDB.agent_id == body.agent_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Agent ID '{body.agent_id}' already exists"
        )
    
    agent = AgentDB(
        agent_id=body.agent_id,
        owner_wallet=body.owner_wallet,
        name=body.name,
        description=body.description,
        permissions=body.permissions,
        status="active",
    )
    
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    
    logger.info("agent_registered", agent_id=agent.agent_id, id=str(agent.id))
    
    return ok(Agent.model_validate(agent, from_attributes=True))


@router.get(
    "/{agent_id}",
    response_model=Envelope[Agent],
    summary="Get agent details",
    description="Retrieve agent information by agent_id",
)
async def get_agent(
    agent_id: str,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[Agent]:
    """Get agent details."""
    
    logger.info("get_agent", agent_id=agent_id)
    
    result = await db.execute(
        select(AgentDB).where(AgentDB.agent_id == agent_id)
    )
    agent = result.scalar_one_or_none()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_id}' not found"
        )
    
    return ok(Agent.model_validate(agent, from_attributes=True))


@router.get(
    "/{agent_id}/activity",
    response_model=Envelope[list[AgentActivity]],
    summary="Get agent activity log",
    description="Retrieve real request log for an agent",
)
async def get_agent_activity(
    agent_id: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session),
) -> Envelope[list[AgentActivity]]:
    """Get agent activity log with real request/response data."""
    
    logger.info("get_agent_activity", agent_id=agent_id, limit=limit)
    
    # Verify agent exists
    agent_result = await db.execute(
        select(AgentDB).where(AgentDB.agent_id == agent_id)
    )
    if not agent_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_id}' not found"
        )
    
    # Get activity log
    result = await db.execute(
        select(AgentActivityDB)
        .where(AgentActivityDB.agent_id == agent_id)
        .order_by(AgentActivityDB.created_at.desc())
        .limit(limit)
    )
    activities = result.scalars().all()
    
    return ok([AgentActivity.model_validate(a, from_attributes=True) for a in activities])
