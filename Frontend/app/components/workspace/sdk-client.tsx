/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Circle, LoaderCircle, ShieldCheck } from "lucide-react";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { apiClient } from "../../lib/api-client";

type FlowState =
  | "disconnected"
  | "wallet"
  | "preparing"
  | "checking"
  | "existing"
  | "scoring"
  | "issuing"
  | "verifying"
  | "success"
  | "error";

type AttestationResult = {
  walletAddress: string;
  score: {
    address?: string;
    trustScore: number;
    trustLevel?: string;
    riskLevel: string;
    confidence?: number;
    fraudProbability?: number;
    network?: string;
    explanation?: string;
  };
  attestation: {
    verified: boolean;
    alreadyExisted: boolean;
    trustScore: number;
    riskLevel: string;
  };
  txHash?: string;
  attestationPda?: string;
  timestamp: number;
};

const progressSteps: { state: FlowState; label: string }[] = [
  { state: "preparing", label: "Preparing" },
  { state: "scoring", label: "Calculating trust score" },
  { state: "issuing", label: "Creating your attestation" },
  { state: "verifying", label: "Confirming your credential" },
];

const existingSteps: { state: FlowState; label: string }[] = [
  { state: "preparing", label: "Preparing" },
  { state: "existing", label: "Checking your existing credential" },
  { state: "verifying", label: "Confirming your credential" },
];

const checkingSteps: { state: FlowState; label: string }[] = [
  { state: "checking", label: "Looking for your attestation..." },
];

function friendlyError(code: string) {
  switch (code) {
    case "scoring":
      return "We couldn't calculate your trust score right now. Please try again shortly.";
    case "verification":
      return "We couldn't verify your attestation on-chain. Please try again.";
    case "wallet_disconnected":
      return "Your wallet was disconnected. Please reconnect and try again.";
    case "attestation":
      return "We couldn't create your attestation right now. Please try again shortly.";
    default:
      return "We couldn't reach CredLayer right now. Please try again shortly.";
  }
}

// ---- Local persistence helpers (per-wallet, survives page refresh) ----
// IMPORTANT: Use same cache key as useWalletData hook for consistency
const cacheKey = (wallet: string) => `credlayer_wallet_${wallet}`;

function loadCachedResult(wallet: string): AttestationResult | null {
  try {
    const raw = localStorage.getItem(cacheKey(wallet));
    return raw ? (JSON.parse(raw) as AttestationResult) : null;
  } catch {
    return null;
  }
}

function saveCachedResult(wallet: string, result: AttestationResult) {
  try {
    localStorage.setItem(cacheKey(wallet), JSON.stringify(result));
  } catch {
    // storage full or unavailable — non-fatal, just skip caching
  }
}

function clearCachedResult(wallet: string) {
  try {
    localStorage.removeItem(cacheKey(wallet));
  } catch {
    // non-fatal
  }
}

