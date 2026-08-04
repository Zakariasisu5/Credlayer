import {
    getCreateCredentialInstruction,
    deriveCredentialPda
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

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');

    // Load our Issuer Wallet
    const issuer = Keypair.fromSecretKey(bs58.decode(process.env.ISSUER_PRIVATE_KEY!));

    const CREDENTIAL_NAME = "CredLayer_Trust_Authority";

    console.log("1. Deriving Credential PDA...");
    const [credentialPda] = await deriveCredentialPda({
        authority: issuer.publicKey.toBase58() as any,
        name: CREDENTIAL_NAME
    });

    console.log("2. Building Transaction...");
    // We are setting the issuer as the authorized signer for V1.
    const createCredentialIxV2 = getCreateCredentialInstruction({
        payer: issuer.publicKey.toBase58() as any,
        credential: credentialPda,
        authority: issuer.publicKey.toBase58() as any,
        name: CREDENTIAL_NAME,
        signers: [issuer.publicKey.toBase58() as any]
    });
    
    const createCredentialIx = toV1Instruction(createCredentialIxV2);

    const tx = new Transaction().add(createCredentialIx);

    console.log("3. Sending Transaction to Devnet...");
    const txId = await sendAndConfirmTransaction(connection, tx, [issuer]);

    console.log(`✅ Credential Created successfully!`);
    console.log(`- Tx Hash: ${txId}`);
    console.log(`- Credential PDA: ${credentialPda.toString()}`);
    console.log(`\nSAVE THIS PDA: You will need it for the schema creation.`);
}

main().catch(console.error);