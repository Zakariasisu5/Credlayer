"""Idempotency key management to prevent duplicate requests and race conditions."""

from datetime import UTC, datetime, timedelta
from typing import Generic, TypeVar
from uuid import UUID

import structlog
from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID

from credlayer.db.base import Base

logger = structlog.get_logger(__name__)

T = TypeVar("T")


class IdempotencyKeyDB(Base):
    """Store idempotency keys and their results to prevent duplicate operations."""
    
    __tablename__ = "idempotency_keys"
    
    id = Column(PGUUID, primary_key=True, server_default="gen_random_uuid()")
    idempotency_key = Column(String(255), nullable=False, unique=True, index=True)
    endpoint = Column(String(255), nullable=False)
    request_hash = Column(String(64), nullable=False, index=True)  # Hash of request body
    status_code = Column(String(32), nullable=False)
    response_body = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default="now()")
    expires_at = Column(DateTime(timezone=True), nullable=False)


class IdempotencyManager:
    """Manages idempotency keys to ensure request idempotency and prevent race conditions."""
    
    EXPIRY_SECONDS = 86400  # 24 hours
    
    def __init__(self, db_session):
        self.db = db_session
    
    async def get_cached_response(
        self, idempotency_key: str, endpoint: str, request_hash: str
    ) -> dict | None:
        """
        Retrieve a cached response if the idempotency key exists and is still valid.
        
        Args:
            idempotency_key: The unique idempotency key from the request header
            endpoint: The API endpoint (for context)
            request_hash: SHA256 hash of the request body
            
        Returns:
            dict with status_code and response_body if found, None otherwise
        """
        from sqlalchemy import select
        
        try:
            result = await self.db.execute(
                select(IdempotencyKeyDB).where(
                    IdempotencyKeyDB.idempotency_key == idempotency_key
                )
            )
            cached = result.scalar_one_or_none()
            
            if cached:
                # Check if expired
                if cached.expires_at < datetime.now(UTC):
                    logger.info(
                        "idempotency_key_expired",
                        key=idempotency_key,
                        endpoint=endpoint
                    )
                    return None
                
                # Verify request hash matches (prevent key reuse with different payloads)
                if cached.request_hash != request_hash:
                    logger.warning(
                        "idempotency_key_mismatch",
                        key=idempotency_key,
                        endpoint=endpoint
                    )
                    return None
                
                logger.info(
                    "idempotency_cache_hit",
                    key=idempotency_key,
                    endpoint=endpoint,
                    status=cached.status_code
                )
                
                return {
                    "status_code": int(cached.status_code),
                    "response_body": cached.response_body
                }
        
        except Exception as exc:
            logger.warning("idempotency_lookup_failed", error=repr(exc))
        
        return None
    
    async def store_response(
        self,
        idempotency_key: str,
        endpoint: str,
        request_hash: str,
        status_code: int,
        response_body: dict
    ) -> None:
        """
        Store the response for an idempotency key.
        
        Args:
            idempotency_key: The unique idempotency key from the request header
            endpoint: The API endpoint
            request_hash: SHA256 hash of the request body
            status_code: HTTP status code of the response
            response_body: Response body to cache
        """
        try:
            expiry = datetime.now(UTC) + timedelta(seconds=self.EXPIRY_SECONDS)
            
            key_entry = IdempotencyKeyDB(
                idempotency_key=idempotency_key,
                endpoint=endpoint,
                request_hash=request_hash,
                status_code=str(status_code),
                response_body=response_body,
                expires_at=expiry
            )
            
            self.db.add(key_entry)
            await self.db.commit()
            
            logger.info(
                "idempotency_response_stored",
                key=idempotency_key,
                endpoint=endpoint,
                status=status_code
            )
        
        except Exception as exc:
            logger.warning("idempotency_store_failed", error=repr(exc))
            # Don't fail the request if caching fails
            await self.db.rollback()


async def get_idempotency_manager(db_session) -> IdempotencyManager:
    """Dependency to get IdempotencyManager."""
    return IdempotencyManager(db_session)
