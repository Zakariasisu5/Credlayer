import { HeaderV2 } from "./header-v2";
import { HeroSectionV2 } from "./hero-section-v2";
import { FeatureTabsSection } from "./feature-tabs-section";
import { PillarSections } from "./pillar-sections";
import { UseCaseTabs } from "./use-case-tabs";
import { FinalCTABanner } from "./final-cta-banner";
import { Footer } from "./footer";

export function LandingPageV2() {
  return (
    <>
      <HeaderV2 />
      <main className="relative overflow-hidden">
        {/* Solid Black Background */}
        <div className="fixed inset-0 -z-10 bg-black" />

        <HeroSectionV2 />
        <FeatureTabsSection />
        <PillarSections />
        <UseCaseTabs />
        <FinalCTABanner />
        <Footer />
      </main>
    </>
  );
}
