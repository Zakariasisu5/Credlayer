from collections.abc import AsyncGenerator

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.cache.redis import get_redis
from credlayer.db.session import get_db as _get_db


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async for session in _get_db():
        yield session


def get_redis_client() -> Redis:
    return get_redis()
