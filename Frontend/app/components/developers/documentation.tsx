"use client";

import { useState } from "react";
import { BookOpen, Code2 } from "lucide-react";
import { Shell } from "../layout/app-shell";
import { Badge } from "../ui";
import { StyledCard } from "../shared/common-components";

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

export function DocumentationPage() {
  const [activeDocSection, setActiveDocSection] = useState<string>("getting-started");

  return (
    <Shell title="Documentation" eyebrow="Developer console" developer>
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-col gap-2 text-sm">
            <span className="mb-2 font-semibold text-foreground">Documentation</span>
            {docSections.map((section) => (
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
            ))}
          </nav>
          <StyledCard>
            <Badge tone="green">Docs</Badge>
            <h2 className="mt-5 text-2xl font-semibold">
              {docContent[activeDocSection].title}
            </h2>
            <div className="mt-6 space-y-4">
              {docContent[activeDocSection].content}
            </div>
            <div className="mt-10 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
              <StyledCard className="bg-background">
                <BookOpen className="size-4 text-primary" />
                <p className="mt-4 text-sm font-semibold">Quickstart</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Make your first verification request.
                </p>
              </StyledCard>
              <StyledCard className="bg-background">
                <Code2 className="size-4 text-primary" />
                <p className="mt-4 text-sm font-semibold">API reference</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore endpoints and schemas.
                </p>
              </StyledCard>
            </div>
          </StyledCard>
        </div>
      </div>
    </Shell>
  );
}
