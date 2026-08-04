```
.
├── Backend
│   ├── migrations
│   │   ├── versions
│   │   │   └── .gitkeep
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── src
│   │   └── credlayer
│   │       ├── api
│   │       │   ├── v1
│   │       │   │   └── __init__.py
│   │       │   ├── __init__.py
│   │       │   ├── deps.py
│   │       │   ├── envelope.py
│   │       │   ├── errors.py
│   │       │   ├── health.py
│   │       │   └── router.py
│   │       ├── cache
│   │       │   ├── __init__.py
│   │       │   └── redis.py
│   │       ├── core
│   │       │   ├── __init__.py
│   │       │   ├── config.py
│   │       │   ├── errors.py
│   │       │   └── logging.py
│   │       ├── db
│   │       │   ├── __init__.py
│   │       │   ├── base.py
│   │       │   └── session.py
│   │       ├── schemas
│   │       │   ├── __init__.py
│   │       │   └── common.py
│   │       ├── __init__.py
│   │       └── main.py
│   ├── .dockerignore
│   ├── .env.example
│   ├── .gitignore
│   ├── .python-version
│   ├── Dockerfile
│   ├── README.md
│   ├── alembic.ini
│   ├── docker-compose.yml
│   └── pyproject.toml
├── Frontend
│  
├── blockchain/                  # <--- YOUR BLOCKCHAIN CODE LIVES HERE
│   ├── sas/                     # SAS TypeScript integration scripts
│   │   ├── src/
│   │   │   ├── create-credential.ts   # Registers CredLayer Authority
│   │   │   ├── create-schema.ts       # Defines Trust Score Data Schema
│   │   │   ├── issue-attestation.ts   # Issues test attestation PDA
│   │   │   └── verify-attestation.ts  # Verification logic for protocols
│   │   ├── package.json         # Node dependencies (sas-lib, @solana/web3.js)
│   │   ├── tsconfig.json
│   │   └── .env.example         # Devnet keypair paths & RPC URLs
│   └── programs/                # (Reserved for future Anchor Rust code)
├── docs
│   ├── backend-ai-specification.md
│   ├── blockchain-solana-specification.md
│   ├── frontend-specification.md
│   └── struct.md
├── LICENSE
├── README.md
└── backend.md
```
