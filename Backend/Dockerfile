FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

WORKDIR /app

COPY pyproject.toml ./
RUN uv sync --no-install-project --no-dev

COPY src ./src
RUN uv sync --no-dev

RUN useradd --create-home --uid 1000 credlayer
USER credlayer

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "credlayer.main:app", "--host", "0.0.0.0", "--port", "8000"]
