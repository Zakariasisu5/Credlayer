"use client";

import { Code2 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useRequestLogs, getRequestStatus } from "../../lib/hooks";

export function DeveloperDashboardPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const { data: requestLogs, isLoading } = useRequestLogs(walletAddress, 100);

  // Calculate stats
  const totalRequests = requestLogs?.length ?? 0;
  const successRequests = requestLogs?.filter(r => r.statusCode >= 200 && r.statusCode < 300).length ?? 0;
  const errorRequests = requestLogs?.filter(r => r.statusCode >= 400).length ?? 0;
  const unauthorizedRequests = requestLogs?.filter(r => r.statusCode === 401 || r.statusCode === 403).length ?? 0;
  const rateLimitedRequests = requestLogs?.filter(r => r.statusCode === 429).length ?? 0;

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-500';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBgColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500/10 text-green-500';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-red-500/10 text-red-500';
  };

  if (!walletAddress) {
    return (
      <Shell title="Developer dashboard" eyebrow="Developer console" developer>
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
          <StyledCard>
            <div className="py-12 text-center text-sm text-muted-foreground">
              Connect your wallet to view developer dashboard
            </div>
          </StyledCard>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Developer dashboard" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-4">
          <Stat 
            label="Total Requests" 
            value={isLoading ? "..." : totalRequests > 0 ? totalRequests.toString() : "—"}
            note={totalRequests > 0 ? "All API calls" : "No requests yet"}
          />
          <Stat 
            label="Successful" 
            value={isLoading ? "..." : successRequests > 0 ? successRequests.toString() : "—"}
            note={successRequests > 0 ? "2xx responses" : "None"}
          />
          <Stat 
            label="Errors" 
            value={isLoading ? "..." : errorRequests > 0 ? errorRequests.toString() : "—"}
            note={errorRequests > 0 ? "4xx/5xx responses" : "None"}
          />
          <Stat 
            label="Unauthorized/Rate Limited" 
            value={isLoading ? "..." : (unauthorizedRequests + rateLimitedRequests) > 0 ? (unauthorizedRequests + rateLimitedRequests).toString() : "—"}
            note={(unauthorizedRequests + rateLimitedRequests) > 0 ? `${unauthorizedRequests} 401, ${rateLimitedRequests} 429` : "None"}
          />
        </div>
        <div className="mt-5">
          {isLoading ? (
            <StyledCard>
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading request logs...
              </div>
            </StyledCard>
          ) : !requestLogs || requestLogs.length === 0 ? (
            <Empty
              icon={Code2}
              title="No API requests yet"
              description="Create an API key and start making requests to see usage and integration health."
            />
          ) : (
            <StyledCard>
              <h2 className="font-semibold border-b border-primary/20 pb-3 mb-4">Request Logs</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {requestLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3 hover:bg-background transition-colors"
                  >
                    <div className={`mt-1 size-2 rounded-full ${
                      log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-500' :
                      log.statusCode >= 400 && log.statusCode < 500 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-semibold">{log.method}</span>
                        <span className="font-mono text-xs truncate flex-1">{log.endpoint}</span>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded ${getStatusBgColor(log.statusCode)}`}>
                          {log.statusCode}
                        </span>
                        {log.durationMs && (
                          <span className="text-xs text-muted-foreground">
                            {log.durationMs}ms
                          </span>
                        )}
                      </div>
                      
                      {log.apiKeyId && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Key: {log.apiKeyId.slice(0, 8)}...
                        </p>
                      )}

                      {log.errorMessage && (
                        <div className="mt-2 p-2 rounded bg-red-500/5 border border-red-500/20">
                          <p className="text-xs text-red-500 font-medium">Error:</p>
                          <p className="text-xs text-red-500/80 mt-1">{log.errorMessage}</p>
                        </div>
                      )}

                      {log.ipAddress && (
                        <p className="text-xs text-muted-foreground mt-1">
                          IP: {log.ipAddress}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>

                      {/* Request/Response Details */}
                      {(log.requestBody || log.responseBody) && (
                        <details className="mt-2">
                          <summary className="text-xs text-primary cursor-pointer hover:underline">
                            View request/response details
                          </summary>
                          <div className="mt-2 space-y-2">
                            {log.requestBody && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Request Body:</p>
                                <pre className="text-xs bg-background/50 rounded p-2 overflow-auto">
                                  {JSON.stringify(log.requestBody, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.responseBody && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Response Body:</p>
                                <pre className="text-xs bg-background/50 rounded p-2 overflow-auto">
                                  {JSON.stringify(log.responseBody, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Summary */}
              {errorRequests > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-sm text-yellow-500">
                    <strong>{errorRequests}</strong> request{errorRequests > 1 ? 's' : ''} failed. 
                    {unauthorizedRequests > 0 && ` ${unauthorizedRequests} unauthorized (401/403).`}
                    {rateLimitedRequests > 0 && ` ${rateLimitedRequests} rate limited (429).`}
                  </p>
                </div>
              )}
            </StyledCard>
          )}
        </div>
      </div>
    </Shell>
  );
}

