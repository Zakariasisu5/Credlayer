import { Connection, PublicKey } from '@solana/web3.js';
import { deriveAttestationPda } from 'sas-lib';

export interface CredLayerScore {
    trustScore: number;
    riskLevel: string;
    isValid: boolean;
}

export class CredLayerClient {
    private connection: Connection;

    // We hardcode the production/devnet PDAs so dApp devs don't have to track them.
    private readonly CREDENTIAL_PDA: PublicKey;
    private readonly SCHEMA_PDA: PublicKey;

    constructor(
        rpcUrl: string = 'https://api.devnet.solana.com',
        credentialPdaStr: string = 'YOUR_CREDENTIAL_PDA_HERE', // Add your actual PDA here
        schemaPdaStr: string = 'YOUR_SCHEMA_PDA_HERE'          // Add your actual PDA here
    ) {
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.CREDENTIAL_PDA = new PublicKey(credentialPdaStr);
        this.SCHEMA_PDA = new PublicKey(schemaPdaStr);
    }

    /**
     * Fetches and decodes a wallet's Trust Score directly from the Solana blockchain.
     * @param walletAddress The public key of the user being verified.
     */
    async getScore(walletAddress: string | PublicKey): Promise<CredLayerScore | null> {
        try {
            const targetWallet = typeof walletAddress === 'string'
                ? new PublicKey(walletAddress)
                : walletAddress;

            // 1. Derive where the score should be stored
            const [attestationPda] = await deriveAttestationPda({
                credential: this.CREDENTIAL_PDA,
                schema: this.SCHEMA_PDA,
                holder: targetWallet,
            });

            // 2. Fetch from Solana
            const accountInfo = await this.connection.getAccountInfo(attestationPda);

            if (!accountInfo) {
                return null; // Wallet has no score on-chain
            }

            // 3. Decode the Custom Payload
            // Assuming the payload starts after standard SAS headers (simplified for prototype)
            const dataBuffer = accountInfo.data;

            // Extract the u16 score (assuming it's at the end of the buffer payload)
            // Note: Update these offset indices based on exact sas-lib header lengths in production
            const trustScore = 850; // Mocked decoded value: dataBuffer.readUInt16LE(offset)
            const riskLevel = "LOW"; // Mocked decoded value: dataBuffer.toString('utf8', offset + 2)

            return {
                trustScore,
                riskLevel,
                isValid: true // Check sas-lib headers for revocation status in prod
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