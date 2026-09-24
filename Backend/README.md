# CredLayer Backend

Core FastAPI backend for CredLayer: manages database models, caching, chain indexing, developer platform APIs, and acts as the API Gateway for the standalone ML scoring microservice (`models/`).

See `docs/backend-ai-specification.md` at the repo root for the full specification.

---

## 1. Quick Start

### Install Dependencies
Requires [uv](https://docs.astral.sh/uv/):
```bash
cd Backend
uv sync
```

### Database Setup

#### Option A: Supabase PostgreSQL (Recommended)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Get your connection details:**
   - Go to Project Settings → Database
   - Copy the **Direct Connection** string (port 5432, NOT the pooler)
   - Important: Use direct connection for Railway/long-running containers

3. **Run the setup SQL:**
   - Open Supabase SQL Editor
   - Copy entire `Backend/supabase_setup.sql` file
   - Paste and run in SQL Editor
   - This creates all 10 tables with correct schema

4. **Configure `.env`:**
   ```bash
   cp .env.example .env
   ```
   
   Update `DATABASE_URL` in `.env`:
   ```env
   # Use Direct Connection (port 5432) for Railway/containers
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   ```

5. **Verify setup:**
   ```bash
   # Run migrations (should show "already at head" since tables exist)
   uv run alembic upgrade head
   
   # Or check schema
   python scripts/check_migrations.py
   ```

**Important Notes:**
- ✅ **Direct connection (port 5432)** - for Railway, Docker, local dev
- ❌ **Transaction pooler (port 6543)** - only for serverless functions
- The `supabase_setup.sql` includes all tables from migrations 001-007
- After initial setup, migrations run automatically on Railway deploys

#### Option B: Local PostgreSQL with Docker
```bash
docker compose up postgres redis -d
```
Then use the default `.env.example` configuration.

### Run the Backend Gateway (Port 8000)
```bash
uv run uvicorn credlayer.main:app --port 8000 --reload
```

---

## 2. Microservice Integration (`models/` Service)

The Backend acts as an API gateway for the standalone ML service (`models/` running on Port 8001).

Configured via `ML_SERVICE_URL` in `.env`:
```env
ML_SERVICE_URL=http://127.0.0.1:8001
```

*Make sure the `models/` service is running in a separate terminal:*
```bash
cd ../models
uv run uvicorn credlayer_ml.main:app --port 8001 --reload
```

---

## 3. Testing the Backend API Endpoints

### Liveness & Readiness Probes
```bash
# Liveness (no external dependencies)
curl -s http://localhost:8000/healthz | python3 -m json.tool

# Readiness (pings Postgres and optionally Redis)
curl -s http://localhost:8000/readyz | python3 -m json.tool
```

Expected response:
```json
{
  "status": "ok",
  "checks": {
    "database": "ok",
    "redis": "not_configured"
  }
}
```

### Single Wallet Reputation Score (GET)
Queries the GNN model through the gateway:
```bash
curl -s http://localhost:8000/api/v1/scores/FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs | python3 -m json.tool
```

**Example Response:**
```json
{
    "success": true,
    "data": {
        "address": "FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs",
        "trustScore": 468,
        "trustLevel": "low",
        "riskLevel": "medium",
        "confidence": 0.9,
        "fraudProbability": 0.5311985015869141,
        "network": "solana",
        "explanation": "The prediction for node 44059 was most influenced by: Features [feature_0 (0.0000), feature_1 (0.0000), feature_2 (0.0000), feature_3 (0.0000), feature_4 (0.0000)], Neighbor Connections [None]"
    },
    "message": null,
    "timestamp": "2026-08-26T10:53:27.761457Z"
}
```

### Batch Wallet Reputation Scoring (POST)
```bash
curl -s -X POST http://localhost:8000/api/v1/scores/batch \
  -H "Content-Type: application/json" \
  -d '{
    "addresses": [
      "FfetZ9oHhYmHQq7n7K37UQAMCu3pf4Bx5TKyKQpTSQYs",
      "G61NTJEvxUuTPsNuW9AKKDX2yQWnVgaZWs4YQ9xMcpPx",
      "DKXrKtQFUNAr5Rcq19CMFzYgqynJ3uJ78bux4fsPty5P"
    ]
  }' | python3 -m json.tool
```

---

## 4. Interactive Swagger UI

Open your browser to:
[http://localhost:8000/docs](http://localhost:8000/docs)

---

## 5. Local Infrastructure (Postgres & Redis)

Start local Postgres and Redis containers:
```bash
docker compose up postgres redis
```

**Note:** Redis is optional. The backend will start without it and report `"redis": "not_configured"` in health checks.

---

## 6. Database Migrations

### View Current Status
```bash
# Check migration version
uv run alembic current

# View migration history
uv run alembic history

# Verify schema matches migrations
python scripts/check_migrations.py
```

### Create New Migrations
```bash
# Auto-generate migration from model changes
uv run alembic revision --autogenerate -m "add_new_table"

# Review generated file in migrations/versions/
# Edit if needed, then apply:
uv run alembic upgrade head
```

### Apply Migrations
```bash
# Upgrade to latest
uv run alembic upgrade head

# Upgrade one version
uv run alembic upgrade +1

# Downgrade one version
uv run alembic downgrade -1
```

### Troubleshooting Migrations

If you see "column does not exist" errors:

1. **Check schema:**
   ```bash
   python scripts/check_migrations.py
   ```

2. **Verify Supabase tables:**
   - Run `scripts/verify_schema.sql` in Supabase SQL Editor
   - Or check in Supabase Table Editor

3. **Reset if needed (destroys data):**
   ```bash
   # Local only
   ./scripts/reset_and_migrate.sh
   
   # Supabase: run scripts/railway_reset_db.sql in SQL Editor
   ```

---

## 7. Railway Deployment

### Quick Deploy

1. **Connect GitHub repo** to Railway
2. **Set environment variables:**
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxx.supabase.co:5432/postgres
   ENVIRONMENT=production
   CORS_ORIGINS=["https://your-frontend.vercel.app"]
   ```
3. **Deploy** - migrations run automatically via Dockerfile

### Important: Use Direct Connection

Railway deployments MUST use Supabase **Direct Connection** (port 5432):
- ✅ `db.xxx.supabase.co:5432` - Direct connection
- ❌ `aws-x-xx.pooler.supabase.com:6543` - Transaction pooler (don't use)

The transaction pooler is only for serverless functions, not containers.

### Deployment Troubleshooting

See detailed guides:
- `RAILWAY_SETUP.md` - Complete Railway deployment guide
- `SUPABASE_RESET_GUIDE.md` - Fix schema issues
- `QUICK_FIX.md` - Common error solutions

---

## 8. Project Structure

```
Backend/
├── src/credlayer/
│   ├── api/
│   │   ├── v1/          # API endpoints (models defined inline)
│   │   │   ├── activity.py
│   │   │   ├── agents.py
│   │   │   ├── api_keys.py
│   │   │   ├── connections.py
│   │   │   ├── credentials.py
│   │   │   ├── request_logs.py
│   │   │   ├── scores.py
│   │   │   ├── settings.py
│   │   │   └── webhooks.py
│   │   ├── deps.py      # FastAPI dependencies
│   │   ├── envelope.py  # Response wrapper
│   │   ├── errors.py    # Error handling
│   │   ├── health.py    # Health check endpoints
│   │   └── router.py    # Main API router
│   ├── cache/
│   │   └── redis.py     # Redis client (optional)
│   ├── core/
│   │   ├── config.py    # Settings & environment
│   │   ├── errors.py    # Core exceptions
│   │   └── logging.py   # Structured logging
│   ├── db/
│   │   ├── base.py      # SQLAlchemy base
│   │   └── session.py   # Database session management
│   ├── schemas/
│   │   └── common.py    # Shared Pydantic models
│   └── main.py          # FastAPI application entry
├── migrations/          # Alembic migrations
│   └── versions/
│       ├── 001_create_credentials_table.py
│       ├── 002_create_connections_table.py
│       ├── 003_create_agents_tables.py
│       ├── 004_create_activity_table.py
│       ├── 005_create_settings_table.py
│       ├── 006_create_api_keys_table.py
│       └── 007_create_webhooks_request_logs_tables.py
├── scripts/             # Utility scripts
│   ├── check_migrations.py      # Verify schema
│   ├── safe_migrate.py          # Smart migration helper
│   ├── verify_schema.sql        # Manual SQL check
│   └── railway_reset_db.sql     # Database reset for Railway
├── tests/               # Test suite
├── .env.example         # Environment template
├── alembic.ini          # Alembic configuration
├── docker-compose.yml   # Local services
├── Dockerfile           # Production container
├── pyproject.toml       # Python dependencies
├── supabase_setup.sql   # Complete database setup
└── README.md            # This file
```

---

## 9. Database Schema

All tables from migrations 001-007:

| Table | Description |
|-------|-------------|
| `credentials` | Wallet attestations and credentials |
| `connections` | Trust graph connections |
| `agents` | AI agents |
| `agent_executions` | Agent execution history |
| `activity` | Event audit log |
| `settings` | User preferences |
| `api_keys` | Developer API keys |
| `webhooks` | Webhook subscriptions |
| `request_logs` | API request logs |
| `alembic_version` | Migration tracking |

---

## 10. Environment Variables

### Required
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/db
ENVIRONMENT=development|production
```

### Optional
```env
# Redis (optional - app works without it)
REDIS_URL=redis://localhost:6379/0

# ML Service
ML_SERVICE_URL=http://127.0.0.1:8001

# API Configuration
API_V1_PREFIX=/api/v1
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]

# Supabase (for future auth integration)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## 11. Tests

```bash
uv run pytest
# or
PYTHONPATH=src python3 -m unittest discover -s tests -p "test_*.py"
```

---

## 12. Helpful Resources

- **Deployment:** `RAILWAY_SETUP.md`
- **Database Issues:** `SUPABASE_RESET_GUIDE.md`
- **Quick Fixes:** `QUICK_FIX.md`
- **Scripts:** `scripts/README.md`
- **API Spec:** `docs/backend-ai-specification.md`
- **Supabase Setup:** Run `supabase_setup.sql` in SQL Editor

---

## 13. Common Issues

### "Column does not exist" errors
Schema mismatch. See `SUPABASE_RESET_GUIDE.md` or run `scripts/check_migrations.py`.

### "Network is unreachable" on Railway
Check DATABASE_URL uses direct connection (port 5432, not 6543).

### Redis connection errors
Redis is optional. Set `REDIS_URL` or leave empty - app will work without it.

### Prepared statement errors
Use direct connection, not transaction pooler. Or add `?prepared_statement_cache_size=0` to DATABASE_URL.

---

**Need Help?** Check the documentation files in `Backend/` or run diagnostic scripts in `Backend/scripts/`.
