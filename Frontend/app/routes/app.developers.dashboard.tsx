import { createFileRoute } from "@tanstack/react-router";
import { DeveloperDashboard } from "@/components/developers/DeveloperDashboard";

export const Route = createFileRoute("/app/developers/dashboard")({
  head: () => ({
    meta: [
      { title: "Developer Dashboard · CredLayer" },
      { name: "description", content: "Monitor CredLayer API usage, request volume, and response status codes for your project." },
      { property: "og:title", content: "Developer Dashboard · CredLayer" },
      { property: "og:description", content: "Monitor CredLayer API usage, request volume, and response status codes for your project." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/dashboard" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/dashboard" }],
  }),
  component: DeveloperDashboard,
});
