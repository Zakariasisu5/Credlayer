"use client";

import { Activity as ActivityIcon, Radio, Award, Link, Star, Settings, FileText } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Empty, Stat, StyledCard } from "../shared/common-components";
import { SkeletonStat, SkeletonList } from "../ui";
import { useConnectedWallet } from "@solana/kit-plugin-wallet/react";
import { useAppClient } from "../../lib/client-provider";
import { useActivity } from "../../lib/hooks";

export function ActivityPage() {
  const client = useAppClient();
  const connectedWallet = useConnectedWallet(client);
  const walletAddress = connectedWallet?.account.address;

  const { data: activity, isLoading } = useActivity(walletAddress, 100);

  const totalEvents = activity?.length ?? 0;
  const successEvents = activity?.filter(e => e.status === 'success').length ?? 0;
  const failedEvents = activity?.filter(e => e.status === 'failed' || e.status === 'error').length ?? 0;
  const pendingEvents = activity?.filter(e => e.status === 'pending').length ?? 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed':
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed':
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      signal: Radio,
      credential: Award,
      connection: Link,
      score: Star,
      system: Settings,
    };
    const IconComponent = iconMap[category] || FileText;
    return <IconComponent className="size-4 text-primary" />;
  };

  return (
    <Shell title="Activity" eyebrow="App workspace">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <p className="mb-7 text-sm text-muted-foreground">
          A transparent record of protocol events.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {isLoading ? (
            <>
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
            </>
          ) : (
            <>
              <Stat 
                label="Total Events" 
                value={totalEvents > 0 ? totalEvents.toString() : "—"}
                note={walletAddress ? (totalEvents > 0 ? "All activity" : "No events yet") : "Connect wallet"}
              />
              <Stat 
                label="Successful" 
                value={successEvents > 0 ? successEvents.toString() : "—"}
                note={walletAddress ? (successEvents > 0 ? "Completed events" : "None completed") : "Connect wallet"}
              />
              <Stat 
                label="Failed/Pending" 
                value={(failedEvents + pendingEvents) > 0 ? (failedEvents + pendingEvents).toString() : "—"}
                note={walletAddress ? (failedEvents > 0 ? `${failedEvents} failed, ${pendingEvents} pending` : "None failed") : "Connect wallet"}
              />
            </>
          )}
        </div>
        <div className="mt-5">
          {!walletAddress ? (
            <Empty
              icon={ActivityIcon}
              title="No wallet connected"
              description="Connect your wallet to view your activity feed and protocol events."
            />
          ) : isLoading ? (
            <SkeletonList count={5} />
          ) : !activity || activity.length === 0 ? (
            <Empty
              icon={ActivityIcon}
              title="No activity yet"
              description="Your verification events and credential issuance will appear here once you interact with the protocol."
            />
          ) : (
            <StyledCard>
              <h3 className="mb-4 font-semibold border-b border-primary/20 pb-3">Activity Feed</h3>
              <div className="space-y-3">
                {activity.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-4 hover:bg-background transition-colors"
                  >
                    <div className={`mt-1 size-2 rounded-full ${getStatusColor(event.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(event.eventCategory)}
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          event.status === 'success' ? 'bg-green-500/10 text-green-500' :
                          event.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">{event.eventCategory}</span>
                        </span>
                        <span>{new Date(event.createdAt).toLocaleString()}</span>
                      </div>

                      {event.errorDetails && (
                        <div className="mt-3 p-2 rounded bg-red-500/5 border border-red-500/20">
                          <p className="text-xs text-red-500 font-medium">Error Details:</p>
                          <pre className="text-xs text-red-500/80 mt-1 overflow-auto">
                            {JSON.stringify(event.errorDetails, null, 2)}
                          </pre>
                        </div>
                      )}

                      {event.metadata && Object.keys(event.metadata).length > 0 && event.status !== 'failed' && event.status !== 'error' && (
                        <details className="mt-2">
                          <summary className="text-xs text-primary cursor-pointer hover:underline">
                            View metadata
                          </summary>
                          <pre className="text-xs bg-background/50 rounded p-2 mt-2 overflow-auto">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {failedEvents > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-red-500">
                    <strong>{failedEvents}</strong> event{failedEvents > 1 ? 's' : ''} failed. 
                    Review error details above to troubleshoot.
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

