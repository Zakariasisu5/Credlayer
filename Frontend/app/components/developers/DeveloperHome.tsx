import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Book,
  Code2,
  Terminal,
  Zap,
  CheckCircle2,
  Clock,
  Package,
  FileCode,
  Webhook,
  BarChart3,
  ExternalLink,
  Github,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SDK_CARDS = [
  {
    name: "JavaScript",
    version: "1.2.4",
    install: "npm install @credlayer/sdk",
    icon: FileCode,
    color: "text-[#F7DF1E]",
  },
  {
    name: "TypeScript",
    version: "1.2.4",
    install: "npm install @credlayer/sdk",
    icon: FileCode,
    color: "text-[#3178C6]",
  },
  {
    name: "Python",
    version: "0.9.2",
    install: "pip install credlayer",
    icon: FileCode,
    color: "text-[#3776AB]",
  },
  {
    name: "cURL",
    version: "REST API",
    install: "curl https://api.credlayer.io",
    icon: Terminal,
    color: "text-gold",
  },
];

const QUICK_LINKS = [
  { label: "Authentication", to: "/app/developers/docs/authentication", icon: Zap },
  { label: "Wallet Analysis", to: "/app/developers/docs/wallet-analysis", icon: BarChart3 },
  { label: "API Reference", to: "/app/developers/api-reference", icon: Code2 },
  { label: "Webhooks", to: "/app/developers/webhooks", icon: Webhook },
];

const FEATURED_GUIDES = [
  {
    title: "Quick Start Guide",
    description: "Get your first API call working in under 5 minutes",
    to: "/app/developers/quickstart",
    time: "5 min",
  },
  {
    title: "Analyze Wallet Reputation",
    description: "Learn how to fetch and interpret wallet reputation scores",
    to: "/app/developers/docs/wallet-analysis",
    time: "10 min",
  },
  {
    title: "AI-Powered Risk Analysis",
    description: "Use AI to detect suspicious patterns and fraud risk",
    to: "/app/developers/docs/ai-analysis",
    time: "15 min",
  },
  {
    title: "Webhook Integration",
    description: "Receive real-time updates when wallet reputations change",
    to: "/app/developers/webhooks",
    time: "12 min",
  },
];

