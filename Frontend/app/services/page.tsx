"use client";

import { Shield, Zap, TrendingUp, Users, Lock, Activity } from "lucide-react";
import { Header } from "../components/layout/header";
import { Button } from "../components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: Shield,
    title: "Wallet Risk Assessment",
    description:
      "Real-time analysis of wallet behavior, transaction patterns, and on-chain reputation to identify risk levels.",
    features: [
      "Transaction history analysis",
      "Smart contract interaction tracking",
      "Network behavior patterns",
      "Risk score calculation",
    ],
  },
  {
    icon: Activity,
    title: "Protocol Intelligence",
    description:
      "Deep insights into protocol interactions, liquidity patterns, and ecosystem participation for informed decisions.",
    features: [
      "Protocol interaction mapping",
      "Liquidity pool analysis",
      "Cross-chain activity tracking",
      "DeFi risk metrics",
    ],
  },
  {
    icon: Users,
    title: "Agent Reputation System",
    description:
      "Verifiable reputation scores for autonomous agents and bots operating in Web3 ecosystems.",
    features: [
      "Agent behavior monitoring",
      "Trust score calculation",
      "Historical performance tracking",
      "Cross-platform verification",
    ],
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "AI-powered predictions for wallet behavior, transaction patterns, and potential risk factors.",
    features: [
      "Machine learning models",
      "Pattern recognition",
      "Anomaly detection",
      "Trend forecasting",
    ],
  },
  {
    icon: Lock,
    title: "Compliance & KYT",
    description:
      "Know Your Transaction (KYT) tools for regulatory compliance and transaction monitoring.",
    features: [
      "AML screening",
      "Sanctions list checking",
      "Transaction monitoring",
      "Compliance reporting",
    ],
  },
  {
    icon: Zap,
    title: "Real-Time API",
    description:
      "Lightning-fast API endpoints for seamless integration into your applications and workflows.",
    features: [
      "Sub-second response times",
      "99.9% uptime SLA",
      "RESTful & GraphQL",
      "Comprehensive documentation",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-5 py-16 lg:px-10 lg:py-24">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Services for Web3 Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive reputation and risk intelligence services powered by AI and on-chain data analysis
            </p>
          </div>

          {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-card hover:border-primary/40 transition-all"
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg border border-primary/30">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3 text-foreground">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Integrate CredLayer into your application and start analyzing wallets today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/app">
            Start Analyzing
          </Button>
          <Button href="/developers" variant="outline">
            View Documentation
          </Button>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  </main>
</>
  );
}
