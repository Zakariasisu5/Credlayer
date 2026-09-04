import { Metadata } from "next";
import { Shield, Zap, TrendingUp, Users, Lock, Activity } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services - CredLayer",
  description: "AI-powered reputation and risk intelligence services for Web3",
};

export default function ServicesPage() {
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

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Services for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Web3 Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Comprehensive reputation and risk intelligence services powered by AI and
              on-chain data analysis.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-gray-400 mb-6">
                Integrate CredLayer into your application and start analyzing wallets today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Start Analyzing
                </Link>
                <Link
                  href="/developers"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg transition-colors"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
