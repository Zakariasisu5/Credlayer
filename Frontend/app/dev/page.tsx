"use client";

import { useState } from "react";
import { CredLayerClient } from "@credlayer/sdk";
import { apiClient } from "../lib/api-client";
import { Shell } from "../components/layout/app-shell";

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
const credentialPda = process.env.NEXT_PUBLIC_CREDENTIAL_PDA;
const schemaPda = process.env.NEXT_PUBLIC_SCHEMA_PDA;

export default function DeveloperAttestationPage() {
  const [address, setAddress] = useState("");
  const [relayerStatus, setRelayerStatus] = useState<unknown>(null);
  const [responses, setResponses] = useState<Array<{ action: string; data: unknown }>>([]);
  const [working, setWorking] = useState<string | null>(null);

  const record = (action: string, data: unknown) => {
    setResponses((current) => [{ action, data }, ...current].slice(0, 10));
  };

  const run = async (action: string, operation: () => Promise<unknown>) => {
    if (!address.trim()) return;
    setWorking(action);
    try {
      const data = await operation();
      record(action, data);
    } catch (error) {
      console.error(`Developer action failed: ${action}`, error);
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };
      const data = axiosError.response
        ? { status: axiosError.response.status, data: axiosError.response.data }
        : { error: axiosError.message };
      record(action, data);
    } finally {
      setWorking(null);
    }
  };

  return (
    <Shell title="Attestation Diagnostics" eyebrow="Developer tools" developer>
      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 lg:px-10">
        <p className="text-sm text-muted-foreground">
          Manual API and on-chain diagnostics. Technical responses are shown here for development use.
        </p>

        <section className="space-y-4 border-b border-border pb-7">
          <label htmlFor="debug-wallet" className="block text-sm font-medium">
            Wallet address
          </label>
          <input
            id="debug-wallet"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="min-h-11 w-full rounded-md border border-border bg-background px-3 font-mono text-sm"
            placeholder="Base58 address"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                run("score", async () => (await apiClient.get(`/scores/${encodeURIComponent(address)}`)).data)
              }
              disabled={!address || working !== null}
              className="min-h-10 rounded-md border border-border px-4 text-sm font-medium disabled:opacity-50"
            >
              {working === "score" ? "Requesting…" : "Request score"}
            </button>
            <button
              type="button"
              onClick={() =>
                run("issue", async () =>
                  (await apiClient.post(`/scores/${encodeURIComponent(address)}/attestation/issue`)).data,
                )
              }
              disabled={!address || working !== null}
              className="min-h-10 rounded-md border border-border px-4 text-sm font-medium disabled:opacity-50"
            >
              {working === "issue" ? "Issuing…" : "Issue attestation"}
            </button>
            <button
              type="button"
              onClick={() =>
                run("verify", async () => {
                  if (!rpcUrl || !credentialPda || !schemaPda) {
                    throw new Error("Configure the Solana RPC URL, credential PDA, and schema PDA.");
                  }
                  const sdk = new CredLayerClient(rpcUrl, credentialPda, schemaPda);
                  return sdk.getScore(address);
                })
              }
              disabled={!address || working !== null}
              className="min-h-10 rounded-md border border-border px-4 text-sm font-medium disabled:opacity-50"
            >
              {working === "verify" ? "Verifying…" : "Verify on-chain"}
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await apiClient.get("/scores/dev/relayer-status");
                  setRelayerStatus(response.data);
                  record("relayer status", response.data);
                } catch (error) {
                  console.error("Relayer status check failed", error);
                  setRelayerStatus({ available: false });
                  record("relayer status", { available: false });
                }
              }}
              className="min-h-10 rounded-md border border-border px-4 text-sm font-medium"
            >
              Check relayer status
            </button>
          </div>
          {relayerStatus !== null && (
            <p className="text-sm text-muted-foreground">
              Relayer: {JSON.stringify(relayerStatus)}
            </p>
          )}
        </section>

        <section aria-live="polite">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Request log</h2>
            <button
              type="button"
              onClick={() => setResponses([])}
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Clear
            </button>
          </div>
          {responses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {responses.map((response, index) => (
                <details key={`${response.action}-${index}`} className="py-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    {response.action}
                  </summary>
                  <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs leading-5">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}