"use client";

import React, { useState, useEffect } from "react";
import { CredLayerClient } from "@credlayer/sdk";
import axios from "axios";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { AlertCircle } from "lucide-react";

// Initialize the SDK (Devnet by default)
const credlayer = new CredLayerClient();

// URL of your running Express Relayer
const RELAYER_URL = process.env.NEXT_PUBLIC_RELAYER_URL || "http://localhost:3001/api/v1/attestations/issue";

export function TrustScoreLiveDemo() {
    const [hasMounted, setHasMounted] = useState(false);
    const client = useAppClient();
    const connectedWallet = useConnectedWallet(client);
    const walletAddress = connectedWallet?.account.address;

    const [scoreData, setScoreData] = useState<{
        trustScore: number;
        riskLevel: string;
        isValid: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [status, setStatus] = useState("Ready");
    const [error, setError] = useState<string | null>(null);

    // Prevent hydration mismatch
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Reset data when wallet changes
    useEffect(() => {
        if (hasMounted) {
            setScoreData(null);
            setTxHash(null);
            setError(null);
            setStatus(walletAddress ? "Ready" : "Please connect your wallet");
        }
    }, [walletAddress, hasMounted]);

    // 1. Simulate AI Backend -> Trigger Relayer to Mint On-Chain
    const handleMintMockScore = async () => {
        if (!walletAddress) {
            setStatus("Please connect your wallet first");
            return;
        }

        setLoading(true);
        setError(null);
        setStatus("Broadcasting score to Solana Devnet via Relayer...");
        setTxHash(null);

        try {
            // Generate a mock score (e.g. between 600 and 850)
            const randomScore = Math.floor(Math.random() * (850 - 600 + 1) + 600);
            const risk = randomScore >= 750 ? "LOW" : randomScore >= 650 ? "MEDIUM" : "HIGH";

            const response = await axios.post(
                RELAYER_URL, 
                {
                    targetWallet: walletAddress,
                    trustScore: randomScore,
                    riskLevel: risk,
                },
                { timeout: 10000 } // 10 second timeout
            );

            if (response.data.success) {
                setTxHash(response.data.txHash);
                setStatus(`Minted on-chain! Tx: ${response.data.txHash.slice(0, 8)}...`);
            }
        } catch (err: any) {
            console.error("Attestation minting error:", err);
            
            if (err.code === "ECONNREFUSED" || err.message === "Network Error") {
                setError(`Relayer service is not running. Please start the relayer on ${RELAYER_URL}`);
                setStatus("Connection failed - Relayer offline");
            } else if (err.code === "ECONNABORTED") {
                setError("Request timed out. The relayer took too long to respond.");
                setStatus("Request timeout");
            } else {
                setError(err.response?.data?.error || err.message || "Failed to mint attestation");
                setStatus("Minting failed");
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch directly from Solana using @credlayer/sdk
    const handleVerifyOnChain = async () => {
        if (!walletAddress) {
            setStatus("Please connect your wallet first");
            return;
        }

        setLoading(true);
        setError(null);
        setStatus("Querying Solana Devnet RPC via @credlayer/sdk...");

        try {
            const data = await credlayer.getScore(walletAddress);
            if (data) {
                setScoreData(data);
                setStatus("Score successfully verified directly from on-chain PDA!");
            } else {
                setScoreData(null);
                setStatus("No attestation found on-chain for this wallet address.");
            }
        } catch (err: any) {
            console.error("On-chain verification error:", err);
            setError(err.message || "Failed to query on-chain attestation");
            setStatus("Query failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-neutral-900 border border-neutral-800 rounded-xl text-white shadow-lg space-y-5">
            <h2 className="text-xl font-semibold text-neutral-100">Live Attestation Testbench</h2>

            <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Connected Wallet Address
                </label>
                <div className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm font-mono text-neutral-200">
                    {!hasMounted ? (
                        <span className="text-neutral-500">Loading...</span>
                    ) : walletAddress ? (
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            {walletAddress}
                        </span>
                    ) : (
                        <span className="text-neutral-500 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            No wallet connected
                        </span>
                    )}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800/50 rounded-lg">
                    <AlertCircle className="size-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-200">Error</p>
                        <p className="text-xs text-red-300 mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={handleMintMockScore}
                    disabled={loading || !walletAddress || !hasMounted}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
                >
                    {loading ? "Processing..." : "1. Issue Attestation (Relayer)"}
                </button>

                <button
                    onClick={handleVerifyOnChain}
                    disabled={loading || !walletAddress || !hasMounted}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition"
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

            {/* Info Card */}
            <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-lg">
                <p className="text-xs text-blue-200">
                    <span className="font-semibold">Note:</span> The relayer service must be running to issue attestations. 
                    Verification queries the blockchain directly and works independently.
                </p>
            </div>
        </div>
    );
}