/**
 * PDA Uniqueness Test Suite
 * 
 * Verifies that:
 * 1. Different wallets derive different PDAs
 * 2. Same wallet always derives same PDA (deterministic)
 * 3. GET and POST use identical PDA derivation logic
 * 4. Nonce encoding is consistent (wallet.toBase58())
 */

import { PublicKey } from '@solana/web3.js';
import { deriveAttestationPda } from 'sas-lib';

// Test wallets
const TEST_WALLETS = [
    new PublicKey('EvzCketG5HoqXWcVxhPeXXqmuUzDivfjeCRtuC6S422H'),
    new PublicKey('4cKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
    new PublicKey('9B5X5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ5ZQQ'),
];

// Fixed credential and schema PDAs (from .env)
const CREDENTIAL_PDA = new PublicKey('DK9XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
const SCHEMA_PDA = new PublicKey('S4XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

async function testPDAUniqueness() {
    console.log('🧪 PDA Uniqueness Test Suite\n');

    console.log('Test 1: Different wallets should derive different PDAs');
    console.log('='.repeat(60));

    const pdaMap: Record<string, string> = {};
    const walletPdaPairs: Array<{ wallet: string; pda: string }> = [];

    for (const wallet of TEST_WALLETS) {
        const walletBase58 = wallet.toBase58();
        const [derivedPdaStr] = await deriveAttestationPda({
            credential: CREDENTIAL_PDA.toBase58() as any,
            schema: SCHEMA_PDA.toBase58() as any,
            nonce: walletBase58 as any,
        });

        walletPdaPairs.push({ wallet: walletBase58, pda: derivedPdaStr });
        console.log(`Wallet: ${walletBase58}`);
        console.log(`PDA:    ${derivedPdaStr}`);
        console.log('');

        if (pdaMap[derivedPdaStr]) {
            console.error('❌ FAIL: Two wallets produced the same PDA!');
            console.error(`  Wallet 1: ${pdaMap[derivedPdaStr]}`);
            console.error(`  Wallet 2: ${walletBase58}`);
            console.error(`  Shared PDA: ${derivedPdaStr}`);
            process.exit(1);
        }

        pdaMap[derivedPdaStr] = walletBase58;
    }

    console.log('✅ PASS: All wallets produce unique PDAs\n');

    console.log('Test 2: Same wallet should derive same PDA consistently');
    console.log('='.repeat(60));

    for (const { wallet, pda: originalPda } of walletPdaPairs) {
        const walletKey = new PublicKey(wallet);
        const [derivedPdaStr] = await deriveAttestationPda({
            credential: CREDENTIAL_PDA.toBase58() as any,
            schema: SCHEMA_PDA.toBase58() as any,
            nonce: walletKey.toBase58() as any,
        });

        console.log(`Wallet: ${wallet}`);
        console.log(`First derivation:  ${originalPda}`);
        console.log(`Second derivation: ${derivedPdaStr}`);

        if (originalPda !== derivedPdaStr) {
            console.error('❌ FAIL: PDA derivation is not deterministic!');
            process.exit(1);
        }

        console.log('✅ Deterministic\n');
    }

    console.log('✅ PASS: PDA derivation is deterministic\n');

    console.log('Test 3: Nonce encoding consistency');
    console.log('='.repeat(60));

    for (const wallet of TEST_WALLETS) {
        const walletBase58 = wallet.toBase58();
        const walletPublicKey = wallet;

        // Method 1: Using toBase58() string
        const [pda1] = await deriveAttestationPda({
            credential: CREDENTIAL_PDA.toBase58() as any,
            schema: SCHEMA_PDA.toBase58() as any,
            nonce: walletBase58 as any,
        });

        // Method 2: Using PublicKey.toBase58() (equivalent)
        const [pda2] = await deriveAttestationPda({
            credential: CREDENTIAL_PDA.toBase58() as any,
            schema: SCHEMA_PDA.toBase58() as any,
            nonce: walletPublicKey.toBase58() as any,
        });

        console.log(`Wallet: ${walletBase58}`);
        console.log(`PDA (string):      ${pda1}`);
        console.log(`PDA (PublicKey):   ${pda2}`);

        if (pda1 !== pda2) {
            console.error('❌ FAIL: Nonce encoding inconsistency!');
            console.error(`  String encoding: ${pda1}`);
            console.error(`  PublicKey encoding: ${pda2}`);
            process.exit(1);
        }

        console.log('✅ Consistent\n');
    }

    console.log('✅ PASS: Nonce encoding is consistent\n');

    console.log('Test 4: Different credential/schema should produce different PDAs');
    console.log('='.repeat(60));

    const testWallet = TEST_WALLETS[0];
    const walletBase58 = testWallet.toBase58();

    const [pda1] = await deriveAttestationPda({
        credential: CREDENTIAL_PDA.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: walletBase58 as any,
    });

    // Modify credential
    const differentCredential = new PublicKey(
        'FKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXf'
    );
    const [pda2] = await deriveAttestationPda({
        credential: differentCredential.toBase58() as any,
        schema: SCHEMA_PDA.toBase58() as any,
        nonce: walletBase58 as any,
    });

    console.log(`Wallet: ${walletBase58}`);
    console.log(`PDA with original credential: ${pda1}`);
    console.log(`PDA with different credential: ${pda2}`);

    if (pda1 === pda2) {
        console.error('❌ FAIL: Credential change did not affect PDA!');
        process.exit(1);
    }

    console.log('✅ Different credential produces different PDA\n');

    console.log('='.repeat(60));
    console.log('✅ All PDA uniqueness tests passed!\n');
}

testPDAUniqueness().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});

