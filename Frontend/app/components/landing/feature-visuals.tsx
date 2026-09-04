"use client";

import Image from "next/image";
import analysisImg from "../../assets/analysis.png";
import agentImg from "../../assets/agent.jpg";
import credentialsImg from "../../assets/Credentials.jpg";
import activityImg from "../../assets/activity.jpg";
import settingsImg from "../../assets/settings.jpg";
import developersImg from "../../assets/Developers.png";

interface FeatureVisualProps {
  type: "analysis" | "agents" | "credentials" | "activity" | "settings" | "developers";
  className?: string;
}

export function FeatureVisual({ type, className = "" }: FeatureVisualProps) {
  const images = {
    analysis: analysisImg,
    agents: agentImg,
    credentials: credentialsImg,
    activity: activityImg,
    settings: settingsImg,
    developers: developersImg,
  };

  const altTexts = {
    analysis: "AI-powered trust scoring and reputation analytics dashboard",
    agents: "Autonomous AI agent management interface",
    credentials: "Blockchain credential verification system",
    activity: "Transaction and event history timeline",
    settings: "Account preferences and configuration panel",
    developers: "API documentation and developer tools",
  };

  return (
    <div className={`relative ${className}`}>
      <Image
        src={images[type]}
        alt={altTexts[type]}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-lg"
        priority
      />
      {/* Overlay gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
    </div>
  );
}
