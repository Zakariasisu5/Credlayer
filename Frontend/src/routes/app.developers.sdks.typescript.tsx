import { createFileRoute } from "@tanstack/react-router";
import { SDKPage } from "@/components/developers/SDKPage";

export const Route = createFileRoute("/app/developers/sdks/typescript")({
  head: () => ({
    meta: [
      { title: "TypeScript SDK · CredLayer Developers" },
      { name: "description", content: "Typed CredLayer SDK for reputation scores, credentials, and agent verification." },
      { property: "og:title", content: "TypeScript SDK · CredLayer Developers" },
      { property: "og:description", content: "Typed CredLayer SDK for reputation scores, credentials, and agent verification." },
      { property: "og:url", content: "https://cred-flow-protocol.lovable.app/app/developers/sdks/typescript" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://cred-flow-protocol.lovable.app/app/developers/sdks/typescript" }],
  }),
  component: () => (
    <SDKPage
      language="TypeScript"
      version="1.2.4"
      install="npm install @credlayer/sdk"
      color="text-[#3178C6]"
    />
  ),
});
