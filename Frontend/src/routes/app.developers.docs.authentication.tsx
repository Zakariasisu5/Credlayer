import { createFileRoute } from "@tanstack/react-router";
import { Key, Shield, Lock, AlertTriangle, CheckCircle2, Code2, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/developers/docs/authentication")({
  component: AuthenticationPage,
});

function AuthenticationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <Key className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Authentication</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Learn how to authenticate your API requests with CredLayer using API keys, manage tokens,
          and implement secure authentication patterns in your applications.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview" icon={<Shield className="size-5" />}>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">
            CredLayer uses API key authentication for all API requests. Each request must include a valid API key
            in the Authorization header. API keys are associated with your account and carry your permissions and rate limits.
          </p>
        </div>
      </Section>

      {/* API Keys */}
      <Section title="API Keys" icon={<Key className="size-5" />}>
        <div className="space-y-4">
          <div className="glass-strong rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Creating an API Key</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-mono text-gold shrink-0">1.</span>
                <span>Navigate to the <Link to="/app/developers/api-keys" className="text-accent hover:underline">API Keys</Link> page in the Developer Portal</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-gold shrink-0">2.</span>
                <span>Click "Create New Key" and enter a descriptive name</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-gold shrink-0">3.</span>
                <span>Select the environment (Production, Development, or Staging)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-gold shrink-0">4.</span>
                <span>Choose permissions: read-only or full access</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-gold shrink-0">5.</span>
                <span>Copy the generated API key immediately — it will only be shown once</span>
              </li>
            </ol>
          </div>

          <div className="glass rounded-lg p-5 border-l-4 border-warn">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-warn shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-warn">Security Best Practices</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Never commit API keys to version control</li>
                  <li>• Store keys in environment variables</li>
                  <li>• Use different keys for development and production</li>
                  <li>• Rotate keys periodically</li>
                  <li>• Revoke keys immediately if compromised</li>
                  <li>• Never expose keys in client-side code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Making Authenticated Requests */}
      <Section title="Making Authenticated Requests" icon={<Lock className="size-5" />}>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Include your API key in the <code className="glass px-2 py-1 rounded text-sm font-mono">Authorization</code> header
            using the Bearer scheme:
          </p>

          <CodeBlock
            title="cURL Example"
            language="bash"
            code={`curl -X GET 'https://api.credlayer.io/v1/wallets/analyze' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "ethereum"
  }'`}
          />

          <CodeBlock
            title="JavaScript/TypeScript Example"
            language="typescript"
            code={`import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({
  apiKey: process.env.CREDLAYER_API_KEY,
  environment: 'production'
});

// All requests are automatically authenticated
const reputation = await client.wallets.analyze({
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chain: 'ethereum'
});`}
          />

          <CodeBlock
            title="Python Example"
            language="python"
            code={`from credlayer import CredLayer

client = CredLayer(
    api_key=os.environ['CREDLAYER_API_KEY'],
    environment='production'
)

# All requests are automatically authenticated
reputation = client.wallets.analyze(
    address='0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    chain='ethereum'
)`}
          />
        </div>
      </Section>

      {/* Token Types */}
      <Section title="Token Types & Permissions" icon={<Shield className="size-5" />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-strong rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <h3 className="font-semibold">Read-Only Keys</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Can only read data from the API. Ideal for analytics dashboards and public-facing integrations.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-success" />
                <span>GET /wallets/analyze</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-success" />
                <span>GET /credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-success" />
                <span>GET /reputation</span>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <Key className="size-4 text-gold" />
              </div>
              <h3 className="font-semibold">Full Access Keys</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Can read and write data. Required for creating credentials, updating webhooks, and managing resources.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-gold" />
                <span>All read operations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-gold" />
                <span>POST /credentials/issue</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-gold" />
                <span>POST /webhooks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3 text-gold" />
                <span>DELETE /webhooks/:id</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Error Handling */}
      <Section title="Authentication Errors" icon={<AlertTriangle className="size-5" />}>
        <div className="space-y-3">
          <ErrorCard
            code="401"
            title="Unauthorized"
            description="Missing or invalid API key"
            example={{
              error: "unauthorized",
              message: "Invalid API key provided"
            }}
          />
          <ErrorCard
            code="403"
            title="Forbidden"
            description="Valid API key but insufficient permissions"
            example={{
              error: "forbidden",
              message: "This API key does not have permission to perform this action"
            }}
          />
          <ErrorCard
            code="429"
            title="Rate Limit Exceeded"
            description="Too many requests from this API key"
            example={{
              error: "rate_limit_exceeded",
              message: "Rate limit exceeded. Try again in 60 seconds",
              retry_after: 60
            }}
          />
        </div>
      </Section>

      {/* Token Rotation */}
      <Section title="API Key Rotation" icon={<RefreshCw className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Best Practice: Regular Key Rotation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Regularly rotating your API keys reduces the risk of unauthorized access. We recommend rotating keys:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground mb-4">
            <li className="flex gap-2">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <span>Every 90 days as a security best practice</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <span>Immediately if a key is compromised</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <span>When team members with access leave</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
              <span>After a security incident</span>
            </li>
          </ul>

          <div className="glass rounded-lg p-4 mt-4">
            <p className="text-sm font-medium mb-2">Zero-Downtime Rotation</p>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. Create a new API key</li>
              <li>2. Update your applications to use the new key</li>
              <li>3. Monitor for 24-48 hours to ensure all services are using the new key</li>
              <li>4. Revoke the old API key</li>
            </ol>
          </div>
        </div>
      </Section>

      {/* Environment Variables */}
      <Section title="Environment Variables" icon={<Code2 className="size-5" />}>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Store your API keys in environment variables to keep them secure and make key rotation easier.
          </p>

          <CodeBlock
            title=".env (Development)"
            language="bash"
            code={`# CredLayer API Configuration
CREDLAYER_API_KEY=sk_dev_1234567890abcdef
CREDLAYER_ENVIRONMENT=development`}
          />

          <CodeBlock
            title=".env.production"
            language="bash"
            code={`# CredLayer API Configuration
CREDLAYER_API_KEY=sk_prod_abcdef1234567890
CREDLAYER_ENVIRONMENT=production`}
          />

          <div className="glass rounded-lg p-4 border-l-4 border-warn">
            <p className="font-semibold text-warn text-sm mb-1">⚠️ Remember</p>
            <p className="text-sm text-muted-foreground">
              Add <code className="glass px-1.5 py-0.5 rounded font-mono">.env</code> to your{" "}
              <code className="glass px-1.5 py-0.5 rounded font-mono">.gitignore</code> file to prevent
              committing sensitive credentials to version control.
            </p>
          </div>
        </div>
      </Section>

      {/* Next Steps */}
      <div className="glass-strong rounded-2xl p-6 border-l-4 border-accent">
        <h3 className="text-lg font-semibold mb-2">Next: Start Analyzing Wallets</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Now that you understand authentication, learn how to use the Wallet Analysis API to get reputation scores and insights.
        </p>
        <Link to="/app/developers/docs/wallet-analysis">
          <button className="glass rounded-lg px-4 py-2 text-sm font-medium hover:bg-elevated-strong transition-colors">
            Wallet Analysis Documentation →
          </button>
        </Link>
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

function CodeBlock({ title, language, code }: { title?: string; language: string; code: string }) {
  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}
      <div className="relative group">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button className="glass rounded px-2 py-1 text-xs hover:bg-elevated-strong">
            Copy
          </button>
        </div>
        <pre className="glass-strong rounded-lg p-4 overflow-x-auto text-sm">
          <code className="font-mono text-foreground whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ErrorCard({ code, title, description, example }: { code: string; title: string; description: string; example: object }) {
  return (
    <div className="glass-strong rounded-lg p-5">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-lg bg-danger/20 flex items-center justify-center shrink-0">
          <span className="text-danger font-mono font-bold text-sm">{code}</span>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <pre className="glass rounded p-3 text-xs overflow-x-auto">
            <code className="font-mono text-danger">{JSON.stringify(example, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
