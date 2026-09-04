"use client";

import { FaShieldAlt, FaDatabase, FaCode, FaBrain, FaLock, FaBolt, FaCodeBranch, FaGlobe, FaChartBar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import agentImg from "../../assets/agent.jpg";
import credentialsImg from "../../assets/Credentials.jpg";
import developersImg from "../../assets/Developers.png";

const PILLARS = [
  {
    id: "ai-reputation",
    eyebrow: "AI REPUTATION & SCORING",
    headline: "Graph Neural Networks for Trust Intelligence",
    description:
      "Our trained GNN model analyzes on-chain behavior patterns to generate accurate reputation scores. Real-time risk assessment powered by machine learning.",
    image: agentImg,
    cards: [
      {
        icon: FaShieldAlt,
        title: "Real-Time Scoring",
        description: "Instant reputation analysis for any wallet address",
        href: "/app/analysis",
        color: "#06b6d4", // cyan
      },
      {
        icon: FaBrain,
        title: "Pattern Recognition",
        description: "AI-powered detection of behavioral anomalies",
        href: "/app/analysis",
        color: "#8b5cf6", // purple
      },
      {
        icon: FaChartBar,
        title: "Risk Assessment",
        description: "Comprehensive risk profiling and alerts",
        href: "/app/analysis",
        color: "#10b981", // green
      },
    ],
  },
  {
    id: "blockchain-credentials",
    eyebrow: "BLOCKCHAIN CREDENTIALS",
    headline: "On-Chain Verification You Can Trust",
    description:
      "Issue tamper-proof credentials directly on-chain. Cryptographic verification ensures authenticity while maintaining privacy and portability across the Web3 ecosystem.",
    image: credentialsImg,
    cards: [
      {
        icon: FaLock,
        title: "Cryptographic Proof",
        description: "Verifiable credentials with zero-knowledge proofs",
        href: "/app/credentials",
        color: "#3b82f6", // blue
      },
      {
        icon: FaGlobe,
        title: "Cross-Chain Support",
        description: "Credentials that work across multiple blockchains",
        href: "/app/credentials",
        color: "#10b981", // green
      },
      {
        icon: FaDatabase,
        title: "Instant Validation",
        description: "Real-time credential verification",
        href: "/app/credentials",
        color: "#06b6d4", // cyan
      },
    ],
  },
  {
    id: "developer-platform",
    eyebrow: "DEVELOPER PLATFORM",
    headline: "Built for Developers, By Developers",
    description:
      "Comprehensive API infrastructure with SDKs, webhooks, and documentation. Integrate reputation intelligence into your application in minutes, not months.",
    image: developersImg,
    cards: [
      {
        icon: FaBolt,
        title: "RESTful API",
        description: "Clean, well-documented API endpoints",
        href: "/developers/docs",
        color: "#f59e0b", // orange
      },
      {
        icon: FaCode,
        title: "SDK & Libraries",
        description: "TypeScript, Python, and Rust support",
        href: "/developers/sdk",
        color: "#8b5cf6", // purple
      },
      {
        icon: FaCodeBranch,
        title: "Webhooks",
        description: "Real-time event notifications",
        href: "/developers/docs",
        color: "#ef4444", // red
      },
    ],
  },
];

export function PillarSections() {
  return (
    <>
      {PILLARS.map((pillar, index) => {
        const isReversed = index % 2 === 1;

        return (
          <section
            key={pillar.id}
            className="relative py-16 sm:py-24 border-t border-gray-800"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  isReversed ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Content */}
                <div className={isReversed ? "lg:col-start-2" : ""}>
                  <div className="space-y-6">
                    <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                      {pillar.eyebrow}
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                      {pillar.headline}
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Feature Cards */}
                  <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillar.cards.map((card) => {
                      const CardIcon = card.icon;
                      return (
                        <Link
                          key={card.title}
                          href={card.href}
                          className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-all"
                        >
                          <div 
                            className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-lg"
                            style={{ 
                              borderWidth: '1px',
                              borderColor: `${card.color}4D`,
                              backgroundColor: `${card.color}0D`
                            }}
                          >
                            <CardIcon className="w-5 h-5" style={{ color: card.color }} />
                          </div>
                          <h3 className="text-sm font-semibold text-white mb-2">
                            {card.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {card.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Visual */}
                <div
                  className={`relative h-96 rounded-lg border border-gray-800 overflow-hidden ${
                    isReversed ? "lg:col-start-1" : ""
                  }`}
                >
                  <Image
                    src={pillar.image}
                    alt={pillar.headline}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
