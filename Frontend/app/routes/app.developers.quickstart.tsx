import { createFileRoute } from "@tanstack/react-router";
import { QuickStart } from "@/components/developers/docs/QuickStart";

export const Route = createFileRoute("/app/developers/quickstart")({
  head: () => ({
    meta: [
      { title: "Quickstart · CredLayer Developers" },
      { name: "description", content: "Fetch your first wallet reputation score with the CredLayer API in under five minutes." },
      { property: "og:title", content: "Quickstart · CredLayer Developers" },
      { property: "og:description", content: "Fetch your first wallet reputation score with the CredLayer API in under five minutes." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/quickstart" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/quickstart" }],
  }),
  component: QuickStart,
});
