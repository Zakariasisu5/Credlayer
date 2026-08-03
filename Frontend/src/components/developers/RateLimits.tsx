import { Zap, Clock, TrendingUp, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";

const RATE_LIMIT_TIERS = [
  {
    name: "Free",
    price: "$0/month",
    limits: {
      perMinute: 20,
      burst: 5,
      monthly: 10000,
    },
    features: [
      "Basic wallet reputation",
      "Standard endpoints",
      "Email support",
    ],
  },
  {
    name: "Starter",
    price: "$49/month",
    limits: {
      perMinute: 100,
      burst: 20,
      monthly: 100000,
    },
    features: [
      "All Free features",
      "AI analysis endpoints",
      "Webhook support",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$199/month",
    limits: {
      perMinute: 500,
      burst: 100,
      monthly: 1000000,
    },
    features: [
      "All Starter features",
      "Advanced analytics",
      "Custom rate limits",
      "24/7 support",
      "SLA guarantee",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    limits: {
      perMinute: "Custom",
      burst: "Custom",
      monthly: "Unlimited",
    },
    features: [
      "All Pro features",
      "Dedicated infrastructure",
      "Custom integrations",
      "Account manager",
      "On-premise options",
    ],
  },
];

export function RateLimits() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <Zap className="size-3.5" />
          Rate Limits
        </div>
        <h1 className="text-3xl font-semibold">API Rate Limits</h1>
        <p className="text-muted-foreground mt-2">
          Understand rate limits, quotas, and best practices for optimizing your API usage.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={Clock}
          title="Per Minute"
          value="100"
          description="Requests per minute"
          color="text-gold"
        />
        <InfoCard
          icon={TrendingUp}
          title="Burst Limit"
          value="20"
          description="Concurrent requests"
          color="text-accent"
        />
        <InfoCard
          icon={Shield}
          title="Monthly Quota"
          value="100K"
          description="Total requests/month"
          color="text-success"
        />
      </div>

      {/* How Rate Limiting Works */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">How Rate Limiting Works</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            CredLayer uses a <strong className="text-foreground">token bucket algorithm</strong> to
            enforce rate limits. Each API key has a bucket that refills at a constant rate.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Per-minute limit:</strong> Maximum requests in
                any 60-second window
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Burst limit:</strong> Maximum concurrent
                requests at any instant
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Monthly quota:</strong> Total requests per
                billing cycle
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Rate Limit Headers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Response Headers</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Every API response includes rate limit headers:
        </p>
        <div className="glass rounded-xl overflow-hidden">
          <div className="divide-y divide-white/[0.06]">
            <HeaderRow
              name="X-RateLimit-Limit"
              description="Maximum requests allowed per minute"
              example="100"
            />
            <HeaderRow
              name="X-RateLimit-Remaining"
              description="Requests remaining in current window"
              example="73"
            />
            <HeaderRow
              name="X-RateLimit-Reset"
              description="Unix timestamp when limit resets"
              example="1705320600"
            />
            <HeaderRow
              name="Retry-After"
              description="Seconds to wait before retrying (429 only)"
              example="45"
            />
          </div>
        </div>
      </div>

      {/* Handling Rate Limits */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Handling Rate Limits</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Implement exponential backoff when you receive a 429 status:
        </p>
        <CodeBlock
          language="javascript"
          code={`async function makeRequestWithRetry(fn, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fn();
      return response;
    } catch (error) {
      if (error.status === 429) {
        attempt++;
        
        // Use Retry-After header if available
        const retryAfter = error.headers['retry-after'] || 
                          Math.pow(2, attempt) * 1000;
        
        console.log(\`Rate limited. Retrying in \${retryAfter}ms...\`);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Usage
const reputation = await makeRequestWithRetry(() =>
  client.wallets.get(address)
);`}
        />
      </div>

      {/* Pricing Tiers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Rate Limit Tiers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {RATE_LIMIT_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`
                glass rounded-xl p-4 sm:p-6 transition-all
                ${tier.highlighted ? "ring-2 ring-gold" : ""}
              `}
            >
              {tier.highlighted && (
                <div className="text-xs uppercase tracking-wider text-gold mb-2">
                  Most Popular
                </div>
              )}
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <div className="text-2xl font-semibold text-gold">{tier.price}</div>
              </div>
              <div className="space-y-2 mb-4">
                <LimitRow label="Per Minute" value={tier.limits.perMinute} />
                <LimitRow label="Burst" value={tier.limits.burst} />
                <LimitRow label="Monthly" value={tier.limits.monthly} />
              </div>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-3">
          <BestPractice
            title="Cache responses"
            description="Wallet reputation doesn't change frequently. Cache for 5-15 minutes to reduce API calls."
          />
          <BestPractice
            title="Monitor rate limit headers"
            description="Check X-RateLimit-Remaining to prevent hitting limits."
          />
          <BestPractice
            title="Implement exponential backoff"
            description="Wait increasingly longer between retries (1s, 2s, 4s, 8s)."
          />
          <BestPractice
            title="Use batch endpoints"
            description="Analyze multiple wallets in one request instead of many individual calls."
          />
          <BestPractice
            title="Respect Retry-After"
            description="Always honor the Retry-After header value when you get a 429."
          />
          <BestPractice
            title="Use webhooks"
            description="Subscribe to events instead of polling for changes."
          />
        </ul>
      </div>

      {/* Monitoring */}
      <div className="glass rounded-xl p-4 sm:p-6 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-6 text-accent shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Monitor Your Usage</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Track your API usage in real-time on the{" "}
              <a href="/app/developers/dashboard" className="text-accent hover:brightness-110">
                Developer Dashboard
              </a>
              . Set up alerts to notify you when approaching rate limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <Icon className={`size-6 ${color} mb-3`} />
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className={`text-3xl font-semibold ${color} mb-1`}>{value}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

function HeaderRow({
  name,
  description,
  example,
}: {
  name: string;
  description: string;
  example: string;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1">
        <code className="text-sm font-mono text-gold">{name}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <code className="text-sm font-mono text-muted-foreground">{example}</code>
    </div>
  );
}

function LimitRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}

function BestPractice({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-3">
      <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </li>
  );
}
