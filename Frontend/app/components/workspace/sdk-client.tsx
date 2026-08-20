"use client";

import React, { useState } from "react";
import { CredLayerClient } from "@credlayer/sdk";
import axios from "axios";

// Initialize the SDK (Devnet by default)
const credlayer = new CredLayerClient();

// URL of your running Express Relayer
const RELAYER_URL = "http://localhost:3001/api/v1/attestations/issue";

export function TrustScoreLiveDemo() {
    const [wallet, setWallet] = useState("11111111111111111111111111111111");
    const [scoreData, setScoreData] = useState<{
        trustScore: number;
        riskLevel: string;
        isValid: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [status, setStatus] = useState("Ready");

    // 1. Simulate AI Backend -> Trigger Relayer to Mint On-Chain
    const handleMintMockScore = async () => {
        setLoading(true);
        setStatus("Broadcasting score to Solana Devnet via Relayer...");
        setTxHash(null);

        try {
            // Generate a mock score (e.g. between 600 and 850)
            const randomScore = Math.floor(Math.random() * (850 - 600 + 1) + 600);
            const risk = randomScore >= 750 ? "LOW" : randomScore >= 650 ? "MEDIUM" : "HIGH";

            const response = await axios.post(RELAYER_URL, {
                targetWallet: wallet,
                trustScore: randomScore,
                riskLevel: risk,
            });

            if (response.data.success) {
                setTxHash(response.data.txHash);
                setStatus(`Minted on-chain! Tx: ${response.data.txHash.slice(0, 8)}...`);
            }
        } catch (err: any) {
            console.error(err);
            setStatus(err.response?.data?.error || "Minting failed. Ensure Relayer is running on port 3001.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch directly from Solana using @credlayer/sdk
    const handleVerifyOnChain = async () => {
        setLoading(true);
        setStatus("Querying Solana Devnet RPC via @credlayer/sdk...");

        try {
            const data = await credlayer.getScore(wallet);
            if (data) {
                setScoreData(data);
                setStatus("Score successfully verified directly from on-chain PDA!");
            } else {
                setScoreData(null);
                setStatus("No attestation found on-chain for this wallet address.");
            }
        } catch (err: any) {
            console.error(err);
            setStatus("Failed to query on-chain attestation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-xl text-white shadow-lg space-y-5">
            <h2 className="text-xl font-semibold text-neutral-100">Live Attestation Testbench</h2>

            <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Solana Wallet Address
                </label>
                <input
                    type="text"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm font-mono text-neutral-200 focus:outline-none focus:border-blue-500"
                    placeholder="Base58 Wallet Address"
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleMintMockScore}
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition"
                >
                    {loading ? "Processing..." : "1. Issue Attestation (Relayer)"}
                </button>

                <button
                    onClick={handleVerifyOnChain}
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition"
                >
                    2. Verify On-Chain (SDK)
                </button>
            </div>

            <div className="p-3 bg-neutral-950/60 rounded-lg text-xs font-mono text-neutral-400 border border-neutral-800">
                Status: <span className="text-neutral-200">{status}</span>
                {txHash && (
                    <div className="mt-1">
                        <a
                            href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 underline"
                        >
                            View on Solana Explorer ↗
                        </a>
                    </div>
                )}
            </div>

            {scoreData && (
                <div className="mt-4 p-5 bg-neutral-950 border border-neutral-800 rounded-lg text-center space-y-2">
                    <div className="text-4xl font-extrabold text-blue-400 font-mono">
                        {scoreData.trustScore}
                    </div>
                    <div className="text-sm font-medium text-neutral-300">
                        Risk Assessment:{" "}
                        <span
                            className={
                                scoreData.riskLevel === "LOW"
                                    ? "text-emerald-400 font-bold"
                                    : scoreData.riskLevel === "MEDIUM"
                                        ? "text-amber-400 font-bold"
                                        : "text-red-400 font-bold"
                            }
                        >
                            {scoreData.riskLevel}
                        </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                        Status: {scoreData.isValid ? "✅ Active On-Chain Attestation" : "❌ Revoked"}
                    </div>
                </div>
            )}
        </div>
    );
}