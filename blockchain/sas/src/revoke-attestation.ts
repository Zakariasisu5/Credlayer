import {
    getCloseAttestationInstruction,
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

const CREDENTIAL_PDA = new PublicKey("YOUR_CREDENTIAL_PDA_HERE");
const SCHEMA_PDA = new PublicKey("YOUR_SCHEMA_PDA_HERE");
const TARGET_WALLET = new PublicKey("YOUR_TEST_WALLET_ADDRESS_HERE");

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    const issuer = Keypair.fromSecretKey(bs58.decode(process.env.ISSUER_PRIVATE_KEY!));

    console.log(`1. 🚨 REVOKING Attestation for Wallet: ${TARGET_WALLET.toBase58()}`);

    const [attestationPda] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: TARGET_WALLET.toBase58() as any,
    });

    console.log("2. Building Revocation Transaction...");
    // This instruction closes the Attestation PDA, effectively revoking it.
    const revokeIxV2 = getCloseAttestationInstruction({
        payer: issuer.publicKey.toBase58() as any,
        authority: issuer.publicKey.toBase58() as any,
        credential: CREDENTIAL_PDA.toBase58() as any,
        attestation: attestationPda,
    });

    const revokeIx = toV1Instruction(revokeIxV2);

    const tx = new Transaction().add(revokeIx);

    console.log("3. Submitting Revocation to Devnet...");
    const txId = await sendAndConfirmTransaction(connection, tx, [issuer]);

    console.log(`\n🚫 Attestation successfully revoked on-chain!`);
    console.log(`- Tx Hash: https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    console.log(`- The verification script will now reject this wallet.`);
}

main().catch(console.error);