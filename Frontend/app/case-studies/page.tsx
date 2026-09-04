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
      title: "Coming Soon: Real-World Implementations",
      category: "Development",
      client: "Early Access Program",
      challenge:
        "We're actively developing CredLayer and will share real case studies as our partners implement the platform.",
      solution:
        "Currently in MVP stage with architecture complete and GNN model trained. Early adopters are helping shape our implementation approach.",
      results: [
        "Full-stack architecture designed and tested",
        "Graph Neural Network model trained and ready",
        "API infrastructure in active development",
        "Open source release planned for community contribution",
      ],
      metrics: {
        improvement: "MVP",
        label: "Development Stage",
      },
      icon: Shield,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Building{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                in Public
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              We're developing CredLayer in the open. Real case studies will be shared as partners adopt the platform.
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
                Interested in early access?
              </h2>
              <p className="text-gray-400 mb-6">
                Join our early adopter program and help shape the future of Web3 reputation systems.
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
