"use client";

import { Target, Users, Zap, Shield, Globe, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "../layout/header";
import { Footer } from "../landing/footer";
import { Button } from "../ui/button";

const VALUES = [
  {
    icon: Shield,
    title: "Trust First",
    description: "We build systems that prioritize security, privacy, and transparency at every level."
  },
  {
    icon: Zap,
    title: "Innovation Driven",
    description: "We push the boundaries of what's possible with AI and blockchain technology."
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "We build for the community, with open communication and collaborative development."
  },
  {
    icon: Globe,
    title: "Globally Accessible",
    description: "We create inclusive infrastructure that serves users worldwide, regardless of location."
  }
];

const TEAM = [
  {
    name: "Leadership Team",
    description: "Experienced leaders from blockchain, AI, and enterprise security backgrounds",
    members: [
      "Former executives from leading Web3 protocols",
      "AI/ML researchers from top universities",
      "Enterprise security veterans"
    ]
  },
  {
    name: "Engineering Team",
    description: "World-class engineers building the future of trust infrastructure",
    members: [
      "Blockchain protocol developers",
      "Machine learning engineers",
      "Full-stack developers"
    ]
  },
  {
    name: "Research Team",
    description: "Dedicated researchers advancing the state of reputation systems",
    members: [
      "PhD researchers in cryptography",
      "Reputation system specialists",
      "Academic partnerships"
    ]
  }
];

const MILESTONES = [
  {
    year: "2023",
    title: "Company Founded",
    description: "CredLayer was established with a mission to build trust infrastructure for Web3"
  },
  {
    year: "2024",
    title: "Platform Launch",
    description: "Launched AI-powered reputation scoring and blockchain credentials platform"
  },
  {
    year: "2025",
    title: "Enterprise Adoption",
    description: "Reached 100+ enterprise clients and 50K+ verified wallets"
  },
  {
    year: "2026",
    title: "Multi-Chain Expansion",
    description: "Expanded support to 8+ blockchains with cross-chain reputation aggregation"
  }
];

export function AboutPage() {
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

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Building Trust Infrastructure for Web3
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              CredLayer is on a mission to make the decentralized web more trustworthy, secure, and accessible for everyone.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
                <Target className="h-7 w-7 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                To empower the Web3 ecosystem with AI-powered trust and verification infrastructure that makes decentralized interactions secure, reliable, and fraud-free.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
                <Heart className="h-7 w-7 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                A decentralized future where trust is transparent, verifiable, and accessible to all—enabling secure interactions without intermediaries.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The principles that guide everything we build and every decision we make.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6 hover:border-cyan-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-400">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Team</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We're a diverse team of builders, researchers, and innovators passionate about making Web3 more trustworthy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TEAM.map((team) => (
                <div
                  key={team.name}
                  className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{team.description}</p>
                  <ul className="space-y-2">
                    {team.members.map((member, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Key milestones in our mission to build trust infrastructure for Web3.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-400/30 to-transparent hidden md:block" />

              <div className="space-y-8">
                {MILESTONES.map((milestone, idx) => (
                  <div key={milestone.year} className="relative flex gap-6">
                    {/* Timeline dot */}
                    <div className="hidden md:flex items-center justify-center h-16 w-16 rounded-full border-4 border-[#030c18] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 flex-shrink-0">
                      <span className="text-sm font-bold text-cyan-400">{milestone.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-6">
                      <div className="flex items-center gap-3 mb-2 md:hidden">
                        <span className="text-sm font-bold text-cyan-400">{milestone.year}</span>
                        <div className="h-px flex-1 bg-cyan-500/20" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Join Us in Building the Future
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you're looking to integrate our platform or join our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/demo" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button href="/contact" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
