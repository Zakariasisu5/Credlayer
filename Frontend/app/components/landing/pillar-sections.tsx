"use client";

import { FaShieldAlt, FaDatabase, FaCode, FaBrain, FaLock, FaBolt, FaCodeBranch, FaGlobe, FaChartBar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../ui/scroll-reveal";
import agentImg from "../../assets/agent.jpg";
import credentialsImg from "../../assets/Credentials.jpg";
import developersImg from "../../assets/Developers.png";

const PILLARS = [
  {
    id: "ai-reputation",
    eyebrow: "AI REPUTATION & SCORING",
    headline: "Graph Neural Networks for Trust Intelligence",
    description:
      "Our proprietary GNN model analyzes complex on-chain behavior patterns to generate highly accurate reputation scores. Powered by advanced machine learning, deep pattern recognition, and real-time risk assessment across the entire blockchain ecosystem.",
    image: agentImg,
    cta: {
      primary: { text: "Try Analysis", href: "/app/analysis" },
      secondary: { text: "Learn More", href: "/services" },
    },
    cards: [
      {
        icon: FaShieldAlt,
        title: "Real-Time Scoring",
        description: "Instant reputation analysis for any wallet address with sub-second response times and 99.9% uptime reliability",
        href: "/app/analysis",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaBrain,
        title: "Pattern Recognition",
        description: "Advanced AI-powered detection of behavioral anomalies, suspicious activity patterns, and potential fraud indicators",
        href: "/app/analysis",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaChartBar,
        title: "Risk Assessment",
        description: "Comprehensive risk profiling with predictive alerts, threat intelligence, and actionable insights for decision-making",
        href: "/app/analysis",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
    ],
  },
  {
    id: "blockchain-credentials",
    eyebrow: "BLOCKCHAIN CREDENTIALS",
    headline: "On-Chain Verification You Can Trust",
    description:
      "Issue and manage tamper-proof credentials directly on the blockchain. Cryptographic verification ensures complete authenticity while maintaining user privacy and cross-chain portability throughout the entire Web3 ecosystem.",
    image: credentialsImg,
    cta: {
      primary: { text: "Issue Credentials", href: "/app/credentials" },
      secondary: { text: "View Docs", href: "/developers/docs" },
    },
    cards: [
      {
        icon: FaLock,
        title: "Cryptographic Proof",
        description: "Verifiable credentials with zero-knowledge proofs ensuring maximum privacy while maintaining full verifiability",
        href: "/app/credentials",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaGlobe,
        title: "Cross-Chain Support",
        description: "Credentials that work seamlessly across Solana, Ethereum, Polygon, and emerging blockchain networks",
        href: "/app/credentials",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaDatabase,
        title: "Instant Validation",
        description: "Real-time credential verification with blockchain consensus and permanent on-chain proof of authenticity",
        href: "/app/credentials",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
    ],
  },
  {
    id: "developer-platform",
    eyebrow: "DEVELOPER PLATFORM",
    headline: "Built for Developers, By Developers",
    description:
      "Enterprise-grade API infrastructure with comprehensive SDKs, real-time webhooks, and extensive documentation. Integrate powerful reputation intelligence into your application in minutes, not months, with our developer-first platform.",
    image: developersImg,
    cta: {
      primary: { text: "Get API Key", href: "/developers" },
      secondary: { text: "View SDK", href: "/developers/sdk" },
    },
    cards: [
      {
        icon: FaBolt,
        title: "RESTful API",
        description: "Clean, well-documented API endpoints with complete OpenAPI specification and interactive API explorer",
        href: "/developers/docs",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaCode,
        title: "SDK & Libraries",
        description: "First-class TypeScript, Python, and Rust SDK support with full type safety and comprehensive examples",
        href: "/developers/sdk",
        color: "#C13A24",
        colorDark: "#8FD3FF",
      },
      {
        icon: FaCodeBranch,
        title: "Webhooks",
        description: "Real-time event notifications for state changes, credential updates, and reputation score modifications",
        href: "/developers/docs",
        color: "#C13A24",
        colorDark: "#8FD3FF",
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
            className="relative py-12 lg:py-16 border-t border-border"
          >
            <div className="mx-auto max-w-7xl px-5 lg:px-10">
              <div
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  isReversed ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Content */}
                <div className={isReversed ? "lg:col-start-2" : ""}>
                  <ScrollReveal direction={isReversed ? "right" : "left"}>
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                        {pillar.eyebrow}
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                        {pillar.headline}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button href={pillar.cta.primary.href} size="sm">
                          {pillar.cta.primary.text}
                        </Button>
                        <Button href={pillar.cta.secondary.href} variant="outline" size="sm">
                          {pillar.cta.secondary.text}
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Feature Cards - Grid Layout */}
                  <StaggerContainer staggerDelay={0.1}>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {pillar.cards.map((card) => {
                        const CardIcon = card.icon;
                        return (
                          <StaggerItem key={card.title}>
                            <Link
                              href={card.href}
                              className="group relative p-4 rounded-xl border border-border bg-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden block h-full"
                            >
                              {/* Hover gradient effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative flex flex-col h-full gap-3">
                                {/* Icon with glow effect */}
                                <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-primary/30 bg-primary/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
                                  <CardIcon className="w-5 h-5 text-primary relative z-10" />
                                  <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                  <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                                    {card.title}
                                  </h3>
                                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                    {card.description}
                                  </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="flex items-center text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                                  <span>Learn more</span>
                                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          </StaggerItem>
                        );
                      })}
                    </div>
                  </StaggerContainer>
                </div>

                {/* Visual */}
                <ScrollReveal 
                  direction={isReversed ? "left" : "right"} 
                  delay={0.2}
                  className={isReversed ? "lg:col-start-1" : ""}
                >
                  <div className="relative h-[300px] lg:h-[350px] rounded-xl border border-border overflow-hidden shadow-card">
                    <Image
                      src={pillar.image}
                      alt={pillar.headline}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
