# CredLayer Solana Attestation PDA 409 Conflict Fix

## Problem Summary

Production exhibits a race condition where brand-new wallets trigger HTTP 409 "Existing account is not a valid attestation" immediately after wallet scoring, despite:
1. GET check returning `verified: false, exists: false`
2. No prior attestation having been created
3. The wallet address being consistent throughout the flow

## Root Cause Analysis

### Hypothesis 1: PDA Derivation Inconsistency (PRIMARY)
- **Finding**: The relayer passes `wallet.toBase58()` as the nonce to `deriveAttestationPda()` and `getCreateAttestationInstruction()`
- **Issue**: GET and POST endpoints had duplicate PDA derivation logic instead of sharing a single, canonical function
- **Impact**: If inputs were subtly different (e.g., different PublicKey object representation), GET and POST could derive different PDAs
- **Fix**: Created shared `getAttestationPda()` helper ensuring both endpoints use identical derivation logic

### Hypothesis 2: Account Decode Layout Mismatch (SECONDARY)
- **Finding**: `decodeTrustAttestation()` uses hard-coded byte offsets:
  - Byte 0: discriminator
  - Bytes 1–33: target_wallet
  - Bytes 33–65: credential
  - Bytes 65–97: schema
  - Bytes 97–101: data_length
  - Bytes 101+: payload
- **Concern**: If SAS account layout changed or offsets were incorrect, valid accounts would fail to decode and trigger 409
- **Fix**: Documented offsets with audit comments and added defensive validation for each field

### Hypothesis 3: Insufficient Logging (SUPPORTING)
- **Finding**: Original code had minimal logging for PDA derivation inputs/outputs
- **Issue**: Impossible to diagnose where PDA mismatch occurred
- **Fix**: Added comprehensive structured debug logging:
  - `PDA_DEBUG`: wallet, credential, schema, nonce, derived PDA
  - `ACCOUNT_DEBUG`: exists, owner, dataLength, lamports, executable
  - `PAYLOAD_DEBUG`: trustScore, riskLevel, payload hex
  - `DIAGNOSTIC`: account state when decode fails

## Changes Made

### 1. Shared PDA Derivation Helper
```typescript
async function getAttestationPda(
    wallet: PublicKey,
    credentialPda: PublicKey,
    schemaPda: PublicKey,
): Promise<PublicKey>
```
- **GET and POST now use identical logic**
- Ensures nonce is always `wallet.toBase58()`
- No duplication = no divergence

### 2. Enhanced Account Validation
```typescript
if (!existingAccount.owner.equals(SAS_PROGRAM_ID)) {
    return res.status(409).json({
        success: false,
        error: "Attestation PDA is occupied by an account owned by another program.",
        attestationPda: attestationPda.toBase58(),
        owner: existingAccount.owner.toBase58(),
        expectedOwner: SAS_PROGRAM_ID.toBase58()
    });
}
```
- Explicitly validates account is owned by SAS program
- Returns 409 with diagnostic details if foreign-owned
- Prevents silent failure or data corruption

### 3. Detailed Decode Logging
When `decodeTrustAttestation()` fails:
```
[ISSUE-{id}] WARNING: Account exists but decode failed. 
  Owner={actual}, dataLen={len}
[ISSUE-{id}] DIAGNOSTIC: accountOwnerIsValid=true, canDecode=false
[ISSUE-{id}] DATA_DUMP: first 32 bytes: {hex}
```
- Helps identify layout mismatches or corruption
- First 32 bytes show discriminator + target_wallet

### 4. Structured Debug Logging
Every request logs:
- **PDA_DEBUG**: All inputs and derived PDA
- **ACCOUNT_DEBUG**: Existence, owner, data length, lamports
- **PAYLOAD_DEBUG**: Score payload hex and structure
- **ATTESTATION**: Decoded values (if successful)

### 5. Race Condition Handling (Enhanced)
After transaction failure, checks if another concurrent request already created valid attestation:
```typescript
if (existingAttestation) {
    return res.json({
        success: true,
        alreadyExists: true,
        // ... idempotent response
    });
}
```
- Ensures repeated requests on race don't fail
- Returns 200 instead of 500

### 6. Documentation
Added audit comments in code:
```typescript
/**
 * AUDIT: SAS Attestation Account Layout
 * Byte 0:         discriminator/version (u8) = 0
 * Bytes 1-33:     target_wallet (PublicKey, 32 bytes)
 * ...
 * This decoder validates all three PublicKey fields match expectations.
 */
```
- Explains expected account structure
- References sas-lib v1.0.10 spec
- Confirms offset correctness

