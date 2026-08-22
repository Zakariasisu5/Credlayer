# CredLayer Relayer - Complete Setup Guide

## Quick Start (For Testing)

If you just want to test the system quickly without setting up the full SAS infrastructure:

### Step 1: Generate a Test Keypair

```bash
node generate-keypair.js
```

This will output:
- **Public Key**: Your wallet address (for receiving devnet SOL)
- **Private Key**: Use this for `ISSUER_PRIVATE_KEY` in `.env`

### Step 2: Fund Your Wallet

1. Copy the **Public Key** from step 1
2. Go to https://faucet.solana.com/
3. Paste your public key and request devnet SOL (2-3 SOL is enough)

### Step 3: Update .env File

Open `blockchain/relayer/.env` and update **only** the `ISSUER_PRIVATE_KEY`:

```env
ISSUER_PRIVATE_KEY=<paste_the_private_key_from_step_1>
```

For testing purposes, you can use temporary placeholder PDAs (the relayer will still start, but attestations won't work until you create real ones):

```env
# Temporary placeholders for testing (won't work for actual attestations)
CREDENTIAL_PDA=11111111111111111111111111111111
SCHEMA_PDA=11111111111111111111111111111111
```

### Step 4: Start the Relayer

```bash
npm run dev
```

The relayer will start on `http://localhost:3001` ✅

Now the frontend will connect successfully (but attestation issuance will fail until you set up real PDAs).

---

## Full Setup (For Production/Real Attestations)

To issue real on-chain attestations, you need to create SAS credentials and schemas.

### Step 1: Set Up the SAS Directory

```bash
cd ../sas
npm install
```

### Step 2: Configure SAS .env

Create or edit `blockchain/sas/.env`:

```env
# Use the same private key you generated earlier
PRIVATE_KEY=<your_base58_private_key>
```

### Step 3: Create Schema

```bash
npm run create-schema
```

**Copy the Schema PDA** from the output. It will look like:
```
Schema created: ABC123xyz...
```

### Step 4: Create Credential

```bash
npm run create-credential
```

**Copy the Credential PDA** from the output.

### Step 5: Update Relayer .env

Go back to the relayer directory and update `.env`:

```env
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
ISSUER_PRIVATE_KEY=<your_private_key>
CREDENTIAL_PDA=<schema_pda_from_step_3>
SCHEMA_PDA=<credential_pda_from_step_4>
```

### Step 6: Restart the Relayer

```bash
cd ../relayer
npm run dev
```

Now you can issue real attestations! 🎉

---

## Testing the Relayer

### Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","service":"credlayer-relayer"}
```

### Issue Test Attestation

```bash
curl -X POST http://localhost:3001/api/v1/attestations/issue \
  -H "Content-Type: application/json" \
  -d '{
    "targetWallet": "11111111111111111111111111111111",
    "trustScore": 750,
    "riskLevel": "LOW"
  }'
```

---

## Troubleshooting

### Error: "Non-base58 character"

**Cause**: The `ISSUER_PRIVATE_KEY` in `.env` is still a placeholder or invalid.

**Solution**: Run `node generate-keypair.js` and copy the private key to `.env`

### Error: "ISSUER_PRIVATE_KEY is still a placeholder"

**Cause**: The `.env` file has placeholder text like `YOUR_ISSUER_PRIVATE_KEY_HERE`

**Solution**: Replace with an actual Base58 private key

### Error: "CREDENTIAL_PDA is still a placeholder"

**Cause**: You need to create a credential using the SAS scripts

**Solution**: 
```bash
cd ../sas
npm run create-credential
# Copy the output PDA to relayer/.env
```

### Error: "SCHEMA_PDA is still a placeholder"

**Cause**: You need to create a schema using the SAS scripts

**Solution**:
```bash
cd ../sas
npm run create-schema
# Copy the output PDA to relayer/.env
```

### Error: "Account not found" or "Insufficient funds"

**Cause**: Your issuer wallet needs devnet SOL

**Solution**: Get SOL from https://faucet.solana.com/

### Relayer starts but frontend shows "Connection failed"

**Possible causes**:
1. Relayer is running on a different port
2. Frontend `NEXT_PUBLIC_RELAYER_URL` is incorrect
3. CORS issues (check relayer logs)

**Solution**: Verify:
- Relayer shows: `🚀 CredLayer Relayer active on http://localhost:3001`
- Frontend `.env.local` has: `NEXT_PUBLIC_RELAYER_URL=http://localhost:3001/api/v1/attestations/issue`

---

## Understanding the Flow

1. **User connects wallet** in the frontend
2. **User clicks "Issue Attestation"** in the dashboard
3. **Frontend sends request** to relayer with wallet address
4. **Relayer generates** a random trust score (600-850)
5. **Relayer creates** an on-chain attestation on Solana
6. **Frontend receives** transaction hash
7. **User can verify** on Solana Explorer

---

## Security Notes

- ⚠️ **Never commit `.env` files** to version control
- ⚠️ **Keep private keys secure** - they control your funds
- ⚠️ This setup is for **Devnet testing only**
- ⚠️ For production, use proper key management (AWS KMS, Azure Key Vault, etc.)

---

## Next Steps

- ✅ Generate keypair: `node generate-keypair.js`
- ✅ Fund wallet: https://faucet.solana.com/
- ✅ Update `.env` with private key
- ✅ Start relayer: `npm run dev`
- ✅ Test with frontend or curl
- 🔜 Create real SAS credentials (optional, for production)
