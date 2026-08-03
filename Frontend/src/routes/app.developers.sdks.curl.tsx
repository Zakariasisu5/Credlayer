import { createFileRoute } from "@tanstack/react-router";
import { SDKPage } from "@/components/developers/SDKPage";

export const Route = createFileRoute("/app/developers/sdks/curl")({
  head: () => ({
    meta: [
      { title: "cURL Examples · CredLayer Developers" },
      { name: "description", content: "Call the CredLayer reputation REST API directly with cURL." },
      { property: "og:title", content: "cURL Examples · CredLayer Developers" },
      { property: "og:description", content: "Call the CredLayer reputation REST API directly with cURL." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/sdks/curl" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/sdks/curl" }],
  }),
  component: () => (
    <SDKPage
      language="cURL"
      version="REST API"
      install="curl https://api.credlayer.io"
      color="text-gold"
    />
  ),
});
