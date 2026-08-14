import { Header } from "../layout/header";
import { HeroSection } from "./hero-section";
import { ServicesSection } from "./services-section";
import { ClientsSection } from "./clients-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        {/* Continuous background */}
        <div className="fixed inset-0 -z-10 bg-[#030c18]">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px] animate-pulse [animation-delay:3s]" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <HeroSection />
        <ServicesSection />
        <ClientsSection />
        <Footer />
      </main>
    </>
  );
}
