import { createFileRoute } from "@tanstack/react-router";
import { RateLimits } from "@/components/developers/RateLimits";

export const Route = createFileRoute("/app/developers/rate-limits")({
  head: () => ({
    meta: [
      { title: "Rate Limits · CredLayer Developers" },
      { name: "description", content: "Per-plan CredLayer API rate limits, burst allowances, and throttling headers." },
      { property: "og:title", content: "Rate Limits · CredLayer Developers" },
      { property: "og:description", content: "Per-plan CredLayer API rate limits, burst allowances, and throttling headers." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/rate-limits" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/rate-limits" }],
  }),
  component: RateLimits,
});
