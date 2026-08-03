from redis.asyncio import Redis

from credlayer.core.config import Settings

_client: Redis | None = None


def init_redis(settings: Settings) -> Redis:
    global _client
    _client = Redis.from_url(settings.redis_url, decode_responses=True)
    return _client


async def dispose_redis() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
    _client = None


def get_redis() -> Redis:
    if _client is None:
        raise RuntimeError("Redis client not initialized - call init_redis() at startup.")
    return _client
