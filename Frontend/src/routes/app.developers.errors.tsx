import { createFileRoute } from "@tanstack/react-router";
import { ErrorCodes } from "@/components/developers/ErrorCodes";

export const Route = createFileRoute("/app/developers/errors")({
  head: () => ({
    meta: [
      { title: "Error Codes · CredLayer Developers" },
      { name: "description", content: "Every CredLayer API error code, what causes it, and how to recover from it." },
      { property: "og:title", content: "Error Codes · CredLayer Developers" },
      { property: "og:description", content: "Every CredLayer API error code, what causes it, and how to recover from it." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/errors" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/errors" }],
  }),
  component: ErrorCodes,
});