export function TrustScoreLiveDemo() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address
    ? String(connectedWallet.account.address)
    : null;
  const [flowState, setFlowState] = useState<FlowState>(
    walletAddress ? "wallet" : "disconnected",
  );
  const [result, setResult] = useState<AttestationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const previousWalletAddress = useRef(walletAddress);
  const lastValidResultRef = useRef<AttestationResult | null>(null);

  const setLastKnownResult = (value: AttestationResult | null) => {
    lastValidResultRef.current = value;
    setResult(value);
  };

  // On wallet connect/disconnect/change — check backend for existing attestation
  useEffect(() => {
    const walletChanged = previousWalletAddress.current !== walletAddress;
    const prevWallet = previousWalletAddress.current;
    previousWalletAddress.current = walletAddress;

    if (!walletChanged) return;

    if (requestController.current) {
      requestController.current.abort();
      requestController.current = null;
    }

    if (!walletAddress) {
      // Disconnected — clear this wallet's cached data and reset state
      if (prevWallet) clearCachedResult(prevWallet);
      setLastKnownResult(null);
      setErrorMessage(null);
      setFlowState("disconnected");
      return;
    }

    console.log(`[Wallet Flow] Wallet connected: ${walletAddress}`);
    
    // Check LOCAL cache first for instant display
    const cached = loadCachedResult(walletAddress);
    if (cached) {
      console.log(`[Wallet Flow] Found cached attestation, displaying immediately`)
      setLastKnownResult(cached);
      setFlowState("success");
      // Don't return — still check backend to verify cache is up-to-date
    } else {
      setLastKnownResult(null);
      setErrorMessage(null);
      setFlowState("checking");
    }

    // Check backend for existing attestation (READ-ONLY)
    const checkExistingAttestation = async () => {
      console.log(`[Wallet Flow] Checking backend for existing attestation...`);
      const controller = new AbortController();
      requestController.current = controller;

      try {
        const checkUrl = apiClient.getUri({
          url: `/scores/${encodeURIComponent(walletAddress)}/attestation/check`,
        });
        
        const checkResponse = await fetch(checkUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (checkResponse.ok) {
          const checkPayload = (await checkResponse.json().catch(() => ({}))) as {
            success?: boolean;
            exists?: boolean;
            attestation?: {
              trustScore?: number;
              riskLevel?: string;
              verified?: boolean;
            };
          };

          console.log(`[Wallet Flow] Check response:`, checkPayload);

          // If attestation exists on-chain, display it immediately
          if (checkPayload.success && checkPayload.exists && checkPayload.attestation) {
            const trustScore = Number(checkPayload.attestation.trustScore ?? 0);
            const riskLevel = String(checkPayload.attestation.riskLevel ?? "unknown").toUpperCase();

            if (Number.isFinite(trustScore) && riskLevel) {
              console.log(`[Wallet Flow] Existing wallet found - trustScore: ${trustScore}, riskLevel: ${riskLevel}`);
              
              const existingResult: AttestationResult = {
                walletAddress,
                score: { 
                  trustScore, 
                  riskLevel,
                },
                attestation: {
                  verified: true,
                  alreadyExisted: true,
                  trustScore,
                  riskLevel,
                },
                timestamp: Date.now(),
              };

              setLastKnownResult(existingResult);
              saveCachedResult(walletAddress, existingResult);
              setFlowState("success");
              return;
            }
          }
        }

        // No existing attestation found on backend
        console.log(`[Wallet Flow] New wallet - no existing attestation found`);
        
        // Only show "Get Trust Score" button if we don't have cached data
        if (!cached) {
          setFlowState("wallet"); // Show "Get Trust Score & Attestation" button
        } else {
          console.log(`[Wallet Flow] Keeping cached data even though backend returned no attestation`);
          // Keep showing cached data and stay in success state
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(`[Wallet Flow] Error checking existing attestation:`, error);
        
        // On error, only show button if we don't have cached data
        if (!cached) {
          setFlowState("wallet");
        } else {
          console.log(`[Wallet Flow] Keeping cached data despite fetch error`);
          // Keep showing cached data
        }
      } finally {
        if (requestController.current === controller) {
          requestController.current = null;
        }
      }
    };

    checkExistingAttestation();
  }, [walletAddress]);

  const runAttestation = async () => {
    if (!walletAddress || requestController.current) return;

    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    console.log(`[Wallet Flow] User clicked "Get Trust Score & Attestation"`);
    console.log(`[Wallet Flow] Creating attestation for wallet: ${walletAddress}`);

    const controller = new AbortController();
    requestController.current = controller;
    setErrorMessage(null);
    setProgressMessage(null);

    const previousResult = lastValidResultRef.current;
    if (!previousResult) {
      setResult(null);
    }
    setFlowState("preparing");

    try {
      // Create the attestation (we already checked existence on wallet connection)
      console.log(`[Wallet Flow] Creating new attestation`)
      setFlowState("scoring");
      const url = apiClient.getUri({
        url: `/scores/${encodeURIComponent(walletAddress)}/attestation`,
      });
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      console.log(`[Wallet Flow] POST response status: ${response.status}`)

      const payload = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        txHash?: string;
        alreadyExists?: boolean;
        attestationPda?: string;
        score?: {
          address?: string;
          trustScore?: number;
          trustLevel?: string;
          riskLevel?: string;
          trust_score?: number;
          risk_level?: string;
          confidence?: number;
          fraudProbability?: number;
          network?: string;
          explanation?: string;
        };
        attestation?: {
          trustScore?: number;
          riskLevel?: string;
        };
        detail?: string;
        error?: string;
        message?: string;
      };

      console.log(`[Wallet Flow] Response payload:`, payload)

      // Handle success (200 OK with success: true)
      if (response.ok && payload.success === true) {
        const trustScore = Number(
          payload.attestation?.trustScore ?? 
          payload.score?.trustScore ?? 
          payload.score?.trust_score ?? 0,
        );
        const riskLevel = String(
          payload.attestation?.riskLevel ??
          payload.score?.riskLevel ?? 
          payload.score?.risk_level ?? "unknown",
        ).toUpperCase();

        if (!Number.isFinite(trustScore) || !riskLevel) {
          throw new Error("verification");
        }

        console.log(`[Wallet Flow] SUCCESS - Attestation created/verified`)
        console.log(`[Wallet Flow] Trust Score: ${trustScore}, Risk Level: ${riskLevel}`)

        const finalResult: AttestationResult = {
          walletAddress,
          score: { 
            address: payload.score?.address,
            trustScore, 
            trustLevel: payload.score?.trustLevel,
            riskLevel,
            confidence: payload.score?.confidence,
            fraudProbability: payload.score?.fraudProbability,
            network: payload.score?.network,
            explanation: payload.score?.explanation,
          },
          attestation: {
            verified: true,
            alreadyExisted: Boolean(payload.alreadyExists ?? false),
            trustScore,
            riskLevel,
          },
          txHash: payload.txHash,
          attestationPda: payload.attestationPda,
          timestamp: Date.now(),
        };

        setLastKnownResult(finalResult);
        saveCachedResult(walletAddress, finalResult);
        setFlowState("success");
        return;
      }

      // Otherwise, treat as error
      const detail = payload.detail || payload.error || payload.message || "attestation";
      console.log(`[Wallet Flow] ERROR - ${detail}`)
      throw new Error(typeof detail === "string" ? detail : "attestation");
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error(`[Wallet Flow] Attestation creation failed`, error);

      const rawDetail = error instanceof Error ? error.message : String(error);
      const showableDetail =
        process.env.NODE_ENV === "development" && rawDetail ? rawDetail : null;

      // If we have a previous valid result, keep showing it
      if (lastValidResultRef.current) {
        setFlowState("success");
        setErrorMessage(null);
        return;
      }

      setErrorMessage(showableDetail ?? friendlyError("attestation"));
      setFlowState("error");
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
      }
    }
  };

  const isProcessing = [
    "preparing",
    "checking",
    "existing",
    "scoring",
    "issuing",
    "verifying",
  ].includes(flowState);

  let currentSteps = progressSteps;
  if (flowState === "checking") {
    currentSteps = checkingSteps;
  } else if (flowState === "existing") {
    currentSteps = existingSteps;
  }

  const displayedResult = result ?? lastValidResultRef.current;

  return (
    <section aria-labelledby="reputation-flow-title" className="py-2">
      <div className="mx-auto max-w-3xl">
        <div className="border-b border-border pb-7">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              CredLayer Reputation
            </span>
          </div>
          <h2
            id="reputation-flow-title"
            className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
          >
            Verify your on-chain reputation
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Connect your Solana wallet to calculate your trust score and create
            a verifiable credential.
          </p>
        </div>

        <div className="flex flex-col gap-5 border-b border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {walletAddress ? "Wallet connected" : "Wallet"}
            </p>
            <p className="mt-2 font-mono text-sm text-foreground">
              {walletAddress
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "Not connected"}
            </p>
            {walletAddress && flowState === "checking" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Checking for existing attestation...
              </p>
            )}
          </div>
        </div>

        {walletAddress && flowState === "wallet" && (
          <div className="py-6">
            <p className="mb-4 text-sm text-muted-foreground">
              No existing attestation found for this wallet.
            </p>
            <button
              type="button"
              onClick={runAttestation}
              disabled={isProcessing}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              aria-hidden={isProcessing ? "false" : undefined}
            >
              {isProcessing && (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              )}
              {isProcessing
                ? "Working on your verification..."
                : "Get Trust Score & Attestation"}
            </button>
          </div>
        )}

        {isProcessing && (
          <ol
            aria-label="Verification progress"
            aria-live="polite"
            className="space-y-4 border-b border-border py-5"
          >
            {currentSteps.map((step) => {
              const currentIndex = currentSteps.findIndex(
                (item) => item.state === flowState,
              );
              const stepIndex = currentSteps.findIndex(
                (item) => item.state === step.state,
              );
              const complete = stepIndex < currentIndex;
              const current = step.state === flowState;
              return (
                <li key={step.state} className="flex items-center gap-3 text-sm">
                  {complete ? (
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  ) : current ? (
                    <LoaderCircle
                      className="size-4 animate-spin text-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className="size-4 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={
                      current || complete
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {isProcessing && progressMessage && (
          <p aria-live="polite" className="py-3 text-sm text-muted-foreground">
            {progressMessage}
          </p>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="border-b border-border py-5 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}

        {flowState === "success" && displayedResult && (
          <div aria-live="polite" className="py-7">
            <div className="flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Trust score
                </p>
                <p className="mt-2 text-5xl font-semibold tabular-nums text-foreground">
                  {displayedResult.attestation.trustScore}
                  <span className="ml-2 text-base font-medium text-muted-foreground">
                    / 1000
                  </span>
                </p>
                {displayedResult.score.trustLevel && (
                  <p className="mt-2 text-sm text-muted-foreground capitalize">
                    Trust Level: {displayedResult.score.trustLevel}
                  </p>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Risk level
                </p>
                <p className="mt-2 text-lg font-medium capitalize text-foreground">
                  {displayedResult.attestation.riskLevel.toLowerCase()} risk
                </p>
              </div>
            </div>
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-4 border-b border-border py-5 sm:grid-cols-2">
              {displayedResult.score.confidence !== undefined && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confidence
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {(displayedResult.score.confidence * 100).toFixed(2)}%
                  </p>
                </div>
              )}
              {displayedResult.score.fraudProbability !== undefined && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Fraud Probability
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {(displayedResult.score.fraudProbability * 100).toFixed(2)}%
                  </p>
                </div>
              )}
              {displayedResult.attestationPda && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Attestation PDA
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground break-all">
                    {displayedResult.attestationPda}
                  </p>
                </div>
              )}
              {displayedResult.txHash && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Transaction Hash
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground break-all">
                    {displayedResult.txHash}
                  </p>
                </div>
              )}
              {displayedResult.walletAddress && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Wallet Address
                  </p>
                  <p className="mt-1 font-mono text-xs text-foreground break-all">
                    {displayedResult.walletAddress}
                  </p>
                </div>
              )}
              {displayedResult.timestamp && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {new Date(displayedResult.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
              {displayedResult.score.network && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Network
                  </p>
                  <p className="mt-1 text-sm text-foreground capitalize">
                    {displayedResult.score.network}
                  </p>
                </div>
              )}
            </div>

            {displayedResult.score.explanation && (
              <div className="border-b border-border py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Analysis Explanation
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {displayedResult.score.explanation}
                </p>
              </div>
            )}

            <p className="flex items-center gap-2 pt-5 text-sm font-medium text-primary">
              <Check className="size-4" aria-hidden="true" />
              Attestation verified on-chain
              {displayedResult.attestation.alreadyExisted && (
                <span className="font-normal text-muted-foreground">
                  · Existing credential confirmed
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                // Clear cache and re-check from backend
                if (walletAddress) {
                  clearCachedResult(walletAddress);
                  setFlowState("checking");
                  // Trigger the wallet effect by temporarily changing state
                  const currentWallet = walletAddress;
                  previousWalletAddress.current = null;
                  previousWalletAddress.current = currentWallet;
                  // Re-run the check
                  (async () => {
                    const controller = new AbortController();
                    requestController.current = controller;
                    try {
                      const checkUrl = apiClient.getUri({
                        url: `/scores/${encodeURIComponent(currentWallet)}/attestation/check`,
                      });
                      const checkResponse = await fetch(checkUrl, {
                        method: "GET",
                        headers: { Accept: "application/json" },
                        signal: controller.signal,
                      });
                      if (checkResponse.ok) {
                        const checkPayload = await checkResponse.json().catch(() => ({})) as {
                          success?: boolean;
                          exists?: boolean;
                          attestation?: { trustScore?: number; riskLevel?: string; verified?: boolean; };
                        };
                        if (checkPayload.success && checkPayload.exists && checkPayload.attestation) {
                          const trustScore = Number(checkPayload.attestation.trustScore ?? 0);
                          const riskLevel = String(checkPayload.attestation.riskLevel ?? "unknown").toUpperCase();
                          if (Number.isFinite(trustScore) && riskLevel) {
                            const refreshedResult: AttestationResult = {
                              walletAddress: currentWallet,
                              score: { trustScore, riskLevel },
                              attestation: { verified: true, alreadyExisted: true, trustScore, riskLevel },
                              timestamp: Date.now(),
                            };
                            setLastKnownResult(refreshedResult);
                            saveCachedResult(currentWallet, refreshedResult);
                            setFlowState("success");
                            return;
                          }
                        }
                      }
                      setFlowState("wallet");
                    } catch (error) {
                      if (!controller.signal.aborted) {
                        console.error("[Wallet Flow] Refresh failed", error);
                        setFlowState("wallet");
                      }
                    } finally {
                      if (requestController.current === controller) {
                        requestController.current = null;
                      }
                    }
                  })();
                }
              }}
              disabled={isProcessing}
              className="mt-6 min-h-10 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        )}

        {!walletAddress && (
          <p className="py-5 text-sm text-muted-foreground">
            Connect a wallet to get started.
          </p>
        )}
      </div>
    </section>
  );
}

