"use client";

import { TrendingUp, Shield, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const CASE_STUDIES = [
  {
    id: "defi-protocol",
    company: "DeFi Protocol X",
    industry: "Decentralized Finance",
    icon: TrendingUp,
    challenge: "High fraud rates and lack of user trust were limiting platform growth and user acquisition.",
    solution: "Implemented CredLayer's AI reputation scoring and real-time fraud detection to verify users and assess risk.",
    results: [
      { metric: "85%", description: "Reduction in fraudulent transactions" },
      { metric: "3x", description: "Increase in user trust scores" },
      { metric: "40%", description: "Growth in active users" }
    ],
    testimonial: {
      quote: "CredLayer transformed how we handle trust and verification. The AI-powered reputation system has been game-changing for our platform.",
      author: "Sarah Chen",
      role: "CTO, DeFi Protocol X"
    },
    tags: ["AI Reputation", "Fraud Detection", "DeFi"]
  },
  {
    id: "nft-marketplace",
    company: "NFT Marketplace Pro",
    industry: "NFT & Digital Assets",
    icon: Shield,
    challenge: "Counterfeit NFTs and unverified sellers were damaging marketplace reputation and user confidence.",
    solution: "Deployed blockchain credentials and multi-chain verification to authenticate sellers and validate NFT provenance.",
    results: [
      { metric: "99%", description: "Authentic seller verification rate" },
      { metric: "60%", description: "Decrease in fraud reports" },
      { metric: "2.5x", description: "Increase in marketplace volume" }
    ],
    testimonial: {
      quote: "The blockchain credential system gave our marketplace the credibility boost we needed. Users now trust that they're dealing with verified sellers.",
      author: "Marcus Rodriguez",
      role: "Founder, NFT Marketplace Pro"
    },
    tags: ["Blockchain Credentials", "NFT", "Verification"]
  },
  {
    id: "dao-platform",
    company: "DAO Governance Hub",
    industry: "DAO & Governance",
    icon: Users,
    challenge: "Sybil attacks and fake accounts were compromising governance voting and proposal outcomes.",
    solution: "Integrated CredLayer's reputation scoring and on-chain identity verification to ensure authentic participation.",
    results: [
      { metric: "90%", description: "Reduction in Sybil attacks" },
      { metric: "75%", description: "Increase in legitimate voters" },
      { metric: "100%", description: "Improvement in proposal quality" }
    ],
    testimonial: {
      quote: "CredLayer's reputation system restored integrity to our governance process. We can now confidently identify real community members.",
      author: "Alex Thompson",
      role: "Community Lead, DAO Governance Hub"
    },
    tags: ["Reputation Scoring", "DAO", "Governance"]
  },
  {
    id: "web3-gaming",
    company: "GameFi Universe",
    industry: "Web3 Gaming",
    icon: Zap,
    challenge: "Bot accounts and cheaters were ruining gameplay experience and devaluing in-game assets.",
    solution: "Implemented behavioral analysis and credential verification to identify and ban bad actors in real-time.",
    results: [
      { metric: "95%", description: "Bot detection accuracy" },
      { metric: "50%", description: "Increase in player satisfaction" },
      { metric: "30%", description: "Growth in in-game economy value" }
    ],
    testimonial: {
      quote: "The real-time fraud detection keeps our game fair and our economy healthy. Players appreciate competing against real humans.",
      author: "Jamie Park",
      role: "Product Director, GameFi Universe"
    },
    tags: ["Fraud Detection", "Gaming", "Real-time"]
  }
];

export function CaseStudiesPage() {
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
              Customer Success Stories
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              See how leading Web3 companies are using CredLayer to build trust, verify identities, and prevent fraud at scale.
            </p>
          </div>

          {/* Case Studies */}
          <div className="space-y-16 sm:space-y-20">
            {CASE_STUDIES.map((caseStudy) => {
              const Icon = caseStudy.icon;
              
              return (
                <div
                  key={caseStudy.id}
                  className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-8 sm:p-10 border-b border-cyan-500/20">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">{caseStudy.company}</h2>
                            <p className="text-sm text-gray-400">{caseStudy.industry}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {caseStudy.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 sm:p-10">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Challenge & Solution */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>
                          <p className="text-gray-400 leading-relaxed">{caseStudy.challenge}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">The Solution</h3>
                          <p className="text-gray-400 leading-relaxed">{caseStudy.solution}</p>
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
                        <div className="space-y-4">
                          {caseStudy.results.map((result, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40"
                            >
                              <div className="text-3xl font-bold text-cyan-400 mb-1">
                                {result.metric}
                              </div>
                              <div className="text-sm text-gray-400">
                                {result.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                        <div>
                          <p className="text-gray-300 italic mb-4 leading-relaxed">
                            &quot;{caseStudy.testimonial.quote}&quot;
                          </p>
                          <div>
                            <p className="text-white font-semibold">{caseStudy.testimonial.author}</p>
                            <p className="text-sm text-gray-400">{caseStudy.testimonial.role}</p>
                          </div>
                        </div>
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
              Ready to Write Your Success Story?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join these industry leaders and transform your Web3 platform with CredLayer&apos;s trust infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Book a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/services" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
