import { FileCode, Download, Github, Book, AlertCircle, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { Button } from "@/components/ui/button";

type SDKPageProps = {
  language: string;
  version: string;
  install: string;
  color: string;
};

export function SDKPage({ language, version, install, color }: SDKPageProps) {
  const isJS = language === "JavaScript";
  const isTS = language === "TypeScript";
  const isPython = language === "Python";
  const isCURL = language === "cURL";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <FileCode className={`size-8 ${color}`} />
          <div>
            <h1 className="text-3xl font-semibold">{language} SDK</h1>
            <p className="text-sm text-muted-foreground">Version {version}</p>
          </div>
        </div>
        <p className="text-muted-foreground mt-4">
          Official CredLayer SDK for {language}. Integrate wallet reputation, AI analysis,
          and credential verification into your application.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="gold" size="sm">
            <Download className="size-4" />
            Install SDK
          </Button>
          <Button variant="glass" size="sm" asChild>
            <a href="https://github.com/credlayer" target="_blank" rel="noreferrer">
              <Github className="size-4" />
              View on GitHub
            </a>
          </Button>
          <Button variant="glass" size="sm">
            <Book className="size-4" />
            Full Documentation
          </Button>
        </div>
      </div>

      {/* Installation */}
      <Section title="Installation" icon={Download}>
        <p className="text-sm text-muted-foreground mb-4">
          Install the CredLayer SDK using your preferred package manager:
        </p>
        <CodeBlock
          language={isCURL ? "bash" : isPython ? "bash" : "bash"}
          code={install}
        />
        {(isJS || isTS) && (
          <div className="mt-3 space-y-2">
            <CodeBlock language="bash" code="yarn add @credlayer/sdk" label="Yarn" />
            <CodeBlock language="bash" code="pnpm add @credlayer/sdk" label="pnpm" />
          </div>
        )}
      </Section>

      {/* Authentication */}
      <Section title="Authentication" icon={CheckCircle2}>
        <p className="text-sm text-muted-foreground mb-4">
          Authenticate your requests using an API key. Get your key from the{" "}
          <a href="/app/developers/api-keys" className="text-gold hover:brightness-110">
            API Keys
          </a>{" "}
          page.
        </p>
        {!isCURL ? (
          <>
            <CodeBlock
              language={isPython ? "python" : isTS ? "typescript" : "javascript"}
              code={getAuthCode(language)}
              label="Set environment variable"
            />
            <div className="mt-4 glass rounded-lg p-4 flex gap-3">
              <AlertCircle className="size-5 text-gold shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Keep your API key secure</p>
                <p className="text-muted-foreground mt-1">
                  Never expose your API key in client-side code or public repositories.
                  Use environment variables or secure key management systems.
                </p>
              </div>
            </div>
          </>
        ) : (
          <CodeBlock
            language="bash"
            code={`curl https://api.credlayer.io/v1/wallets/0xd8dA...6045 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
          />
        )}
      </Section>

      {/* Initialize Client */}
      {!isCURL && (
        <Section title="Initialize Client" icon={FileCode}>
          <p className="text-sm text-muted-foreground mb-4">
            Create a new CredLayer client instance with your API key:
          </p>
          <CodeBlock
            language={isPython ? "python" : isTS ? "typescript" : "javascript"}
            code={getInitCode(language)}
          />
        </Section>
      )}

      {/* First Request */}
      <Section title="First Request" icon={Book}>
        <p className="text-sm text-muted-foreground mb-4">
          Make your first API call to fetch wallet reputation:
        </p>
        <CodeBlock
          language={isCURL ? "bash" : isPython ? "python" : isTS ? "typescript" : "javascript"}
          code={getFirstRequestCode(language)}
        />
      </Section>

      {/* Wallet Reputation Example */}
      <Section title="Wallet Reputation Example">
        <p className="text-sm text-muted-foreground mb-4">
          Get comprehensive reputation data for any wallet address:
        </p>
        <CodeBlock
          language={isCURL ? "bash" : isPython ? "python" : isTS ? "typescript" : "javascript"}
          code={getWalletExampleCode(language)}
        />
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Response:</p>
          <CodeBlock
            language="json"
            code={`{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "score": 892,
  "tier": "Excellent",
  "risk": "Low",
  "trust": 94,
  "age_years": 3.2,
  "chains": 6,
  "signals": 142,
  "metrics": {
    "defi_engagement": 82,
    "protocol_diversity": 74,
    "sybil_resistance": 96
  },
  "credentials": [
    "Gitcoin Passport",
    "ENS Domain",
    "Proof-of-Humanity"
  ]
}`}
          />
        </div>
      </Section>

      {/* AI Analysis Example */}
      <Section title="AI Analysis Example">
        <p className="text-sm text-muted-foreground mb-4">
          Use AI to analyze wallet behavior and detect suspicious patterns:
        </p>
        <CodeBlock
          language={isCURL ? "bash" : isPython ? "python" : isTS ? "typescript" : "javascript"}
          code={getAIExampleCode(language)}
        />
      </Section>

      {/* Error Handling */}
      <Section title="Error Handling" icon={AlertCircle}>
        <p className="text-sm text-muted-foreground mb-4">
          Handle API errors gracefully in your application:
        </p>
        <CodeBlock
          language={isPython ? "python" : isTS ? "typescript" : "javascript"}
          code={getErrorHandlingCode(language)}
        />
      </Section>

      {/* Pagination */}
      {!isCURL && (
        <Section title="Pagination">
          <p className="text-sm text-muted-foreground mb-4">
            For endpoints that return lists, use pagination parameters:
          </p>
          <CodeBlock
            language={isPython ? "python" : isTS ? "typescript" : "javascript"}
            code={getPaginationCode(language)}
          />
        </Section>
      )}

      {/* Rate Limits */}
      <Section title="Rate Limits">
        <p className="text-sm text-muted-foreground mb-4">
          The SDK automatically handles rate limiting with exponential backoff. Default limits:
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard label="Requests / minute" value="100" />
          <InfoCard label="Burst limit" value="20" />
          <InfoCard label="Monthly quota" value="100K" />
        </div>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices" icon={CheckCircle2}>
        <ul className="space-y-3">
          <BestPractice
            title="Cache responses"
            description="Wallet reputation doesn't change frequently. Cache responses for 5-15 minutes to reduce API calls."
          />
          <BestPractice
            title="Handle errors gracefully"
            description="Always implement proper error handling and provide fallback behavior for API failures."
          />
          <BestPractice
            title="Use webhooks"
            description="For real-time updates, subscribe to webhooks instead of polling the API repeatedly."
          />
          <BestPractice
            title="Batch requests"
            description="When analyzing multiple wallets, use batch endpoints to reduce API overhead."
          />
          <BestPractice
            title="Monitor usage"
            description="Track your API usage in the developer dashboard to avoid hitting rate limits."
          />
        </ul>
      </Section>

      {/* Next Steps */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold mb-4">Next Steps</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/app/developers/api-reference"
            className="glass rounded-lg p-4 hover:bg-elevated] transition-colors"
          >
            <p className="font-medium text-sm">API Reference</p>
            <p className="text-xs text-muted-foreground mt-1">
              Explore all available endpoints
            </p>
          </a>
          <a
            href="/app/developers/webhooks"
            className="glass rounded-lg p-4 hover:bg-elevated] transition-colors"
          >
            <p className="font-medium text-sm">Webhooks</p>
            <p className="text-xs text-muted-foreground mt-1">
              Set up real-time notifications
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="size-5 text-gold" />}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold text-gold mt-1">{value}</div>
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

// Code generation functions
function getAuthCode(language: string): string {
  if (language === "Python") {
    return `# Add to .env file
CREDLAYER_API_KEY=your_api_key_here`;
  }
  return `// Add to .env file
CREDLAYER_API_KEY=your_api_key_here`;
}

function getInitCode(language: string): string {
  if (language === "Python") {
    return `from credlayer import CredLayer

client = CredLayer(api_key=os.environ.get("CREDLAYER_API_KEY"))`;
  }
  if (language === "TypeScript") {
    return `import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({
  apiKey: process.env.CREDLAYER_API_KEY as string
});`;
  }
  return `import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({
  apiKey: process.env.CREDLAYER_API_KEY
});`;
}

function getFirstRequestCode(language: string): string {
  if (language === "cURL") {
    return `curl https://api.credlayer.io/v1/wallets/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 \\
  -H "Authorization: Bearer YOUR_API_KEY"`;
  }
  if (language === "Python") {
    return `# Get wallet reputation
reputation = client.wallets.get("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")

print(f"Score: {reputation.score}")
print(f"Tier: {reputation.tier}")`;
  }
  if (language === "TypeScript") {
    return `// Get wallet reputation
const reputation = await client.wallets.get(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
);

console.log(\`Score: \${reputation.score}\`);
console.log(\`Tier: \${reputation.tier}\`);`;
  }
  return `// Get wallet reputation
const reputation = await client.wallets.get(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
);

console.log('Score:', reputation.score);
console.log('Tier:', reputation.tier);`;
}

function getWalletExampleCode(language: string): string {
  if (language === "cURL") {
    return `curl https://api.credlayer.io/v1/wallets/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;
  }
  if (language === "Python") {
    return `# Get full reputation profile
wallet = client.wallets.get(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    include_credentials=True,
    include_history=True
)

print(f"Address: {wallet.address}")
print(f"Score: {wallet.score} / 1000")
print(f"Risk Level: {wallet.risk}")
print(f"Trust: {wallet.trust}%")
print(f"Credentials: {', '.join(wallet.credentials)}")`;
  }
  return `// Get full reputation profile
const wallet = await client.wallets.get(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  {
    includeCredentials: true,
    includeHistory: true
  }
);

console.log(\`Address: \${wallet.address}\`);
console.log(\`Score: \${wallet.score} / 1000\`);
console.log(\`Risk Level: \${wallet.risk}\`);
console.log(\`Trust: \${wallet.trust}%\`);
console.log(\`Credentials: \${wallet.credentials.join(', ')}\`);`;
}

function getAIExampleCode(language: string): string {
  if (language === "cURL") {
    return `curl -X POST https://api.credlayer.io/v1/ai/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "depth": "full"
  }'`;
  }
  if (language === "Python") {
    return `# AI-powered wallet analysis
analysis = client.ai.analyze(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    depth="full"
)

print(f"Summary: {analysis.summary}")
print(f"Risk Score: {analysis.risk_score}")
print(f"Suspicious Patterns: {analysis.flags}")`;
  }
  return `// AI-powered wallet analysis
const analysis = await client.ai.analyze(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  { depth: 'full' }
);

console.log(\`Summary: \${analysis.summary}\`);
console.log(\`Risk Score: \${analysis.riskScore}\`);
console.log(\`Suspicious Patterns:\`, analysis.flags);`;
}

function getErrorHandlingCode(language: string): string {
  if (language === "Python") {
    return `from credlayer import CredLayerError, RateLimitError

try:
    reputation = client.wallets.get(address)
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except CredLayerError as e:
    print(f"API Error: {e.message} (code: {e.code})")
except Exception as e:
    print(f"Unexpected error: {str(e)}")`;
  }
  return `try {
  const reputation = await client.wallets.get(address);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log(\`Rate limited. Retry after \${error.retryAfter}s\`);
  } else if (error.code === 'WALLET_NOT_FOUND') {
    console.log('Wallet address not found or invalid');
  } else {
    console.error('API Error:', error.message);
  }
}`;
}

function getPaginationCode(language: string): string {
  if (language === "Python") {
    return `# Paginate through wallet history
history = client.wallets.history(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    page=1,
    limit=50
)

print(f"Total records: {history.total}")
print(f"Page {history.page} of {history.pages}")

for event in history.data:
    print(f"{event.timestamp}: {event.type}")`;
  }
  return `// Paginate through wallet history
const history = await client.wallets.history(
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  { page: 1, limit: 50 }
);

console.log(\`Total records: \${history.total}\`);
console.log(\`Page \${history.page} of \${history.pages}\`);

history.data.forEach(event => {
  console.log(\`\${event.timestamp}: \${event.type}\`);
});`;
}
