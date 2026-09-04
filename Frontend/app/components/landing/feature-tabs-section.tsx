"use client";

import { useState } from "react";
import { FaChartLine, FaRobot, FaShieldAlt, FaClock, FaCog, FaCode } from "react-icons/fa";
import { FeatureVisual } from "./feature-visuals";

const FEATURES = [
  {
    id: "analysis",
    title: "Analysis",
    icon: FaChartLine,
    description:
      "AI-powered trust scoring and reputation analytics. Get real-time risk assessment and behavioral insights for any wallet or protocol.",
    href: "/app/analysis",
    color: "#06b6d4", // cyan
  },
  {
    id: "agents",
    title: "Agents",
    icon: FaRobot,
    description:
      "Autonomous AI agent management and orchestration. Deploy, monitor, and control intelligent agents with built-in trust verification.",
    href: "/app/agents",
    color: "#8b5cf6", // purple
  },
  {
    id: "credentials",
    title: "Credentials",
    icon: FaShieldAlt,
    description:
      "Blockchain credential verification and management. Issue, verify, and track tamper-proof credentials across multiple chains.",
    href: "/app/credentials",
    color: "#3b82f6", // blue
  },
  {
    id: "activity",
    title: "Activity",
    icon: FaClock,
    description:
      "Transaction and event history tracking. Monitor all on-chain activities, reputation changes, and credential updates in real-time.",
    href: "/app/activity",
    color: "#10b981", // green
  },
  {
    id: "settings",
    title: "Settings",
    icon: FaCog,
    description:
      "Account preferences and configuration. Manage your profile, API keys, notification settings, and integration preferences.",
    href: "/app/settings",
    color: "#f59e0b", // orange
  },
  {
    id: "developers",
    title: "Developers",
    icon: FaCode,
    description:
      "API documentation and developer tools. Access comprehensive docs, SDKs, code examples, and integration guides for building with CredLayer.",
    href: "/developers",
    color: "#ef4444", // red
  },
];

export function FeatureTabsSection() {
  const [activeTab, setActiveTab] = useState("analysis");
  const activeFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0];
  const Icon = activeFeature.icon;

  return (
    <section className="relative py-16 sm:py-24 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tab Strip */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-800">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === feature.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {feature.title}
              {activeTab === feature.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div className="space-y-6">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-lg border border-cyan-500/30 bg-cyan-500/5"
              style={{ borderColor: `${activeFeature.color}30`, backgroundColor: `${activeFeature.color}0D` }}
            >
              <Icon className="w-8 h-8" style={{ color: activeFeature.color }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {activeFeature.title}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {activeFeature.description}
            </p>
            <div className="flex gap-4">
              <a
                href={activeFeature.href}
                className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
              >
                Open {activeFeature.title}
              </a>
              <a
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative h-96 rounded-lg border border-gray-800 overflow-hidden">
            <FeatureVisual 
              type={activeFeature.id as "analysis" | "agents" | "credentials" | "activity" | "settings" | "developers"} 
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
