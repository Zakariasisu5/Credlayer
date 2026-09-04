"use client";

import { useState } from "react";
import { FaCoins, FaUsers, FaRobot } from "react-icons/fa";
import Image from "next/image";
import credentialsImg from "../../assets/Credentials.jpg";
import activityImg from "../../assets/activity.jpg";
import agentImg from "../../assets/agent.jpg";

const USE_CASES = [
  {
    id: "defi",
    title: "DeFi Lending",
    icon: FaCoins,
    image: activityImg,
    color: "#10b981", // green
    description:
      "Assess borrower reputation before extending credit. Real-time risk scoring helps lending protocols make informed decisions and reduce default rates.",
    features: [
      "Credit score generation from on-chain history",
      "Transaction pattern analysis",
      "Cross-protocol reputation aggregation",
      "Risk-based interest rate optimization",
    ],
  },
  {
    id: "protocols",
    title: "Protocols & DAOs",
    icon: FaUsers,
    image: credentialsImg,
    color: "#3b82f6", // blue
    description:
      "Screen wallet addresses before governance participation. Identify trustworthy contributors and prevent Sybil attacks with verifiable reputation data.",
    features: [
      "Contributor reputation tracking",
      "Voting power weighted by trust score",
      "Sybil resistance mechanisms",
      "Treasury interaction analysis",
    ],
  },
  {
    id: "agents",
    title: "AI Agents",
    icon: FaRobot,
    image: agentImg,
    color: "#8b5cf6", // purple
    description:
      "Enable autonomous agents to transact safely in Web3. Reputation scores help agents evaluate counterparties and make trust-based decisions without human oversight.",
    features: [
      "Agent-to-agent trust verification",
      "Automated risk threshold enforcement",
      "Transaction confidence scoring",
      "Historical behavior analysis",
    ],
  },
];

export function UseCaseTabs() {
  const [activeTab, setActiveTab] = useState("defi");
  const activeCase = USE_CASES.find((c) => c.id === activeTab) || USE_CASES[0];
  const Icon = activeCase.icon;

  return (
    <section className="relative py-16 sm:py-24 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Your Use Case
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Reputation intelligence designed for the unique needs of Web3 ecosystems
          </p>
        </div>

        {/* Tab Strip */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {USE_CASES.map((useCase) => {
            const TabIcon = useCase.icon;
            return (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-lg border transition-all ${
                  activeTab === useCase.id
                    ? "bg-cyan-500/10 border-cyan-500 text-white"
                    : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                <TabIcon className="w-5 h-5" />
                <span className="font-semibold">{useCase.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Use Case Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Description & Features */}
          <div className="space-y-6">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-lg"
              style={{ 
                borderWidth: '1px',
                borderColor: `${activeCase.color}4D`,
                backgroundColor: `${activeCase.color}0D`
              }}
            >
              <Icon className="w-8 h-8" style={{ color: activeCase.color }} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {activeCase.title}
            </h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              {activeCase.description}
            </p>
            <ul className="space-y-3">
              {activeCase.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <a
                href="/app"
                className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
              >
                Get started
              </a>
            </div>
          </div>

          {/* Right: Visual Placeholder */}
          <div className="relative h-96 rounded-lg border border-gray-800 overflow-hidden">
            <Image
              src={activeCase.image}
              alt={activeCase.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
