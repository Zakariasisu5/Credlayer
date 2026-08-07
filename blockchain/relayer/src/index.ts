import express, { Request, Response } from 'express';
import cors from 'cors';
import {
    Connection,
    Keypair,
    Transaction,
    PublicKey,
    TransactionInstruction
} from '@solana/web3.js';
import {
    getCreateAttestationInstruction,
    deriveAttestationPda
} from 'sas-lib';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
);

// Helper function to convert v2-style instructions to v1 TransactionInstruction
function toV1Instruction(ix: any): TransactionInstruction {
    return new TransactionInstruction({
        programId: new PublicKey(ix.programAddress),
        keys: (ix.accounts || []).map((acc: any) => ({
            pubkey: new PublicKey(acc.address),
            isSigner: acc.role === 2 || acc.role === 3,
            isWritable: acc.role === 1 || acc.role === 3
        })),
        data: Buffer.from(ix.data || new Uint8Array()),
    });
}

// Health check endpoint for FastAPI or monitoring tools
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'credlayer-relayer' });
});

// Endpoint called by the Python FastAPI backend
app.post('/api/v1/attestations/issue', async (req: Request, res: Response) => {
    try {
        const { targetWallet, trustScore, riskLevel } = req.body;

        if (!targetWallet || trustScore === undefined || !riskLevel) {
            return res.status(400).json({
                error: "Missing required parameters: targetWallet, trustScore, or riskLevel"
            });
        }

        const issuerKey = process.env.ISSUER_PRIVATE_KEY;
        const credentialPdaStr = process.env.CREDENTIAL_PDA;
        const schemaPdaStr = process.env.SCHEMA_PDA;

        if (!issuerKey || !credentialPdaStr || !schemaPdaStr) {
            return res.status(500).json({
                error: "Relayer environment variables are unconfigured."
            });
        }

        const issuer = Keypair.fromSecretKey(bs58.decode(issuerKey));
        const credentialPda = new PublicKey(credentialPdaStr);
        const schemaPda = new PublicKey(schemaPdaStr);

        console.log(`[Relayer] Processing score issuance for wallet: ${targetWallet}`);

        // 1. Derive Attestation PDA
        const [attestationPdaStr] = await deriveAttestationPda({
            credential: credentialPda.toBase58() as any,
            schema: schemaPda.toBase58() as any,
            nonce: targetWallet as any,
        });

        const attestationPda = new PublicKey(attestationPdaStr);

        // 2. Encode score payload (u16 trust_score + UTF-8 risk_level string)
        const scoreBuffer = Buffer.alloc(2);
        scoreBuffer.writeUInt16LE(trustScore, 0);
        const riskBuffer = Buffer.from(riskLevel, 'utf-8');
        const dataPayload = Buffer.concat([scoreBuffer, riskBuffer]);

        // 3. Build Instruction
        const v2Ix = getCreateAttestationInstruction({
            payer: issuer.publicKey.toBase58() as any,
            authority: issuer.publicKey.toBase58() as any,
            credential: credentialPda.toBase58() as any,
            schema: schemaPda.toBase58() as any,
            nonce: targetWallet as any,
            attestation: attestationPda.toBase58() as any,
            data: dataPayload as any,
            expiry: 0n,
        });

        const v1Ix = toV1Instruction(v2Ix);
        const tx = new Transaction().add(v1Ix);

        // 4. Send and Confirm Transaction
        const txId = await connection.sendTransaction(tx, [issuer]);

        console.log(`[Relayer] Success! Tx Hash: ${txId}`);

        return res.json({
            success: true,
            txHash: txId,
            attestationPda: attestationPda.toBase58(),
            wallet: targetWallet,
            trustScore,
            riskLevel,
        });

    } catch (error: any) {
        console.error("[Relayer Error]:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to process on-chain attestation"
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 CredLayer Relayer active on http://localhost:${PORT}`);
});