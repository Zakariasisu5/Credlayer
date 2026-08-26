from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    log_level: str = "INFO"

    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:3000"])

    database_url: str = "postgresql+asyncpg://credlayer:credlayer@localhost:5432/credlayer"
    redis_url: str = "redis://localhost:6379/0"

    # Standalone ML microservice connection (explicit IPv4 loopback)
    ml_service_url: str = "http://127.0.0.1:8001"

    # Reserved for a future Supabase-backed identity provider (see CLAUDE.md
    # "Blockchain / Solana layer" auth notes) - unused until then.
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
