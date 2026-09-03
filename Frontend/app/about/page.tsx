import { Metadata } from "next";
import { Target, Eye, Zap, Shield, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - CredLayer",
  description: "Learn about CredLayer's mission to build trust in Web3",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "We believe in building verifiable reputation systems that are transparent and auditable on-chain.",
    },
    {
      icon: Zap,
      title: "Speed & Reliability",
      description:
        "Real-time analysis with sub-second response times and 99.9% uptime for mission-critical applications.",
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description:
        "Our tools are built for developers and end-users, making Web3 safer and more accessible for everyone.",
    },
  ];

  const stats = [
    { value: "10M+", label: "Wallets Analyzed" },
    { value: "50+", label: "Protocols Integrated" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "<100ms", label: "API Response Time" },
  ];

  const team = [
    {
      role: "Leadership",
      description: "Experienced founders from top Web3 protocols and AI research labs",
    },
    {
      role: "Engineering",
      description: "World-class engineers building scalable infrastructure for Web3",
    },
    {
      role: "Research",
      description: "PhD-level researchers advancing on-chain intelligence and ML models",
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
                Trust in Web3
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              CredLayer is on a mission to make Web3 safer and more transparent through
              AI-powered reputation and risk intelligence.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-lg mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400">
                To provide the most accurate and comprehensive reputation and risk intelligence
                for Web3, enabling protocols, users, and autonomous agents to transact with
                confidence. We're building the trust infrastructure that Web3 deserves.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-lg mb-4">
                <Eye className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-400">
                A Web3 ecosystem where trust is verifiable, reputation is portable, and risk is
                transparent. We envision a future where every wallet, protocol, and agent has a
                verifiable reputation that follows them across the entire blockchain ecosystem.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg mb-4">
                      <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((item) => (
                <div
                  key={item.role}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">{item.role}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Join Us in Building the Future</h2>
              <p className="text-gray-400 mb-6">
                We're always looking for talented individuals to join our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg transition-colors"
                >
                  Try CredLayer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
