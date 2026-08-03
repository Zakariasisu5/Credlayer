import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/credlayer/Nav";
import { Hero } from "@/components/credlayer/Hero";
import { Features } from "@/components/credlayer/Features";
import { DashboardPreview } from "@/components/credlayer/DashboardPreview";
import { CTA, Footer } from "@/components/credlayer/CTA";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CredLayer — The Reputation Layer for Web3" },
      { name: "description", content: "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis." },
      { property: "og:title", content: "CredLayer — The Reputation Layer for Web3" },
      { property: "og:description", content: "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://cred-flow-protocol.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://cred-flow-protocol.lovable.app/#website",
              name: "CredLayer",
              url: "https://cred-flow-protocol.lovable.app/",
              description:
                "Portable Web3 reputation for wallets, users, and AI agents — trust scores, verified credentials, and on-chain behavior analysis.",
              publisher: { "@id": "https://cred-flow-protocol.lovable.app/#organization" },
            },
            {
              "@type": "Organization",
              "@id": "https://cred-flow-protocol.lovable.app/#organization",
              name: "CredLayer",
              url: "https://cred-flow-protocol.lovable.app/",
              logo: "https://cred-flow-protocol.lovable.app/favicon.png",
              description:
                "CredLayer is the decentralized reputation protocol for wallets, users, and AI agents.",
            },
            {
              "@type": "SoftwareApplication",
              name: "CredLayer Protocol",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              url: "https://cred-flow-protocol.lovable.app/",
              description:
                "Reputation APIs and SDKs that deliver portable on-chain trust scores, credentials, and AI agent verification.",
            },
          ],
        }),
      },
    ],
  }),
});

function Index() {
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
