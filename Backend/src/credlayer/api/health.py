import structlog
from fastapi import APIRouter, Response
from sqlalchemy import text

from credlayer.cache.redis import get_redis
from credlayer.db.session import get_engine

logger = structlog.get_logger(__name__)

# Outside /api/v1 and deliberately unenveloped - these are infra checks
# (load balancer / orchestrator probes), not part of the public API contract.
router = APIRouter(tags=["infra"])


@router.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/readyz")
async def readyz(response: Response) -> dict[str, object]:
    checks: dict[str, str] = {}
    healthy = True

    try:
        engine = get_engine()
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as exc:  # noqa: BLE001 - readiness must report, not raise
        logger.warning("readyz_database_failed", error=str(exc))
        checks["database"] = "unavailable"
        healthy = False

    try:
        redis = get_redis()
        await redis.ping()
        checks["redis"] = "ok"
    except Exception as exc:  # noqa: BLE001
        logger.warning("readyz_redis_failed", error=str(exc))
        checks["redis"] = "unavailable"
        healthy = False

    response.status_code = 200 if healthy else 503
    return {"status": "ok" if healthy else "degraded", "checks": checks}
