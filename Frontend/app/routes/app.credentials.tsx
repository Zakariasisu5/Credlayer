import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Award, ShieldCheck } from "lucide-react";
import { useWalletSession } from "@/lib/wallet/session";
import { ConnectPrompt } from "@/components/app/ConnectPrompt";
import { useMyCredentials } from "@/hooks/api/useCredentials";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { CardSkeleton } from "@/components/ui/loading-state";

export const Route = createFileRoute("/app/credentials")({
  component: CredentialsPage,
  head: () => ({
    meta: [
      { title: "Verified Credentials · CredLayer" },
      {
        name: "description",
        content:
          "View the verifiable credentials and badges attested to your wallet by protocols, DAOs, and identity providers.",
      },
      { property: "og:title", content: "Verified Credentials · CredLayer" },
      {
        property: "og:description",
        content: "Signed, portable, revocable credentials attested to your wallet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/credentials" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/credentials" }],
  }),
});

function CredentialsPage() {
  const { address, authenticated } = useWalletSession();
  const { data, isLoading, isError, error, refetch } = useMyCredentials();

  if (!authenticated || !address)
    return <ConnectPrompt title="Connect to view your credentials" />;

  const credentials = data?.data?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-w-0">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-accent">Credentials</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">Verified credentials & badges</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Attestations issued to your wallet by protocols, DAOs, and identity providers — signed,
          portable, revocable.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {isError && <ErrorState error={error as Error} onRetry={() => refetch()} />}

      {!isLoading && !isError && credentials.length === 0 && (
        <div className="glass rounded-2xl">
          <EmptyState
            icon={Award}
            title="No credentials yet"
            description="Credentials issued to your wallet will appear here once they are attested on-chain."
          />
        </div>
      )}

      {credentials.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <div key={c.id} className="glass rounded-2xl p-5 relative overflow-hidden min-w-0">
              <div className="flex items-center gap-3">
                <div className="glass-strong rounded-xl p-2.5 shrink-0">
                  <Award className="size-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{c.metadata.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Issued {new Date(c.issuedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {c.metadata.description && (
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                  {c.metadata.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-success">
                <ShieldCheck className="size-3" /> {c.proof.type.toUpperCase()} · {c.status}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <BadgeCheck className="size-3.5 text-gold" /> How credentials are earned
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Credentials are issued by third-party attesters — identity providers, DAOs, and protocols.
          Once an issuer attests to your wallet, the credential is indexed by CredLayer and appears
          here automatically.
        </p>
      </div>
    </div>
  );
}
