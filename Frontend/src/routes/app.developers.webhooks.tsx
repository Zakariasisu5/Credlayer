import { createFileRoute } from "@tanstack/react-router";
import { Webhooks } from "@/components/developers/Webhooks";

export const Route = createFileRoute("/app/developers/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhooks · CredLayer Developers" },
      { name: "description", content: "Subscribe to CredLayer reputation events and verify webhook delivery signatures." },
      { property: "og:title", content: "Webhooks · CredLayer Developers" },
      { property: "og:description", content: "Subscribe to CredLayer reputation events and verify webhook delivery signatures." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/webhooks" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/webhooks" }],
  }),
  component: Webhooks,
});
