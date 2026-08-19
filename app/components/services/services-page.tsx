"use client";

import { Shield, Database, Zap, Target, Layers, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const SERVICES = [
  {
    id: "ai-reputation",
    icon: Shield,
    title: "AI Reputation Scoring",
    tagline: "Advanced trust analysis powered by machine learning",
    description: "Our AI-powered reputation engine analyzes on-chain behavior, transaction patterns, and social signals to generate comprehensive trust scores for wallets, agents, and entities.",
    features: [
      "Real-time risk assessment and fraud detection",
      "Multi-chain behavioral analysis",
      "Historical reputation tracking",
      "Custom scoring models for your use case",
      "API integration for automated decisions"
    ],
    metrics: [
      { label: "Accuracy Rate", value: "98.5%" },
      { label: "Analysis Time", value: "<2s" },
      { label: "Data Points", value: "1M+" }
    ]
  },
  {
    id: "blockchain-credentials",
    icon: Database,
    title: "Blockchain Credentials",
    tagline: "Tamper-proof verifiable credentials on-chain",
    description: "Issue, manage, and verify blockchain-based credentials that are cryptographically secure, instantly verifiable, and permanently stored on the blockchain.",
    features: [
      "W3C Verifiable Credentials standard",
      "Multi-chain credential issuance",
      "Instant verification system",
      "Revocation management",
      "Privacy-preserving selective disclosure"
    ],
    metrics: [
      { label: "Credentials Issued", value: "250K+" },
      { label: "Verification Time", value: "<1s" },
      { label: "Chains Supported", value: "5+" }
    ]
  },
  {
    id: "developer-api",
    icon: Zap,
    title: "Developer API & SDKs",
    tagline: "Enterprise-grade infrastructure for seamless integration",
    description: "Comprehensive APIs and SDKs that make it easy to integrate CredLayer's verification infrastructure into your application with just a few lines of code.",
    features: [
      "RESTful API with comprehensive documentation",
      "TypeScript, Python, and Rust SDKs",
      "Webhook support for real-time events",
      "GraphQL endpoint for flexible queries",
      "99.9% uptime SLA"
    ],
    metrics: [
      { label: "API Uptime", value: "99.9%" },
      { label: "Response Time", value: "<100ms" },
      { label: "Daily Requests", value: "5M+" }
    ]
  },
  {
    id: "fraud-detection",
    icon: Target,
    title: "Fraud Detection",
    tagline: "Proactive security with real-time anomaly detection",
    description: "Advanced machine learning algorithms continuously monitor transactions and behaviors to detect and prevent fraudulent activities before they impact your business.",
    features: [
      "Real-time transaction monitoring",
      "Behavioral anomaly detection",
      "Risk scoring and alerts",
      "Pattern recognition algorithms",
      "Custom rule engine"
    ],
    metrics: [
      { label: "Threats Blocked", value: "50K+" },
      { label: "False Positive Rate", value: "<0.1%" },
      { label: "Detection Speed", value: "<500ms" }
    ]
  },
  {
    id: "multi-chain",
    icon: Layers,
    title: "Multi-Chain Support",
    tagline: "Cross-chain reputation aggregation",
    description: "Aggregate and analyze reputation data across multiple blockchain networks to provide a comprehensive view of trust and credibility in the multi-chain ecosystem.",
    features: [
      "Solana, Ethereum, and EVM chains",
      "Cross-chain identity resolution",
      "Unified reputation scores",
      "Chain-agnostic credential verification",
      "Seamless chain switching"
    ],
    metrics: [
      { label: "Chains Supported", value: "8+" },
      { label: "Cross-chain Queries", value: "1M+/day" },
      { label: "Networks", value: "Mainnet & Testnet" }
    ]
  },
  {
    id: "analytics",
    icon: TrendingUp,
    title: "Analytics & Insights",
    tagline: "Deep insights into reputation trends and patterns",
    description: "Comprehensive analytics dashboards that provide actionable insights into reputation trends, verification patterns, and trust metrics across your ecosystem.",
    features: [
      "Customizable analytics dashboards",
      "Real-time reputation tracking",
      "Historical trend analysis",
      "Export and reporting tools",
      "API for custom integrations"
    ],
    metrics: [
      { label: "Data Visualization", value: "Real-time" },
      { label: "Report Types", value: "20+" },
      { label: "Export Formats", value: "5+" }
    ]
  }
];

export function ServicesPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-[#030c18]">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-[#030c18]">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse [animation-delay:3s]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        {/* Hero Section */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Enterprise Trust Infrastructure
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive Web3 verification solutions powered by AI and blockchain technology. Build trust at scale with our enterprise-grade platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Book a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/developers" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="space-y-16 sm:space-y-24">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
                >
                  {/* Content */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        {service.title}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      {service.tagline}
                    </h2>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button href="/demo" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Metrics Card */}
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8">
                      <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
                        <Icon className="h-8 w-8 text-cyan-400" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-6">Key Metrics</h3>
                      
                      <div className="space-y-4">
                        {service.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40">
                            <span className="text-sm text-gray-400">{metric.label}</span>
                            <span className="text-lg font-bold text-cyan-400">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-24 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join leading Web3 companies using CredLayer to build trust and verify identities at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Schedule a Demo
              </Button>
              <Button href="/contact" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
