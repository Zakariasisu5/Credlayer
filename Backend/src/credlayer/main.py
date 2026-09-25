from __future__ import annotations

import asyncio
import time
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from starlette.middleware.base import BaseHTTPMiddleware

from credlayer.api.errors import register_exception_handlers
from credlayer.api.health import router as health_router
from credlayer.api.router import api_router
from credlayer.api.v1.api_keys import ApiKeyDB
from credlayer.api.v1.request_logs import RequestLogDB
from credlayer.cache.redis import dispose_redis, init_redis
from credlayer.core.config import get_settings
from credlayer.core.logging import configure_logging
from credlayer.db.session import dispose_engine, init_engine, session_scope


logger = structlog.get_logger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Persist business API requests without affecting the API response."""

    _excluded_paths = {
        "/healthz",
        "/readyz",
        "/docs",
        "/openapi.json",
        "/redoc",
    }

    def _is_excluded(self, request: Request) -> bool:
        path = request.url.path.rstrip("/") or "/"
        return path in self._excluded_paths or path.startswith("/static/")

    @staticmethod
    def _owner_from_path(request: Request) -> str | None:
        # Path parameters are populated by Starlette before call_next returns.
        # Restrict this to names that actually identify an owner, rather than
        # accidentally treating IDs such as agent_id as wallet addresses.
        for name in ("wallet", "wallet_address", "owner_wallet", "address"):
            value = request.path_params.get(name)
            if value:
                return str(value)
        return None

    @staticmethod
    async def _api_key_owner(request: Request) -> tuple[str | None, object | None]:
        presented = (
            request.headers.get("x-api-key")
            or request.headers.get("api-key")
            or ""
        ).strip()
        if not presented:
            authorization = request.headers.get("authorization", "")
            if authorization.lower().startswith("bearer "):
                presented = authorization[7:].strip()
        if not presented:
            return None, None

        # API keys are currently persisted with their public key_prefix (the
        # key_hash written by the existing API-key endpoint is not derived from
        # the returned secret), so prefix lookup is the only compatible lookup.
        async with session_scope() as db:
            result = await db.execute(
                select(ApiKeyDB).where(ApiKeyDB.key_prefix == presented[:10])
            )
            api_key = result.scalar_one_or_none()
            if api_key is None:
                return None, None
            return api_key.owner_wallet, api_key.id

    async def _resolve_owner(self, request: Request) -> tuple[str | None, object | None]:
        # Query parameters are available before routing and are used by the
        # developer/API-key management endpoints.
        owner = request.query_params.get("owner_wallet")
        if owner:
            return owner, None

        owner, api_key_id = await self._api_key_owner(request)
        if owner:
            return owner, api_key_id

        return self._owner_from_path(request), None

    async def _write_log(self, values: dict) -> None:
        try:
            async with session_scope() as db:
                db.add(RequestLogDB(**values))
                await db.commit()
        except Exception as exc:  # Logging must never change request behavior.
            logger.warning("request_log_write_failed", error=repr(exc))

    async def dispatch(self, request: Request, call_next) -> Response:
        if self._is_excluded(request):
            return await call_next(request)

        started = time.perf_counter()
        exception: Exception | None = None
        response: Response | None = None
        try:
            response = await call_next(request)
        except Exception as exc:
            exception = exc
            raise
        finally:
            duration_ms = max(0, round((time.perf_counter() - started) * 1000))
            try:
                owner_wallet, api_key_id = await self._resolve_owner(request)
                # A request without an attributable owner is deliberately not
                # logged: request_logs.owner_wallet is non-null and a fake value
                # would make dashboard data misleading.
                if owner_wallet:
                    status_code = response.status_code if response is not None else 500
                    values = {
                        "api_key_id": api_key_id,
                        "owner_wallet": owner_wallet,
                        "method": request.method,
                        "endpoint": request.url.path,
                        "status_code": status_code,
                        "error_message": (
                            repr(exception)
                            if exception is not None
                            else (f"HTTP {status_code}" if status_code >= 500 else None)
                        ),
                        "duration_ms": duration_ms,
                        "ip_address": (
                            request.headers.get("x-forwarded-for", "").split(",")[0].strip()
                            or (request.client.host if request.client else None)
                        ),
                    }
                    # RequestLog.status derives the dashboard bucket from this
                    # status_code (401/403, 429, 4xx, 5xx, or success); do not
                    # persist a second, potentially divergent status field.
                    asyncio.create_task(self._write_log(values))
            except Exception as exc:
                logger.warning("request_log_prepare_failed", error=repr(exc))

        # The normal response is returned by the try block; this is only here
        # for type checkers because exception paths re-raise above.
        assert response is not None
        return response


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
        init_engine(settings)
        init_redis(settings)
        try:
            yield
        finally:
            await dispose_engine()
            await dispose_redis()

    app = FastAPI(title="CredLayer API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)

    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
