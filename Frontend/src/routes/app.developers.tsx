import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DeveloperLayout } from "@/components/developers/DeveloperLayout";

export const Route = createFileRoute("/app/developers")({
  component: DevelopersPage,
  head: () => ({
    meta: [
      { title: "CredLayer Developer Portal" },
      { name: "description", content: "Build trusted Web3 applications with CredLayer APIs and SDKs. Complete documentation, API reference, and code examples." },
    ],
  }),
});

function DevelopersPage() {
  return (
    <DeveloperLayout>
      <Outlet />
    </DeveloperLayout>
  );
}
