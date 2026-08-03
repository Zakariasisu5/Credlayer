import { Webhook, Shield, RefreshCcw, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { useState } from "react";

const WEBHOOK_EVENTS = [
  {
    name: "wallet.reputation.updated",
    description: "Triggered when a wallet's reputation score changes by more than 10 points",
    payload: `{
  "event": "wallet.reputation.updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "old_score": 875,
    "new_score": 892,
    "tier": "Excellent",
    "change": +17
  }
}`,
  },
  {
    name: "wallet.risk.changed",
    description: "Triggered when a wallet's risk level changes (Low, Medium, High)",
    payload: `{
  "event": "wallet.risk.changed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "old_risk": "Medium",
    "new_risk": "Low",
    "reason": "Sybil check passed"
  }
}`,
  },
  {
    name: "wallet.analysis.completed",
    description: "Triggered when AI analysis completes for a wallet",
    payload: `{
  "event": "wallet.analysis.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "analysis_id": "anlz_abc123",
    "risk_score": 12,
    "flags": []
  }
}`,
  },
  {
    name: "credential.created",
    description: "Triggered when a new credential is issued to a wallet",
    payload: `{
  "event": "credential.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "credential": "Gitcoin Passport",
    "issuer": "Gitcoin",
    "score_impact": +8
  }
}`,
  },
  {
    name: "credential.revoked",
    description: "Triggered when a credential is revoked from a wallet",
    payload: `{
  "event": "credential.revoked",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "credential": "Proof-of-Humanity",
    "reason": "Expired"
  }
}`,
  },
  {
    name: "api.key.created",
    description: "Triggered when a new API key is created",
    payload: `{
  "event": "api.key.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "key_id": "key_abc123",
    "name": "Production API Key",
    "environment": "production"
  }
}`,
  },
];

export function Webhooks() {
  const [selectedEvent, setSelectedEvent] = useState(WEBHOOK_EVENTS[0]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <Webhook className="size-3.5" />
          Webhooks
        </div>
        <h1 className="text-3xl font-semibold">Real-Time Event Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Subscribe to webhook events to receive real-time notifications when wallet
          reputations change, credentials are issued, or risk levels shift.
        </p>
      </div>

      {/* Overview */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">How Webhooks Work</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Webhooks allow you to receive HTTP POST requests to your server whenever
            specific events occur in CredLayer. This is more efficient than polling the API
            repeatedly.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <InfoCard
              icon={Webhook}
              label="Event Triggered"
              description="CredLayer detects a change"
            />
            <InfoCard
              icon={RefreshCcw}
              label="Webhook Sent"
              description="POST request to your endpoint"
            />
            <InfoCard
              icon={CheckCircle2}
              label="You Respond"
              description="Return 200 OK to confirm"
            />
          </div>
        </div>
      </div>

      {/* Supported Events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Supported Events</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {WEBHOOK_EVENTS.map((event) => (
            <button
              key={event.name}
              onClick={() => setSelectedEvent(event)}
              className={`
                text-left glass rounded-lg p-4 transition-all
                ${
                  selectedEvent.name === event.name
                    ? "ring-2 ring-gold bg-elevated]"
                    : "hover:bg-elevated]"
                }
              `}
            >
              <code className="text-sm font-mono text-gold">{event.name}</code>
              <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <code className="text-gold">{selectedEvent.name}</code> Payload
          </h2>
          <CodeBlock code={selectedEvent.payload} language="json" />
        </div>
      )}

      {/* Configuration */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Configure Webhook Endpoint</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Set up your webhook endpoint to receive events:
        </p>
        <CodeBlock
          language="bash"
          code={`curl -X POST https://api.credlayer.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/credlayer",
    "events": [
      "wallet.reputation.updated",
      "wallet.risk.changed"
    ],
    "secret": "whsec_your_signing_secret"
  }'`}
        />
      </div>

      {/* Signature Verification */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <Shield className="inline size-5 mr-2 text-gold" />
          Verify Webhook Signatures
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Always verify webhook signatures to ensure requests are from CredLayer:
        </p>
        <CodeBlock
          language="javascript"
          code={`import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// In your webhook handler
app.post('/webhooks/credlayer', (req, res) => {
  const signature = req.headers['x-credlayer-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process the event
  const event = req.body;
  console.log('Received event:', event.event);
  
  res.status(200).send('OK');
});`}
        />
      </div>

      {/* Retry Policy */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Retry Policy</h2>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            If your endpoint fails to respond or returns a non-2xx status code, CredLayer
            will retry the webhook delivery:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Immediate retry</strong> after 5 seconds
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Second retry</strong> after 1 minute
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Third retry</strong> after 15 minutes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground">Final retry</strong> after 1 hour
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            After 4 failed attempts, the webhook delivery is marked as failed and you'll
            receive an email notification.
          </p>
        </div>
      </div>

      {/* Best Practices */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-3">
          <BestPractice
            title="Respond quickly"
            description="Return a 200 OK response immediately, then process the event asynchronously."
          />
          <BestPractice
            title="Verify signatures"
            description="Always verify webhook signatures to prevent unauthorized requests."
          />
          <BestPractice
            title="Handle duplicates"
            description="Webhooks may be delivered more than once. Use event IDs to deduplicate."
          />
          <BestPractice
            title="Use HTTPS"
            description="Webhook endpoints must use HTTPS for security."
          />
          <BestPractice
            title="Monitor failures"
            description="Set up alerts for failed webhook deliveries in your dashboard."
          />
        </ul>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <div className="glass rounded-lg p-4 text-center">
      <Icon className="size-6 text-gold mx-auto mb-2" />
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">{description}</div>
    </div>
  );
}

function BestPractice({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-3">
      <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </li>
  );
}
