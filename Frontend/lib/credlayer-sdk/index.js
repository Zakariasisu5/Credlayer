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
var SAS_PROGRAM_ID = new import_web3.PublicKey("22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG");
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
      if (!accountInfo.owner.equals(SAS_PROGRAM_ID)) {
        throw new Error("Attestation account is owned by an unexpected program");
      }
      const data = accountInfo.data;
      const dataLengthOffset = 97;
      const payloadOffset = dataLengthOffset + 4;
      if (data.length < payloadOffset + 6 || data.readUInt8(0) !== 0) {
        throw new Error("Attestation account data is invalid");
      }
      if (!new import_web3.PublicKey(data.subarray(1, 33)).equals(new import_web3.PublicKey(targetWalletStr)) || !new import_web3.PublicKey(data.subarray(33, 65)).equals(new import_web3.PublicKey(this.CREDENTIAL_PDA)) || !new import_web3.PublicKey(data.subarray(65, 97)).equals(new import_web3.PublicKey(this.SCHEMA_PDA))) {
        throw new Error("Attestation account identity does not match the request");
      }
      const encodedDataLength = data.readUInt32LE(dataLengthOffset);
      if (encodedDataLength < 6 || payloadOffset + encodedDataLength > data.length) {
        throw new Error("Attestation score payload is invalid");
      }
      const payload = data.subarray(payloadOffset, payloadOffset + encodedDataLength);
      const trustScore = payload.readUInt16LE(0);
      const riskLength = payload.readUInt32LE(2);
      if (trustScore > 1e3 || riskLength !== payload.length - 6) {
        throw new Error("Attestation score payload is invalid");
      }
      const riskLevel = payload.toString("utf8", 6);
      if (!["LOW", "MEDIUM", "HIGH", "MINIMAL"].includes(riskLevel)) {
        throw new Error("Attestation risk payload is invalid");
      }
      return {
        trustScore,
        riskLevel,
        isValid: true
      };
    } catch (error) {
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
