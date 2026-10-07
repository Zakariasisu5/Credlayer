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
    deriveAttestationPda,
    getAttestationDecoder
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

/**
 * Decode and validate a CredLayer trust attestation using official sas-lib decoder.
 * 
 * This uses the official getAttestationDecoder() from sas-lib to ensure compatibility
 * with any SAS account layout changes. The custom data payload is then extracted
 * from the decoded attestation.
 * 
 * Returns decoded trust score and risk level if valid, null otherwise.
 */
function decodeTrustAttestation(
    accountData: Buffer,
    targetWallet: PublicKey,
    credentialPda: PublicKey,
    schemaPda: PublicKey,
): { trustScore: number; riskLevel: string } | null {
    try {
        // Use official sas-lib decoder for robust account parsing
        const decoder = getAttestationDecoder();
        const attestation = decoder.decode(new Uint8Array(accountData));

        // Verify the attestation matches our expected parameters
        const targetWalletBase58 = targetWallet.toBase58();
        const credentialBase58 = credentialPda.toBase58();
        const schemaBase58 = schemaPda.toBase58();

        if (attestation.nonce !== targetWalletBase58) {
            console.log('[Decode] Nonce mismatch:', {
                expected: targetWalletBase58,
                actual: attestation.nonce,
            });
            return null;
        }
        if (attestation.credential !== credentialBase58) {
            console.log('[Decode] Credential mismatch:', {
                expected: credentialBase58,
                actual: attestation.credential,
            });
            return null;
        }
        if (attestation.schema !== schemaBase58) {
            console.log('[Decode] Schema mismatch:', {
                expected: schemaBase58,
                actual: attestation.schema,
            });
            return null;
        }

        // Decode the custom data payload: u16 trust_score + u32 length + UTF-8 risk_level
        const dataPayload = Buffer.from(attestation.data);
        if (dataPayload.length < 6) {
            console.log('[Decode] Data payload too short:', dataPayload.length);
            return null;
        }

        const trustScore = dataPayload.readUInt16LE(0);
        const riskLength = dataPayload.readUInt32LE(2);
        
        if (trustScore > 1000 || riskLength !== dataPayload.length - 6) {
            console.log('[Decode] Invalid trust score or length:', { trustScore, riskLength, payloadLength: dataPayload.length });
            return null;
        }

        const riskLevel = dataPayload.toString('utf8', 6);
        if (!['LOW', 'MEDIUM', 'HIGH', 'MINIMAL'].includes(riskLevel)) {
            console.log('[Decode] Invalid risk level:', riskLevel);
            return null;
        }

        return { trustScore, riskLevel };
    } catch (error) {
        console.error('[Decode Error]', error);
        return null;
    }
}

/**
 * SHARED: Derive attestation PDA with consistent nonce encoding.
 * This ensures GET and POST use identical PDA derivation logic.
 * 
 * CRITICAL: nonce is passed as base58-encoded wallet string.
 * This must match sas-lib's expectations exactly.
 */
async function getAttestationPda(
    wallet: PublicKey,
    credentialPda: PublicKey,
    schemaPda: PublicKey,
): Promise<PublicKey> {
    const walletBase58 = wallet.toBase58();
    const credentialBase58 = credentialPda.toBase58();
    const schemaBase58 = schemaPda.toBase58();

    const [attestationPdaStr] = await deriveAttestationPda({
        credential: credentialBase58 as any,
        schema: schemaBase58 as any,
        nonce: walletBase58 as any,
    });

    return new PublicKey(attestationPdaStr);
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
    res.json({
        status: 'ok',
        service: 'credlayer-relayer',
        version: '2.0.0-official-decoder',
        environment: process.env.ENVIRONMENT || 'unknown',
        commit: process.env.GIT_COMMIT || 'ceafff1'
    });
});

/**
 * GET /api/v1/attestations/:targetWallet
 * 
 * Check if a valid attestation exists for a wallet.
 * 
 * Returns:
 *   200 success=true, verified=true/false
 *   200 success=true, verified=false (no account or decode failed)
 *   500 on env/config errors
 */
