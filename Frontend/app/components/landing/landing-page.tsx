import { Header } from "../layout/header";
import { HeroSection } from "./hero-section";
import { ServicesSection } from "./services-section";
import { PillarSections } from "./pillar-sections";
import { ClientsSection } from "./clients-section";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-background">
        <HeroSection />
        <ServicesSection />
        <PillarSections />
        <ClientsSection />
        <Footer />
      </main>
    </>
  );
}
