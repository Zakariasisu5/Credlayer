import { Nav } from "@/components/credlayer/Nav";
import { Hero } from "@/components/credlayer/Hero";
import { Features } from "@/components/credlayer/Features";
import { DashboardPreview } from "@/components/credlayer/DashboardPreview";
import { CTA, Footer } from "@/components/credlayer/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
