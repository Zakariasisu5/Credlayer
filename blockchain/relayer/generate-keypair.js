/**
 * Generate a Solana keypair for testing
 * Run with: node generate-keypair.js
 */

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

console.log('\n🔑 Generating a new Solana keypair for testing...\n');

const keypair = Keypair.generate();

console.log('Public Key (Wallet Address):');
console.log(keypair.publicKey.toBase58());
console.log('\nPrivate Key (Base58 - use this for ISSUER_PRIVATE_KEY):');
console.log(bs58.encode(keypair.secretKey));
console.log('\n⚠️  IMPORTANT:');
console.log('1. This wallet has NO SOL - you need to fund it with devnet SOL');
console.log('2. Get devnet SOL from: https://faucet.solana.com/');
console.log('3. Copy the Private Key above to your .env file as ISSUER_PRIVATE_KEY');
console.log('4. Never share or commit your private key!\n');
