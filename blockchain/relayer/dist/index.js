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
// Endpoint called by the Python FastAPI backend
app.post('/api/v1/attestations/issue', async (req, res) => {
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
        const credentialPda = new web3_js_1.PublicKey(credentialPdaStr);
        const schemaPda = new web3_js_1.PublicKey(schemaPdaStr);
        console.log(`[Relayer] Processing score issuance for wallet: ${targetWallet}`);
        console.log(`[Relayer] Using issuer: ${issuer.publicKey.toBase58()}`);
        // 1. Derive Attestation PDA
        const [attestationPdaStr] = await (0, sas_lib_1.deriveAttestationPda)({
            credential: credentialPda.toBase58(),
            schema: schemaPda.toBase58(),
            nonce: targetWallet,
        });
        const attestationPda = new web3_js_1.PublicKey(attestationPdaStr);
        // 2. Encode score payload (u16 trust_score + UTF-8 risk_level string)
        const scoreBuffer = Buffer.alloc(2);
        scoreBuffer.writeUInt16LE(trustScore, 0);
        const riskBuffer = Buffer.from(riskLevel, 'utf-8');
        const dataPayload = Buffer.concat([scoreBuffer, riskBuffer]);
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
        console.log(`[Relayer] Success! Tx Hash: ${txId}`);
        return res.json({
            success: true,
            txHash: txId,
            attestationPda: attestationPda.toBase58(),
            wallet: targetWallet,
            trustScore,
            riskLevel,
        });
    }
    catch (error) {
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
