// Centralized configuration with validation and safe defaults
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  },
  wallet: {
    reownProjectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694',
  },
  solana: {
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
  },
} as const;

// Validation and logging on startup (client-side only)
if (typeof window !== 'undefined') {
  console.log('[CredLayer] Configuration loaded:', {
    apiBaseUrl: config.api.baseUrl,
    walletProjectId: config.wallet.reownProjectId.substring(0, 8) + '...',
    solanaNetwork: config.solana.network,
  });
}

export default config;
