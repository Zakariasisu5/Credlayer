import { Metadata } from "next";
import { ExternalLink, TrendingUp, Shield, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies - CredLayer",
  description: "Real-world success stories and implementations of CredLayer",
};

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      title: "DeFi Protocol Reduces Risk by 87%",
      category: "DeFi",
      client: "Leading DEX Platform",
      challenge:
        "High-risk wallet interactions were causing significant losses and reputation damage.",
      solution:
        "Implemented CredLayer's real-time risk assessment to screen all wallet connections before transaction execution.",
      results: [
        "87% reduction in fraudulent transactions",
        "99.9% reduction in user complaints",
        "$2.3M in prevented losses over 6 months",
        "42% increase in user trust scores",
      ],
      metrics: {
        improvement: "87%",
        label: "Risk Reduction",
      },
      icon: Shield,
    },
    {
      title: "NFT Marketplace Enhances Trust",
      category: "NFT",
      client: "Top 10 NFT Marketplace",
      challenge:
        "Wash trading and bot activity were undermining marketplace integrity and user confidence.",
      solution:
        "Integrated CredLayer's agent reputation system to identify and flag suspicious wallet behavior.",
      results: [
        "94% accurate bot detection rate",
        "56% decrease in wash trading activity",
        "3x increase in verified seller badges",
        "28% growth in monthly active users",
      ],
      metrics: {
        improvement: "94%",
        label: "Bot Detection",
      },
      icon: Users,
    },
    {
      title: "DAO Treasury Management Success",
      category: "DAO",
      client: "Multi-Million Dollar DAO",
      challenge:
        "Treasury management required better risk assessment for protocol and wallet interactions.",
      solution:
        "Deployed CredLayer's protocol intelligence and predictive analytics for treasury decisions.",
      results: [
        "100% on-chain transparency maintained",
        "35% improvement in investment returns",
        "$5M treasury protected from risky protocols",
        "Zero security incidents in 12 months",
      ],
      metrics: {
        improvement: "35%",
        label: "ROI Increase",
      },
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Success Stories from{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Web3 Leaders
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Discover how leading protocols and platforms are using CredLayer to build trust
              and reduce risk.
            </p>
          </div>

          {/* Case Studies */}
          <div className="space-y-12">
            {caseStudies.map((study, index) => {
              const Icon = study.icon;
              return (
                <div
                  key={study.title}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm font-medium rounded-full">
                            {study.category}
                          </span>
                          <span className="text-sm text-gray-500">{study.client}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{study.title}</h2>
                      </div>
                      <div className="flex-shrink-0 ml-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg">
                          <Icon className="w-8 h-8 text-cyan-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                            Challenge
                          </h3>
                          <p className="text-gray-300">{study.challenge}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                            Solution
                          </h3>
                          <p className="text-gray-300">{study.solution}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
                          Results
                        </h3>
                        <ul className="space-y-2 mb-6">
                          {study.results.map((result) => (
                            <li key={result} className="flex items-start text-gray-300">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
                          <div className="text-3xl font-bold text-cyan-400 mb-1">
                            {study.metrics.improvement}
                          </div>
                          <div className="text-sm text-gray-400">{study.metrics.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Ready to become our next success story?
              </h2>
              <p className="text-gray-400 mb-6">
                Join leading Web3 protocols in building trust and reducing risk with CredLayer.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
              >
                Get Started
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
