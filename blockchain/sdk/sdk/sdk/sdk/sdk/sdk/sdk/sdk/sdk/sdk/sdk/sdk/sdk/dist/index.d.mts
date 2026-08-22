import { PublicKey } from '@solana/web3.js';

interface CredLayerScore {
    trustScore: number;
    riskLevel: string;
    isValid: boolean;
}
declare class CredLayerClient {
    private connection;
    private readonly CREDENTIAL_PDA;
    private readonly SCHEMA_PDA;
    constructor(rpcUrl?: string, credentialPdaStr?: string, schemaPdaStr?: string);
    /**
     * Fetches and decodes a wallet's Trust Score directly from the Solana blockchain.
     * @param walletAddress The address of the user being verified.
     */
    getScore(walletAddress: string | PublicKey): Promise<CredLayerScore | null>;
    /**
     * Helper function for Protocols to quickly enforce security rules.
     */
    isApproved(walletAddress: string, minimumScore?: number): Promise<boolean>;
}

export { CredLayerClient, type CredLayerScore };
