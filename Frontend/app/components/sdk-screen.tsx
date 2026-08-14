"use client";

import { ArrowRight, Code2, Copy, ShieldCheck, Terminal } from "lucide-react";
import { Badge, Button, Card } from "./credlayer-app";
import { useState } from "react";

function CodeBlock({ code, language = "typescript" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 overflow-hidden rounded-lg border border-border bg-[#0a192f]">
      <div className="flex items-center justify-between border-b border-border/50 bg-[#061426] px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Copy code"
        >
          {copied ? <ShieldCheck className="size-4 text-green-500" /> : <Copy className="size-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function SdkScreen() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <Badge tone="green">@credlayer/sdk</Badge>
            <h2 className="mt-5 text-3xl font-semibold">TypeScript SDK</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              The official client SDK for verifying CredLayer Trust Scores directly from the Solana blockchain.
              This package allows decentralized applications (dApps), mobile frontends, and backend services to read and validate AI-generated trust scores without relying on centralized APIs.
            </p>
          </div>
          <Button href="https://github.com/Zakariasisu5/Credlayer/tree/main/blockchain/sdk" variant="outline">
            View Source <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <Terminal className="size-5 text-primary" />
              <h3 className="text-xl font-semibold">Installation</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Since this package is currently in active local development, you will install it in your frontend project using a relative path or <code className="bg-muted px-1 py-0.5 rounded">npm link</code>.
            </p>
            <CodeBlock 
              language="bash"
              code={`# 1. Install the local SDK\nnpm install ../path/to/Credlayer/blockchain/sdk\n\n# 2. Install Solana Web3 dependency\nnpm install @solana/web3.js`}
            />
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <h3 className="text-xl font-semibold">Quickstart & Features</h3>
            </div>
            
            <div className="mt-6 space-y-8">
              <div>
                <h4 className="text-lg font-medium text-foreground">1. Initialize the Client</h4>
                <p className="mt-2 text-sm text-muted-foreground">The client comes pre-configured with CredLayer's default Solana Devnet RPC and standard Program Derived Addresses (PDAs).</p>
                <CodeBlock 
                  code={`import { CredLayerClient } from '@credlayer/sdk';\n\n// Initialize with default Devnet settings\nconst credlayer = new CredLayerClient();`}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-foreground">2. Fast Verification (Gatekeeping)</h4>
                <p className="mt-2 text-sm text-muted-foreground">If protocol just needs a simple boolean (Yes/No) to allow or block a user based on a minimum Trust Score threshold:</p>
                <CodeBlock 
                  code={`const verifyUser = async (walletAddress: string) => {\n    // Check if the wallet has a valid, unrevoked score of 800 or higher\n    const isSafe = await credlayer.isApproved(walletAddress, 800);\n\n    if (isSafe) {\n        console.log("✅ Access Granted: User meets protocol security requirements.");\n        // Grant loan, allow swap, etc.\n    } else {\n        console.log("🚫 Access Denied: Trust Score too low or missing.");\n    }\n};`}
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-foreground">3. Fetch Full Score Data</h4>
                <p className="mt-2 text-sm text-muted-foreground">If building the UI dashboard and need to display the exact data payload:</p>
                <CodeBlock 
                  code={`const displayUserScore = async (walletAddress: string) => {\n    const scoreData = await credlayer.getScore(walletAddress);\n\n    if (!scoreData) {\n        console.log("Wallet has no CredLayer attestation on-chain.");\n        return;\n    }\n\n    if (!scoreData.isValid) {\n        console.log("⚠️ WARNING: This wallet's trust score was REVOKED.");\n        return;\n    }\n\n    console.log(\`Trust Score: \${scoreData.trustScore}\`); // e.g., 850\n    console.log(\`Risk Level: \${scoreData.riskLevel}\`);   // e.g., "LOW"\n};`}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#040d1a]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">API Reference</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-mono text-sm text-primary">CredLayerClient</h4>
                <ul className="mt-2 space-y-3 text-xs text-muted-foreground">
                  <li>
                    <code className="text-foreground bg-white/5 px-1 py-0.5 rounded break-all block mb-1">constructor(rpcUrl?, credentialPdaStr?, schemaPdaStr?)</code>
                    Optionally override the default network settings.
                  </li>
                  <li>
                    <code className="text-foreground bg-white/5 px-1 py-0.5 rounded break-all block mb-1">getScore(walletAddress)</code>
                    Derives PDA and fetches raw account data from Solana RPC. Returns Promise&lt;CredLayerScore | null&gt;.
                  </li>
                  <li>
                    <code className="text-foreground bg-white/5 px-1 py-0.5 rounded break-all block mb-1">isApproved(walletAddress, minScore?)</code>
                    Returns true if score exists, is valid (not revoked), and meets the minimumScore.
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border/50">
                <h4 className="font-mono text-sm text-primary">CredLayerScore</h4>
                <div className="mt-2 rounded bg-black/40 p-3 font-mono text-xs text-slate-300">
                  <span className="text-blue-400">interface</span> CredLayerScore {'{\n'}
                  {'  '}trustScore: <span className="text-green-400">number</span>;{'\n'}
                  {'  '}riskLevel: <span className="text-green-400">string</span>;{'\n'}
                  {'  '}isValid: <span className="text-green-400">boolean</span>;{'\n'}
                  {'}'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
