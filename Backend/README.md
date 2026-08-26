# CredLayer Backend

Core FastAPI backend for CredLayer: manages database models, caching, chain indexing, developer platform APIs, and acts as the API Gateway for the standalone ML scoring microservice (`models/`).

See `docs/backend-ai-specification.md` at the repo root for the full specification.

---

## 1. Quick Start

### Install Dependencies
Requires [uv](https://docs.astral.sh/uv/):
```bash
cd Backend
cp .env.example .env
uv sync
```

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

# Readiness (pings Postgres and Redis)
curl -s http://localhost:8000/readyz | python3 -m json.tool
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

---

## 6. Database Migrations

```bash
uv run alembic revision --autogenerate -m "migration_description"
uv run alembic upgrade head
```

---

## 7. Tests

```bash
uv run pytest
# or
PYTHONPATH=src python3 -m unittest discover -s tests -p "test_*.py"
```