export function DeveloperHome() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
          <span className="relative flex size-1.5">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          API v1.0 • All systems operational
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold">
          Welcome to <span className="text-gold">CredLayer Developers</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Build trusted Web3 applications with CredLayer's reputation infrastructure.
          Query wallet scores, analyze on-chain behavior, and verify credentials with
          enterprise-grade APIs and SDKs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="gold" size="lg" asChild>
            <Link to="/app/developers/api-keys">
              <Zap className="size-4" />
              Get API Key
            </Link>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <Link to="/app/developers/quickstart">
              <Book className="size-4" />
              Quick Start
            </Link>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <Link to="/app/developers/api-reference">
              <Code2 className="size-4" />
              API Reference
            </Link>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <a href="https://github.com/credlayer" target="_blank" rel="noreferrer">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-4">
        <StatusCard
          icon={CheckCircle2}
          label="API Status"
          value="Operational"
          color="text-success"
        />
        <StatusCard
          icon={Package}
          label="Latest SDK"
          value="v1.2.4"
          color="text-gold"
        />
        <StatusCard
          icon={Clock}
          label="Uptime"
          value="99.98%"
          color="text-accent"
        />
        <StatusCard
          icon={BarChart3}
          label="Endpoints"
          value="24"
          color="text-foreground"
        />
      </div>

      {/* SDK Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">SDKs & Libraries</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Official client libraries for your favorite languages
            </p>
          </div>
          <Link
            to="/app/developers/sdks/javascript"
            className="text-sm text-gold hover:brightness-110 flex items-center gap-1"
          >
            View all SDKs <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-4">
          {SDK_CARDS.map((sdk) => (
            <SDKCard key={sdk.name} {...sdk} />
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-4">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="glass rounded-xl p-4 hover:bg-elevated] transition-colors group"
            >
              <link.icon className="size-5 text-gold mb-2" />
              <div className="font-medium group-hover:text-gold transition-colors">
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Guides */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Featured Guides</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.to}
              to={guide.to}
              className="glass rounded-xl p-4 sm:p-6 hover:bg-elevated] transition-all hover:shadow-card-hover group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-gold transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {guide.description}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0 ml-4" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {guide.time}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Code Example */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Get Started in Seconds</h3>
          <CopyButton
            text={`import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({ 
  apiKey: process.env.CREDLAYER_KEY 
});

// Get wallet reputation
const reputation = await client.wallets.get(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
);

console.log(reputation.score); // 892
console.log(reputation.tier);  // "Excellent"`}
          />
        </div>
        <pre className="text-xs md:text-sm overflow-x-auto font-mono leading-relaxed">
          <code className="text-muted-foreground">
            <span className="text-accent">import</span>{" "}
            <span className="text-foreground">{"{ CredLayer }"}</span>{" "}
            <span className="text-accent">from</span>{" "}
            <span className="text-success">'@credlayer/sdk'</span>;
            {"\n\n"}
            <span className="text-accent">const</span>{" "}
            <span className="text-foreground">client</span> ={" "}
            <span className="text-accent">new</span>{" "}
            <span className="text-gold">CredLayer</span>({"{\n  "}
            <span className="text-foreground">apiKey</span>:{" "}
            <span className="text-foreground">process.env</span>.
            <span className="text-foreground">CREDLAYER_KEY</span>
            {"\n});"}
            {"\n\n"}
            <span className="text-muted-foreground">
              // Get wallet reputation
            </span>
            {"\n"}
            <span className="text-accent">const</span>{" "}
            <span className="text-foreground">reputation</span> ={" "}
            <span className="text-accent">await</span>{" "}
            <span className="text-foreground">client</span>.
            <span className="text-foreground">wallets</span>.
            <span className="text-gold">get</span>(
            {"\n  "}
            <span className="text-success">
              '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
            </span>
            {"\n);"}
            {"\n\n"}
            <span className="text-foreground">console</span>.
            <span className="text-gold">log</span>(
            <span className="text-foreground">reputation</span>.
            <span className="text-foreground">score</span>);{" "}
            <span className="text-muted-foreground">// 892</span>
            {"\n"}
            <span className="text-foreground">console</span>.
            <span className="text-gold">log</span>(
            <span className="text-foreground">reputation</span>.
            <span className="text-foreground">tier</span>);{" "}
            <span className="text-muted-foreground">// "Excellent"</span>
          </code>
        </pre>
      </div>

      {/* Resources */}
      <div className="grid gap-4 md:grid-cols-3">
        <ResourceCard
          icon={Book}
          title="Documentation"
          description="Comprehensive guides and API reference"
          to="/app/developers/docs/getting-started"
        />
        <ResourceCard
          icon={Code2}
          title="API Reference"
          description="Complete REST API endpoint documentation"
          to="/app/developers/api-reference"
        />
        <ResourceCard
          icon={ExternalLink}
          title="Status Page"
          description="Real-time API status and uptime"
          href="https://status.credlayer.io"
        />
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Icon className={`size-3.5 ${color}`} />
        {label}
      </div>
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function SDKCard({
  name,
  version,
  install,
  icon: Icon,
  color,
}: {
  name: string;
  version: string;
  install: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(install);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Icon className={`size-6 ${color}`} />
        <span className="text-xs text-muted-foreground font-mono">{version}</span>
      </div>
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground mt-1">Official SDK</div>
      </div>
      <div className="glass rounded-lg p-2 flex items-center justify-between gap-2">
        <code className="text-xs font-mono flex-1 truncate">{install}</code>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Copy install command"
        >
          {copied ? (
            <CheckCircle2 className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function ResourceCard({
  icon: Icon,
  title,
  description,
  to,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  to?: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="size-5 text-gold mb-3" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
      <div className="mt-4 flex items-center text-sm text-gold">
        Learn more <ArrowRight className="size-3.5 ml-1" />
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="glass rounded-xl p-4 sm:p-6 hover:bg-elevated] transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={to!}
      className="glass rounded-xl p-4 sm:p-6 hover:bg-elevated] transition-colors"
    >
      {content}
    </Link>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
    >
      {copied ? (
        <>
          <CheckCircle2 className="size-3.5 text-success" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
