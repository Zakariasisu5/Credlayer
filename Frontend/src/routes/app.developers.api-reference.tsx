import { createFileRoute } from "@tanstack/react-router";
import { APIReference } from "@/components/developers/APIReference";

export const Route = createFileRoute("/app/developers/api-reference")({
  head: () => ({
    meta: [
      { title: "API Reference · CredLayer Developers" },
      { name: "description", content: "Full REST endpoint reference for CredLayer reputation, credential, and agent APIs." },
      { property: "og:title", content: "API Reference · CredLayer Developers" },
      { property: "og:description", content: "Full REST endpoint reference for CredLayer reputation, credential, and agent APIs." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/api-reference" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/api-reference" }],
  }),
  component: APIReference,
});
