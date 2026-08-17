"use client";

import { Users, Shield, Zap, Globe } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaAws } from "react-icons/fa";
import { SiInfosys, SiTcs } from "react-icons/si";
import { BsBuilding } from "react-icons/bs";

const STATS = [
  { 
    label: "Verified Wallets",
    value: "50K+",
    icon: Users,
    color: "text-cyan-400"
  },
  { 
    label: "Credentials Issued",
    value: "250K+",
    icon: Shield,
    color: "text-blue-400"
  },
  { 
    label: "API Requests/Day",
    value: "5M+",
    icon: Zap,
    color: "text-purple-400"
  },
  { 
    label: "Enterprise Clients",
    value: "100+",
    icon: Globe,
    color: "text-green-400"
  },
];

const CLIENTS = [
  { 
    name: "AWS", 
    icon: FaAws,
    color: "text-orange-500"
  },
  { 
    name: "Microsoft", 
    icon: FaMicrosoft,
    color: "text-blue-500"
  },
  { 
    name: "Google", 
    icon: FcGoogle,
    color: ""
  },
  { 
    name: "Infosys", 
    icon: SiInfosys,
    color: "text-blue-600"
  },
  { 
    name: "TCS", 
    icon: SiTcs,
    color: "text-purple-600"
  },
  { 
    name: "Deloitte", 
    icon: BsBuilding,
    color: "text-green-500"
  },
];

export function ClientsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-16 sm:py-20 lg:px-8 lg:py-32 border-t border-cyan-500/10">
      {/* Background effects */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-4xl rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-block mb-4">
            <div className="relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-400 mb-2 flex items-center gap-2 justify-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400" />
                TRUSTED BY THOUSANDS
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400" />
              </h2>
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Powering The Future of Web3 Trust
          </h3>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Join the growing ecosystem of enterprises building on CredLayer&apos;s verification infrastructure
          </p>
        </div>

        {/* Key Clients */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-8 text-center">
            <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Key Clients</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-center justify-items-center max-w-6xl mx-auto">
            {CLIENTS.map((client, index) => {
              const Icon = client.icon;
              return (
                <div
                  key={client.name}
                  className="group relative w-full flex flex-col items-center justify-center opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-cyan-400/0 blur-xl opacity-0 transition-all duration-300 group-hover:bg-cyan-400/20 group-hover:opacity-100" />
                  
                  {/* Icon Container */}
                  <div className="relative flex flex-col items-center justify-center h-20 sm:h-24 w-full px-3 sm:px-4 py-3 sm:py-4 transition-all duration-300 group-hover:scale-110">
                    <Icon 
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${client.color || 'text-cyan-400'} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <span className="mt-2 text-xs font-medium text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                      {client.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative opacity-0 animate-fadeInUp"
                style={{ 
                  animationDelay: `${index * 100 + 600}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {/* Card background with hover effect */}
                <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative h-full rounded-xl border border-cyan-500/20 bg-[#0a1628]/60 backdrop-blur-sm p-6 transition-all duration-300 group-hover:border-cyan-400/40 group-hover:-translate-y-1">
                  {/* Icon */}
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg border border-cyan-500/30 bg-transparent">
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                  
                  {/* Value */}
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof Section */}
        <div className="mt-8">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1628]/80 to-[#061426]/60 backdrop-blur-sm p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Ready to Build Trust at Scale?
                </h4>
                <p className="text-gray-400 mb-6">
                  Join leading Web3 companies using CredLayer to verify identities, issue credentials, and build reputation systems.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="/app"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-colors duration-300"
                  >
                    Start Free Trial
                  </a>
                  <a 
                    href="/developers"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-medium transition-colors duration-300"
                  >
                    View Documentation
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "24/7 Support", value: "Enterprise SLA" },
                  { label: "Uptime Guarantee", value: "99.9%" },
                  { label: "Response Time", value: "<100ms" },
                ].map((item, i) => (
                  <div 
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-lg border border-cyan-500/20 bg-[#0a1628]/40 opacity-0 animate-fadeInLeft"
                    style={{ 
                      animationDelay: `${i * 100 + 1200}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className="text-sm font-semibold text-cyan-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
