# CredLayer SAS Relayer

The CredLayer Relayer is an Express.js microservice that acts as the bridge between the AI Data Engine (Python/FastAPI) and the Solana blockchain. 

Since the Solana Attestation Service (SAS) ecosystem relies heavily on TypeScript tooling, this isolated service handles all wallet cryptography, PDA derivations, and transaction broadcasting on behalf of the AI backend.

## Architecture

1. The Python AI Model calculates a user's Trust Score.
2. The Python backend sends an internal HTTP POST request to this Relayer.
3. The Relayer signs the payload using the `Master Issuer` private key.
4. The Relayer issues the score as an on-chain Attestation PDA on Solana.
5. The Relayer returns the Transaction Hash back to the Python backend to be stored in Postgres.

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the template file to create your local `.env`:

```bash
cp .env.example .env
```

Add your specific keys and PDAs:

```env
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
ISSUER_PRIVATE_KEY=your_actual_base58_private_key
CREDENTIAL_PDA=your_credential_pda
SCHEMA_PDA=your_schema_pda
```

### 3. Run the Server

For local development with hot-reloading:

```bash
npm run dev
```

For production:

```bash
npm run build
npm run start
```

## API Reference

### `GET /health`

Verifies the relayer is online and ready to accept requests.

### `POST /api/v1/attestations/issue`

Issues a new Trust Score attestation on the Solana blockchain.

**Request Body (JSON):**

```json
{
  "targetWallet": "String (Base58 Public Key)", 
  "trustScore": 780,
  "riskLevel": "LOW | MEDIUM | HIGH"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "txHash": "5Xk...",
  "attestationPda": "PDA_Address_Here",
  "wallet": "Target_Wallet_Address",
  "trustScore": 780,
  "riskLevel": "MEDIUM"
}
```

## Testing Locally

You can test the relayer without needing the Python backend by running this `curl` command in a separate terminal:

```bash
curl -X POST http://localhost:3001/api/v1/attestations/issue \
-H "Content-Type: application/json" \
-d '{
  "targetWallet": "11111111111111111111111111111111", 
  "trustScore": 780,
  "riskLevel": "MEDIUM"
}'
```


## Troubleshooting

### Error: "Cannot find module 'D:\...\dist\index.js'"
**Solution:** Run `npm run build` to compile TypeScript to JavaScript first.

### Error: "Relayer environment variables are unconfigured"
**Solution:** 
- Make sure you've created a `.env` file (copy from `.env.example`)
- Verify that all required variables are set with actual values (not placeholders)
- Required variables: `ISSUER_PRIVATE_KEY`, `CREDENTIAL_PDA`, `SCHEMA_PDA`

### Error: "Account not found" or "Transaction failed"
**Solution:**
- Ensure your issuer account has sufficient SOL for transaction fees
  - Get devnet SOL from: https://faucet.solana.com/
- Verify that the `CREDENTIAL_PDA` and `SCHEMA_PDA` exist on-chain
- Confirm the issuer has authority to issue attestations

### How to Get Credential and Schema PDAs

If you don't have these values yet, you need to create them using the SAS scripts:

```bash
# Navigate to the SAS directory
cd ../sas

# Install dependencies
npm install

# Configure your .env file in the sas directory
# Then create a schema
npm run create-schema

# Create a credential
npm run create-credential
```

The scripts will output the PDA addresses - copy them to your relayer `.env` file.

## Frontend Integration

The relayer works seamlessly with the CredLayer frontend. When you click "Issue Attestation" in the dashboard:

1. Frontend sends wallet address to relayer
2. Relayer generates mock trust score (600-850)
3. Relayer creates on-chain attestation
4. Frontend displays transaction hash and Solana Explorer link

Make sure the frontend's `NEXT_PUBLIC_RELAYER_URL` matches this service's URL (default: `http://localhost:3001/api/v1/attestations/issue`).
