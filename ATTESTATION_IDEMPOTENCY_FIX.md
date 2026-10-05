# Attestation Flow Idempotency Fix

## Problem Summary

The wallet attestation flow was creating duplicate attestations and returning 409 Conflict errors when users:
- Connected their wallet (automatic creation attempt)
- Clicked "Get Trust Score & Attestation" multiple times
- Had an existing attestation already on-chain

**Root Causes:**
1. Frontend called POST /attestation without checking if attestation already exists
2. Backend didn't verify existence before calling relayer
3. Relayer returned incomplete data when attestation already existed
4. Race conditions between simultaneous requests

---

## Solution Overview

Implemented three-layer idempotency with proper existence checking:

### Layer 1: Frontend (sdk-client.tsx)
**Changes:**
- Added explicit existence check via `GET /attestation/check` before POST
- Flow now: Check → Display existing OR Create new
- Existing `requestController.current` prevents duplicate requests during processing
- Removed automatic attestation creation on wallet connect

**New Flow:**
```
User clicks button
    ↓
GET /attestation/check
    ↓
Exists? → YES → Display existing attestation
    ↓
   NO
    ↓
POST /attestation → Create new
```

### Layer 2: Backend (scores.py)
**New Endpoints:**

1. **GET /{address}/attestation/check**
   - Checks relayer for existing attestation
   - Returns `{success: true, exists: true/false, attestation: {...}}`
   - Non-destructive, safe to call repeatedly

2. **POST /{address}/attestation** (Enhanced)
   - Step 0: Check if attestation already exists via GET relayer
   - If exists: Return 200 with `alreadyExists: true` + attestation data
   - If not: Score wallet → Call relayer → Return result
   - Always returns complete data structure

**Response Format (consistent for both cases):**
```json
{
  "success": true,
  "alreadyExists": true/false,
  "txHash": "..." or null,
  "attestationPda": "...",
  "attestation": {
    "trustScore": 892,
    "riskLevel": "LOW"
  },
  "score": {
    "trustScore": 892,
    "riskLevel": "LOW"
  }
}
```

### Layer 3: Relayer (index.ts)
**Changes to POST /attestations/issue:**

1. **Before creating:** Check if PDA exists
   - If valid attestation exists → Return 200 with complete data
   - If PDA exists but invalid → Return 409 with clear error
   
2. **After transaction fails:** Check again (race condition handling)
   - If attestation now exists → Return 200 with `alreadyExists: true`
   - Otherwise → Return actual error

---

## Testing Checklist

### ✅ Must Test Before Deployment

1. **No existing attestation:**
   - Connect wallet
   - Click "Get Trust Score & Attestation"
   - Verify attestation created successfully
   - Verify txHash displayed

2. **Existing attestation:**
   - Connect wallet with existing attestation
   - Click "Get Trust Score & Attestation"
   - Verify existing attestation displayed
   - Verify NO new transaction created

3. **Repeated clicks:**
   - Click button multiple times rapidly
   - Verify only ONE request sent
   - Verify button disabled during processing

4. **Wallet reconnect:**
   - Get attestation
   - Disconnect and reconnect wallet
   - Verify cached attestation displayed

---

## Files Modified

1. `Frontend/app/components/workspace/sdk-client.tsx`
2. `Backend/src/credlayer/api/v1/scores.py`
3. `blockchain/relayer/src/index.ts`

## Deployment Order

1. Deploy relayer first (backward compatible)
2. Deploy backend (uses new relayer responses)
3. Deploy frontend (uses new backend endpoint)