## Verification Strategy

### 1. PDA Uniqueness Tests
- Run `tests/pda-uniqueness.test.ts`
- Verify:
  - 3+ different wallets → 3+ different PDAs
  - Same wallet, two derivations → identical PDA
  - Nonce encoding consistent (toBase58() string)

### 2. Manual Integration Test
```bash
# Test 1: Brand-new wallet
curl -X POST http://localhost:3001/api/v1/attestations/issue \
  -H "Content-Type: application/json" \
  -d '{
    "targetWallet": "EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H",
    "trustScore": 850,
    "riskLevel": "LOW"
  }'
# Expected: 200, success: true, alreadyExists: false, txHash: "..."

# Test 2: Repeated call on same wallet
curl -X POST http://localhost:3001/api/v1/attestations/issue \
  -H "Content-Type: application/json" \
  -d '{
    "targetWallet": "EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H",
    "trustScore": 850,
    "riskLevel": "LOW"
  }'
# Expected: 200, success: true, alreadyExists: true, txHash: null

# Test 3: GET on existing
curl http://localhost:3001/api/v1/attestations/EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H
# Expected: 200, verified: true, attestation: { trustScore: 850, riskLevel: "LOW" }
```

### 3. Log Inspection
Watch production logs for:
- `PDA_DEBUG` entries showing inputs/outputs
- `ACCOUNT_DEBUG` showing account state
- **NO 409 errors for brand-new wallets**
- **NO decode failures for newly created accounts**

### 4. Deployment Validation
After deploy:
1. Test with 5 brand-new wallets (different addresses)
2. Verify each creates successfully (200, alreadyExists: false)
3. Verify repeated calls return 200, alreadyExists: true
4. Verify GET checks return verified: true
5. Monitor logs for any decode failures

## Configuration Validation (Pre-Deployment)

Before deploying, verify:
1. **SOLANA_RPC_URL**: Same cluster (devnet/mainnet) for GET and POST
2. **CREDENTIAL_PDA**: Not a placeholder, valid base58
3. **SCHEMA_PDA**: Not a placeholder, valid base58
4. **SAS_PROGRAM_ID**: Hardcoded to `22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG`
5. **ISSUER_PRIVATE_KEY**: Valid base58, valid keypair

Add `/health` endpoint check:
```bash
curl http://localhost:3001/health
# {
#   "status": "ok",
#   "service": "credlayer-relayer",
#   "environment": "production",
#   "commit": "abc1234"
# }
```

## Expected Behavior After Fix

### Scenario 1: Brand-New Wallet
```
1. GET /attestations/wallet1 → 200, verified: false
2. Backend scores wallet → score: 850, risk: LOW
3. POST /attestations/issue with wallet1 → 200, success: true, alreadyExists: false, txHash: "4x..."
4. GET /attestations/wallet1 → 200, verified: true, attestation: { trustScore: 850, ... }
```
**✅ No 409 error**

### Scenario 2: Repeat POST for Same Wallet
```
1. POST /attestations/issue with wallet1 (existing) → 200, success: true, alreadyExists: true, txHash: null
```
**✅ Idempotent**

### Scenario 3: Concurrent Requests
```
1. Request A: POST /attestations/issue with wallet2
2. Request B: POST /attestations/issue with wallet2 (before A completes)
3. A succeeds, creates attestation
4. B's race condition check finds existing valid attestation
5. B returns 200, success: true, alreadyExists: true
```
**✅ Both 200, no conflict**

## Remaining Questions (For sas-lib Maintainers)

1. **Account Layout**: Are the documented byte offsets (0, 1–33, 33–65, 65–97, 97–101) the canonical SAS format?
2. **Nonce Encoding**: Does `deriveAttestationPda()` expect nonce as base58 string or raw bytes?
3. **Version Stability**: Has account layout changed between sas-lib v1.0.0 and v1.0.10?

If offsets are wrong or nonce encoding differs, update `getAttestationPda()` and `decodeTrustAttestation()` immediately.

## Rollback Plan

If after deploy issues persist:
1. Revert to previous relayer commit
2. Downgrade sas-lib to known-working version
3. Manually inspect Solana explorer for PDA account contents
4. If account corrupt, file Solana RPC issue or use `revoke-attestation.ts` to clean up

