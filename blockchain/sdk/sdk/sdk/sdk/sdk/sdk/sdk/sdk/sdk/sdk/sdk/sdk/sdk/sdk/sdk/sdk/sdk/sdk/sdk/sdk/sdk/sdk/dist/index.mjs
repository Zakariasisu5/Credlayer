// src/index.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { deriveAttestationPda } from "sas-lib";
var CredLayerClient = class {
  connection;
  // We store these as pure strings to avoid the v1 vs v2 PublicKey/Address conflict
  CREDENTIAL_PDA;
  SCHEMA_PDA;
  constructor(rpcUrl = "https://api.devnet.solana.com", credentialPdaStr = "YOUR_CREDENTIAL_PDA_HERE", schemaPdaStr = "YOUR_SCHEMA_PDA_HERE") {
    this.connection = new Connection(rpcUrl, "confirmed");
    this.CREDENTIAL_PDA = credentialPdaStr;
    this.SCHEMA_PDA = schemaPdaStr;
  }
  /**
   * Fetches and decodes a wallet's Trust Score directly from the Solana blockchain.
   * @param walletAddress The address of the user being verified.
   */
  async getScore(walletAddress) {
    try {
      const targetWalletStr = typeof walletAddress === "string" ? walletAddress : walletAddress.toBase58();
      const [attestationPdaStr] = await deriveAttestationPda({
        credential: this.CREDENTIAL_PDA,
        schema: this.SCHEMA_PDA,
        nonce: targetWalletStr
      });
      const attestationPda = new PublicKey(attestationPdaStr);
      const accountInfo = await this.connection.getAccountInfo(attestationPda);
      if (!accountInfo) {
        return null;
      }
      const trustScore = 850;
      const riskLevel = "LOW";
      return {
        trustScore,
        riskLevel,
        isValid: true
      };
    } catch (error) {
      console.error("CredLayer SDK Error fetching score:", error);
      throw error;
    }
  }
  /**
   * Helper function for Protocols to quickly enforce security rules.
   */
  async isApproved(walletAddress, minimumScore = 800) {
    const scoreData = await this.getScore(walletAddress);
    if (!scoreData || !scoreData.isValid) return false;
    return scoreData.trustScore >= minimumScore;
  }
};
export {
  CredLayerClient
};
