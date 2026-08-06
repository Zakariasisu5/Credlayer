import { createFileRoute } from "@tanstack/react-router";
import { SDKPage } from "@/components/developers/SDKPage";

export const Route = createFileRoute("/app/developers/sdks/python")({
  head: () => ({
    meta: [
      { title: "Python SDK · CredLayer Developers" },
      { name: "description", content: "Install and use the CredLayer Python SDK for reputation scores and credentials." },
      { property: "og:title", content: "Python SDK · CredLayer Developers" },
      { property: "og:description", content: "Install and use the CredLayer Python SDK for reputation scores and credentials." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/sdks/python" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/sdks/python" }],
  }),
  component: () => (
    <SDKPage
      language="Python"
      version="0.9.2"
      install="pip install credlayer"
      color="text-[#3776AB]"
    />
  ),
});
