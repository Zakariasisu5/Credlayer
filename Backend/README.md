# CredLayer Backend

FastAPI backend for wallet reputation/AI scoring, chain indexing, and the developer platform.
See `docs/backend-ai-specification.md` at the repo root for the full spec, and `CLAUDE.md` for
project-wide context and the current build phase.

## Status

Phase 1 (Foundation) in progress. This is the bare app scaffold: config, logging, error
envelope, health/readiness checks. No domain routes, auth, or indexing yet.

## Local development

Requires [uv](https://docs.astral.sh/uv/).

```bash
cp .env.example .env
uv sync
uv run uvicorn credlayer.main:app --reload
```

`GET /healthz` is a liveness check (no dependencies). `GET /readyz` checks Postgres and Redis
connectivity and returns 503 if either is unavailable.

Postgres and Redis for local dev:

```bash
docker compose up postgres redis
```

## Migrations

```bash
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
```

Autogenerate is a draft, not a source of truth — review every migration by hand before
committing it (see the naming-convention note in `src/credlayer/db/base.py`).

## Tests

```bash
uv run pytest
```
