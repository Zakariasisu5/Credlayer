from setuptools import setup, find_packages

setup(
    name="credlayer",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi>=0.115",
        "uvicorn[standard]>=0.32",
        "pydantic>=2.9",
        "pydantic-settings>=2.6",
        "sqlalchemy[asyncio]>=2.0",
        "asyncpg>=0.30",
        "aiosqlite>=0.20",
        "alembic>=1.14",
        "redis>=5.2",
        "structlog>=24.4",
        "httpx>=0.27",
    ],
    python_requires=">=3.12",
)
