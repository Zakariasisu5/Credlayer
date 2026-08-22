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
