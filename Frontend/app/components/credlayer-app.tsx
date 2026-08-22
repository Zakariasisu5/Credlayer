"use client";

import { usePathname } from "next/navigation";
import { LandingPage } from "./landing";

// Workspace pages
import { DashboardPage } from "./workspace/dashboard";
import { ProfilePage } from "./workspace/profile";
import { AnalysisPage } from "./workspace/analysis";
import { AgentsPage } from "./workspace/agents";
import { CredentialsPage } from "./workspace/credentials";
import { ActivityPage } from "./workspace/activity";
import { SettingsPage } from "./workspace/settings";

// Developer portal pages
import { DeveloperDashboardPage } from "./developers/developer-dashboard";
import { ApiKeysPage } from "./developers/api-keys";
import { DocumentationPage } from "./developers/documentation";
import { SdkPage } from "./developers/sdk";

// Other pages
import { ProtocolPage } from "./pages/protocol";
import { ExplorerPage } from "./pages/explorer";
import { DashboardPreviewPage } from "./pages/dashboard-preview";

export default function CredLayerApp() {
  const pathname = usePathname();

  // Landing page
  if (pathname === "/") return <LandingPage />;

  // Public pages
  if (pathname === "/protocol") return <ProtocolPage />;
  if (pathname === "/explorer") return <ExplorerPage />;
  if (pathname === "/dashboard-preview") return <DashboardPreviewPage />;

  // Workspace pages
  if (pathname === "/app") return <DashboardPage />;
  if (pathname === "/app/dashboard") return <DashboardPage />;
  if (pathname === "/app/profile") return <ProfilePage />;
  if (pathname === "/app/analysis") return <AnalysisPage />;
  if (pathname === "/app/agents") return <AgentsPage />;
  if (pathname === "/app/credentials") return <CredentialsPage />;
  if (pathname === "/app/activity") return <ActivityPage />;
  if (pathname === "/app/settings") return <SettingsPage />;

  // Developer portal pages
  if (pathname === "/developers/dashboard" || pathname === "/developers") return <DeveloperDashboardPage />;
  if (pathname === "/developers/api-keys") return <ApiKeysPage />;
  if (pathname === "/developers/docs") return <DocumentationPage />;
  if (pathname === "/developers/sdk") return <SdkPage />;

  // Default fallback
  return <LandingPage />;
}

export { CredLayerApp };
