import { createFileRoute } from "@tanstack/react-router";
import { Zap, Shield, TrendingUp, Code2, CheckCircle2, AlertTriangle, Lock, Activity } from "lucide-react";

export const Route = createFileRoute("/app/developers/docs/best-practices")({
  component: BestPracticesPage,
});

function BestPracticesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <Zap className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Best Practices</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Production-ready patterns, security guidelines, and optimization tips for building robust
          applications with CredLayer's reputation API.
        </p>
      </div>

      {/* Security */}
      <Section title="Security Best Practices" icon={<Shield className="size-5" />}>
        <div className="space-y-4">
          <BestPracticeCard
            title="Never Expose API Keys Client-Side"
            severity="critical"
            description="API keys should only be used in server-side code. Never include them in frontend JavaScript, mobile apps, or version control."
            dos={[
              "Store keys in environment variables",
              "Use server-side proxies for API calls",
              "Implement key rotation schedules",
              "Monitor API key usage for anomalies"
            ]}
            donts={[
              "Commit keys to Git repositories",
              "Hardcode keys in source code",
              "Share keys via email or chat",
              "Use production keys in development"
            ]}
          />

          <BestPracticeCard
            title="Implement Rate Limit Handling"
            severity="high"
            description="Properly handle rate limit responses to avoid service disruption and ensure fair API usage."
            dos={[
              "Respect Retry-After headers",
              "Implement exponential backoff",
              "Cache responses when appropriate",
              "Monitor your rate limit usage"
            ]}
            donts={[
              "Retry immediately after 429 errors",
              "Make unnecessary duplicate requests",
              "Ignore rate limit warnings",
              "Overwhelm the API with requests"
            ]}
          />

          <BestPracticeCard
            title="Validate Input Data"
            severity="high"
            description="Always validate wallet addresses and chain parameters before making API calls."
            dos={[
              "Verify address format matches chain",
              "Sanitize user input",
              "Handle invalid addresses gracefully",
              "Log validation failures"
            ]}
            donts={[
              "Trust user input blindly",
              "Skip address format validation",
              "Expose validation errors to users",
              "Make API calls with invalid data"
            ]}
          />
        </div>
      </Section>

      {/* Performance */}
      <Section title="Performance Optimization" icon={<TrendingUp className="size-5" />}>
        <div className="space-y-4">
          <OptimizationCard
            title="Cache Reputation Data"
            impact="high"
            description="Reputation scores don't change constantly. Implement caching to reduce API calls and improve response times."
          >
            <CodeExample
              language="typescript"
              code={`// Cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getReputation(address: string) {
  const cached = cache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await credlayer.wallets.analyze({ address, chain: 'ethereum' });
  cache.set(address, { data, timestamp: Date.now() });
  return data;
}`}
            />
          </OptimizationCard>

          <OptimizationCard
            title="Batch Requests When Possible"
            impact="medium"
            description="When analyzing multiple wallets, batch requests to reduce overhead and improve throughput."
          >
            <CodeExample
              language="typescript"
              code={`// Batch wallet analysis
const addresses = ['0xaaa...', '0xbbb...', '0xccc...'];

// Good: Batch request
const results = await credlayer.wallets.batchAnalyze({
  addresses,
  chain: 'ethereum'
});

// Avoid: Sequential individual requests
// const results = await Promise.all(
//   addresses.map(addr => credlayer.wallets.analyze({address: addr}))
// );`}
            />
          </OptimizationCard>

          <OptimizationCard
            title="Use Webhooks for Real-time Updates"
            impact="high"
            description="Instead of polling for changes, use webhooks to receive updates when wallet reputation changes."
          >
            <CodeExample
              language="typescript"
              code={`// Register webhook for reputation changes
await credlayer.webhooks.create({
  url: 'https://yourapp.com/webhooks/reputation-update',
  events: ['wallet.reputation.updated'],
  filters: {
    minScoreChange: 50 // Only notify for significant changes
  }
});`}
            />
          </OptimizationCard>
        </div>
      </Section>

      {/* Error Handling */}
      <Section title="Error Handling" icon={<AlertTriangle className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Robust Error Handling Pattern</h3>
          <CodeExample
            language="typescript"
            code={`async function analyzeWallet(address: string) {
  try {
    const result = await credlayer.wallets.analyze({
      address,
      chain: 'ethereum'
    });
    return { success: true, data: result };
    
  } catch (error) {
    // Handle specific error types
    if (error.statusCode === 401) {
      // Invalid API key - log and alert
      logger.error('Invalid API key');
      await alertTeam('API key invalid or expired');
      return { success: false, error: 'authentication_failed' };
    }
    
    if (error.statusCode === 429) {
      // Rate limited - wait and retry
      const retryAfter = error.retryAfter || 60;
      await sleep(retryAfter * 1000);
      return analyzeWallet(address); // Retry once
    }
    
    if (error.statusCode === 400) {
      // Invalid input - don't retry
      logger.warn('Invalid wallet address', { address });
      return { success: false, error: 'invalid_input' };
    }
    
    if (error.statusCode >= 500) {
      // Server error - retry with exponential backoff
      return retryWithBackoff(() => analyzeWallet(address));
    }
    
    // Unknown error
    logger.error('Unexpected error', error);
    return { success: false, error: 'unknown_error' };
  }
}`}
          />
        </div>
      </Section>

      {/* Integration Patterns */}
      <Section title="Integration Patterns" icon={<Code2 className="size-5" />}>
        <div className="space-y-4">
          <PatternCard
            title="Pre-Transaction Verification"
            description="Check wallet reputation before processing high-value transactions"
            useCase="DeFi protocols, DEX aggregators"
          >
            <CodeExample
              language="typescript"
              code={`// Verify before processing transaction
async function processTransaction(from: string, to: string, amount: number) {
  // Check sender reputation
  const senderRep = await getReputation(from);
  
  if (amount > 10000) {
    // High value: require excellent reputation
    if (senderRep.score < 800 || senderRep.risk !== 'Low') {
      return { approved: false, reason: 'insufficient_reputation' };
    }
  } else if (amount > 1000) {
    // Medium value: require good reputation
    if (senderRep.score < 600) {
      return { approved: false, reason: 'low_reputation' };
    }
  }
  
  return await executeTransaction(from, to, amount);
}`}
            />
          </PatternCard>

          <PatternCard
            title="Progressive Trust"
            description="Gradually increase permissions as reputation improves"
            useCase="DAOs, social platforms, lending protocols"
          >
            <CodeExample
              language="typescript"
              code={`function getPermissions(reputation: ReputationData) {
  const permissions = {
    canVote: false,
    canPropose: false,
    votingWeight: 1,
    maxBorrowAmount: 0
  };
  
  if (reputation.score >= 400) {
    permissions.canVote = true;
  }
  
  if (reputation.score >= 700) {
    permissions.canPropose = true;
    permissions.votingWeight = 2;
  }
  
  if (reputation.score >= 850) {
    permissions.votingWeight = 3;
    permissions.maxBorrowAmount = 100000;
  }
  
  return permissions;
}`}
            />
          </PatternCard>

          <PatternCard
            title="Risk-Based Rate Limiting"
            description="Apply different rate limits based on wallet reputation"
            useCase="APIs, trading platforms, faucets"
          >
            <CodeExample
              language="typescript"
              code={`function getRateLimit(reputation: ReputationData): number {
  // Returns requests per hour
  if (reputation.score >= 900) return 10000;
  if (reputation.score >= 750) return 5000;
  if (reputation.score >= 600) return 2000;
  if (reputation.score >= 400) return 500;
  return 100; // Conservative limit for new/low reputation
}

async function checkRateLimit(address: string): Promise<boolean> {
  const reputation = await getReputation(address);
  const limit = getRateLimit(reputation);
  const currentUsage = await redis.get(\`ratelimit:\${address}\`);
  
  return currentUsage < limit;
}`}
            />
          </PatternCard>
        </div>
      </Section>

      {/* Monitoring */}
      <Section title="Monitoring & Observability" icon={<Activity className="size-5" />}>
        <div className="grid sm:grid-cols-2 gap-4">
          <MonitoringCard
            title="Track API Usage"
            metrics={[
              "Request volume and patterns",
              "Error rates by type",
              "Response time percentiles",
              "Rate limit approaching warnings"
            ]}
          />
          <MonitoringCard
            title="Monitor Reputation Trends"
            metrics={[
              "Average user reputation scores",
              "Distribution across tiers",
              "Risk level trends",
              "Flagged wallet frequencies"
            ]}
          />
          <MonitoringCard
            title="Set Up Alerts"
            metrics={[
              "API key usage spikes",
              "High error rates",
              "Rate limit violations",
              "Unusual reputation patterns"
            ]}
          />
          <MonitoringCard
            title="Log Important Events"
            metrics={[
              "High-risk wallet interactions",
              "Reputation threshold changes",
              "API authentication failures",
              "Integration errors"
            ]}
          />
        </div>
      </Section>

      {/* Testing */}
      <Section title="Testing Strategies" icon={<CheckCircle2 className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Development & Testing</h3>
          <div className="space-y-4">
            <div className="glass rounded-lg p-4">
              <p className="font-semibold mb-2">Use Test Mode</p>
              <p className="text-sm text-muted-foreground mb-3">
                Development API keys return consistent, deterministic results for testing.
              </p>
              <CodeExample
                language="typescript"
                code={`const client = new CredLayer({
  apiKey: process.env.CREDLAYER_DEV_KEY,
  environment: 'development' // Test mode
});`}
              />
            </div>

            <div className="glass rounded-lg p-4">
              <p className="font-semibold mb-2">Mock Responses in Tests</p>
              <p className="text-sm text-muted-foreground mb-3">
                Mock CredLayer responses in your unit tests to avoid API calls.
              </p>
              <CodeExample
                language="typescript"
                code={`// Mock in tests
jest.mock('@credlayer/sdk');

const mockAnalyze = jest.fn().mockResolvedValue({
  score: 850,
  tier: 'Excellent',
  risk: 'Low'
});

credlayer.wallets.analyze = mockAnalyze;`}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Summary */}
      <div className="glass-strong rounded-2xl p-6 border-l-4 border-success">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="size-5 text-success" />
          Quick Reference
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-medium mb-2">Security ✓</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Server-side API keys only</li>
              <li>• Environment variables</li>
              <li>• Regular key rotation</li>
              <li>• Input validation</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Performance ✓</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Cache responses (5-15 min TTL)</li>
              <li>• Batch requests when possible</li>
              <li>• Use webhooks over polling</li>
              <li>• Implement rate limit handling</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Error Handling ✓</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Handle all status codes</li>
              <li>• Exponential backoff</li>
              <li>• Graceful degradation</li>
              <li>• Comprehensive logging</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Monitoring ✓</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Track API usage</li>
              <li>• Monitor error rates</li>
              <li>• Set up alerts</li>
              <li>• Log critical events</li>
            </ul>
          </div>
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

function BestPracticeCard({
  title,
  severity,
  description,
  dos,
  donts
}: {
  title: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
  dos: string[];
  donts: string[];
}) {
  const severityColors = {
    critical: "border-danger",
    high: "border-warn",
    medium: "border-azure"
  }[severity];

  const severityBadge = {
    critical: "bg-danger/20 text-danger",
    high: "bg-warn/20 text-warn",
    medium: "bg-azure/20 text-azure"
  }[severity];

  return (
    <div className={`glass-strong rounded-lg p-6 border-l-4 ${severityColors}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded uppercase ${severityBadge}`}>
          {severity}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-lg p-4">
          <p className="text-sm font-semibold text-success mb-2">✓ Do</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {dos.map((item, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-sm font-semibold text-danger mb-2">✗ Don't</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {donts.map((item, i) => (
              <li key={i} className="flex gap-2">
                <AlertTriangle className="size-4 text-danger shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function OptimizationCard({ title, impact, description, children }: {
  title: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  children: React.ReactNode;
}) {
  const impactColors = {
    high: "text-success",
    medium: "text-warn",
    low: "text-muted-foreground"
  }[impact];

  return (
    <div className="glass-strong rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-xs ${impactColors} uppercase font-semibold`}>
          {impact} impact
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}

function PatternCard({ title, description, useCase, children }: {
  title: string;
  description: string;
  useCase: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-strong rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="inline-flex items-center gap-2 text-xs text-accent glass px-3 py-1 rounded">
          <Zap className="size-3" />
          <span>Use case: {useCase}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function MonitoringCard({ title, metrics }: { title: string; metrics: string[] }) {
  return (
    <div className="glass-strong rounded-lg p-5">
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {metrics.map((metric, i) => (
          <li key={i} className="flex gap-2">
            <Activity className="size-4 text-accent shrink-0 mt-0.5" />
            <span>{metric}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeExample({ language, code }: { language: string; code: string }) {
  return (
    <div className="mt-3">
      <pre className="glass rounded p-4 overflow-x-auto text-sm">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
