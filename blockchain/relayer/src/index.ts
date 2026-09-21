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
                error: "Relayer environment variables are unconfigured. Check your .env file."
            });
        }

        // Validate that the issuer key is not a placeholder
        if (issuerKey.includes('YOUR_') || issuerKey.includes('HERE') || issuerKey.length < 32) {
            return res.status(500).json({
                error: "ISSUER_PRIVATE_KEY in .env is still a placeholder. Please set it to a valid Base58 private key.",
                hint: "Generate a keypair using: solana-keygen new --outfile keypair.json, then use the private key"
            });
        }

        // Validate credential and schema PDAs
        if (credentialPdaStr.includes('YOUR_') || credentialPdaStr.includes('HERE') || credentialPdaStr.length < 32) {
            return res.status(500).json({
                error: "CREDENTIAL_PDA in .env is still a placeholder. Please run the SAS credential creation script.",
                hint: "Run: cd ../sas && npm run create-credential"
            });
        }

        if (schemaPdaStr.includes('YOUR_') || schemaPdaStr.includes('HERE') || schemaPdaStr.length < 32) {
            return res.status(500).json({
                error: "SCHEMA_PDA in .env is still a placeholder. Please run the SAS schema creation script.",
                hint: "Run: cd ../sas && npm run create-schema"
            });
        }

        let issuer: Keypair;
        try {
            issuer = Keypair.fromSecretKey(bs58.decode(issuerKey));
        } catch (error) {
            return res.status(500).json({
                error: "Invalid ISSUER_PRIVATE_KEY format. Must be a Base58-encoded private key.",
                hint: "The key should be a Base58 string (like: 5Kb8d...)"
            });
        }

        const credentialPda = new PublicKey(credentialPdaStr);
        const schemaPda = new PublicKey(schemaPdaStr);

        console.log(`[Relayer] Processing score issuance for wallet: ${targetWallet}`);
        console.log(`[Relayer] Using issuer: ${issuer.publicKey.toBase58()}`);

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
        
        // Borsh string encoding requires a 4-byte length prefix
        const riskBytes = Buffer.from(riskLevel, 'utf-8');
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32LE(riskBytes.length, 0);
        
        const dataPayload = Buffer.concat([scoreBuffer, lengthBuffer, riskBytes]);

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