app.get('/api/v1/attestations/:targetWallet', async (req: Request, res: Response) => {
    const requestId = Date.now() + Math.random().toString(36).substr(2, 9);
    const targetWalletParam = req.params.targetWallet;
    
    try {
        const targetWallet = new PublicKey(targetWalletParam);
        
        const credentialPdaStr = process.env.CREDENTIAL_PDA;
        const schemaPdaStr = process.env.SCHEMA_PDA;
        
        if (!credentialPdaStr || !schemaPdaStr) {
            console.error(`[CHECK-${requestId}] ERROR: Missing credential or schema PDA`);
            return res.status(503).json({ success: false });
        }

        const credentialPda = new PublicKey(credentialPdaStr);
        const schemaPda = new PublicKey(schemaPdaStr);

        // Derive attestation PDA using shared helper
        const attestationPda = await getAttestationPda(targetWallet, credentialPda, schemaPda);
        
        console.log(`[CHECK-${requestId}] PDA_DEBUG: {
  wallet: ${targetWallet.toBase58()},
  credential: ${credentialPda.toBase58()},
  schema: ${schemaPda.toBase58()},
  nonce: ${targetWallet.toBase58()},
  attestationPda: ${attestationPda.toBase58()}
}`);

        const accountInfo = await connection.getAccountInfo(attestationPda);
        console.log(`[CHECK-${requestId}] ACCOUNT_DEBUG: {
  exists: ${accountInfo !== null},
  owner: ${accountInfo?.owner.toBase58() || 'N/A'},
  dataLength: ${accountInfo?.data.length || 0},
  lamports: ${accountInfo?.lamports || 0},
  executable: ${accountInfo?.executable || false}
}`);
        
        const attestation = accountInfo?.owner.equals(SAS_PROGRAM_ID)
            ? decodeTrustAttestation(
                accountInfo.data,
                targetWallet,
                credentialPda,
                schemaPda,
            )
            : null;
        
        if (attestation) {
            console.log(`[CHECK-${requestId}] ATTESTATION: verified=true, trustScore=${attestation.trustScore}, riskLevel=${attestation.riskLevel}`);
        } else if (accountInfo) {
            console.log(`[CHECK-${requestId}] WARNING: Account exists but decode failed. Owner=${accountInfo.owner.toBase58()}, dataLen=${accountInfo.data.length}`);
        } else {
            console.log(`[CHECK-${requestId}] INFO: No attestation found (account does not exist)`);
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

/**
 * POST /api/v1/attestations/issue
 * 
 * Create a new attestation on-chain, or return existing if valid.
 * 
 * Returns:
 *   200 success=true, alreadyExists=false (created)
 *   200 success=true, alreadyExists=true (already exists and valid)
 *   409 success=false (PDA occupied by corrupt/invalid account)
 *   400 invalid request
 *   500 internal error
 */
app.post('/api/v1/attestations/issue', async (req: Request, res: Response) => {
    const requestId = Date.now() + Math.random().toString(36).substr(2, 9);
    console.log(`[ISSUE-${requestId}] TRACE: POST /api/v1/attestations/issue body=${JSON.stringify(req.body)}`);
    
    let attestationPda: PublicKey | undefined;
    let targetWalletKey: PublicKey | undefined;
    try {
        const { targetWallet, trustScore, riskLevel } = req.body;

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

        if (!credentialPdaStr || !schemaPdaStr) {
            console.log(`[ISSUE-${requestId}] ERROR: Missing credential or schema PDA`);
            return res.status(500).json({
                error: "Relayer environment variables are unconfigured. Check your .env file."
            });
        }

        const wallet = new PublicKey(targetWallet);
        targetWalletKey = wallet;
        const credentialPda = new PublicKey(credentialPdaStr);
        const schemaPda = new PublicKey(schemaPdaStr);
        
        // Derive attestation PDA using shared helper
        attestationPda = await getAttestationPda(wallet, credentialPda, schemaPda);
        
        console.log(`[ISSUE-${requestId}] PDA_DEBUG: {
  wallet: ${wallet.toBase58()},
  credential: ${credentialPda.toBase58()},
  schema: ${schemaPda.toBase58()},
  nonce: ${wallet.toBase58()},
  attestationPda: ${attestationPda.toBase58()}
}`);

        console.log(`[ISSUE-${requestId}] TRACE: Checking if attestation already exists on-chain...`);
        const existingAccount = await connection.getAccountInfo(attestationPda);
        
        console.log(`[ISSUE-${requestId}] ACCOUNT_DEBUG: {
  exists: ${existingAccount !== null},
  owner: ${existingAccount?.owner.toBase58() || 'N/A'},
  expectedOwner: ${SAS_PROGRAM_ID.toBase58()},
  ownerMatch: ${existingAccount?.owner.equals(SAS_PROGRAM_ID) || false},
  dataLength: ${existingAccount?.data.length || 0},
  lamports: ${existingAccount?.lamports || 0}
}`);
        
        if (existingAccount) {
            // Verify owner is SAS_PROGRAM_ID
            if (!existingAccount.owner.equals(SAS_PROGRAM_ID)) {
                console.error(`[ISSUE-${requestId}] CONFLICT: PDA owned by different program`);
                return res.status(409).json({
                    success: false,
                    error: "Attestation PDA is occupied by an account owned by another program.",
                    attestationPda: attestationPda.toBase58(),
                    owner: existingAccount.owner.toBase58(),
                    expectedOwner: SAS_PROGRAM_ID.toBase58()
                });
            }

            // Try to decode as valid attestation
            const existingAttestation = decodeTrustAttestation(
                existingAccount.data,
                wallet,
                credentialPda,
                schemaPda
            );
            
            if (existingAttestation) {
                console.log(`[ISSUE-${requestId}] SUCCESS: Valid attestation already exists`);
                console.log(`[ISSUE-${requestId}] ATTESTATION: trustScore=${existingAttestation.trustScore}, riskLevel=${existingAttestation.riskLevel}`);
                
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
            
            // Account exists but cannot be decoded as valid attestation
            console.error(`[ISSUE-${requestId}] CONFLICT: PDA contains invalid attestation data`);
            console.error(`[ISSUE-${requestId}] DIAGNOSTIC: accountOwnerIsValid=${existingAccount.owner.equals(SAS_PROGRAM_ID)}, canDecode=false`);
            console.error(`[ISSUE-${requestId}] DATA_DUMP: first 32 bytes: ${existingAccount.data.subarray(0, 32).toString('hex')}`);
            
            return res.status(409).json({
                success: false,
                error: "Attestation PDA already exists but contains invalid or unrecognized data. Cannot overwrite existing account.",
                attestationPda: attestationPda.toBase58(),
                details: {
                    accountExists: true,
                    validOwner: existingAccount.owner.equals(SAS_PROGRAM_ID),
                    canDecode: false,
                    dataLength: existingAccount.data.length,
                    lamports: existingAccount.lamports
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

        if (issuerKey.includes('YOUR_') || issuerKey.includes('HERE') || issuerKey.length < 32) {
            return res.status(500).json({
                error: "ISSUER_PRIVATE_KEY in .env is still a placeholder. Please set it to a valid Base58 private key.",
                hint: "Generate a keypair using: solana-keygen new --outfile keypair.json, then use the private key"
            });
        }

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

        // Encode score payload (u16 trust_score + Borsh string with length prefix)
        const scoreBuffer = Buffer.alloc(2);
        scoreBuffer.writeUInt16LE(trustScore, 0);
        
        const riskBytes = Buffer.from(normalizedRiskLevel, 'utf-8');
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32LE(riskBytes.length, 0);
        
        const dataPayload = Buffer.concat([scoreBuffer, lengthBuffer, riskBytes]);
        console.log(`[ISSUE-${requestId}] PAYLOAD_DEBUG: trustScore=${trustScore}, riskLevel=${normalizedRiskLevel}, payloadLen=${dataPayload.length}, payloadHex=${dataPayload.toString('hex')}`);

        // Build instruction with identical nonce encoding
        const v2Ix = getCreateAttestationInstruction({
            payer: issuer.publicKey.toBase58() as any,
            authority: issuer.publicKey.toBase58() as any,
            credential: credentialPda.toBase58() as any,
            schema: schemaPda.toBase58() as any,
            nonce: wallet.toBase58() as any,  // ✅ CONSISTENT: wallet.toBase58()
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
    console.log(`Environment: ${process.env.ENVIRONMENT || 'unknown'}`);
    console.log(`Solana RPC: ${process.env.SOLANA_RPC_URL || 'default'}`);
});

