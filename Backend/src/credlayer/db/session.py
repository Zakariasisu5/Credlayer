from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from credlayer.core.config import Settings

_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def init_engine(settings: Settings) -> AsyncEngine:
    global _engine, _session_factory
    
    # Configure connect_args for asyncpg to fix Supabase pgbouncer compatibility
    connect_args = {}
    if "supabase" in settings.database_url or "pgbouncer" in settings.database_url:
        # Disable prepared statement cache for pgbouncer compatibility
        connect_args["prepared_statement_cache_size"] = 0
    
    _engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
        connect_args=connect_args
    )
    _session_factory = async_sessionmaker(_engine, expire_on_commit=False)
    return _engine


async def dispose_engine() -> None:
    global _engine, _session_factory
    if _engine is not None:
        await _engine.dispose()
    _engine = None
    _session_factory = None


def get_engine() -> AsyncEngine:
    if _engine is None:
        raise RuntimeError("Database engine not initialized - call init_engine() at startup.")
    return _engine


@asynccontextmanager
async def session_scope() -> AsyncGenerator[AsyncSession, None]:
    if _session_factory is None:
        raise RuntimeError("Session factory not initialized - call init_engine() at startup.")
    async with _session_factory() as session:
        yield session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with session_scope() as session:
        yield session
