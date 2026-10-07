# PDA Conflict Diagnosis & Resolution

## Current Production Error

```
POST /api/v1/attestations/issue
→ 409 Conflict
→ "Existing account is not a valid attestation"
```

##Root Cause Analysis

The error occurs when:
1. ✅ PDA is derived correctly
2. ✅ An account exists at that PDA address
3. ✅ The account is owned by SAS_PROGRAM_ID
4. ❌ The account data cannot be decoded as a valid CredLayer attestation

This means the account at the PDA was created with **different parameters** or has a **different data structure** than expected.

## Possible Causes

### 1. Stale Credential/Schema Configuration
**Most Likely**

The production relayer environment variables may have outdated values:
```bash
CREDENTIAL_PDA=<old_value>
SCHEMA_PDA=<old_value>
```

If these were changed after attestations were already created, the derived PDAs will point to accounts created with the old credential/schema.

**Fix:** Ensure production env vars match the actual on-chain credential and schema PDAs.

### 2. Account Layout Mismatch

The `decodeTrustAttestation` function expects this layout:
```
Byte 0:       discriminator (u8) = 0
Bytes 1-33:   nonce/target_wallet (32 bytes)
Bytes 33-65:  credential (32 bytes)
Bytes 65-97:  schema (32 bytes)  
Bytes 97-101: data_length (u32)
Bytes 101+:   data payload
```

If the SAS program updated its account layout, this decoder will fail.

**Fix:** Use official `getAttestationDecoder()` from sas-lib instead of manual parsing.

### 3. Multiple Relayer Deployments

If multiple relayer instances exist with different configurations, they may create conflicting PDAs.

**Fix:** Verify only one active relayer deployment exists.

### 4. Devnet/Mainnet Mismatch

Production may be connected to the wrong Solana cluster.

**Fix:** Verify `SOLANA_RPC_URL` matches where credentials/schemas were created.

## Debugging Steps

### Step 1: Check Production Environment

```bash
# In Railway/production console
echo $CREDENTIAL_PDA
echo $SCHEMA_PDA  
echo $SOLANA_RPC_URL
```

Compare with actual on-chain accounts.

### Step 2: Run PDA Test Locally

```bash
cd blockchain/relayer
cp .env.example .env
# Edit .env with PRODUCTION values
npx ts-node test-pda.ts
```

This verifies:
- PDA derivation is consistent
- Different wallets produce different PDAs
- Same wallet always produces same PDA

### Step 3: Check Existing Account

For the failing wallet, check what's actually at the derived PDA:

```bash
solana account <DERIVED_PDA> --url devnet
```

Compare:
- Owner program ID
- Data length
- Lamports balance

### Step 4: Decode Existing Account

Add temporary logging in the relayer:

```typescript
if (existingAccount) {
    console.log('[DEBUG] Account data (hex):', existingAccount.data.toString('hex'));
    console.log('[DEBUG] First 97 bytes:');
    console.log('  Discriminator:', existingAccount.data.readUInt8(0));
    console.log('  Nonce:', new PublicKey(existingAccount.data.subarray(1, 33)).toBase58());
    console.log('  Credential:', new PublicKey(existingAccount.data.subarray(33, 65)).toBase58());
    console.log('  Schema:', new PublicKey(existingAccount.data.subarray(65, 97)).toBase58());
}
```

This shows EXACTLY what values the existing attestation was created with.

## Resolution Options

### Option A: Update Environment Variables (Recommended)

If credentials/schemas changed:

1. Find the correct CREDENTIAL_PDA and SCHEMA_PDA values
2. Update Railway environment variables
3. Redeploy relayer
4. Test with a NEW wallet (existing wallets may still have old attestations)

### Option B: Clean Up Invalid Accounts

If accounts are truly invalid/corrupt:

1. Create a cleanup script to close invalid accounts
2. Requires the authority/issuer keypair
3. Recovers lamports
4. Allows recreation with correct parameters

**Warning:** Only do this if you're certain the accounts are invalid.

### Option C: Use Official Decoder

Replace manual `decodeTrustAttestation` with official sas-lib decoder:

```typescript
import { getAttestationDecoder } from 'sas-lib';

function decodeTrustAttestation(accountData: Buffer, ...): { trustScore: number; riskLevel: string } | null {
    try {
        const decoder = getAttestationDecoder();
        const attestation = decoder.decode(new Uint8Array(accountData));
        
        // Extract custom data payload
        const dataPayload = Buffer.from(attestation[0].data);
        const trustScore = dataPayload.readUInt16LE(0);
        const riskLength = dataPayload.readUInt32LE(2);
        const riskLevel = dataPayload.toString('utf8', 6);
        
        return { trustScore, riskLevel };
    } catch (error) {
        console.error('[Decode Error]', error);
        return null;
    }
}
```

This ensures compatibility with any SAS layout changes.

## Current Code Status

The relayer already has:
- ✅ Comprehensive PDA debugging logs
- ✅ Account existence checks
- ✅ Owner verification
- ✅ Proper 409 error responses for invalid accounts
- ✅ Idempotency for valid existing attestations

What's needed:
- ⚠️ Verify production environment variables
- ⚠️ Consider using official sas-lib decoder
- ⚠️ Test PDA derivation matches production

## Next Steps

1. **Immediate:** Check production Railway logs for the PDA_DEBUG output
2. **Verify:** Compare logged credential/schema with expected values
3. **Test:** Use test-pda.ts script with production env values
4. **Fix:** Update env vars if mismatch found
5. **Deploy:** Redeploy relayer with correct configuration
6. **Validate:** Test with a brand-new wallet address

## Testing Checklist

After fixing:

- [ ] Brand new wallet creates attestation successfully
- [ ] Same wallet returns existing attestation (200 alreadyExists=true)
- [ ] Different wallet creates different PDA
- [ ] No 409 errors for valid operations
- [ ] Frontend displays attestations correctly
- [ ] Repeated clicks don't create duplicates

