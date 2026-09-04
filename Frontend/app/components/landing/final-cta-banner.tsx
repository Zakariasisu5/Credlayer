"use client";

import Link from "next/link";

export function FinalCTABanner() {
  return (
    <section className="relative py-20 sm:py-32 border-t border-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Ready to Build Trust at Scale?
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join the early access program and help shape the future of Web3 reputation systems
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white text-lg font-semibold rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            Try the Demo
          </Link>
          <Link
            href="/developers"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-lg font-semibold rounded-lg hover:border-cyan-400/70 transition-all duration-300"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}
