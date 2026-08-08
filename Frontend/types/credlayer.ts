export type ChainId = "solana" | "ethereum" | "base";

export interface Credential {
  id: string;
  issuer: string;
  subject: string;
  type: string;
  status: "active" | "revoked" | "pending";
  issuedAt: string;
  expiresAt?: string;
  chain: ChainId;
}

export interface ReputationProfile {
  address: string;
  displayName?: string;
  credentials: Credential[];
  signals: Record<string, number>;
  updatedAt: string;
}

export interface AgentRegistration {
  name: string;
  description?: string;
  scopes: string[];
  callbackUrl?: string;
}

export interface ProtocolService {
  getProfile(address: string): Promise<ReputationProfile | null>;
  listCredentials(address: string): Promise<Credential[]>;
  registerAgent(input: AgentRegistration): Promise<{ id: string }>;
}

export const supportedChains: { id: ChainId; name: string; status: "live" | "planned" }[] = [
  { id: "solana", name: "Solana", status: "live" },
  { id: "ethereum", name: "Ethereum", status: "planned" },
  { id: "base", name: "Base", status: "planned" },
];
