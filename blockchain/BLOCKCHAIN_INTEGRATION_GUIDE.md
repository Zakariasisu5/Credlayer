# CredLayer Blockchain Integration Guide

This document provides a comprehensive architectural and codebase audit of the Solana blockchain integration across the CredLayer repository. It details the current reality of the on-chain implementation, cross-service flow, key management, and deployment runbooks.

---

## 1. Current Codebase Reality vs. Architecture

### On-Chain vs. Off-Chain Implementation
The current implementation **does not use a custom compiled Anchor program** (the `blockchain/programs/` directory is empty). Instead, CredLayer heavily leverages the **Solana Attestation Service (SAS)** via the `sas-lib` SDK. 
- **Off-Chain Execution:** The `Backend` performs ML-based reputation scoring and triggers the `Relayer`.
- **On-Chain Execution:** The `Relayer` builds and broadcasts a native Solana transaction using `sas-lib` (`getCreateAttestationInstruction`) to mint a verifiable credential PDA on Devnet.
- **On-Chain Reads:** The `Frontend` uses the custom `@credlayer/sdk` to derive the PDA and read the attestation data directly from the Solana RPC.

### File Structure of `blockchain/`
- **`relayer/`**: An Express.js microservice (`src/index.ts`) that acts as a secure bridge between the Python FastAPI backend and Solana Devnet. It holds the master private key and pays for transaction fees.
  - `generate-keypair.js`: Utility script to generate a new Base58 wallet for the relayer.
  - `.env.example` / `.env`: Configuration for RPC, PDA addresses, and the master `ISSUER_PRIVATE_KEY`.
- **`sas/`**: Contains utility scripts for managing the SAS lifecycle.
  - `src/create-schema.ts`: Defines the schema format for trust scores.
  - `src/create-credential.ts`: Registers the issuer credential.
  - `src/update-attestation.ts` / `revoke-attestation.ts`: Lifecycle management for issued scores.
- **`sdk/`**: The `@credlayer/sdk` package used by the Frontend.
  - Wraps `sas-lib` to abstract away PDA derivation and data decoding for the frontend UI.
- **`programs/`**: Empty directory. No custom Anchor smart contracts are currently deployed or required.

---

## 2. Cross-Service Synchronization Flow

### Transaction Lifecycle
1. **Wallet Connection (`Frontend`)**: The user connects their wallet using the Solana wallet adapter in `TrustScoreLiveDemo`.
2. **Score Request (`Frontend` -> `Backend`)**: The UI calls the gateway endpoint via `apiClient.get('/scores/${walletAddress}')`.
3. **ML Processing (`Backend`)**: The gateway (`Backend/src/credlayer/api/v1/scores.py`) queries the standalone ML service (`http://127.0.0.1:8001/api/v1/scores/{address}`).
4. **Relayer Trigger (`Backend` -> `Relayer`)**: Upon receiving the score, the FastAPI backend immediately sends a POST request to the Relayer (`http://localhost:3001/api/v1/attestations/issue`) containing the wallet, score, and risk level.
5. **On-Chain Minting (`Relayer` -> `Solana Devnet`)**: The Relayer constructs a transaction using `getCreateAttestationInstruction`, signs it with the `ISSUER_PRIVATE_KEY`, and sends it to the Solana RPC.
6. **On-Chain Read-Back (`Frontend` <- `Solana Devnet`)**: The user clicks "Verify On-Chain (SDK)" in the UI, which uses the `@credlayer/sdk` (`credlayer.getScore(walletAddress)`) to directly query the Solana RPC, skipping the backend entirely.

### Sequence Diagram
```text
+----------+             +---------+              +-------------+            +---------------+
| Frontend |             | Backend |              |   Relayer   |            | Solana Devnet |
+----------+             +---------+              +-------------+            +---------------+
     |                        |                          |                           |
     | 1. GET /scores/{addr}  |                          |                           |
     |----------------------->|                          |                           |
     |                        | 2. Fetch ML Score        |                           |
     |                        |    (Internal ML Svc)     |                           |
     |                        |                          |                           |
     |                        | 3. POST /attestations/issue                          |
     |                        |    { targetWallet,       |                           |
     |                        |      trustScore,         |                           |
     |                        |      riskLevel }         |                           |
     |                        |------------------------->|                           |
     |                        |                          | 4. getCreateAttestation() |
     |                        |                          |    Sign with ISSUER_KEY   |
     |                        |                          |-------------------------->|
     |                        |                          |                           |
     |                        | 5. Return Tx Hash        |                           |
     |                        |<-------------------------|                           |
     | 6. Return Score Data   |                          |                           |
     |<-----------------------|                          |                           |
     |                        |                          |                           |
     | 7. credlayer.getScore()|                          |                           |
     |------------------------------------------------------------------------------>|
     |                        |                          |                           |
     | 8. Return PDA Data     |                          |                           |
     |<------------------------------------------------------------------------------|
```

