# CredLayer Frontend

> AI-powered reputation and verification infrastructure for Web3.

CredLayer provides trust and reputation scoring for Solana wallets, AI agents, and decentralized applications using advanced blockchain analysis and machine learning.

## 🌟 Features

- **Wallet Reputation Analysis** - AI-powered trust scoring for Solana wallets
- **Risk Assessment** - Real-time risk level evaluation
- **Behavioral Metrics** - Detailed on-chain behavior analysis
- **Verifiable Credentials** - Blockchain-based attestations and credentials
- **AI Agent Trust** - Reputation scoring for autonomous agents
- **Developer API Platform** - Full-featured API for B2B integration
- **Real-time Analysis** - Live wallet reputation monitoring

## 🏗️ Architecture

```
Frontend (Next.js)
      ↓
FastAPI Backend
      ↓
AI Reputation Engine
      ↓
Blockchain Data Providers
      ↓
Solana / Multi-chain
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 24
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/credlayer-frontend.git
cd credlayer-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your API URL and settings

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Application
NEXT_PUBLIC_APP_NAME=CredLayer
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for all available configuration options.

## 📁 Project Structure

```
Frontend/
├── app/
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   ├── workspace/       # Workspace pages
│   │   ├── developers/      # Developer platform
│   │   ├── reputation/      # Reputation components
│   │   ├── credentials/     # Credential components
│   │   ├── wallet/          # Wallet components
│   │   ├── loading/         # Loading skeletons
│   │   ├── empty/           # Empty states
│   │   └── ui/              # UI primitives
│   ├── lib/
│   │   └── api/             # API client layer
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── types/                   # Shared types
```

## 🔌 API Integration

The frontend integrates with the CredLayer FastAPI backend:

### Reputation API
```typescript
import { analyzeWallet, getWalletReputation } from '@/lib/api';

// Analyze a wallet
const score = await analyzeWallet('WALLET_ADDRESS');

// Get cached reputation
const reputation = await getWalletReputation('WALLET_ADDRESS');
```

### Credentials API
```typescript
import { getCredentials, verifyCredential } from '@/lib/api';

// Get wallet credentials
const creds = await getCredentials({ wallet: 'WALLET_ADDRESS' });

// Verify a credential
const verification = await verifyCredential('CREDENTIAL_ID');
```

### Developer API
```typescript
import { createApiKey, getApiUsage } from '@/lib/api';

// Create API key
const key = await createApiKey({ name: 'My Project' });

// Get usage stats
const usage = await getApiUsage();
```

## 🎨 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Blockchain**: Solana Web3.js
- **Wallet**: @solana/kit
- **Icons**: Lucide React + React Icons
- **HTTP Client**: Native Fetch API
- **Theme**: next-themes

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm run start
```

## 🛡️ Security

- Never commit `.env.local` or any files containing secrets
- API keys and private keys are never exposed to the browser
- All sensitive operations happen on the backend
- Wallet connections use industry-standard wallet-adapter

## 📊 Features Status

### ✅ Implemented
- Wallet connection (Solana)
- Network switching
- Responsive layout
- Theme switching
- Component architecture
- Type system
- API client layer

### 🔄 Integration Ready
- Reputation analysis (API ready)
- Credentials system (API ready)
- AI agent trust (API ready)
- Developer platform (API ready)
- Activity tracking (API ready)

### 🚧 Coming Soon
- Blockchain attestation verification
- Multi-chain support
- Advanced analytics dashboard
- Webhook management
- Team collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🔗 Links

- [CredLayer Website](https://credlayer.com)
- [API Documentation](https://docs.credlayer.com)
- [Developer Portal](https://credlayer.com/developers)

## 📧 Support

For support, email support@credlayer.com or join our Discord community.

---

Built with ❤️ by the CredLayer team
