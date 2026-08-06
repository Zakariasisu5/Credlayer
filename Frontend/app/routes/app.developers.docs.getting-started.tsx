import { createFileRoute } from "@tanstack/react-router";
import { Book, Zap, Key, Code2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/developers/docs/getting-started")({
  component: GettingStartedPage,
});

function GettingStartedPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <Book className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Start building with CredLayer in minutes. This guide will walk you through everything you need
          to integrate wallet reputation and AI-powered risk analysis into your application.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLinkCard
          icon={<Key className="size-5" />}
          title="Get API Key"
          description="Create your first API key"
          to="/app/developers/api-keys"
        />
        <QuickLinkCard
          icon={<Zap className="size-5" />}
          title="Quick Start"
          description="5-minute integration guide"
          to="/app/developers/quickstart"
        />
        <QuickLinkCard
          icon={<Code2 className="size-5" />}
          title="API Reference"
          description="Complete API documentation"
          to="/app/developers/api-reference"
        />
      </div>

      {/* Prerequisites */}
      <Section title="Prerequisites" icon={<CheckCircle2 className="size-5" />}>
        <div className="prose prose-invert max-w-none">
          <p>Before you begin, you'll need:</p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
              <span>A CredLayer account (sign in with your wallet)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
              <span>An API key from the Developer Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
              <span>Basic knowledge of REST APIs and HTTP requests</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
              <span>Node.js 16+ (for SDK integration) or any HTTP client</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Step-by-step Guide */}
      <Section title="Step-by-Step Guide" icon={<Zap className="size-5" />}>
        <div className="space-y-6">
          <StepCard
            number={1}
            title="Create Your Account"
            description="Connect your wallet to create a CredLayer developer account."
          >
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Navigate to the <Link to="/app/developers" className="text-accent hover:underline">Developer Portal</Link></li>
              <li>Click "Connect Wallet" and select your wallet provider</li>
              <li>Sign the authentication message in your wallet</li>
              <li>You're now logged in!</li>
            </ol>
          </StepCard>

          <StepCard
            number={2}
            title="Generate an API Key"
            description="Create an API key to authenticate your requests."
          >
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
              <li>Go to <Link to="/app/developers/api-keys" className="text-accent hover:underline">API Keys</Link></li>
              <li>Click "Create New Key"</li>
              <li>Enter a name (e.g., "Production" or "Development")</li>
              <li>Select the environment (Production/Development/Staging)</li>
              <li>Choose permissions (read-only or full access)</li>
              <li>Copy your API key — you won't see it again!</li>
            </ol>
            <div className="mt-4 p-4 glass rounded-lg border-l-4 border-warn">
              <p className="text-sm text-warn font-medium">⚠️ Important</p>
              <p className="text-sm text-muted-foreground mt-1">
                Store your API key securely. Never commit it to version control or expose it in client-side code.
                Use environment variables to manage your keys.
              </p>
            </div>
          </StepCard>

          <StepCard
            number={3}
            title="Make Your First Request"
            description="Test your integration with a simple API call."
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use cURL or any HTTP client to analyze a wallet:
              </p>
              <CodeBlock
                language="bash"
                code={`curl -X GET 'https://api.credlayer.io/v1/wallets/analyze' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "ethereum"
  }'`}
              />
              <p className="text-sm text-muted-foreground">
                You'll receive a detailed reputation analysis including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Trust score (0-1000)</li>
                <li>• Risk level (Low/Medium/High)</li>
                <li>• Behavioral metrics</li>
                <li>• AI-powered insights</li>
                <li>• Verified credentials</li>
              </ul>
            </div>
          </StepCard>

          <StepCard
            number={4}
            title="Install an SDK (Optional)"
            description="Use our official SDKs for easier integration."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4">
                <h4 className="font-semibold mb-2">JavaScript/TypeScript</h4>
                <CodeBlock
                  language="bash"
                  code="npm install @credlayer/sdk"
                />
                <Link
                  to="/app/developers/sdks/typescript"
                  className="text-sm text-accent hover:underline inline-flex items-center gap-1 mt-2"
                >
                  View TypeScript docs <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="glass rounded-lg p-4">
                <h4 className="font-semibold mb-2">Python</h4>
                <CodeBlock
                  language="bash"
                  code="pip install credlayer"
                />
                <Link
                  to="/app/developers/sdks/python"
                  className="text-sm text-accent hover:underline inline-flex items-center gap-1 mt-2"
                >
                  View Python docs <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </StepCard>

          <StepCard
            number={5}
            title="Integrate into Your App"
            description="Add reputation checks to your application flow."
          >
            <p className="text-sm text-muted-foreground mb-4">
              Common integration patterns:
            </p>
            <div className="space-y-3">
              <IntegrationPattern
                title="DeFi Protocol"
                description="Check wallet reputation before allowing high-value transactions"
              />
              <IntegrationPattern
                title="NFT Marketplace"
                description="Display trust scores next to user profiles"
              />
              <IntegrationPattern
                title="DAO"
                description="Weight voting power by reputation score"
              />
              <IntegrationPattern
                title="AI Agent"
                description="Verify counterparty trustworthiness before executing trades"
              />
            </div>
          </StepCard>
        </div>
      </Section>

      {/* Next Steps */}
      <Section title="Next Steps" icon={<ArrowRight className="size-5" />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <NextStepCard
            title="Authentication"
            description="Learn about API authentication and security best practices"
            to="/app/developers/docs/authentication"
            icon={<Key className="size-5" />}
          />
          <NextStepCard
            title="Wallet Analysis"
            description="Deep dive into wallet analysis endpoints and features"
            to="/app/developers/docs/wallet-analysis"
            icon={<Code2 className="size-5" />}
          />
          <NextStepCard
            title="API Reference"
            description="Complete reference for all API endpoints"
            to="/app/developers/api-reference"
            icon={<Book className="size-5" />}
          />
          <NextStepCard
            title="Best Practices"
            description="Production-ready patterns and optimization tips"
            to="/app/developers/docs/best-practices"
            icon={<Zap className="size-5" />}
          />
        </div>
      </Section>

      {/* Support */}
      <div className="glass-strong rounded-2xl p-6 border-l-4 border-accent">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our team is here to help you get started. Reach out if you have any questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="glass" size="sm">
            <Book className="size-4" />
            Browse Docs
          </Button>
          <Button variant="glass" size="sm">
            <Code2 className="size-4" />
            View Examples
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="text-gold">{icon}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function QuickLinkCard({ icon, title, description, to }: { icon: React.ReactNode; title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="glass rounded-xl p-4 hover:bg-elevated-strong transition-colors border border-transparent hover:border-accent/30 group"
    >
      <div className="text-accent mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

function StepCard({ number, title, description, children }: { number: number; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="glass-strong rounded-xl p-6 border-l-4 border-gold">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <span className="text-gold font-bold">{number}</span>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="glass rounded px-2 py-1 text-xs hover:bg-elevated-strong">
          Copy
        </button>
      </div>
      <pre className="glass-strong rounded-lg p-4 overflow-x-auto text-sm">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}

function IntegrationPattern({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 glass rounded-lg p-3">
      <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function NextStepCard({ title, description, to, icon }: { title: string; description: string; to: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="glass rounded-xl p-5 hover:bg-elevated-strong transition-all border border-transparent hover:border-accent/30 hover:shadow-lg group"
    >
      <div className="text-accent mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex items-center gap-1 text-sm text-accent">
        Read more <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
