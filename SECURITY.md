# CredLayer Engineering Rules

## Security

Never commit:

- private keys
- seed phrases
- API secrets
- database credentials
- JWT secrets
- OpenAI API keys
- RPC API keys

Never trust reputation scores supplied by the frontend.

All reputation and risk calculations must be validated server-side.

## Blockchain

CredLayer uses Solana and Anchor.

Blockchain code is security-critical.

Every instruction must validate:

- signer
- authority
- account ownership
- PDA
- account relationships
- instruction parameters

## AI

CredLayer's AI system generates reputation and risk intelligence.

Do not claim model accuracy without proper evaluation.

Avoid:

- data leakage
- train/test contamination
- feature leakage
- unrealistic validation
- relying only on accuracy

## Frontend

CredLayer uses:

- Next.js
- TypeScript
- TailwindCSS

Do not expose private credentials in client-side code.

Wallet interactions must be handled securely.

## Backend

CredLayer uses:

- FastAPI
- Python
- PostgreSQL
- Redis

Validate all external input.

Never trust client-provided:

- trust scores
- risk levels
- wallet ownership claims
- authentication claims