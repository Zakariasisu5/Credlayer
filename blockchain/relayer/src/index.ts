import express, { Request, Response } from 'express';
import cors from 'cors';
import {
    Connection,
    Keypair,
    Transaction,
    PublicKey,
    TransactionInstruction,
    ComputeBudgetProgram,
    SystemProgram
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
const SAS_PROGRAM_ID = new PublicKey('22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG');

function decodeTrustAttestation(
    accountData: Buffer,
    targetWallet: PublicKey,
    credentialPda: PublicKey,
    schemaPda: PublicKey,
) {
    const dataLengthOffset = 97;
    const payloadOffset = dataLengthOffset + 4;
    if (accountData.length < payloadOffset + 6 || accountData.readUInt8(0) !== 0) return null;
    if (!new PublicKey(accountData.subarray(1, 33)).equals(targetWallet)) return null;
    if (!new PublicKey(accountData.subarray(33, 65)).equals(credentialPda)) return null;
    if (!new PublicKey(accountData.subarray(65, 97)).equals(schemaPda)) return null;

    const encodedDataLength = accountData.readUInt32LE(dataLengthOffset);
    if (encodedDataLength < 6 || payloadOffset + encodedDataLength > accountData.length) return null;
    const scorePayload = accountData.subarray(payloadOffset, payloadOffset + encodedDataLength);
    const trustScore = scorePayload.readUInt16LE(0);
    const riskLength = scorePayload.readUInt32LE(2);
    if (trustScore > 1000 || riskLength !== scorePayload.length - 6) return null;

    const riskLevel = scorePayload.toString('utf8', 6);
    if (!['LOW', 'MEDIUM', 'HIGH', 'MINIMAL'].includes(riskLevel)) return null;
    return { trustScore, riskLevel };
}

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

app.get('/api/v1/attestations/:targetWallet', async (req: Request, res: Response) => {
    const requestId = Date.now() + Math.random().toString(36).substr(2, 9);
    const targetWalletParam = req.params.targetWallet;
    console.log(`[CHECK-${requestId}] TRACE: GET /api/v1/attestations/:targetWallet`);
    console.log(`[CHECK-${requestId}] TRACE: targetWallet param = "${targetWalletParam}"`);
    
    try {
        const targetWallet = new PublicKey(targetWalletParam);
        console.log(`[CHECK-${requestId}] TRACE: targetWallet as PublicKey = ${targetWallet.toBase58()}`);
        
        const credentialPdaStr = process.env.CREDENTIAL_PDA;
        const schemaPdaStr = process.env.SCHEMA_PDA;
        console.log(`[CHECK-${requestId}] TRACE: credential = ${credentialPdaStr}`);
        console.log(`[CHECK-${requestId}] TRACE: schema = ${schemaPdaStr}`);
        
        if (!credentialPdaStr || !schemaPdaStr) {
            console.log(`[CHECK-${requestId}] ERROR: Missing credential or schema PDA`);
            return res.status(503).json({ success: false });
        }

        console.log(`[CHECK-${requestId}] TRACE: Deriving attestation PDA with nonce = ${targetWallet.toBase58()}`);
        const [attestationPdaStr] = await deriveAttestationPda({
            credential: credentialPdaStr as any,
            schema: schemaPdaStr as any,
            nonce: targetWallet.toBase58() as any,
        });
        console.log(`[CHECK-${requestId}] TRACE: Derived attestationPda = ${attestationPdaStr}`);
        
        const accountInfo = await connection.getAccountInfo(new PublicKey(attestationPdaStr));
        console.log(`[CHECK-${requestId}] TRACE: Account exists = ${accountInfo !== null}`);
        
        const attestation = accountInfo?.owner.equals(SAS_PROGRAM_ID)
            ? decodeTrustAttestation(
                accountInfo.data,
                targetWallet,
                new PublicKey(credentialPdaStr),
                new PublicKey(schemaPdaStr),
            )
            : null;
        
        console.log(`[CHECK-${requestId}] TRACE: Attestation decoded = ${attestation !== null}`);
        if (attestation) {
            console.log(`[CHECK-${requestId}] TRACE: Attestation data = {trustScore: ${attestation.trustScore}, riskLevel: ${attestation.riskLevel}}`);
        }

        return res.json({
            success: true,
            data: { verified: attestation !== null, attestation },
        });
    } catch (error) {
        console.error(`[CHECK-${requestId}] ERROR:`, error);
        return res.json({
            success: true,
            data: { verified: false, attestation: null },
        });
    }
});

// Endpoint called by the Python FastAPI backend
app.post('/api/v1/attestations/issue', async (req: Request, res: Response) => {
    const requestId = Date.now() + Math.random().toString(36).substr(2, 9);
    console.log(`[ISSUE-${requestId}] TRACE: POST /api/v1/attestations/issue`);
    console.log(`[ISSUE-${requestId}] TRACE: Request body = ${JSON.stringify(req.body)}`);
    
    let attestationPda: PublicKey | undefined;
    let targetWalletKey: PublicKey | undefined;
    try {
        const { targetWallet, trustScore, riskLevel } = req.body;
        
        console.log(`[ISSUE-${requestId}] TRACE: targetWallet = "${targetWallet}"`);
        console.log(`[ISSUE-${requestId}] TRACE: trustScore = ${trustScore}`);
        console.log(`[ISSUE-${requestId}] TRACE: riskLevel = ${riskLevel}`);

        if (!targetWallet || trustScore === undefined || !riskLevel) {
            console.log(`[ISSUE-${requestId}] ERROR: Missing required parameters`);
            return res.status(400).json({
                error: "Missing required parameters: targetWallet, trustScore, or riskLevel"
            });
        }

        if (!Number.isInteger(trustScore) || trustScore < 0 || trustScore > 1000) {
            return res.status(400).json({ success: false, error: "Invalid trust score" });
        }

        if (!["LOW", "MEDIUM", "HIGH", "MINIMAL"].includes(String(riskLevel).toUpperCase())) {
            return res.status(400).json({ success: false, error: "Invalid risk level" });
        }
        const normalizedRiskLevel = String(riskLevel).toUpperCase();

        const credentialPdaStr = process.env.CREDENTIAL_PDA;
        const schemaPdaStr = process.env.SCHEMA_PDA;
        console.log(`[ISSUE-${requestId}] TRACE: credential = ${credentialPdaStr}`);
        console.log(`[ISSUE-${requestId}] TRACE: schema = ${schemaPdaStr}`);

        if (!credentialPdaStr || !schemaPdaStr) {
            console.log(`[ISSUE-${requestId}] ERROR: Missing credential or schema PDA`);
            return res.status(500).json({
                error: "Relayer environment variables are unconfigured. Check your .env file."
            });
        }

        const wallet = new PublicKey(targetWallet);
        targetWalletKey = wallet;
        console.log(`[ISSUE-${requestId}] TRACE: wallet as PublicKey = ${wallet.toBase58()}`);
        
        const credentialPda = new PublicKey(credentialPdaStr);
        const schemaPda = new PublicKey(schemaPdaStr);
        
        console.log(`[ISSUE-${requestId}] TRACE: Deriving attestation PDA with:`);
        console.log(`[ISSUE-${requestId}]   - credential: ${credentialPda.toBase58()}`);
        console.log(`[ISSUE-${requestId}]   - schema: ${schemaPda.toBase58()}`);
        console.log(`[ISSUE-${requestId}]   - nonce: ${wallet.toBase58()}`);
        
        const [attestationPdaStr] = await deriveAttestationPda({
            credential: credentialPda.toBase58() as any,
            schema: schemaPda.toBase58() as any,
            nonce: wallet.toBase58() as any,  // ✅ FIX: Use wallet.toBase58() instead of wallet object
        });
        attestationPda = new PublicKey(attestationPdaStr);
        console.log(`[ISSUE-${requestId}] TRACE: Derived attestationPda = ${attestationPda.toBase58()}`);

        console.log(`[ISSUE-${requestId}] TRACE: Checking if attestation already exists on-chain...`);
        const existingAccount = await connection.getAccountInfo(attestationPda);
        console.log(`[ISSUE-${requestId}] TRACE: Existing account found = ${existingAccount !== null}`);
        
        if (existingAccount) {
            console.log(`[ISSUE-${requestId}] TRACE: Existing account owner = ${existingAccount.owner.toBase58()}`);
            console.log(`[ISSUE-${requestId}] TRACE: Expected program ID = ${SAS_PROGRAM_ID.toBase58()}`);
            console.log(`[ISSUE-${requestId}] TRACE: Owner matches expected = ${existingAccount.owner.equals(SAS_PROGRAM_ID)}`);
            
            const existingAttestation = existingAccount.owner.equals(SAS_PROGRAM_ID)
                ? decodeTrustAttestation(existingAccount.data, wallet, credentialPda, schemaPda)
                : null;
            
            console.log(`[ISSUE-${requestId}] TRACE: Existing attestation decoded = ${existingAttestation !== null}`);
            
            if (existingAttestation) {
                console.log(`[ISSUE-${requestId}] TRACE: Attestation already exists:`);
                console.log(`[ISSUE-${requestId}]   - trustScore: ${existingAttestation.trustScore}`);
                console.log(`[ISSUE-${requestId}]   - riskLevel: ${existingAttestation.riskLevel}`);
                console.log(`[ISSUE-${requestId}] SUCCESS: Returning existing attestation with alreadyExists=true`);
                
                return res.json({
                    success: true,
                    alreadyExists: true,
                    txHash: null,
                    attestationPda: attestationPda.toBase58(),
                    wallet: targetWallet,
                    trustScore: existingAttestation.trustScore,
                    riskLevel: existingAttestation.riskLevel,
                });
            }
            
            // Existing account is corrupt or invalid
            console.error(`[ISSUE-${requestId}] ERROR: PDA exists but contains invalid attestation data`);
            console.error(`[ISSUE-${requestId}] CONFLICT: Account at ${attestationPda.toBase58()} is not a valid attestation`);
            return res.status(409).json({
                success: false,
                error: "Attestation PDA already exists but contains invalid or unrecognized data. Cannot overwrite existing account.",
                attestationPda: attestationPda.toBase58(),
                details: {
                    accountExists: true,
                    validOwner: existingAccount.owner.equals(SAS_PROGRAM_ID),
                    canDecode: false,
                }
            });
        }

        console.log(`[ISSUE-${requestId}] TRACE: No existing attestation found, proceeding with creation...`);

        const issuerKey = process.env.ISSUER_PRIVATE_KEY;
        if (!issuerKey) {
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

        console.log(`[ISSUE-${requestId}] TRACE: Creating transaction for wallet: ${wallet.toBase58()}`);
        console.log(`[ISSUE-${requestId}] TRACE: Using issuer: ${issuer.publicKey.toBase58()}`);

        // 1. Derive Attestation PDA
        // 2. Encode score payload (u16 trust_score + UTF-8 risk_level string)
        const scoreBuffer = Buffer.alloc(2);
        scoreBuffer.writeUInt16LE(trustScore, 0);
        
        // Borsh string encoding requires a 4-byte length prefix
        const riskBytes = Buffer.from(normalizedRiskLevel, 'utf-8');
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32LE(riskBytes.length, 0);
        
        const dataPayload = Buffer.concat([scoreBuffer, lengthBuffer, riskBytes]);

        // 3. Build Instruction
        const v2Ix = getCreateAttestationInstruction({
            payer: issuer.publicKey.toBase58() as any,
            authority: issuer.publicKey.toBase58() as any,
            credential: credentialPda.toBase58() as any,
            schema: schemaPda.toBase58() as any,
            nonce: wallet.toBase58() as any,  // ✅ FIX: Use wallet.toBase58() for consistency
            attestation: attestationPda.toBase58() as any,
            data: dataPayload as any,
            expiry: 0n,
        });

        const v1Ix = toV1Instruction(v2Ix);
        const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 100000,
        });

        const tx = new Transaction().add(priorityFeeIx, v1Ix);

        const latestBlockhash = await connection.getLatestBlockhash('confirmed');
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = issuer.publicKey;

        // 4. Send and Confirm Transaction
        console.log(`[ISSUE-${requestId}] TRACE: Sending transaction...`);
        const txId = await connection.sendTransaction(tx, [issuer], {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
        });
        console.log(`[ISSUE-${requestId}] TRACE: Transaction submitted, txId = ${txId}`);
        
        const confirmation = await connection.confirmTransaction({
            signature: txId,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        }, 'confirmed');
        
        if (confirmation.value.err) {
            throw new Error(`Attestation transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }

        console.log(`[ISSUE-${requestId}] SUCCESS: Attestation created! Tx Hash: ${txId}`);

        return res.json({
            success: true,
            alreadyExists: false,
            txHash: txId,
            attestationPda: attestationPda.toBase58(),
            wallet: targetWallet,
            trustScore,
            riskLevel: normalizedRiskLevel,
        });

    } catch (error: any) {
        console.error(`[ISSUE-${requestId}] ERROR:`, error);
        
        // Handle race condition: check if attestation was created by another request
        if (attestationPda && targetWalletKey) {
            try {
                console.log(`[ISSUE-${requestId}] TRACE: Checking for race condition at attestationPda = ${attestationPda.toBase58()}`);
                const accountInfo = await connection.getAccountInfo(attestationPda);
                if (accountInfo) {
                    console.log(`[ISSUE-${requestId}] TRACE: Account exists in race check, attempting to decode...`);
                    const existingAttestation = accountInfo.owner.equals(SAS_PROGRAM_ID)
                        ? decodeTrustAttestation(
                            accountInfo.data,
                            targetWalletKey,
                            new PublicKey(process.env.CREDENTIAL_PDA!),
                            new PublicKey(process.env.SCHEMA_PDA!),
                        )
                        : null;
                    
                    if (existingAttestation) {
                        console.log(`[ISSUE-${requestId}] RACE_CONDITION: Attestation was created by concurrent request`);
                        return res.json({
                            success: true,
                            alreadyExists: true,
                            txHash: null,
                            attestationPda: attestationPda.toBase58(),
                            wallet: targetWalletKey.toBase58(),
                            trustScore: existingAttestation.trustScore,
                            riskLevel: existingAttestation.riskLevel,
                        });
                    }
                }
            } catch (verificationError) {
                console.error(`[ISSUE-${requestId}] ERROR in race condition check:`, verificationError);
            }
        }
        
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

