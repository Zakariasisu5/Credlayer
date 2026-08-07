# CredLayer SAS Administration Scripts

This directory contains the core administrative scripts for deploying and managing the CredLayer Trust Score protocol on the Solana blockchain. It utilizes the **Solana Attestation Service (SAS)** standard to issue on-chain, verifiable credentials.

These scripts are primarily used by the protocol administrators to initialize the smart contract state and manually test the CRUD (Create, Read, Update, Delete) lifecycle of a Trust Score.

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in this directory with the following variables:

```env
SOLANA_RPC_URL=https://api.devnet.solana.com
ISSUER_PRIVATE_KEY=your_base58_private_key_here

# You will generate these two PDAs in Step 1 & 2 below:
SCHEMA_PDA=
CREDENTIAL_PDA=
```

## Phase 1: Protocol Initialization (Run Once)

Before you can issue any scores, you must deploy the structure of your Trust Score to the blockchain. This only happens once per environment (Devnet/Mainnet).

### 1. Create the Schema

Defines the binary layout of the Trust Score (`u16` score + `String` risk level).

```bash
npx ts-node src/create-schema.ts
```

> **Action:** Copy the resulting Schema PDA into your `.env` file.

### 2. Create the Credential Metadata

Links Master Issuer authority to the Schema created.

```bash
npx ts-node src/create-credential.ts
```

> **Action:** Copy the resulting Credential PDA into your `.env` file.

## Phase 2: Attestation Lifecycle (CRUD)

These scripts manage the day-to-day lifecycle of user Trust Scores. (Note: In production, these actions are automated by the relayer microservice, but these scripts are kept here for manual testing and administrative overrides).

### Issue a Trust Score

Encodes an AI-generated score into a Buffer and issues it to a user's wallet as an Attestation PDA.

```bash
npx ts-node src/issue-attestation.ts
```

### Verify / Read a Trust Score

Simulates a 3rd-party DeFi protocol reading and decoding the custom payload directly from the Solana RPC.

```bash
npx ts-node src/verify-attestation.ts
```

### Update a Trust Score

Overwrites an existing Attestation PDA with a newly recalculated score (e.g., if a user's risk profile degrades).

```bash
npx ts-node src/update-attestation.ts
```

### Revoke (Close) a Trust Score

Instantly closes the Attestation PDA account, recovering the rent and invalidating the score. Used for compromised or highly flagged wallets.

```bash
npx ts-node src/revoke-attestation.ts
```

## Technical Notes on @solana/kit Compatibility

These scripts include custom bridging logic to resolve strict TypeScript collisions between legacy `@solana/web3.js` (v1) and the modern `@solana/kit` (v2) used by `sas-lib`.

- `PublicKey` objects are cast to Base58 strings.
- v2 Instructions are mapped back to v1 `TransactionInstruction` objects using the `toV1Instruction` helper.
- Uses strict parameters like `nonce` (instead of `holder`) and `expiry: 0n` for cross-compatibility.