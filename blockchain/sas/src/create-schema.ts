import {
    getCreateSchemaInstruction,
    deriveSchemaPda
} from 'sas-lib';
import {
    Connection,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
    TransactionInstruction,
    PublicKey
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

// PASTE THE PDA FROM STEP 2 HERE
const CREDENTIAL_PDA = new PublicKey(process.env.CREDENTIAL_PDA!);

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');
    const issuer = Keypair.fromSecretKey(bs58.decode(process.env.ISSUER_PRIVATE_KEY!));

    const SCHEMA_NAME = "Trust_Score_V1";
    const SCHEMA_VERSION = 1;

    console.log("1. Deriving Schema PDA...");
    const [schemaPda] = await deriveSchemaPda({
        credential: CREDENTIAL_PDA.toBase58() as any,
        name: SCHEMA_NAME,
        version: SCHEMA_VERSION
    });

    console.log("2. Building Schema Transaction...");
    const createSchemaIxV2 = getCreateSchemaInstruction({
        authority: issuer.publicKey.toBase58() as any,
        payer: issuer.publicKey.toBase58() as any,
        name: SCHEMA_NAME,
        credential: CREDENTIAL_PDA.toBase58() as any,
        description: "CredLayer AI Behavioral Trust Score",
        // Map our AI outputs directly to the on-chain fields
        fieldNames: ["trust_score", "risk_level"],
        schema: schemaPda,
        // Layout: 1 = U16 (Integer 0-1000), 12 = String ("LOW", "HIGH")
        layout: Buffer.from([1, 12]),
    });

    const createSchemaIx = toV1Instruction(createSchemaIxV2);

    const tx = new Transaction().add(createSchemaIx);

    console.log("3. Sending Transaction to Devnet...");
    const txId = await sendAndConfirmTransaction(connection, tx, [issuer]);

    console.log(`✅ Schema Created successfully!`);
    console.log(`- Tx Hash: ${txId}`);
    console.log(`- Schema PDA: ${schemaPda.toString()}`);
    console.log(`\nYour infrastructure is now ready to receive AI scores!`);
}

main().catch(console.error);