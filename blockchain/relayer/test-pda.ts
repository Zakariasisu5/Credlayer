/**
 * PDA Derivation Test Script
 * 
 * This script tests that:
 * 1. Same wallet produces same PDA (idempotent)
 * 2. Different wallets produce different PDAs (uniqueness)
 * 3. PDA derivation matches what's used in production
 */

import { PublicKey } from '@solana/web3.js';
import { deriveAttestationPda } from 'sas-lib';
import dotenv from 'dotenv';

dotenv.config();

const CREDENTIAL_PDA = process.env.CREDENTIAL_PDA!;
const SCHEMA_PDA = process.env.SCHEMA_PDA!;

async function testPdaDerivation() {
    console.log('=== PDA DERIVATION TEST ===\n');
    
    console.log('Environment:');
    console.log(`  CREDENTIAL_PDA: ${CREDENTIAL_PDA}`);
    console.log(`  SCHEMA_PDA: ${SCHEMA_PDA}\n`);
    
    // Test wallets
    const testWallets = [
        'EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H',
        '7XbGQUuNqpW9LxYQAkJxJz3Pg4SqBKW3v8MMQwm8vR9d',
        'C5n3Wz3tMQVVfgMzRs4vK8xJ9YbUyGqPvNd2HxTrMwXe',
    ];
    
    const pdaResults: { [wallet: string]: string } = {};
    
    console.log('Test 1: Derive PDAs for different wallets');
    console.log('==========================================\n');
    
    for (const walletStr of testWallets) {
        const wallet = new PublicKey(walletStr);
        
        const [attestationPdaStr] = await deriveAttestationPda({
            credential: CREDENTIAL_PDA as any,
            schema: SCHEMA_PDA as any,
            nonce: walletStr as any,
        });
        
        pdaResults[walletStr] = attestationPdaStr;
        
        console.log(`Wallet:  ${walletStr}`);
        console.log(`PDA:     ${attestationPdaStr}`);
        console.log('');
    }
    
    // Check uniqueness
    const pdaValues = Object.values(pdaResults);
    const uniquePdas = new Set(pdaValues);
    
    console.log('Test 2: Verify PDA Uniqueness');
    console.log('==============================\n');
    
    if (uniquePdas.size === pdaValues.length) {
        console.log('✅ PASS: All PDAs are unique\n');
    } else {
        console.log('❌ FAIL: Duplicate PDAs detected!\n');
        console.log('PDA Counts:');
        const counts: { [pda: string]: string[] } = {};
        for (const [wallet, pda] of Object.entries(pdaResults)) {
            if (!counts[pda]) counts[pda] = [];
            counts[pda].push(wallet);
        }
        for (const [pda, wallets] of Object.entries(counts)) {
            if (wallets.length > 1) {
                console.log(`  PDA ${pda} is used by:`);
                wallets.forEach(w => console.log(`    - ${w}`));
            }
        }
        console.log('');
    }
    
    // Check idempotency
    console.log('Test 3: Verify Idempotency');
    console.log('===========================\n');
    
    const testWallet = testWallets[0];
    const [pda1] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA as any,
        schema: SCHEMA_PDA as any,
        nonce: testWallet as any,
    });
    
    const [pda2] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA as any,
        schema: SCHEMA_PDA as any,
        nonce: testWallet as any,
    });
    
    if (pda1 === pda2) {
        console.log(`✅ PASS: Same wallet produces same PDA`);
        console.log(`  Wallet: ${testWallet}`);
        console.log(`  PDA 1:  ${pda1}`);
        console.log(`  PDA 2:  ${pda2}\n`);
    } else {
        console.log(`❌ FAIL: Same wallet produces different PDAs!`);
        console.log(`  Wallet: ${testWallet}`);
        console.log(`  PDA 1:  ${pda1}`);
        console.log(`  PDA 2:  ${pda2}\n`);
    }
    
    // Test encoding consistency
    console.log('Test 4: Verify Encoding Consistency');
    console.log('====================================\n');
    
    const wallet = new PublicKey(testWallet);
    
    // Method 1: toBase58()
    const [pdaBase58] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA as any,
        schema: SCHEMA_PDA as any,
        nonce: wallet.toBase58() as any,
    });
    
    // Method 2: direct string
    const [pdaDirect] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA as any,
        schema: SCHEMA_PDA as any,
        nonce: testWallet as any,
    });
    
    if (pdaBase58 === pdaDirect) {
        console.log(`✅ PASS: Encoding methods produce same PDA`);
        console.log(`  wallet.toBase58(): ${pdaBase58}`);
        console.log(`  direct string:     ${pdaDirect}\n`);
    } else {
        console.log(`❌ FAIL: Different encoding methods produce different PDAs!`);
        console.log(`  wallet.toBase58(): ${pdaBase58}`);
        console.log(`  direct string:     ${pdaDirect}\n`);
    }
    
    console.log('=== TEST COMPLETE ===');
}

testPdaDerivation().catch(console.error);
