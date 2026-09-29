"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const web3_js_1 = require("@solana/web3.js");
const sas_lib_1 = require("sas-lib");
const bs58_1 = __importDefault(require("bs58"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const connection = new web3_js_1.Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');
const SAS_PROGRAM_ID = new web3_js_1.PublicKey('22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG');
function decodeTrustAttestation(accountData, targetWallet, credentialPda, schemaPda) {
    const dataLengthOffset = 97;
    const payloadOffset = dataLengthOffset + 4;
    if (accountData.length < payloadOffset + 6 || accountData.readUInt8(0) !== 0)
        return null;
    if (!new web3_js_1.PublicKey(accountData.subarray(1, 33)).equals(targetWallet))
        return null;
    if (!new web3_js_1.PublicKey(accountData.subarray(33, 65)).equals(credentialPda))
        return null;
    if (!new web3_js_1.PublicKey(accountData.subarray(65, 97)).equals(schemaPda))
        return null;
    const encodedDataLength = accountData.readUInt32LE(dataLengthOffset);
    if (encodedDataLength < 6 || payloadOffset + encodedDataLength > accountData.length)
        return null;
    const scorePayload = accountData.subarray(payloadOffset, payloadOffset + encodedDataLength);
    const trustScore = scorePayload.readUInt16LE(0);
    const riskLength = scorePayload.readUInt32LE(2);
    if (trustScore > 1000 || riskLength !== scorePayload.length - 6)
        return null;
    const riskLevel = scorePayload.toString('utf8', 6);
    if (!['LOW', 'MEDIUM', 'HIGH', 'MINIMAL'].includes(riskLevel))
        return null;
    return { trustScore, riskLevel };
}
// Helper function to convert v2-style instructions to v1 TransactionInstruction
function toV1Instruction(ix) {
    return new web3_js_1.TransactionInstruction({
        programId: new web3_js_1.PublicKey(ix.programAddress),
        keys: (ix.accounts || []).map((acc) => ({
            pubkey: new web3_js_1.PublicKey(acc.address),
            isSigner: acc.role === 2 || acc.role === 3,
            isWritable: acc.role === 1 || acc.role === 3
        })),
        data: Buffer.from(ix.data || new Uint8Array()),
    });
}
// Health check endpoint for FastAPI or monitoring tools
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'credlayer-relayer' });
});
app.get('/api/v1/attestations/:targetWallet', async (req, res) => {
    try {
        const targetWallet = new web3_js_1.PublicKey(req.params.targetWallet);
        const credentialPdaStr = process.env.CREDENTIAL_PDA;
        const schemaPdaStr = process.env.SCHEMA_PDA;
        if (!credentialPdaStr || !schemaPdaStr) {
            return res.status(503).json({ success: false });
        }
        const [attestationPdaStr] = await (0, sas_lib_1.deriveAttestationPda)({
            credential: credentialPdaStr,
            schema: schemaPdaStr,
            nonce: targetWallet.toBase58(),
        });
        const accountInfo = await connection.getAccountInfo(new web3_js_1.PublicKey(attestationPdaStr));
        const attestation = accountInfo?.owner.equals(SAS_PROGRAM_ID)
            ? decodeTrustAttestation(accountInfo.data, targetWallet, new web3_js_1.PublicKey(credentialPdaStr), new web3_js_1.PublicKey(schemaPdaStr))
            : null;
        return res.json({
            success: true,
            data: { verified: attestation !== null, attestation },
        });
    }
    catch (error) {
        console.error('[Relayer Verification Error]:', error);
        return res.status(400).json({ success: false });
    }
});
// Endpoint called by the Python FastAPI backend
app.post('/api/v1/attestations/issue', async (req, res) => {
    let attestationPda;
    let targetWalletKey;
    try {
        const { targetWallet, trustScore, riskLevel } = req.body;
        if (!targetWallet || trustScore === undefined || !riskLevel) {
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
            return res.status(500).json({
                error: "Relayer environment variables are unconfigured. Check your .env file."
            });
        }
        const wallet = new web3_js_1.PublicKey(targetWallet);
        targetWalletKey = wallet;
        const credentialPda = new web3_js_1.PublicKey(credentialPdaStr);
        const schemaPda = new web3_js_1.PublicKey(schemaPdaStr);
        const [attestationPdaStr] = await (0, sas_lib_1.deriveAttestationPda)({
            credential: credentialPda.toBase58(),
            schema: schemaPda.toBase58(),
            nonce: wallet.toBase58(),
        });
        attestationPda = new web3_js_1.PublicKey(attestationPdaStr);
        const existingAccount = await connection.getAccountInfo(attestationPda);
        if (existingAccount) {
            const existingAttestation = existingAccount.owner.equals(SAS_PROGRAM_ID)
                ? decodeTrustAttestation(existingAccount.data, wallet, credentialPda, schemaPda)
                : null;
            if (existingAttestation) {
                return res.json({ success: true, alreadyExists: true });
            }
            return res.status(409).json({ success: false, error: "Existing account is not a valid attestation" });
        }
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
        let issuer;
        try {
            issuer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(issuerKey));
        }
        catch (error) {
            return res.status(500).json({
                error: "Invalid ISSUER_PRIVATE_KEY format. Must be a Base58-encoded private key.",
                hint: "The key should be a Base58 string (like: 5Kb8d...)"
            });
        }
        console.log(`[Relayer] Processing score issuance for wallet: ${targetWallet}`);
        console.log(`[Relayer] Using issuer: ${issuer.publicKey.toBase58()}`);
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
        const v2Ix = (0, sas_lib_1.getCreateAttestationInstruction)({
            payer: issuer.publicKey.toBase58(),
            authority: issuer.publicKey.toBase58(),
            credential: credentialPda.toBase58(),
            schema: schemaPda.toBase58(),
            nonce: targetWallet,
            attestation: attestationPda.toBase58(),
            data: dataPayload,
            expiry: 0n,
        });
        const v1Ix = toV1Instruction(v2Ix);
        const tx = new web3_js_1.Transaction().add(v1Ix);
        // 4. Send and Confirm Transaction
        const txId = await connection.sendTransaction(tx, [issuer]);
        const confirmation = await connection.confirmTransaction(txId, 'confirmed');
        if (confirmation.value.err) {
            throw new Error('Attestation transaction was not confirmed');
        }
        console.log(`[Relayer] Success! Tx Hash: ${txId}`);
        return res.json({
            success: true,
            alreadyExists: false,
            txHash: txId,
            attestationPda: attestationPda.toBase58(),
            wallet: targetWallet,
            trustScore,
            riskLevel: normalizedRiskLevel,
        });
    }
    catch (error) {
        console.error("[Relayer Error]:", error);
        if (attestationPda) {
            try {
                const accountInfo = await connection.getAccountInfo(attestationPda);
                const existingAttestation = accountInfo?.owner.equals(SAS_PROGRAM_ID)
                    ? decodeTrustAttestation(accountInfo.data, targetWalletKey, new web3_js_1.PublicKey(process.env.CREDENTIAL_PDA), new web3_js_1.PublicKey(process.env.SCHEMA_PDA))
                    : null;
                if (existingAttestation) {
                    return res.json({ success: true, alreadyExists: true });
                }
            }
            catch (verificationError) {
                console.error("[Relayer Idempotency Check Error]:", verificationError);
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
