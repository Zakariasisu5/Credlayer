import type { AgentRegistration, Credential, ProtocolService, ReputationProfile } from "../../types/credlayer";

/** Backend-neutral adapter. Replace the empty implementation with an API client when the indexer is connected. */
export const credLayerService: ProtocolService = {
  async getProfile(address: string): Promise<ReputationProfile | null> {
    void address;
    return null;
  },
  async listCredentials(address: string): Promise<Credential[]> {
    void address;
    return [];
  },
  async registerAgent(input: AgentRegistration): Promise<{ id: string }> {
    void input;
    throw new Error("Agent registration API is not connected.");
  },
};
