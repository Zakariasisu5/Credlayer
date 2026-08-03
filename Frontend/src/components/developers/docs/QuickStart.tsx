import { Zap, CheckCircle2, Terminal, Code2, Key } from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function QuickStart() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <Zap className="size-3.5" />
          Quick Start
        </div>
        <h1 className="text-3xl font-semibold">Get Started in 5 Minutes</h1>
        <p className="text-muted-foreground mt-2">
          Follow this guide to make your first API call and integrate CredLayer reputation
          into your application.
        </p>
      </div>

      {/* Step 1 */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold font-semibold">
            1
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Get Your API Key</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Sign up and generate your API key from the developer dashboard. You'll need this
              to authenticate your requests.
            </p>
            <Button variant="gold" size="sm" asChild>
              <Link to="/app/developers/api-keys">
                <Key className="size-4" />
                Get API Key
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold font-semibold">
            2
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Install the SDK</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred language and install the CredLayer SDK:
            </p>
            <div className="space-y-3">
              <CodeBlock
                language="bash"
                code="npm install @credlayer/sdk"
                label="JavaScript / TypeScript"
              />
              <CodeBlock
                language="bash"
                code="pip install credlayer"
                label="Python"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold font-semibold">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Make Your First Request</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Initialize the client and fetch wallet reputation:
            </p>
            <CodeBlock
              language="javascript"
              code={`import { CredLayer } from '@credlayer/sdk';

// Initialize client with your API key
const client = new CredLayer({
  apiKey: process.env.CREDLAYER_API_KEY
});

// Get wallet reputation
const reputation = await client.wallets.get(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
);

console.log(\`Score: \${reputation.score}/1000\`);
console.log(\`Tier: \${reputation.tier}\`);
console.log(\`Risk: \${reputation.risk}\`);`}
            />
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold font-semibold">
            4
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Handle the Response</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The API returns comprehensive reputation data:
            </p>
            <CodeBlock
              language="json"
              code={`{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "score": 892,
  "tier": "Excellent",
  "risk": "Low",
  "trust": 94,
  "age_years": 3.2,
  "chains": 6,
  "credentials": ["Gitcoin Passport", "ENS Domain"]
}`}
            />
          </div>
        </div>
      </div>

      {/* What You've Built */}
      <div className="glass rounded-xl p-4 sm:p-6 bg-success/5 border-success/20">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-6 text-success shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">You're All Set!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've successfully integrated CredLayer reputation into your application.
              You can now:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Query wallet reputation scores
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Analyze on-chain behavior
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Verify credentials
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                Detect fraud patterns with AI
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/app/developers/api-reference"
            className="glass rounded-xl p-5 hover:bg-elevated] transition-colors"
          >
            <Code2 className="size-5 text-gold mb-2" />
            <h3 className="font-semibold mb-1">Wallet Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Learn advanced wallet analysis techniques
            </p>
          </Link>
          <Link
            to="/app/developers/webhooks"
            className="glass rounded-xl p-5 hover:bg-elevated] transition-colors"
          >
            <Terminal className="size-5 text-gold mb-2" />
            <h3 className="font-semibold mb-1">Set Up Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Get real-time reputation updates
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
