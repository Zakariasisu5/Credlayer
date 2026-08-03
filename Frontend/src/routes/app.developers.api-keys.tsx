import { createFileRoute } from "@tanstack/react-router";
import { APIKeys } from "@/components/developers/APIKeys";

export const Route = createFileRoute("/app/developers/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys · CredLayer Developers" },
      { name: "description", content: "Create, rotate, and revoke CredLayer API keys for your reputation integrations." },
      { property: "og:title", content: "API Keys · CredLayer Developers" },
      { property: "og:description", content: "Create, rotate, and revoke CredLayer API keys for your reputation integrations." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/api-keys" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/api-keys" }],
  }),
  component: APIKeys,
});
