import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Award, Clock, Activity } from "lucide-react";

export const Route = createFileRoute("/app/developers/docs/reputation")({
  component: ReputationEnginePage,
});

function ReputationEnginePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <BarChart3 className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Reputation Engine</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Understand how CredLayer's AI-powered reputation engine calculates trust scores, evaluates
          on-chain behavior, and provides actionable insights for your applications.
        </p>
      </div>

      {/* Overview */}
      <Section title="How It Works" icon={<TrendingUp className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <p className="text-muted-foreground mb-4">
            The CredLayer reputation engine combines multiple data sources and machine learning models
            to generate comprehensive wallet reputation scores. Our system analyzes:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Clock className="size-5" />}
              title="Temporal Analysis"
              description="Wallet age, activity consistency, and historical patterns over time"
            />
            <FeatureCard
              icon={<Activity className="size-5" />}
              title="Behavioral Patterns"
              description="Transaction frequency, volume patterns, and interaction diversity"
            />
            <FeatureCard
              icon={<Users className="size-5" />}
              title="Social Signals"
              description="Verified credentials, attestations, and on-chain identity markers"
            />
            <FeatureCard
              icon={<Award className="size-5" />}
              title="Protocol Engagement"
              description="DeFi participation, governance activity, and ecosystem contribution"
            />
          </div>
        </div>
      </Section>

      {/* Scoring Algorithm */}
      <Section title="Scoring Algorithm" icon={<BarChart3 className="size-5" />}>
        <div className="space-y-4">
          <div className="glass-strong rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Score Components</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reputation scores (0-1000) are calculated using weighted factors across multiple dimensions:
            </p>
            <div className="space-y-3">
              <ScoreComponent
                name="Wallet Age & History"
                weight="25%"
                description="Time since first transaction, consistency of activity"
              />
              <ScoreComponent
                name="Transaction Quality"
                weight="20%"
                description="Volume, diversity, and legitimacy of transactions"
              />
              <ScoreComponent
                name="Protocol Interactions"
                weight="20%"
                description="Engagement with established DeFi protocols and dApps"
              />
              <ScoreComponent
                name="Credential Verification"
                weight="15%"
                description="Verified attestations, ENS names, social proofs"
              />
              <ScoreComponent
                name="Network Effects"
                weight="10%"
                description="Multi-chain presence and cross-protocol activity"
              />
              <ScoreComponent
                name="Risk Signals"
                weight="10%"
                description="Absence of suspicious patterns or blacklist flags"
              />
            </div>
          </div>

          <div className="glass rounded-lg p-5 border-l-4 border-accent">
            <p className="font-semibold mb-2">Dynamic Weighting</p>
            <p className="text-sm text-muted-foreground">
              Component weights adjust based on available data quality and chain-specific characteristics.
              For example, newer chains may place higher weight on credential verification.
            </p>
          </div>
        </div>
      </Section>

      {/* Reputation Tiers */}
      <Section title="Reputation Tiers" icon={<Award className="size-5" />}>
        <div className="space-y-3">
          <TierCard
            tier="Excellent"
            range="900-1000"
            color="success"
            characteristics={[
              "3+ years of consistent activity",
              "High-value, diverse transactions",
              "Multiple verified credentials",
              "Strong protocol engagement",
              "Multi-chain presence"
            ]}
            useCases={[
              "Approved for high-value transactions",
              "Eligible for governance roles",
              "Priority access to new features"
            ]}
          />

          <TierCard
            tier="Strong"
            range="750-899"
            color="gold"
            characteristics={[
              "1-3 years of activity",
              "Regular, legitimate transactions",
              "Some verified credentials",
              "Active protocol user",
              "Presence on 2-3 chains"
            ]}
            useCases={[
              "Approved for most transactions",
              "Eligible for community features",
              "Standard access levels"
            ]}
          />

          <TierCard
            tier="Fair"
            range="600-749"
            color="azure"
            characteristics={[
              "6-12 months of activity",
              "Moderate transaction volume",
              "Limited credentials",
              "Basic protocol interactions",
              "Single or dual-chain"
            ]}
            useCases={[
              "Standard transaction approval",
              "May require additional verification",
              "Limited access to premium features"
            ]}
          />

          <TierCard
            tier="Emerging"
            range="400-599"
            color="warn"
            characteristics={[
              "3-6 months of activity",
              "Low transaction volume",
              "No verified credentials",
              "Limited protocol usage",
              "Single chain presence"
            ]}
            useCases={[
              "Additional verification recommended",
              "Transaction limits may apply",
              "Monitoring suggested"
            ]}
          />

          <TierCard
            tier="New"
            range="0-399"
            color="danger"
            characteristics={[
              "<3 months old or inactive",
              "Minimal transaction history",
              "No credentials",
              "Limited or suspicious patterns",
              "Possible sybil indicators"
            ]}
            useCases={[
              "Enhanced verification required",
              "Transaction restrictions advised",
              "Close monitoring necessary"
            ]}
          />
        </div>
      </Section>

      {/* Real-time Updates */}
      <Section title="Score Updates" icon={<Activity className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Update Frequency</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                <Clock className="size-5 text-success" />
              </div>
              <div>
                <p className="font-semibold mb-1">Real-time Transaction Processing</p>
                <p className="text-sm text-muted-foreground">
                  Reputation scores update within minutes of new on-chain activity being detected
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <TrendingUp className="size-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-1">Periodic Recalculation</p>
                <p className="text-sm text-muted-foreground">
                  Full score recalculation occurs every 24 hours to incorporate time-decay factors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-azure/20 flex items-center justify-center shrink-0">
                <Award className="size-5 text-azure" />
              </div>
              <div>
                <p className="font-semibold mb-1">Credential Updates</p>
                <p className="text-sm text-muted-foreground">
                  New credentials and attestations are reflected immediately upon verification
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Integration Examples */}
      <Section title="Integration Patterns" icon={<Users className="size-5" />}>
        <div className="space-y-4">
          <CodeExample
            title="Conditional Logic Based on Score"
            language="typescript"
            code={`const { score, tier, risk } = await credlayer.wallets.analyze({ 
  address: userWallet,
  chain: 'ethereum'
});

if (score >= 750 && risk === 'Low') {
  // High reputation: instant approval
  await processTransaction();
} else if (score >= 500) {
  // Medium reputation: additional checks
  await requestKYC();
} else {
  // Low reputation: reject or manual review
  await flagForReview();
}`}
          />

          <CodeExample
            title="Dynamic Rate Limiting"
            language="typescript"
            code={`// Adjust rate limits based on reputation
const getRateLimit = (score: number) => {
  if (score >= 900) return 1000; // requests/hour
  if (score >= 750) return 500;
  if (score >= 600) return 250;
  return 100; // default for new/low reputation
};

const userLimit = getRateLimit(reputation.score);`}
          />
        </div>
      </Section>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="text-accent mb-2">{icon}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function ScoreComponent({ name, weight, description }: { name: string; weight: string; description: string }) {
  return (
    <div className="flex items-start gap-4 glass rounded-lg p-4">
      <div className="glass-strong px-3 py-1 rounded font-mono text-sm text-gold shrink-0">{weight}</div>
      <div>
        <p className="font-semibold text-sm mb-1">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TierCard({
  tier,
  range,
  color,
  characteristics,
  useCases
}: {
  tier: string;
  range: string;
  color: string;
  characteristics: string[];
  useCases: string[];
}) {
  const colorClasses = {
    success: "border-success",
    gold: "border-gold",
    azure: "border-azure",
    warn: "border-warn",
    danger: "border-danger"
  }[color];

  return (
    <div className={`glass-strong rounded-lg p-6 border-l-4 ${colorClasses}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{tier}</h3>
        <span className="glass px-3 py-1 rounded font-mono text-sm">{range}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-2 text-muted-foreground">Characteristics</p>
          <ul className="space-y-1 text-sm">
            {characteristics.map((char, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2 text-muted-foreground">Use Cases</p>
          <ul className="space-y-1 text-sm">
            {useCases.map((use, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-muted-foreground">→</span>
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CodeExample({ title, language, code }: { title: string; language: string; code: string }) {
  return (
    <div className="glass-strong rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{title}</h4>
        <span className="text-xs glass px-2 py-1 rounded">{language}</span>
      </div>
      <pre className="glass rounded p-4 overflow-x-auto text-sm">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
