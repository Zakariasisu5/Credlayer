"use client";

import { Target, Eye, Zap, Shield, Users } from "lucide-react";
import { Header } from "../components/layout/header";
import { Button } from "../components/ui/button";
import Link from "next/link";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "We believe in building verifiable reputation systems that are transparent and auditable on-chain.",
  },
  {
    icon: Zap,
    title: "Innovation & Quality",
    description:
      "Developing cutting-edge AI models and blockchain infrastructure with a focus on accuracy and reliability.",
  },
  {
    icon: Users,
    title: "User-Centric Design",
    description:
      "Our tools are built for developers and end-users, making Web3 safer and more accessible for everyone.",
  },
];

const stats = [
  { value: "MVP", label: "Development Stage" },
  { value: "GNN", label: "Model Trained" },
  { value: "Open", label: "Building in Public" },
  { value: "Soon", label: "Early Access" },
];

const team = [
  {
    role: "Development",
    description: "Building the future of Web3 reputation intelligence from the ground up",
  },
  {
    role: "Research",
    description: "Advancing on-chain intelligence through Graph Neural Networks and ML",
  },
  {
    role: "Community",
    description: "Growing an open ecosystem of contributors and early adopters",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-5 py-16 lg:px-10 lg:py-24">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Building Trust in Web3
            </h1>
            <p className="text-lg text-muted-foreground">
              CredLayer is on a mission to make Web3 safer and more transparent through AI-powered reputation and risk intelligence
            </p>
          </div>

          {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg border border-primary/30 mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
          <p className="text-muted-foreground">
            To provide the most accurate and comprehensive reputation and risk intelligence
            for Web3, enabling protocols, users, and autonomous agents to transact with
            confidence. We're building the trust infrastructure that Web3 deserves.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg border border-primary/30 mb-4">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h2>
          <p className="text-muted-foreground">
            A Web3 ecosystem where trust is verifiable, reputation is portable, and risk is
            transparent. We envision a future where every wallet, protocol, and agent has a
            verifiable reputation that follows them across the entire blockchain ecosystem.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg border border-primary/30 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 mb-16 shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((item) => (
            <div
              key={item.role}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card"
            >
              <h3 className="text-xl font-semibold mb-3 text-primary">{item.role}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3 text-foreground">Join Our Early Community</h2>
        <p className="text-muted-foreground mb-6">
          We're looking for early adopters and contributors to help shape the future of Web3 reputation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/contact">
            Get in Touch
          </Button>
          <Button href="/app" variant="outline">
            Try CredLayer
          </Button>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  </main>
</>
  );
}
