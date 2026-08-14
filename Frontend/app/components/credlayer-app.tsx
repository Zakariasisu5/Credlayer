"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, ArrowRight, BarChart3, BookOpen, Code2, Database, Globe2, KeyRound, LayoutDashboard, Network, Radar, Search, Settings, ShieldCheck, Sparkles, UserRound, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { WalletButton } from "./wallet-button";
import { LandingPage } from "./landing";
import { Header, Brand } from "./layout";
import { Badge, Button, Card } from "./ui";

const credLayerLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000050c081f4ade2ab8730a0e87d-RQX8RDIugIzMfNeu4oYtO2nx88jhHr.png";

const appNav: { href: string; label: string; icon: LucideIcon }[] = [{ href: "/app", label: "Overview", icon: LayoutDashboard }, { href: "/app/profile", label: "Profile", icon: UserRound }, { href: "/app/analysis", label: "Analysis", icon: BarChart3 }, { href: "/app/agents", label: "Agents", icon: Sparkles }, { href: "/app/credentials", label: "Credentials", icon: ShieldCheck }, { href: "/app/activity", label: "Activity", icon: Activity }, { href: "/app/settings", label: "Settings", icon: Settings }];
const developerNav: { href: string; label: string }[] = [{ href: "/developers/dashboard", label: "Dashboard" }, { href: "/developers/api-keys", label: "API keys" }, { href: "/developers/docs", label: "Documentation" }, { href: "/developers/sdk", label: "SDK" }];
function AppSidebar({ developer = false }: { developer?: boolean }) { const items = developer ? developerNav.map((item) => ({ ...item, icon: Code2 })) : appNav; const pathname = usePathname(); return <aside className="sticky top-0 h-screen w-60 shrink-0 border-r border-border bg-card/40 p-4 overflow-y-auto hidden lg:block"><div className="mb-8 px-2"><Brand /></div><p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{developer ? "Developer console" : "Workspace"}</p><div className="flex flex-col gap-1">{items.map((item) => { const Icon: LucideIcon = item.icon; const active = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}><Icon className="size-4" />{item.label}</Link>; })}</div><div className="mt-auto pt-16"><div className="rounded-xl border border-border bg-background/60 p-3"><p className="text-xs font-semibold">Need help?</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Read the docs or talk to the community.</p><Button href="/developers/docs" variant="ghost">Open docs <ArrowRight className="size-3" /></Button></div></div></aside>; }
function WalletControl() { return <WalletButton />; }
function Shell({ children, title, eyebrow, developer = false }: { children: React.ReactNode; title?: string; eyebrow?: string; developer?: boolean }) { return <><Header /><div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1440px]">{title && <AppSidebar developer={developer} />}<main className="min-w-0 flex-1">{title && <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-5 py-7 lg:px-10"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{eyebrow || "CredLayer"}</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1></div><WalletControl /></div></div>}{children}</main></div></>; }
function Empty({ icon: Icon = Database, title, description }: { icon?: typeof Database; title: string; description: string }) { return <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border bg-card/30 p-8 text-center"><div><span className="mx-auto mb-4 grid size-10 place-items-center rounded-full border border-border bg-accent text-muted-foreground"><Icon className="size-4" /></span><h3 className="text-sm font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p></div></div>; }
function StyledCard({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-xl border border-primary/20 bg-[#071a2c]/80 p-5 shadow-[0_0_24px_rgba(14,165,233,0.06)] backdrop-blur-sm ${className}`}>{children}</section>; }
function Stat({ label, value = "—", note = "Awaiting data" }: { label: string; value?: string; note?: string }) { return <StyledCard><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p><p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></StyledCard>; }
function NetworkVisual({ dashboard = false }: { dashboard?: boolean }) { const nodes = dashboard ? [[18,18],[38,32],[62,18],[80,38],[25,63],[50,50],[72,68],[88,82],[12,82]] : [[16,28],[32,48],[52,20],[70,38],[86,22],[25,78],[50,68],[76,76],[90,56]]; return <div className={`group relative overflow-hidden rounded-2xl border border-primary/30 bg-[#061426] ${dashboard ? "min-h-[280px]" : "min-h-[390px]"}`}><div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" /><div className="absolute left-1/2 top-[42%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 opacity-70 animate-[ping_4s_ease-in-out_infinite]" /><div className="absolute left-1/2 top-[42%] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 opacity-50 animate-[ping_5s_ease-in-out_1s_infinite]" /><div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-primary/40 bg-background/80 p-3 shadow-[0_0_34px_rgba(32,214,208,0.24)] transition duration-500 group-hover:scale-110"><Image src={credLayerLogo} alt="CredLayer verification infrastructure" width={72} height={72} className="size-16 object-cover" /></div><svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true"><g stroke="rgba(56,189,248,0.45)" strokeWidth="0.25">{nodes.slice(0, -1).map((node, i) => <line key={`line-${i}`} x1={node[0]} y1={node[1]} x2={nodes[i + 1][0]} y2={nodes[i + 1][1]} />)}{nodes.slice(2).map((node, i) => <line key={`cross-${i}`} x1={nodes[i][0]} y1={nodes[i][1]} x2={node[0]} y2={node[1]} />)}</g><g fill="#22d3ee">{nodes.map((node, i) => <circle key={`node-${i}`} cx={node[0]} cy={node[1]} r={i === 5 ? 1.8 : 0.8} className="animate-pulse" />)}</g></svg><div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-xl border border-primary/20 bg-background/80 px-4 py-3 backdrop-blur"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{dashboard ? "Network topology" : "Verification infrastructure"}</span><span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_#22d3ee] animate-pulse" />Live preview</span></div></div>; }
function SecurityLogoVisual() { const particles = Array.from({ length: 12 }); return <div className="relative isolate flex min-h-[430px] items-center justify-center overflow-hidden bg-[#020915] px-4 py-10 sm:min-h-[560px] sm:px-8"><div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" /><div className="absolute size-72 rounded-full bg-primary/20 blur-3xl sm:size-96" /><div className="absolute size-[78%] rounded-full border border-primary/20 [animation:spin_26s_linear_infinite]" /><div className="absolute size-[62%] rounded-full border border-cyan-300/20 border-dashed [animation:spin_18s_linear_infinite_reverse]" /><div className="absolute size-[48%] rounded-full border border-sky-400/15 [animation:spin_34s_linear_infinite]" /><div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-70 [animation:scan 5s_ease-in-out_infinite]" />{particles.map((_, index) => { const angle = index * 30; return <span key={index} className="absolute size-1 rounded-full bg-cyan-200 shadow-[0_0_14px_4px_rgba(34,211,238,0.65)] [animation:particle-float_6s_ease-in-out_infinite]" style={{ transform: `rotate(${angle}deg) translateY(-${36 + (index % 3) * 7}%)`, animationDelay: `${index * -0.45}s` }} />; })}<div className="absolute bottom-[9%] left-1/2 h-10 w-[48%] -translate-x-1/2 rounded-[50%] bg-cyan-400/25 blur-2xl [animation:ground-pulse_4s_ease-in-out_infinite]" /><div className="relative w-[72%] max-w-[410px] [animation:logo-float_6s_ease-in-out_infinite]"><div className="absolute -inset-8 rounded-full bg-cyan-400/20 blur-2xl [animation:shield-pulse_4s_ease-in-out_infinite]" /><div className="relative aspect-square overflow-visible bg-transparent shadow-[0_0_70px_rgba(14,165,233,0.35)]"><Image src={credLayerLogo} alt="CredLayer security shield" fill priority loading="eager" sizes="(max-width: 640px) 70vw, 430px" className="object-contain mix-blend-screen" /></div></div></div>; }

function Landing() {
  return <LandingPage />;
}
function Protocol() { return <Shell><div className="mx-auto max-w-5xl px-5 py-16 lg:px-8"><Badge tone="green">The protocol</Badge><h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">A shared language for trust.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">CredLayer turns verifiable activity into composable credentials without turning people into scores.</p><div className="mt-14 grid gap-5 md:grid-cols-3">{[{ icon: Network, title: "Signals", body: "Collect consented activity and attestations from connected ecosystems." }, { icon: ShieldCheck, title: "Credentials", body: "Package proof into portable credentials with clear provenance." }, { icon: Globe2, title: "Access", body: "Let apps request exactly the context they need, and nothing more." }].map(({ icon: Icon, title, body }) => <StyledCard key={title}><Icon className="size-5 text-primary" /><h2 className="mt-8 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></StyledCard>)}</div><StyledCard className="mt-5"><div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-primary">Designed for interoperability</p><h2 className="mt-3 text-2xl font-semibold">One layer. Many ecosystems.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Solana is our first home. The adapter model keeps the protocol ready for other networks, attestations, and data sources.</p></div><Button href="/developers/docs">Read technical docs <ArrowRight className="size-4" /></Button></div></StyledCard></div></Shell>; }
function Explorer() { return <Shell><div className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><Badge>Public explorer</Badge><h1 className="mt-4 text-3xl font-semibold tracking-tight">Explore the layer</h1><p className="mt-2 text-sm text-muted-foreground">Search addresses, credentials, and protocol activity.</p></div><div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 md:w-80"><Search className="size-4 text-muted-foreground" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search an address or credential" /></div></div><div className="grid gap-5 md:grid-cols-3"><Stat label="Verified credentials" /><Stat label="Active issuers" /><Stat label="Protocol events" /></div><div className="mt-5"><Empty icon={Search} title="No records to display" description="Connect an indexer to populate the explorer. Search is ready for when your data source is configured." /></div></div></Shell>; }
function DashboardPreview() { return <Shell title="Reputation dashboard" eyebrow="Preview mode"><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10"><div className="mb-6 flex items-center justify-between"><div><p className="text-sm text-muted-foreground">A private view of your verifiable identity.</p></div><Badge tone="amber">Preview · No live data</Badge></div><StyledCard className="mb-5 overflow-hidden p-0"><NetworkVisual dashboard /></StyledCard><div className="grid gap-5 md:grid-cols-3"><Stat label="Reputation profile" /><Stat label="Credentials" /><Stat label="Network activity" /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><StyledCard><div className="flex items-center justify-between"><h2 className="font-semibold">Signal overview</h2><BarChart3 className="size-4 text-muted-foreground" /></div><Empty icon={Radar} title="Analysis will appear here" description="Connect a wallet and allow CredLayer to analyze permissioned signals." /></StyledCard><StyledCard><h2 className="font-semibold">Connected identity</h2><div className="mt-5 flex flex-col gap-3"><div className="flex items-center justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Wallet</span><span>Not connected</span></div><div className="flex items-center justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Network</span><span className="text-primary">Solana</span></div><WalletControl /></div></StyledCard></div></div></Shell>; }
function AppPage({ sub }: { sub?: string }) { const configs: Record<string, [string, string]> = { profile: ["Profile", "Your identity, your permissions."], analysis: ["Analysis", "Understand the signals behind your reputation."], agents: ["Agents", "Create trusted workflows for your products."], credentials: ["Credentials", "Portable proof you can share with consent."], activity: ["Activity", "A transparent record of protocol events."], settings: ["Settings", "Manage preferences and connected services."] }; const [title, desc] = configs[sub || ""] || ["Overview", "Your reputation workspace, at a glance."]; return <Shell title={title} eyebrow="App workspace"><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10"><p className="mb-7 text-sm text-muted-foreground">{desc}</p>{sub === "agents" ? <div className="flex flex-col gap-5"><StyledCard><div className="flex items-center justify-between"><div><h2 className="font-semibold">Registered agents</h2><p className="mt-1 text-sm text-muted-foreground">Agents will use scoped credentials to act on your behalf.</p></div><Button variant="outline">Register agent <ArrowRight className="size-4" /></Button></div></StyledCard><Empty icon={Sparkles} title="No agents registered" description="Create an agent when you are ready to automate a trusted workflow." /></div> : sub === "settings" ? <StyledCard><h2 className="font-semibold">Workspace settings</h2><div className="mt-6 flex flex-col gap-4"><label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm"><span><span className="block font-medium">Privacy mode</span><span className="text-xs text-muted-foreground">Only share credentials when explicitly requested.</span></span><input type="checkbox" defaultChecked className="accent-primary" /></label><label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm"><span><span className="block font-medium">Activity notifications</span><span className="text-xs text-muted-foreground">Receive updates for new attestations.</span></span><input type="checkbox" className="accent-primary" /></label></div></StyledCard> : <><div className="grid gap-5 md:grid-cols-3"><Stat label="Verified signals" /><Stat label="Trust connections" /><Stat label="Credentials" /></div><div className="mt-5"><Empty icon={sub === "activity" ? Activity : sub === "credentials" ? ShieldCheck : sub === "analysis" ? BarChart3 : UserRound} title={sub ? `No ${sub} data yet` : "Connect your wallet to begin"} description="This workspace is connected to the CredLayer protocol, but no live records are available yet." /></div></>}</div></Shell>; }
function Developers({ sub }: { sub?: string }) { 
  const [activeDocSection, setActiveDocSection] = useState<string>("getting-started");
  const title = sub === "api-keys" ? "API keys" : sub === "docs" ? "Documentation" : sub === "sdk" ? "SDK" : "Developer dashboard"; 
  
  const docSections = [
    { id: "getting-started", label: "Getting started" },
    { id: "authentication", label: "Authentication" },
    { id: "credentials-api", label: "Credentials API" },
    { id: "webhooks", label: "Webhooks" },
  ];

  const docContent: Record<string, { title: string; content: React.ReactNode }> = {
    "getting-started": {
      title: "Getting Started with CredLayer",
      content: (
        <>
          <p className="text-sm leading-7 text-muted-foreground">
            Welcome to the CredLayer API documentation. This guide will help you integrate CredLayer's verification and credential infrastructure into your application.
          </p>
          <h3 className="mt-6 text-lg font-semibold">Quick Start</h3>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
              <span>Create an API key in the API keys section</span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
              <span>Install the CredLayer SDK or use the REST API directly</span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span>
              <span>Authenticate your requests and start making API calls</span>
            </li>
          </ol>
          <div className="mt-6 rounded-lg border border-border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground">npm install @credlayer/sdk</p>
          </div>
        </>
      ),
    },
    "authentication": {
      title: "Authentication",
      content: (
        <>
          <p className="text-sm leading-7 text-muted-foreground">
            CredLayer uses API keys to authenticate requests. Include your API key in the Authorization header of all requests.
          </p>
          <h3 className="mt-6 text-lg font-semibold">API Key Authentication</h3>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground">
              Authorization: Bearer YOUR_API_KEY
            </p>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Example Request</h3>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`curl -X GET https://api.credlayer.com/v1/credentials \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-semibold text-amber-200">Security Best Practices</p>
            <ul className="mt-2 space-y-1 text-xs text-amber-200/80">
              <li>• Never expose API keys in client-side code</li>
              <li>• Use environment variables to store keys</li>
              <li>• Rotate keys regularly</li>
              <li>• Use separate keys for development and production</li>
            </ul>
          </div>
        </>
      ),
    },
    "credentials-api": {
      title: "Credentials API",
      content: (
        <>
          <p className="text-sm leading-7 text-muted-foreground">
            The Credentials API allows you to issue, verify, and manage verifiable credentials on the blockchain.
          </p>
          <h3 className="mt-6 text-lg font-semibold">Issue a Credential</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new verifiable credential for a user or entity.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-mono text-xs font-semibold text-primary">POST /v1/credentials</p>
            <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`{
  "subject": "did:sol:abc123",
  "type": "VerifiedIdentity",
  "claims": {
    "name": "Example User",
    "verified": true
  },
  "expiresAt": "2025-12-31T23:59:59Z"
}`}
            </pre>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Verify a Credential</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify the authenticity and validity of a credential.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-mono text-xs font-semibold text-primary">GET /v1/credentials/:id/verify</p>
            <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`{
  "credentialId": "cred_abc123",
  "valid": true,
  "issuer": "did:sol:credlayer",
  "subject": "did:sol:abc123",
  "issuedAt": "2024-01-15T10:30:00Z"
}`}
            </pre>
          </div>
          <h3 className="mt-6 text-lg font-semibold">List Credentials</h3>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <p className="mb-2 font-mono text-xs font-semibold text-primary">GET /v1/credentials?subject=did:sol:abc123</p>
            <p className="font-mono text-xs text-muted-foreground">Returns a paginated list of credentials</p>
          </div>
        </>
      ),
    },
    "webhooks": {
      title: "Webhooks",
      content: (
        <>
          <p className="text-sm leading-7 text-muted-foreground">
            Webhooks allow you to receive real-time notifications when events occur in your CredLayer account.
          </p>
          <h3 className="mt-6 text-lg font-semibold">Supported Events</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-xs font-semibold text-primary">credential.issued</p>
              <p className="mt-1 text-xs text-muted-foreground">Triggered when a new credential is issued</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-xs font-semibold text-primary">credential.verified</p>
              <p className="mt-1 text-xs text-muted-foreground">Triggered when a credential is verified</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="font-mono text-xs font-semibold text-primary">credential.revoked</p>
              <p className="mt-1 text-xs text-muted-foreground">Triggered when a credential is revoked</p>
            </div>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Webhook Payload Example</h3>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`{
  "id": "evt_abc123",
  "type": "credential.issued",
  "timestamp": "2024-08-13T12:00:00Z",
  "data": {
    "credentialId": "cred_xyz789",
    "subject": "did:sol:abc123",
    "issuer": "did:sol:credlayer"
  }
}`}
            </pre>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Verifying Webhook Signatures</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            All webhook requests include a signature header for verification.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}`}
            </pre>
          </div>
        </>
      ),
    },
  };

  return <Shell title={title} eyebrow="Developer console" developer><div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{sub === "docs" ? <div className="grid gap-8 lg:grid-cols-[220px_1fr]"><nav className="flex flex-col gap-2 text-sm"><span className="mb-2 font-semibold text-foreground">Documentation</span>{docSections.map((section) => (
    <button
      key={section.id}
      onClick={() => setActiveDocSection(section.id)}
      className={`rounded-lg px-3 py-2 text-left transition ${
        activeDocSection === section.id
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {section.label}
    </button>
  ))}</nav><StyledCard><Badge tone="green">Docs</Badge><h2 className="mt-5 text-2xl font-semibold">{docContent[activeDocSection].title}</h2><div className="mt-6 space-y-4">{docContent[activeDocSection].content}</div><div className="mt-10 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"><StyledCard className="bg-background"><BookOpen className="size-4 text-primary" /><p className="mt-4 text-sm font-semibold">Quickstart</p><p className="mt-1 text-xs text-muted-foreground">Make your first verification request.</p></StyledCard><StyledCard className="bg-background"><Code2 className="size-4 text-primary" /><p className="mt-4 text-sm font-semibold">API reference</p><p className="mt-1 text-xs text-muted-foreground">Explore endpoints and schemas.</p></StyledCard></div></StyledCard></div> : sub === "api-keys" ? <StyledCard><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Project API keys</h2><p className="mt-1 text-sm text-muted-foreground">Keys are generated locally in this preview only.</p></div><Button>Create key <KeyRound className="size-4" /></Button></div><div className="mt-6"><Empty icon={KeyRound} title="No API keys" description="Create a key to authenticate your first integration." /></div></StyledCard> : sub === "sdk" ? <StyledCard><Badge tone="green">TypeScript SDK</Badge><h2 className="mt-5 text-2xl font-semibold">Ship trusted experiences faster.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">The CredLayer SDK will provide typed clients for identity, credentials, and verification requests.</p><div className="mt-6 rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted-foreground">npm install @credlayer/sdk</div><Button href="/developers/docs" variant="outline">View SDK guide <ArrowRight className="size-4" /></Button></StyledCard> : <><div className="grid gap-5 md:grid-cols-3"><Stat label="API requests" /><Stat label="Credentials issued" /><Stat label="Webhooks" /></div><div className="mt-5"><Empty icon={Code2} title="Connect your first project" description="Create an API key to start seeing usage and integration health." /></div></>}</div></Shell>; }
export default function CredLayerApp() { const pathname = usePathname(); if (pathname === "/") return <Landing />; if (pathname === "/protocol") return <Protocol />; if (pathname === "/explorer") return <Explorer />; if (pathname === "/dashboard-preview") return <DashboardPreview />; if (pathname.startsWith("/app")) return <AppPage sub={pathname.split("/")[2]} />; if (pathname.startsWith("/developers")) return <Developers sub={pathname.split("/")[2]} />; return <Landing />; }
export { CredLayerApp };

