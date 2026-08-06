import { createFileRoute } from "@tanstack/react-router";
import { DeveloperHome } from "@/components/developers/DeveloperHome";

export const Route = createFileRoute("/app/developers/")({
  head: () => ({
    meta: [
      { title: "Developer Home · CredLayer" },
      { name: "description", content: "Start building with CredLayer reputation APIs, SDKs, and webhooks." },
      { property: "og:title", content: "Developer Home · CredLayer" },
      { property: "og:description", content: "Start building with CredLayer reputation APIs, SDKs, and webhooks." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers" }],
  }),
  component: DeveloperHome,
});
