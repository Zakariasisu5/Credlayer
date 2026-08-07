import { Connection, PublicKey } from '@solana/web3.js';
import { deriveAttestationPda } from 'sas-lib';

export interface CredLayerScore {
    trustScore: number;
    riskLevel: string;
    isValid: boolean;
}

export class CredLayerClient {
    private connection: Connection;
    // We store these as pure strings to avoid the v1 vs v2 PublicKey/Address conflict
    private readonly CREDENTIAL_PDA: string;
    private readonly SCHEMA_PDA: string;

    constructor(
        rpcUrl: string = 'https://api.devnet.solana.com',
        credentialPdaStr: string = 'YOUR_CREDENTIAL_PDA_HERE',
        schemaPdaStr: string = 'YOUR_SCHEMA_PDA_HERE'
    ) {
        // We stick to the standard v1 Connection that your project already has installed
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.CREDENTIAL_PDA = credentialPdaStr;
        this.SCHEMA_PDA = schemaPdaStr;
    }

    /**
     * Fetches and decodes a wallet's Trust Score directly from the Solana blockchain.
     * @param walletAddress The address of the user being verified.
     */
    async getScore(walletAddress: string | PublicKey): Promise<CredLayerScore | null> {
        try {
            // Ensure we have a string representation of the target wallet
            const targetWalletStr = typeof walletAddress === 'string'
                ? walletAddress
                : walletAddress.toBase58();

            // 1. Derive where the score should be stored
            // We use `as any` here to safely bypass the strict Address type enforcement of sas-lib
            // Also changed 'holder' to 'nonce' to match the sas-lib interface
            const [attestationPdaStr] = await deriveAttestationPda({
                credential: this.CREDENTIAL_PDA as any,
                schema: this.SCHEMA_PDA as any,
                nonce: targetWalletStr as any,
            });

            // Convert the returned string back into a v1 PublicKey so we can fetch it
            const attestationPda = new PublicKey(attestationPdaStr);

            // 2. Fetch from Solana
            const accountInfo = await this.connection.getAccountInfo(attestationPda);

            if (!accountInfo) {
                return null; // Wallet has no score on-chain
            }

            // 3. Decode the Custom Payload
            // (Mocked for V1 prototype until sas-lib offset parsing is finalized)
            const trustScore = 850;
            const riskLevel = "LOW";

            return {
                trustScore,
                riskLevel,
                isValid: true
            };

        } catch (error) {
            console.error("CredLayer SDK Error fetching score:", error);
            throw error;
        }
    }

    /**
     * Helper function for Protocols to quickly enforce security rules.
     */
    async isApproved(walletAddress: string, minimumScore: number = 800): Promise<boolean> {
        const scoreData = await this.getScore(walletAddress);
        if (!scoreData || !scoreData.isValid) return false;

        return scoreData.trustScore >= minimumScore;
    }
}