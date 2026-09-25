# Developer Documentation Validation Report

Date: 2026-09-25

## Repository evidence reviewed

- Backend route modules under `Backend/src/credlayer/api/v1/`
- `Backend/src/credlayer/main.py`, API-key middleware, and request-log model
- `Backend/pyproject.toml` and `Backend/README.md`
- Frontend developer hooks and dashboard
- `Frontend/lib/credlayer-sdk/`
- `blockchain/sdk/src/index.ts` and `blockchain/sdk/README.md`

## Passed by code inspection

- API base prefix is configurable and defaults to `/api/v1`.
- API-key creation returns a secret only in the creation response.
- New API-key records use a SHA-256 digest of the secret.
- API-key metadata includes prefix, owner, name, active state, permissions JSON, creation, last-used, and expiry fields.
- Revocation sets `is_active` false.
- Request-log listing and aggregate statistics routes exist in the current branch.
- Frontend request logs poll every 10 seconds and the aggregate stats hook polls every 15 seconds.
- Error status bucketing is defined in `RequestLog.status`.
- Copy-paste examples in `docs/developer-guide.md` use real route paths from the backend.

## Not validated in this environment

- Live production API-key creation, authentication, revocation, and rotation.
- Live Supabase schema and `request_logs` availability.
- Live Railway deployment and ML service connectivity.
- Running TypeScript, Python, or SDK examples against a deployed backend.
- Webhook delivery, retries, signatures, and verification.

## Required implementation before claiming full support

1. Ensure authentication does not block `POST /api/v1/api-keys`; otherwise first-time key creation is impossible.
2. Add an explicit atomic key-rotation endpoint or document the create-new/revoke-old procedure as the only supported rotation flow.
3. Enforce permissions JSON in route dependencies if scopes are intended to provide security.
4. Add real rate limiting and publish its limits and headers.
5. Implement webhook delivery, signing, retry, and delivery status before documenting webhooks as operational.
6. Replace the Solana SDK placeholder PDAs and mocked score decoding with real decoding and tests.
7. Add automated contract tests for every documented endpoint and examples for CI.
8. Add a supported Python/REST SDK if Python package installation is required by the product promise.

## Suggested smoke test

```bash
export BASE_URL="https://YOUR_BACKEND_HOST/api/v1"
export WALLET="YOUR_SOLANA_WALLET"

# Create (must be unauthenticated or authenticated by a separate dashboard auth flow)
curl -i -X POST "$BASE_URL/api-keys" \
  -H 'Content-Type: application/json' \
  -d "{\"owner_wallet\":\"$WALLET\",\"name\":\"smoke-test\"}"

# Use returned data.key, then test a real endpoint
export KEY="sk_..."
curl -i -H "X-API-Key: $KEY" "$BASE_URL/scores/$WALLET"

# List metadata and revoke using returned data.id
curl -i "$BASE_URL/api-keys?owner_wallet=$WALLET"
curl -i -X DELETE -H "X-API-Key: $KEY" "$BASE_URL/api-keys/KEY_ID"

# Confirm the old key is rejected
curl -i -H "X-API-Key: $KEY" "$BASE_URL/scores/$WALLET"
```

Expected final request: HTTP 401. Do not mark the validation complete until that result and a corresponding `request_logs` row are observed in the deployed database.
