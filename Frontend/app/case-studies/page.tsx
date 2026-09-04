"use client";

import { ExternalLink, Shield } from "lucide-react";
import { Header } from "../components/layout/header";
import { Button } from "../components/ui/button";
import Link from "next/link";

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

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-5 py-16 lg:px-10 lg:py-24">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Building in Public
            </h1>
            <p className="text-lg text-muted-foreground">
              We're developing CredLayer in the open. Real case studies will be shared as partners adopt the platform
            </p>
          </div>

          {/* Case Studies */}
      <div className="space-y-8 mb-16">
        {caseStudies.map((study) => {
          const Icon = study.icon;
          return (
            <div
              key={study.title}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-all shadow-card"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/30">
                        {study.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{study.client}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-foreground">{study.title}</h2>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg border border-primary/30">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                        Challenge
                      </h3>
                      <p className="text-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                        Solution
                      </h3>
                      <p className="text-foreground">{study.solution}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      Results
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {study.results.map((result) => (
                        <li key={result} className="flex items-start text-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {study.metrics.improvement}
                      </div>
                      <div className="text-sm text-muted-foreground">{study.metrics.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-card max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3 text-foreground">
          Interested in early access?
        </h2>
        <p className="text-muted-foreground mb-6">
          Join our early adopter program and help shape the future of Web3 reputation systems.
        </p>
        <Button href="/contact">
          Get Started
          <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
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
