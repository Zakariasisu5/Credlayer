"use client";

import { Code2, CheckCircle2, Shield, ArrowRight, Copy } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge, Button } from "../ui";
import { StyledCard } from "../shared/common-components";
import { useState } from "react";
import { toast } from "sonner";

export function SdkPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const codeExamples = [
    {
      title: "Installation",
      language: "bash",
      code: `npm install @credlayer/sdk @solana/web3.js`,
    },
    {
      title: "Initialize Client",
      language: "typescript",
      code: `import { CredLayerClient } from '@credlayer/sdk';

// Initialize with default Devnet settings
const credlayer = new CredLayerClient();

// Or override with custom settings
const credlayer = new CredLayerClient(
  'https://api.mainnet-beta.solana.com', // Custom RPC
  'YOUR_CREDENTIAL_PDA',
  'YOUR_SCHEMA_PDA'
);`,
    },
    {
      title: "Fast Verification (Access Control)",
      language: "typescript",
      code: `// Check if wallet meets minimum trust score threshold
const isSafe = await credlayer.isApproved(walletAddress, 800);

if (isSafe) {
  console.log("✅ Access Granted");
  // Grant loan, allow swap, enable feature, etc.
} else {
  console.log("🚫 Access Denied");
  // Block access or request additional verification
}`,
    },
    {
      title: "Fetch Full Score Data",
      language: "typescript",
      code: `// Get complete trust score data for UI display
const scoreData = await credlayer.getScore(walletAddress);

if (!scoreData) {
  console.log("No attestation found");
  return;
}

if (!scoreData.isValid) {
  console.log("⚠️ Score was revoked");
  return;
}

console.log(\`Trust Score: \${scoreData.trustScore}\`); // e.g., 850
console.log(\`Risk Level: \${scoreData.riskLevel}\`);   // e.g., "LOW"`,
    },
    {
      title: "React Component Example",
      language: "typescript",
      code: `import { CredLayerClient } from '@credlayer/sdk';
import { useState, useEffect } from 'react';

function TrustScoreDisplay({ walletAddress }: { walletAddress: string }) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      const client = new CredLayerClient();
      const data = await client.getScore(walletAddress);
      setScore(data?.trustScore ?? null);
      setLoading(false);
    };
    fetchScore();
  }, [walletAddress]);

  if (loading) return <div>Loading...</div>;
  if (!score) return <div>No score found</div>;

  return (
    <div>
      <h3>Trust Score: {score}</h3>
      <p>Status: {score >= 800 ? 'Verified' : 'Below threshold'}</p>
    </div>
  );
}`,
    },
  ];

  return (
    <Shell title="SDK" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 space-y-8">
        {/* Header */}
        <StyledCard>
          <div className="flex items-start justify-between">
            <div>
              <Badge tone="green">TypeScript SDK</Badge>
              <h2 className="mt-5 text-2xl font-semibold">
                Verify trust scores directly from Solana
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                The CredLayer SDK provides typed clients for reading AI-generated trust scores 
                from the Solana blockchain. Query attestations without relying on centralized APIs.
              </p>
            </div>
            <Code2 className="size-8 text-primary" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button href="/developers/docs" variant="outline">
              View full documentation <ArrowRight className="size-4" />
            </Button>
          </div>
        </StyledCard>

        {/* Key Features */}
        <div className="grid gap-5 md:grid-cols-3">
          <StyledCard>
            <Shield className="size-5 text-primary mb-3" />
            <h3 className="font-semibold mb-2">On-Chain Verification</h3>
            <p className="text-sm text-muted-foreground">
              Read trust scores directly from Solana Program Derived Addresses (PDAs) 
              without third-party dependencies.
            </p>
          </StyledCard>

          <StyledCard>
            <CheckCircle2 className="size-5 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Simple Integration</h3>
            <p className="text-sm text-muted-foreground">
              Two methods: <code className="text-xs bg-accent px-1 py-0.5 rounded">getScore()</code> for 
              full data and <code className="text-xs bg-accent px-1 py-0.5 rounded">isApproved()</code> for 
              quick access control.
            </p>
          </StyledCard>

          <StyledCard>
            <Code2 className="size-5 text-primary mb-3" />
            <h3 className="font-semibold mb-2">TypeScript Native</h3>
            <p className="text-sm text-muted-foreground">
              Fully typed interfaces for CredLayerScore with IntelliSense support 
              in VS Code and other editors.
            </p>
          </StyledCard>
        </div>

        {/* Code Examples */}
        <div className="space-y-5">
          <h2 className="text-xl font-semibold">Code Examples</h2>
          
          {codeExamples.map((example, index) => (
            <StyledCard key={index}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{example.title}</h3>
                <button
                  onClick={() => copyToClipboard(example.code, index)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle2 className="size-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-border bg-background/50 p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-muted-foreground whitespace-pre">
                  {example.code}
                </pre>
              </div>
            </StyledCard>
          ))}
        </div>

        {/* API Reference */}
        <StyledCard>
          <h2 className="text-xl font-semibold mb-4 border-b border-primary/20 pb-3">
            API Reference
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <code className="text-sm bg-accent px-2 py-1 rounded">CredLayerClient</code>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Main client class for interacting with on-chain trust scores.
              </p>
              
              <div className="space-y-3 ml-4">
                <div>
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    constructor(rpcUrl?, credentialPdaStr?, schemaPdaStr?)
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Initialize the client. All parameters are optional and default to Devnet settings.
                  </p>
                </div>

                <div>
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    getScore(walletAddress: string | PublicKey): Promise&lt;CredLayerScore | null&gt;
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fetches complete trust score data including trustScore, riskLevel, and isValid flag.
                  </p>
                </div>

                <div>
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    isApproved(walletAddress: string, minimumScore?: number): Promise&lt;boolean&gt;
                  </code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Returns true if score exists, is valid (not revoked), and meets minimumScore (defaults to 800).
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <code className="text-sm bg-accent px-2 py-1 rounded">CredLayerScore</code>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Interface for trust score data returned by getScore().
              </p>
              
              <div className="space-y-2 ml-4">
                <div className="flex items-start gap-2">
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    trustScore: number
                  </code>
                  <span className="text-xs text-muted-foreground">
                    AI-calculated score (300-850 range)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    riskLevel: string
                  </code>
                  <span className="text-xs text-muted-foreground">
                    Categorical risk: "LOW", "MEDIUM", "HIGH"
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <code className="text-xs bg-background border border-border px-2 py-1 rounded">
                    isValid: boolean
                  </code>
                  <span className="text-xs text-muted-foreground">
                    False if attestation was revoked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </StyledCard>

        {/* Use Cases */}
        <StyledCard>
          <h2 className="text-xl font-semibold mb-4 border-b border-primary/20 pb-3">
            Common Use Cases
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="font-medium mb-2">DeFi Protocols</h4>
              <p className="text-sm text-muted-foreground">
                Gate lending pools, adjust interest rates, or require additional collateral 
                based on borrower trust scores.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="font-medium mb-2">NFT Marketplaces</h4>
              <p className="text-sm text-muted-foreground">
                Verify buyer/seller reputation before high-value trades or enable 
                trusted-only marketplace sections.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="font-medium mb-2">Gaming & Social</h4>
              <p className="text-sm text-muted-foreground">
                Prevent sybil attacks, match players with similar reputation levels, 
                or unlock features for verified users.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <h4 className="font-medium mb-2">DAO Governance</h4>
              <p className="text-sm text-muted-foreground">
                Weight voting power by trust score or require minimum reputation 
                thresholds for proposal creation.
              </p>
            </div>
          </div>
        </StyledCard>

        {/* Footer CTA */}
        <StyledCard>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Ready to integrate?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Check out the full documentation and API reference for advanced usage.
            </p>
            <Button href="/developers/docs">
              View documentation <ArrowRight className="size-4" />
            </Button>
          </div>
        </StyledCard>
      </div>
    </Shell>
  );
}
