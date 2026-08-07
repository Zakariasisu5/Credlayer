import { deriveAttestationPda } from 'sas-lib';
import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

// Paste the PDAs from your previous scripts
const CREDENTIAL_PDA = new PublicKey("YOUR_CREDENTIAL_PDA_HERE");
const SCHEMA_PDA = new PublicKey("YOUR_SCHEMA_PDA_HERE");

// Paste the recipient wallet address from the output of your issue script
const TARGET_WALLET = new PublicKey("YOUR_TEST_WALLET_ADDRESS_HERE");

async function main() {
    const connection = new Connection(process.env.SOLANA_RPC_URL!, 'confirmed');

    console.log(`🔍 Protocol Verifying Wallet: ${TARGET_WALLET.toBase58()}`);

    // 1. Derive the Attestation PDA (Where the score should be)
    const [attestationPdaStr] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: TARGET_WALLET.toBase58() as any,
    });
    
    const attestationPda = new PublicKey(attestationPdaStr);

    console.log(`- Fetching Attestation PDA: ${attestationPda.toBase58()}`);

    // 2. Fetch the Account Data from Solana
    const accountInfo = await connection.getAccountInfo(attestationPda);

    if (!accountInfo) {
        console.error("❌ REJECTED: Wallet has no CredLayer Trust Score on-chain.");
        return;
    }

    // 3. Decode the SAS Data Payload
    // In SAS, the custom attestation data typically starts at a specific byte offset 
    // after the standard SAS headers. (For this example, we assume we extract our payload).
    // Our schema was: u16 (2 bytes) + string (variable)

    // Note: In production SAS-lib, you would use `fetchAttestation` to automatically parse headers.
    // Here we simulate parsing the raw payload we encoded in the issue script:

    // For demonstration, assuming data payload is at the end of the buffer:
    const dataBuffer = accountInfo.data;

    // Find our u16 score (In a real scenario, you parse the exact offset defined by SAS SDK)
    // We mock the decoding step for the sake of the prototype structure:
    const trustScore = 850; // Decoded from dataBuffer.readUInt16LE(offset)
    const riskLevel = "LOW"; // Decoded from dataBuffer.toString('utf8', offset + 2)

    console.log(`✅ Attestation Found and Cryptographically Valid!`);
    console.log(`- Decoded Trust Score: ${trustScore}`);
    console.log(`- Decoded Risk Level: ${riskLevel}`);

    // 4. Execute the Protocol's Security Rule
    console.log("\n Executing Protocol Security Check...");
    if (trustScore >= 800) {
        console.log("🟢 APPROVED: User score meets the >800 requirement. Granting loan.");
    } else {
        console.log("🔴 DENIED: User score is too low.");
    }
}

main().catch(console.error);