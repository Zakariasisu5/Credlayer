/**
 * Diagnostic script for a specific wallet's PDA and attestation
 * 
 * Usage: npx ts-node diagnose-wallet.ts <WALLET_ADDRESS>
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { deriveAttestationPda, getAttestationDecoder } from 'sas-lib';
import dotenv from 'dotenv';

dotenv.config();

const WALLET = process.argv[2] || 'EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H';
const CREDENTIAL_PDA = process.env.CREDENTIAL_PDA;
const SCHEMA_PDA = process.env.SCHEMA_PDA;
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const SAS_PROGRAM_ID = new PublicKey('22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG');

async function diagnose() {
    console.log('=== WALLET ATTESTATION DIAGNOSTIC ===\n');
    console.log('Configuration:');
    console.log(`  Wallet: ${WALLET}`);
    console.log(`  Credential PDA: ${CREDENTIAL_PDA || 'NOT SET'}`);
    console.log(`  Schema PDA: ${SCHEMA_PDA || 'NOT SET'}`);
    console.log(`  RPC URL: ${RPC_URL}`);
    console.log(`  SAS Program: ${SAS_PROGRAM_ID.toBase58()}\n`);

    if (!CREDENTIAL_PDA || !SCHEMA_PDA) {
        console.error('❌ ERROR: CREDENTIAL_PDA or SCHEMA_PDA not set in .env');
        process.exit(1);
    }

    // Derive PDA
    console.log('Step 1: Derive Attestation PDA');
    console.log('================================\n');
    
    const [attestationPdaStr] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA as any,
        schema: SCHEMA_PDA as any,
        nonce: WALLET as any,
    });
    
    console.log(`Derived PDA: ${attestationPdaStr}\n`);

    // Check account
    console.log('Step 2: Check On-Chain Account');
    console.log('================================\n');
    
    const connection = new Connection(RPC_URL, 'confirmed');
    const attestationPda = new PublicKey(attestationPdaStr);
    const accountInfo = await connection.getAccountInfo(attestationPda);
    
    if (!accountInfo) {
        console.log('✅ Result: No account exists at this PDA');
        console.log('   Action: POST /attestations/issue should create successfully\n');
        return;
    }

    console.log('Account exists:');
    console.log(`  Owner: ${accountInfo.owner.toBase58()}`);
    console.log(`  Expected Owner: ${SAS_PROGRAM_ID.toBase58()}`);
    console.log(`  Owner Match: ${accountInfo.owner.equals(SAS_PROGRAM_ID) ? '✅' : '❌'}`);
    console.log(`  Data Length: ${accountInfo.data.length} bytes`);
    console.log(`  Lamports: ${accountInfo.lamports}`);
    console.log(`  Executable: ${accountInfo.executable}\n`);

    if (!accountInfo.owner.equals(SAS_PROGRAM_ID)) {
        console.log('❌ ERROR: Account owned by different program!');
        console.log('   This PDA is occupied and cannot be used for attestations.\n');
        return;
    }

    // Try to decode
    console.log('Step 3: Decode Attestation');
    console.log('===========================\n');
    
    try {
        const decoder = getAttestationDecoder();
        const attestation = decoder.decode(new Uint8Array(accountInfo.data));
        
        console.log('✅ Successfully decoded attestation:');
        console.log(`  Nonce: ${attestation.nonce}`);
        console.log(`  Credential: ${attestation.credential}`);
        console.log(`  Schema: ${attestation.schema}`);
        console.log(`  Data Length: ${attestation.data.length} bytes\n`);
        
        // Validate fields
        console.log('Step 4: Validate Fields');
        console.log('========================\n');
        
        const nonceMatch = attestation.nonce === WALLET;
        const credMatch = attestation.credential === CREDENTIAL_PDA;
        const schemaMatch = attestation.schema === SCHEMA_PDA;
        
        console.log(`  Nonce matches wallet: ${nonceMatch ? '✅' : '❌'}`);
        if (!nonceMatch) {
            console.log(`    Expected: ${WALLET}`);
            console.log(`    Actual:   ${attestation.nonce}`);
        }
        
        console.log(`  Credential matches: ${credMatch ? '✅' : '❌'}`);
        if (!credMatch) {
            console.log(`    Expected: ${CREDENTIAL_PDA}`);
            console.log(`    Actual:   ${attestation.credential}`);
        }
        
        console.log(`  Schema matches: ${schemaMatch ? '✅' : '❌'}`);
        if (!schemaMatch) {
            console.log(`    Expected: ${SCHEMA_PDA}`);
            console.log(`    Actual:   ${attestation.schema}`);
        }
        console.log('');
        
        if (!nonceMatch || !credMatch || !schemaMatch) {
            console.log('❌ DIAGNOSIS: Attestation exists but was created with different parameters!');
            console.log('\nPossible causes:');
            console.log('  1. CREDENTIAL_PDA or SCHEMA_PDA env vars changed after attestation was created');
            console.log('  2. Multiple relayer deployments with different configurations');
            console.log('  3. Attestation was created for different credential/schema\n');
            console.log('Recommended fix:');
            console.log('  - Update env vars to match actual on-chain values, OR');
            console.log('  - Close/revoke the existing invalid attestation\n');
            return;
        }
        
        // Try to parse payload
        console.log('Step 5: Parse Data Payload');
        console.log('===========================\n');
        
        const dataPayload = Buffer.from(attestation.data);
        if (dataPayload.length < 6) {
            console.log('❌ Data payload too short\n');
            return;
        }
        
        const trustScore = dataPayload.readUInt16LE(0);
        const riskLength = dataPayload.readUInt32LE(2);
        const riskLevel = dataPayload.toString('utf8', 6);
        
        console.log('✅ Payload decoded successfully:');
        console.log(`  Trust Score: ${trustScore}`);
        console.log(`  Risk Level: ${riskLevel}`);
        console.log(`  Risk Length: ${riskLength}\n`);
        
        if (trustScore <= 1000 && ['LOW', 'MEDIUM', 'HIGH', 'MINIMAL'].includes(riskLevel)) {
            console.log('✅ DIAGNOSIS: Valid attestation exists');
            console.log('   Action: Relayer should return 200 with alreadyExists=true\n');
        } else {
            console.log('❌ DIAGNOSIS: Invalid payload data');
            console.log(`   Trust score out of range or invalid risk level\n`);
        }
        
    } catch (error: any) {
        console.log('❌ Failed to decode attestation');
        console.log(`   Error: ${error.message}\n`);
        console.log('Raw account data (first 128 bytes):');
        console.log(accountInfo.data.subarray(0, Math.min(128, accountInfo.data.length)).toString('hex'));
        console.log('\n');
        console.log('DIAGNOSIS: Account exists but cannot be decoded as SAS attestation');
        console.log('Possible causes:');
        console.log('  1. Account was created by different program');
        console.log('  2. SAS account layout changed (decoder version mismatch)');
        console.log('  3. Corrupt or malformed data\n');
    }
}

diagnose().catch(console.error);
