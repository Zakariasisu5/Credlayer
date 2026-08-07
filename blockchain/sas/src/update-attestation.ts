import {
    getCreateAttestationInstruction,
    deriveAttestationPda
} from 'sas-lib';
import {
    Connection,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey,
    TransactionInstruction
} from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

function toV1Instruction(ix: any): TransactionInstruction {
    return new TransactionInstruction({
        programId: new PublicKey(ix.programAddress),
        keys: (ix.accounts || []).map((acc: any) => ({
            pubkey: new PublicKey(acc.address),
            isSigner: acc.role === 2 || acc.role === 3,
            isWritable: acc.role === 1 || acc.role === 3
        })),
        data: Buffer.from(ix.data || new Uint8Array())
    });
}

// Use the exact same PDAs you generated earlier
const CREDENTIAL_PDA = new PublicKey("YOUR_CREDENTIAL_PDA_HERE");
const SCHEMA_PDA = new PublicKey("YOUR_SCHEMA_PDA_HERE");

// The wallet whose score is being updated
const TARGET_WALLET = new PublicKey("YOUR_TEST_WALLET_ADDRESS_HERE");

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    const issuer = Keypair.fromSecretKey(bs58.decode(process.env.ISSUER_PRIVATE_KEY!));

    console.log(`1. Updating Attestation for Wallet: ${TARGET_WALLET.toBase58()}`);

    // Derive the Attestation PDA (it maps to the same address as before)
    const [attestationPda] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: TARGET_WALLET.toBase58() as any,
    });

    // Let's simulate the AI calculating a newly degraded score
    const newTrustScore = 410; // Dropped from 850
    const newRiskLevel = "HIGH"; // Changed from "LOW"

    console.log(`2. Encoding New AI Score: ${newTrustScore} (${newRiskLevel} Risk)`);
    const scoreBuffer = Buffer.alloc(2);
    scoreBuffer.writeUInt16LE(newTrustScore, 0);
    const riskBuffer = Buffer.from(newRiskLevel, 'utf-8');
    const newDataPayload = Buffer.concat([scoreBuffer, riskBuffer]);

    console.log("3. Building Update Transaction...");
    const updateIxV2 = getCreateAttestationInstruction({
        payer: issuer.publicKey.toBase58() as any,
        authority: issuer.publicKey.toBase58() as any,
        credential: CREDENTIAL_PDA.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: TARGET_WALLET.toBase58() as any,
        attestation: attestationPda,
        data: newDataPayload,
        expiry: 0n,
    });

    const updateIx = toV1Instruction(updateIxV2);

    const tx = new Transaction().add(updateIx);

    console.log("4. Submitting Update to Devnet...");
    const txId = await sendAndConfirmTransaction(connection, tx, [issuer]);

    console.log(`\n✅ Attestation successfully updated on-chain!`);
    console.log(`- Tx Hash: https://explorer.solana.com/tx/${txId}?cluster=devnet`);
}

main().catch(console.error);