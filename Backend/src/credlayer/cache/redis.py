from redis.asyncio import Redis

from credlayer.core.config import Settings

_client: Redis | None = None


def init_redis(settings: Settings) -> Redis | None:
    """Initialize Redis client if URL is configured, otherwise return None."""
    global _client
    if settings.redis_url is None:
        _client = None
        return None
    _client = Redis.from_url(settings.redis_url, decode_responses=True)
    return _client


async def dispose_redis() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
    _client = None


def get_redis() -> Redis:
    if _client is None:
        raise RuntimeError("Redis client not initialized or not configured.")
    return _client
