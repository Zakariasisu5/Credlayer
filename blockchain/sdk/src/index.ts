import { Connection, PublicKey } from '@solana/web3.js';
import { deriveAttestationPda } from 'sas-lib';

const SAS_PROGRAM_ID = new PublicKey('22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG');

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

            if (!accountInfo.owner.equals(SAS_PROGRAM_ID)) {
                throw new Error('Attestation account is owned by an unexpected program');
            }

            const data = accountInfo.data;
            const dataLengthOffset = 97;
            const payloadOffset = dataLengthOffset + 4;
            if (data.length < payloadOffset + 6 || data.readUInt8(0) !== 0) {
                throw new Error('Attestation account data is invalid');
            }
            if (
                !new PublicKey(data.subarray(1, 33)).equals(new PublicKey(targetWalletStr)) ||
                !new PublicKey(data.subarray(33, 65)).equals(new PublicKey(this.CREDENTIAL_PDA)) ||
                !new PublicKey(data.subarray(65, 97)).equals(new PublicKey(this.SCHEMA_PDA))
            ) {
                throw new Error('Attestation account identity does not match the request');
            }

            const encodedDataLength = data.readUInt32LE(dataLengthOffset);
            if (encodedDataLength < 6 || payloadOffset + encodedDataLength > data.length) {
                throw new Error('Attestation score payload is invalid');
            }
            const payload = data.subarray(payloadOffset, payloadOffset + encodedDataLength);
            const trustScore = payload.readUInt16LE(0);
            const riskLength = payload.readUInt32LE(2);
            if (trustScore > 1000 || riskLength !== payload.length - 6) {
                throw new Error('Attestation score payload is invalid');
            }
            const riskLevel = payload.toString('utf8', 6);
            if (!['LOW', 'MEDIUM', 'HIGH', 'MINIMAL'].includes(riskLevel)) {
                throw new Error('Attestation risk payload is invalid');
            }

            return {
                trustScore,
                riskLevel,
                isValid: true
            };

        } catch (error) {
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