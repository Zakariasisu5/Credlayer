"use client";

import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaAws } from "react-icons/fa";
import { SiInfosys, SiTcs } from "react-icons/si";
import { BsBuilding } from "react-icons/bs";

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
    <section className="relative mx-auto max-w-7xl px-4 sm:px-5 py-12 sm:py-16 lg:px-8 lg:py-20 border-t border-cyan-500/10">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-full max-w-3xl rounded-full bg-cyan-500/5 blur-3xl" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-block">
            <div className="relative">
              <h2 className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-400 mb-2">
                KEY CLIENTS
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>
          </div>
        </div>

        {/* Client Icons - Fully Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-center justify-items-center max-w-6xl mx-auto">
          {CLIENTS.map((client, index) => {
            const Icon = client.icon;
            return (
              <div
                key={client.name}
                className="group relative w-full flex flex-col items-center justify-center animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
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
    </section>
  );
}
