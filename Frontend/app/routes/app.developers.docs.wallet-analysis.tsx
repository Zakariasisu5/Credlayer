import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, Shield, BarChart3, Search, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/developers/docs/wallet-analysis")({
  component: WalletAnalysisPage,
});

function WalletAnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <Wallet className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Wallet Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Analyze wallet behavior, reputation, and risk across multiple blockchain networks. Get AI-powered
          insights into wallet activity, transaction patterns, and on-chain history.
        </p>
      </div>

      {/* Analyze Endpoint */}
      <Section title="Analyze Wallet" icon={<Search className="size-5" />}>
        <div className="space-y-4">
          <div className="glass-strong rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">POST /v1/wallets/analyze</h3>
              <span className="glass px-3 py-1 rounded text-xs font-mono">Authenticated</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze a wallet address and receive comprehensive reputation scoring, behavioral analysis,
              and risk assessment.
            </p>

            <CodeBlock
              title="Request"
              language="bash"
              code={`curl -X POST 'https://api.credlayer.io/v1/wallets/analyze' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "ethereum"
  }'`}
            />

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Request Parameters</p>
              <div className="glass rounded-lg divide-y divide-border">
                <ParamRow
                  name="address"
                  type="string"
                  required
                  description="Wallet address to analyze"
                />
                <ParamRow
                  name="chain"
                  type="string"
                  required
                  description="Blockchain network (ethereum, polygon, base, solana, etc.)"
                />
                <ParamRow
                  name="include_history"
                  type="boolean"
                  description="Include transaction history (default: false)"
                />
                <ParamRow
                  name="depth"
                  type="string"
                  description="Analysis depth: 'quick' | 'standard' | 'deep' (default: 'standard')"
                />
              </div>
            </div>

            <CodeBlock
              title="Response"
              language="json"
              code={`{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "chain": "ethereum",
    "score": 842,
    "tier": "Excellent",
    "trust": 87,
    "risk": "Low",
    "ageYears": 3.2,
    "chains": 5,
    "signals": 247,
    "tx30d": 1523,
    "volumeUsd": 425000,
    "contracts": 42,
    "metrics": [
      {
        "key": "DeFi engagement",
        "value": 92,
        "tone": "gold"
      },
      {
        "key": "Protocol diversity",
        "value": 78,
        "tone": "azure"
      },
      {
        "key": "Sybil resistance",
        "value": 95,
        "tone": "success"
      },
      {
        "key": "Volatility exposure",
        "value": 23,
        "tone": "warn"
      }
    ],
    "credentials": [
      "Gitcoin Passport · Verified",
      "ENS Primary Name",
      "Optimism Attestation · Delegate"
    ],
    "aiSummary": "Wallet shows excellent on-chain reputation with 3.2-year history across 5 networks..."
  },
  "timestamp": "2026-01-31T12:00:00Z"
}`}
            />
          </div>
        </div>
      </Section>

      {/* Reputation Score */}
      <Section title="Understanding Reputation Scores" icon={<TrendingUp className="size-5" />}>
        <div className="grid sm:grid-cols-3 gap-4">
          <ScoreCard
            range="900-1000"
            tier="Excellent"
            color="success"
            description="Exceptional reputation with strong trust signals"
          />
          <ScoreCard
            range="750-899"
            tier="Strong"
            color="gold"
            description="Very good reputation with consistent behavior"
          />
          <ScoreCard
            range="600-749"
            tier="Fair"
            color="azure"
            description="Moderate reputation, some activity history"
          />
          <ScoreCard
            range="400-599"
            tier="Emerging"
            color="warn"
            description="Limited history or mixed signals"
          />
          <ScoreCard
            range="0-399"
            tier="New"
            color="danger"
            description="New wallet or concerning patterns"
          />
        </div>
      </Section>

      {/* Risk Levels */}
      <Section title="Risk Assessment" icon={<Shield className="size-5" />}>
        <div className="space-y-3">
          <RiskCard
            level="Low"
            color="success"
            indicators={[
              "Long wallet history (>1 year)",
              "Consistent transaction patterns",
              "Verified credentials present",
              "No suspicious activity flags"
            ]}
          />
          <RiskCard
            level="Medium"
            color="warn"
            indicators={[
              "Moderate wallet age (3-12 months)",
              "Some unusual patterns detected",
              "Limited credential verification",
              "Irregular transaction frequency"
            ]}
          />
          <RiskCard
            level="High"
            color="danger"
            indicators={[
              "New wallet (<3 months)",
              "Suspicious transaction patterns",
              "No verified credentials",
              "High-risk contract interactions"
            ]}
          />
        </div>
      </Section>

      {/* Behavioral Metrics */}
      <Section title="Behavioral Metrics" icon={<BarChart3 className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Each wallet analysis includes behavioral metrics scored 0-100. These metrics provide
            insight into specific aspects of wallet behavior:
          </p>
          <div className="space-y-3">
            <MetricCard
              name="DeFi Engagement"
              description="Level of interaction with DeFi protocols (lending, swapping, staking)"
              tone="gold"
            />
            <MetricCard
              name="Protocol Diversity"
              description="Number of unique protocols and smart contracts used"
              tone="azure"
            />
            <MetricCard
              name="Sybil Resistance"
              description="Likelihood that wallet represents a unique human (not bot or duplicate)"
              tone="success"
            />
            <MetricCard
              name="Volatility Exposure"
              description="Risk from holding volatile assets or high-frequency trading"
              tone="warn"
            />
          </div>
        </div>
      </Section>

      {/* Multi-chain Support */}
      <Section title="Supported Chains" icon={<Wallet className="size-5" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            "Ethereum", "Polygon", "Arbitrum", "Optimism",
            "Base", "Solana", "Avalanche", "BNB Chain",
            "Sui", "Aptos"
          ].map((chain) => (
            <div key={chain} className="glass rounded-lg p-3 text-center">
              <div className="font-medium">{chain}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Rate Limits */}
      <div className="glass-strong rounded-2xl p-6 border-l-4 border-warn">
        <div className="flex gap-3">
          <AlertTriangle className="size-5 text-warn shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Rate Limits</h3>
            <p className="text-sm text-muted-foreground">
              Wallet analysis endpoints are rate-limited based on your subscription tier.
              See the <a href="/app/developers/rate-limits" className="text-accent hover:underline">Rate Limits documentation</a> for details.
            </p>
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
          <button className="glass rounded px-2 py-1 text-xs hover:bg-elevated-strong">Copy</button>
        </div>
        <pre className="glass-strong rounded-lg p-4 overflow-x-auto text-sm">
          <code className="font-mono text-foreground whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ParamRow({ name, type, required, description }: { name: string; type: string; required?: boolean; description: string }) {
  return (
    <div className="p-3 flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <code className="font-mono text-sm text-gold">{name}</code>
          <span className="text-xs glass px-2 py-0.5 rounded">{type}</span>
          {required && (
            <span className="text-xs bg-danger/20 text-danger px-2 py-0.5 rounded">required</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ScoreCard({ range, tier, color, description }: { range: string; tier: string; color: string; description: string }) {
  const colorClasses = {
    success: "border-success text-success",
    gold: "border-gold text-gold",
    azure: "border-azure text-azure",
    warn: "border-warn text-warn",
    danger: "border-danger text-danger"
  }[color];

  return (
    <div className={`glass-strong rounded-lg p-4 border-l-4 ${colorClasses}`}>
      <div className="font-mono text-lg font-bold mb-1">{range}</div>
      <div className="font-semibold mb-2">{tier}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function RiskCard({ level, color, indicators }: { level: string; color: string; indicators: string[] }) {
  const colorClasses = {
    success: "border-success bg-success/5",
    warn: "border-warn bg-warn/5",
    danger: "border-danger bg-danger/5"
  }[color];

  const iconColor = {
    success: "text-success",
    warn: "text-warn",
    danger: "text-danger"
  }[color];

  return (
    <div className={`glass-strong rounded-lg p-5 border-l-4 ${colorClasses}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className={`size-5 ${iconColor}`} />
        <h3 className="font-semibold">{level} Risk</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {indicators.map((indicator, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{indicator}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricCard({ name, description, tone }: { name: string; description: string; tone: string }) {
  const toneClasses = {
    gold: "border-gold",
    azure: "border-azure",
    success: "border-success",
    warn: "border-warn"
  }[tone];

  return (
    <div className={`glass rounded-lg p-4 border-l-2 ${toneClasses}`}>
      <h4 className="font-semibold text-sm mb-1">{name}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