---

## 3. Key Management & Environment Configuration

### `.env` Audit across Services
- **Backend (`Backend/.env`)**: Does not handle any Solana private keys. Contains standard database and Redis URLs.
- **Relayer (`blockchain/relayer/.env`)**: 
  - Requires `ISSUER_PRIVATE_KEY` (Base58 encoded secret key). 
  - Requires `CREDENTIAL_PDA` and `SCHEMA_PDA`.
  - **Security:** This is the *only* service that holds the master keypair. When deploying to Railway, these values are injected directly into the secure environment variables dashboard, ensuring the private key is never exposed to frontend developers or checked into source control.
- **Frontend (`Frontend/.env.local`)**:
  - Exposes `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_RELAYER_URL`.
  - Contains no private keys. The SAS SDK is initialized using hardcoded PDAs (`AaNQ...` and `GF4C...`) in `sdk-client.tsx`, which are safe to expose publicly.

### RPC Routing & GetBlock Integration
- **Current State:** The Relayer and Frontend currently default to `https://api.devnet.solana.com`. 
- **Action Required:** To integrate the GetBlock Devnet endpoint, the `SOLANA_RPC_URL` in `blockchain/relayer/.env` and `NEXT_PUBLIC_SOLANA_RPC_URL` in `Frontend/.env.local` must be updated to the GetBlock URI. The relayer is already configured to consume `process.env.SOLANA_RPC_URL`, but the Frontend SDK initialization in `sdk-client.tsx` currently hardcodes `"https://api.devnet.solana.com"` and needs to be updated to use the environment variable.

---

## 4. Identified Mismatches & Broken Links

1. **Hardcoded Frontend URLs:** In `Frontend/app/components/workspace/sdk-client.tsx`, the `NEXT_PUBLIC_RELAYER_URL` environment variable is defined but commented out/overridden by a hardcoded `const GATEWAY_URL = "http://localhost:3001/api/v1/attestations/issue"`.
2. **Hardcoded RPC in Frontend SDK:** The `CredLayerClient` initialization in `sdk-client.tsx` hardcodes the Devnet public RPC, ignoring `NEXT_PUBLIC_SOLANA_RPC_URL`.
3. **Misnamed Script Execution:** The documentation/usage intent was `node generate-keypair.json`, but the actual script is `generate-keypair.js`.
4. **Redundant Endpoint Call:** `sdk-client.tsx` references `NEXT_PUBLIC_RELAYER_URL`, but the Frontend *should not* call the Relayer directly. The current implementation correctly calls the Backend (`apiClient.get('/scores/${walletAddress}')`), which then forwards to the Relayer. The `GATEWAY_URL`/`NEXT_PUBLIC_RELAYER_URL` constants in the Frontend are unused and misleading.

---

## 5. Independent Testing & Verification Runbook

### Local Relayer Testing (No Frontend/Backend)
To verify the Relayer can successfully mint an attestation without running the entire stack:

1. **Start the Relayer:**
   ```bash
   cd blockchain/relayer
   npm install
   npm run dev
   ```
2. **Trigger an Attestation via cURL:**
   ```bash
   curl -X POST http://localhost:3001/api/v1/attestations/issue \
        -H "Content-Type: application/json" \
        -d '{
              "targetWallet": "Enter_A_Valid_Solana_Address_Here",
              "trustScore": 850,
              "riskLevel": "LOW"
            }'
   ```
3. **Verify Output:** You should receive a JSON response containing `success: true` and a `txHash`. You can view this hash on the Solana Devnet Explorer.

### Railway Deployment Runbook
To deploy the Relayer independently to Railway:

1. **Create a new Railway Project** from the GitHub repository, specifically setting the Root Directory to `/blockchain/relayer`.
2. **Set Build Command:** `npm run build`
3. **Set Start Command:** `npm run start`
4. **Configure Environment Variables in Railway:**
   - `PORT`: `3001` (or let Railway inject automatically)
   - `SOLANA_RPC_URL`: `https://go.getblock.io/...` (Your GetBlock Devnet URI)
   - `ISSUER_PRIVATE_KEY`: The Base58 private key of the funded issuer wallet.
   - `CREDENTIAL_PDA`: The exact PDA generated from the `sas/` scripts.
   - `SCHEMA_PDA`: The exact PDA generated from the `sas/` scripts.
5. **Update Backend Config:** Once deployed, update the Backend environment variable (or the hardcoded string in `scores.py`) to point to the new Railway public URL instead of `http://localhost:3001`.
