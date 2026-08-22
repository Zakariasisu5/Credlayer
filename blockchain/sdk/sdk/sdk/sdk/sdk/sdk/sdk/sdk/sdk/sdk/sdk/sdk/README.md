# @credlayer/sdk

The official client SDK for verifying CredLayer Trust Scores directly from the Solana blockchain. 

This package allows decentralized applications (dApps), mobile frontends, and backend services to read and validate AI-generated trust scores without relying on centralized APIs.

## Installation

Since this package is currently in active local development, you will install it in your frontend project (e.g., your React Native / Expo app / Next app) using a relative path or `npm link`.

**Option 1: Relative Path Install (Recommended for React Native)**

From your frontend project directory:
```bash
npm install ../path/to/Credlayer/blockchain/sdk
```

Note: Your frontend project will also need `@solana/web3.js` installed to handle wallet connections.

```bash
npm install @solana/web3.js
```

## Quickstart

### 1. Initialize the Client

The client comes pre-configured with CredLayer's default Solana Devnet RPC and standard Program Derived Addresses (PDAs).

```typescript
import { CredLayerClient } from '@credlayer/sdk';

// Initialize with default Devnet settings
const credlayer = new CredLayerClient(); 
```

### 2. Fast Verification (Gatekeeping)

If protocol just needs a simple boolean (Yes/No) to allow or block a user based on a minimum Trust Score threshold:

```typescript
const verifyUser = async (walletAddress: string) => {
    // Check if the wallet has a valid, unrevoked score of 800 or higher
    const isSafe = await credlayer.isApproved(walletAddress, 800);

    if (isSafe) {
        console.log("✅ Access Granted: User meets protocol security requirements.");
        // Grant loan, allow swap, etc.
    } else {
        console.log("🚫 Access Denied: Trust Score too low or missing.");
    }
};
```

### 3. Fetch Full Score Data

If building the UI dashboard and need to display the exact data payload (e.g., inside Frontend app):

```typescript
const displayUserScore = async (walletAddress: string) => {
    const scoreData = await credlayer.getScore(walletAddress);

    if (!scoreData) {
        console.log("Wallet has no CredLayer attestation on-chain.");
        return;
    }

    if (!scoreData.isValid) {
        console.log("⚠️ WARNING: This wallet's trust score was REVOKED.");
        return;
    }

    console.log(`Trust Score: ${scoreData.trustScore}`); // e.g., 850
    console.log(`Risk Level: ${scoreData.riskLevel}`);   // e.g., "LOW"
};
```

## API Reference

### `CredLayerClient`

**`constructor(rpcUrl?, credentialPdaStr?, schemaPdaStr?)`**
Optionally override the default network settings. Useful for moving from Devnet to Mainnet.

**`getScore(walletAddress: string | PublicKey): Promise<CredLayerScore | null>`**
Derives the SAS Attestation PDA, fetches the raw account data from the Solana RPC, and decodes the custom Buffer payload.

**`isApproved(walletAddress: string, minimumScore?: number): Promise<boolean>`**
Returns true if the score exists, is valid (not revoked), and meets the `minimumScore` (defaults to 800).

### `CredLayerScore` Interface

```typescript
interface CredLayerScore {
    trustScore: number; // The AI-calculated score (e.g., 300-850)
    riskLevel: string;  // Categorical risk ("LOW", "MEDIUM", "HIGH")
    isValid: boolean;   // On-chain boolean flag (false if revoked)
}
```