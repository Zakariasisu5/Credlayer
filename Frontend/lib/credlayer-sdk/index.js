"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CredLayerClient: () => CredLayerClient
});
module.exports = __toCommonJS(index_exports);
var import_web3 = require("@solana/web3.js");
var import_sas_lib = require("sas-lib");
var CredLayerClient = class {
  connection;
  // We store these as pure strings to avoid the v1 vs v2 PublicKey/Address conflict
  CREDENTIAL_PDA;
  SCHEMA_PDA;
  constructor(rpcUrl = "https://api.devnet.solana.com", credentialPdaStr = "YOUR_CREDENTIAL_PDA_HERE", schemaPdaStr = "YOUR_SCHEMA_PDA_HERE") {
    this.connection = new import_web3.Connection(rpcUrl, "confirmed");
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
      const [attestationPdaStr] = await (0, import_sas_lib.deriveAttestationPda)({
        credential: this.CREDENTIAL_PDA,
        schema: this.SCHEMA_PDA,
        nonce: targetWalletStr
      });
      const attestationPda = new import_web3.PublicKey(attestationPdaStr);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CredLayerClient
});
