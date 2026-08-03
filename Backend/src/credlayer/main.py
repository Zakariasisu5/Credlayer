from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from credlayer.api.errors import register_exception_handlers
from credlayer.api.health import router as health_router
from credlayer.api.router import api_router
from credlayer.cache.redis import dispose_redis, init_redis
from credlayer.core.config import get_settings
from credlayer.core.logging import configure_logging
from credlayer.db.session import dispose_engine, init_engine


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
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
