# @credlayer/sdk

This package is the on-chain Solana reader, not the HTTP API-key SDK. It is currently a prototype and is not production-ready.

## Current status

- Install/build from `blockchain/sdk` with `npm install && npm run build`.
- `CredLayerClient` exposes `getScore()` and `isApproved()`.
- The package currently requires real credential and schema PDA values; the repository defaults are placeholders.
- The current implementation returns placeholder score data after finding an attestation account and does not decode the SAS payload or revocation state.

Do not use this package as a security decision until the PDA configuration and payload/revocation decoding are implemented and tested.

## API-key integrations

For the current HTTP API, use the server-side examples in [`docs/developer-guide.md`](../docs/developer-guide.md). There is no published REST SDK or supported Python package in this repository.

## Build

```bash
cd blockchain/sdk
npm install
npm run build
```
