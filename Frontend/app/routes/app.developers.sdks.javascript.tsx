import { createFileRoute } from "@tanstack/react-router";
import { SDKPage } from "@/components/developers/SDKPage";

export const Route = createFileRoute("/app/developers/sdks/javascript")({
  head: () => ({
    meta: [
      { title: "JavaScript SDK · CredLayer Developers" },
      { name: "description", content: "Install and use the CredLayer JavaScript SDK for reputation scores and credentials." },
      { property: "og:title", content: "JavaScript SDK · CredLayer Developers" },
      { property: "og:description", content: "Install and use the CredLayer JavaScript SDK for reputation scores and credentials." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/sdks/javascript" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/sdks/javascript" }],
  }),
  component: () => (
    <SDKPage
      language="JavaScript"
      version="1.2.4"
      install="npm install @credlayer/sdk"
      color="text-[#F7DF1E]"
    />
  ),
});
