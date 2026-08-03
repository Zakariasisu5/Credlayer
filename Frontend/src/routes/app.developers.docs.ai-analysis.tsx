import { createFileRoute } from "@tanstack/react-router";
import { Bot, Brain, Sparkles, MessageSquare, TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/app/developers/docs/ai-analysis")({
  component: AIAnalysisPage,
});

function AIAnalysisPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-accent mb-2">
          <Bot className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Documentation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">AI Analysis</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Leverage CredLayer's AI-powered insights to understand wallet behavior, detect patterns,
          and make informed decisions with explainable AI summaries and risk intelligence.
        </p>
      </div>

      {/* AI Summary */}
      <Section title="AI-Generated Summaries" icon={<MessageSquare className="size-5" />}>
        <div className="space-y-4">
          <div className="glass-strong rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Every wallet analysis includes an AI-generated summary that explains the reputation score
              in plain English, highlighting key insights and behavioral patterns.
            </p>
            
            <div className="glass rounded-lg p-5 border-l-4 border-accent">
              <p className="text-sm font-semibold text-accent mb-2">Example AI Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Wallet 0x742d...0bEb shows <span className="text-foreground font-medium">excellent on-chain reputation</span> with 
                a <span className="text-foreground font-medium">3.2-year history</span> across <span className="text-foreground font-medium">5 networks</span>. 
                Behavior is consistent with a long-term power user: <span className="text-success">strong sybil resistance</span> and 
                <span className="text-success"> diverse protocol usage</span>. Recent activity indicates{" "}
                <span className="text-success">no elevated risk signals</span>. The wallet demonstrates mature DeFi participation with
                regular interactions across established protocols and maintains verified credentials from Gitcoin Passport and ENS."
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <AIFeatureCard
              icon={<Brain className="size-5" />}
              title="Explainable"
              description="Understand why a score was assigned"
            />
            <AIFeatureCard
              icon={<Sparkles className="size-5" />}
              title="Contextual"
              description="Tailored insights based on wallet type"
            />
            <AIFeatureCard
              icon={<Shield className="size-5" />}
              title="Actionable"
              description="Clear recommendations for decision-making"
            />
          </div>
        </div>
      </Section>

      {/* Pattern Detection */}
      <Section title="Pattern Detection" icon={<TrendingUp className="size-5" />}>
        <div className="glass-strong rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">AI-Detected Patterns</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI models identify behavioral patterns that indicate wallet characteristics:
          </p>
          <div className="space-y-3">
            <PatternCard
              pattern="Power User"
              indicators={["High transaction volume", "Diverse protocol usage", "Long account age"]}
              color="success"
            />
            <PatternCard
              pattern="DeFi Farmer"
              indicators={["Frequent yield farming", "Multiple LP positions", "Quick entry/exit patterns"]}
              color="gold"
            />
            <PatternCard
              pattern="NFT Collector"
              indicators={["Regular NFT purchases", "Collection holdings", "Marketplace activity"]}
              color="azure"
            />
            <PatternCard
              pattern="Trader"
              indicators={["Frequent swaps", "High volatility exposure", "DEX-heavy activity"]}
              color="warn"
            />
            <PatternCard
              pattern="Potential Sybil"
              indicators={["Similar patterns to other wallets", "Minimal diversity", "Short lifespan"]}
              color="danger"
            />
          </div>
        </div>
      </Section>

      {/* Risk Intelligence */}
      <Section title="Risk Intelligence" icon={<Shield className="size-5" />}>
        <div className="space-y-4">
          <div className="glass-strong rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">AI-Powered Risk Detection</h3>
            <p className="text-muted-foreground mb-4">
              CredLayer's AI continuously monitors for risk signals across multiple dimensions:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <RiskCategory
                title="Transaction Patterns"
                risks={[
                  "Unusual transaction timing",
                  "Suspicious value patterns",
                  "Wash trading indicators",
                  "Front-running behavior"
                ]}
              />
              <RiskCategory
                title="Contract Interactions"
                risks={[
                  "High-risk contract calls",
                  "Unverified contract usage",
                  "Flash loan participation",
                  "Mixer/tumbler activity"
                ]}
              />
              <RiskCategory
                title="Network Behavior"
                risks={[
                  "Coordinated activity",
                  "Sybil attack patterns",
                  "Bot-like behavior",
                  "Cluster membership"
                ]}
              />
              <RiskCategory
                title="Credential Signals"
                risks={[
                  "Lack of verified identity",
                  "Suspicious social links",
                  "Blacklist presence",
                  "Sanction screening"
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* API Integration */}
      <Section title="Accessing AI Insights" icon={<Bot className="size-5" />}>
        <div className="space-y-4">
          <CodeExample
            title="Get AI Summary"
            language="typescript"
            code={`const analysis = await credlayer.wallets.analyze({
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chain: 'ethereum'
});

// AI-generated summary
console.log(analysis.aiSummary);

// Detected patterns
console.log(analysis.patterns);

// Risk signals
console.log(analysis.riskSignals);`}
          />

          <CodeExample
            title="Request Detailed Analysis"
            language="typescript"
            code={`// Request deep analysis for more detailed AI insights
const deepAnalysis = await credlayer.wallets.analyze({
  address: walletAddress,
  chain: 'ethereum',
  depth: 'deep' // Provides extended AI analysis
});

// Access detailed behavioral insights
console.log(deepAnalysis.behavioralAnalysis);
console.log(deepAnalysis.riskAssessment);
console.log(deepAnalysis.recommendations);`}
          />
        </div>
      </Section>

      {/* AI for Agents */}
      <Section title="AI Agent Integration" icon={<Bot className="size-5" />}>
        <div className="glass-strong rounded-lg p-6 border-l-4 border-accent">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Bot className="size-6 text-accent" />
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold mb-2">Built for AI Agents</h3>
                <p className="text-sm text-muted-foreground">
                  CredLayer's AI summaries are designed to be easily consumed by autonomous AI agents,
                  providing them with trustworthiness signals to make safe on-chain decisions.
                </p>
              </div>
              
              <div className="glass rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Agent Use Cases</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verify counterparty reputation before executing trades</li>
                  <li>• Adjust transaction parameters based on risk assessment</li>
                  <li>• Filter interaction targets by reputation tier</li>
                  <li>• Make informed decisions about protocol participation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Model Information */}
      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Model Architecture</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Training Data</p>
            <p className="text-xs text-muted-foreground">Millions of wallets across 10+ chains</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Update Frequency</p>
            <p className="text-xs text-muted-foreground">Models retrained weekly with latest data</p>
          </div>
          <div className="glass rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Accuracy</p>
            <p className="text-xs text-muted-foreground">95%+ precision on risk detection</p>
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

function AIFeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-lg p-4 text-center">
      <div className="text-accent mb-2 flex justify-center">{icon}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function PatternCard({ pattern, indicators, color }: { pattern: string; indicators: string[]; color: string }) {
  const colorClasses = {
    success: "border-success",
    gold: "border-gold",
    azure: "border-azure",
    warn: "border-warn",
    danger: "border-danger"
  }[color];

  return (
    <div className={`glass rounded-lg p-4 border-l-2 ${colorClasses}`}>
      <h4 className="font-semibold mb-2">{pattern}</h4>
      <div className="flex flex-wrap gap-2">
        {indicators.map((indicator, i) => (
          <span key={i} className="glass px-2 py-1 rounded text-xs">
            {indicator}
          </span>
        ))}
      </div>
    </div>
  );
}

function RiskCategory({ title, risks }: { title: string; risks: string[] }) {
  return (
    <div className="glass rounded-lg p-4">
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {risks.map((risk, i) => (
          <li key={i} className="flex gap-2">
            <span>•</span>
            <span>{risk}</span>
          </li>
        ))}
      </ul>
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
