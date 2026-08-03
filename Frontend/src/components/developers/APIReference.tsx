import { useState } from "react";
import {
  Key,
  Wallet,
  BarChart3,
  Bot,
  Code2,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { Button } from "@/components/ui/button";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Parameter = {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
};

type Endpoint = {
  method: HTTPMethod;
  path: string;
  description: string;
  parameters?: Parameter[];
  headers?: Parameter[];
  body?: string;
  response: string;
  statusCodes: { code: number; description: string }[];
};

type Category = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  endpoints: Endpoint[];
};

const API_CATEGORIES: Category[] = [
  {
    name: "Authentication",
    icon: Key,
    endpoints: [
      {
        method: "POST",
        path: "/v1/auth/login",
        description: "Authenticate and receive an access token",
        headers: [
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "api_key": "your_api_key_here"
}`,
        response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}`,
        statusCodes: [
          { code: 200, description: "Successfully authenticated" },
          { code: 401, description: "Invalid API key" },
          { code: 429, description: "Too many requests" },
        ],
      },
      {
        method: "POST",
        path: "/v1/auth/refresh",
        description: "Refresh an expired access token",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}`,
        statusCodes: [
          { code: 200, description: "Token refreshed successfully" },
          { code: 401, description: "Invalid or expired token" },
        ],
      },
    ],
  },
  {
    name: "Wallet",
    icon: Wallet,
    endpoints: [
      {
        method: "GET",
        path: "/v1/wallets/{address}",
        description: "Get complete reputation profile for a wallet address",
        parameters: [
          {
            name: "address",
            type: "string",
            required: true,
            description: "Wallet address (EVM or Solana)",
            example: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          },
          {
            name: "include_credentials",
            type: "boolean",
            required: false,
            description: "Include verified credentials",
            example: "true",
          },
          {
            name: "include_history",
            type: "boolean",
            required: false,
            description: "Include reputation history",
            example: "true",
          },
        ],
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "score": 892,
  "tier": "Excellent",
  "risk": "Low",
  "trust": 94,
  "age_years": 3.2,
  "chains": 6,
  "signals": 142,
  "tx_30d": 284,
  "volume_usd": 1240000,
  "metrics": {
    "defi_engagement": 82,
    "protocol_diversity": 74,
    "sybil_resistance": 96,
    "volatility_exposure": 34
  },
  "credentials": [
    "Gitcoin Passport",
    "ENS Domain",
    "Proof-of-Humanity"
  ]
}`,
        statusCodes: [
          { code: 200, description: "Wallet data retrieved successfully" },
          { code: 404, description: "Wallet not found" },
          { code: 422, description: "Invalid wallet address format" },
        ],
      },
      {
        method: "GET",
        path: "/v1/wallets/{address}/history",
        description: "Get reputation history and timeline for a wallet",
        parameters: [
          {
            name: "address",
            type: "string",
            required: true,
            description: "Wallet address",
          },
          {
            name: "page",
            type: "number",
            required: false,
            description: "Page number for pagination",
            example: "1",
          },
          {
            name: "limit",
            type: "number",
            required: false,
            description: "Results per page (max 100)",
            example: "50",
          },
        ],
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "total": 142,
  "page": 1,
  "pages": 3,
  "limit": 50,
  "data": [
    {
      "id": "evt_abc123",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "credential_verified",
      "label": "Gitcoin Passport verified",
      "score_change": +8,
      "metadata": {
        "provider": "Gitcoin",
        "credential_type": "Passport"
      }
    }
  ]
}`,
        statusCodes: [
          { code: 200, description: "History retrieved successfully" },
          { code: 404, description: "Wallet not found" },
        ],
      },
      {
        method: "POST",
        path: "/v1/wallets/analyze",
        description: "Analyze one or more wallet addresses",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "addresses": [
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  ],
  "include_credentials": true
}`,
        response: `{
  "results": [
    {
      "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "score": 892,
      "tier": "Excellent",
      "risk": "Low"
    }
  ],
  "analyzed": 2,
  "timestamp": "2024-01-15T10:30:00Z"
}`,
        statusCodes: [
          { code: 200, description: "Analysis completed" },
          { code: 400, description: "Invalid request body" },
          { code: 422, description: "Invalid addresses provided" },
        ],
      },
    ],
  },
  {
    name: "Reputation",
    icon: TrendingUp,
    endpoints: [
      {
        method: "GET",
        path: "/v1/reputation/{wallet}",
        description: "Get reputation score and tier only",
        parameters: [
          {
            name: "wallet",
            type: "string",
            required: true,
            description: "Wallet address",
          },
        ],
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "score": 892,
  "tier": "Excellent",
  "percentile": 94
}`,
        statusCodes: [
          { code: 200, description: "Score retrieved successfully" },
          { code: 404, description: "Wallet not found" },
        ],
      },
      {
        method: "POST",
        path: "/v1/reputation/verify",
        description: "Verify if a wallet meets minimum reputation criteria",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "min_score": 700,
  "max_risk": "Medium",
  "required_credentials": ["Gitcoin Passport"]
}`,
        response: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "verified": true,
  "score": 892,
  "risk": "Low",
  "missing_credentials": [],
  "checks_passed": 3,
  "checks_total": 3
}`,
        statusCodes: [
          { code: 200, description: "Verification completed" },
          { code: 400, description: "Invalid criteria" },
        ],
      },
    ],
  },
  {
    name: "AI Analysis",
    icon: Bot,
    endpoints: [
      {
        method: "POST",
        path: "/v1/ai/analyze",
        description: "AI-powered wallet behavior analysis",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "depth": "full",
  "include_recommendations": true
}`,
        response: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "summary": "Established DeFi user with consistent engagement...",
  "risk_score": 12,
  "risk_level": "Low",
  "flags": [],
  "behavior_patterns": [
    "Regular LP provider",
    "Active governance participant"
  ],
  "recommendations": [
    "Strong candidate for protocol participation"
  ],
  "confidence": 0.94,
  "analyzed_at": "2024-01-15T10:30:00Z"
}`,
        statusCodes: [
          { code: 200, description: "Analysis completed" },
          { code: 422, description: "Invalid address" },
          { code: 429, description: "Rate limit exceeded" },
        ],
      },
      {
        method: "POST",
        path: "/v1/ai/explain",
        description: "Get AI explanation of reputation score",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
}`,
        response: `{
  "explanation": "This wallet demonstrates excellent reputation through...",
  "factors": [
    {
      "factor": "Wallet Age",
      "impact": "Positive",
      "weight": 0.15
    },
    {
      "factor": "DeFi Engagement",
      "impact": "Positive",
      "weight": 0.25
    }
  ]
}`,
        statusCodes: [
          { code: 200, description: "Explanation generated" },
          { code: 404, description: "Wallet not found" },
        ],
      },
    ],
  },
  {
    name: "Developer",
    icon: Code2,
    endpoints: [
      {
        method: "POST",
        path: "/v1/apikey/create",
        description: "Create a new API key",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
          { name: "Content-Type", type: "string", required: true, description: "application/json" },
        ],
        body: `{
  "name": "Production API Key",
  "environment": "production",
  "permissions": ["wallets:read", "ai:analyze"]
}`,
        response: `{
  "id": "key_abc123",
  "key": "cl_live_abc123def456...",
  "name": "Production API Key",
  "environment": "production",
  "created_at": "2024-01-15T10:30:00Z"
}`,
        statusCodes: [
          { code: 201, description: "API key created successfully" },
          { code: 400, description: "Invalid request" },
        ],
      },
      {
        method: "GET",
        path: "/v1/apikey",
        description: "List all API keys",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "keys": [
    {
      "id": "key_abc123",
      "name": "Production API Key",
      "environment": "production",
      "last_used": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-10T08:00:00Z"
    }
  ],
  "total": 1
}`,
        statusCodes: [
          { code: 200, description: "Keys retrieved successfully" },
        ],
      },
      {
        method: "DELETE",
        path: "/v1/apikey/{id}",
        description: "Revoke an API key",
        parameters: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "API key ID",
          },
        ],
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "id": "key_abc123",
  "revoked": true,
  "revoked_at": "2024-01-15T10:30:00Z"
}`,
        statusCodes: [
          { code: 200, description: "Key revoked successfully" },
          { code: 404, description: "Key not found" },
        ],
      },
    ],
  },
  {
    name: "Analytics",
    icon: BarChart3,
    endpoints: [
      {
        method: "GET",
        path: "/v1/usage",
        description: "Get API usage statistics",
        parameters: [
          {
            name: "start_date",
            type: "string",
            required: false,
            description: "Start date (ISO 8601)",
            example: "2024-01-01",
          },
          {
            name: "end_date",
            type: "string",
            required: false,
            description: "End date (ISO 8601)",
            example: "2024-01-31",
          },
        ],
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "total_requests": 15420,
  "successful_requests": 15234,
  "failed_requests": 186,
  "endpoints": {
    "/v1/wallets/{address}": 12000,
    "/v1/ai/analyze": 2500
  },
  "daily_breakdown": []
}`,
        statusCodes: [
          { code: 200, description: "Usage data retrieved" },
        ],
      },
      {
        method: "GET",
        path: "/v1/metrics",
        description: "Get real-time metrics",
        headers: [
          { name: "Authorization", type: "string", required: true, description: "Bearer {token}" },
        ],
        response: `{
  "requests_today": 284,
  "rate_limit_remaining": 816,
  "rate_limit_reset": "2024-01-15T11:00:00Z",
  "monthly_quota_used": 15420,
  "monthly_quota_limit": 100000
}`,
        statusCodes: [
          { code: 200, description: "Metrics retrieved" },
        ],
      },
    ],
  },
];

export function APIReference() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Authentication",
    "Wallet",
  ]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    API_CATEGORIES[1].endpoints[0]
  );
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "python" | "curl">(
    "javascript"
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredCategories = API_CATEGORIES.map((category) => ({
    ...category,
    endpoints: category.endpoints.filter(
      (endpoint) =>
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.endpoints.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">API Reference</h1>
        <p className="text-muted-foreground mt-2">
          Complete REST API documentation with examples in multiple languages
        </p>
      </div>

      {/* Search */}
      <div className="glass rounded-lg flex items-center gap-2 px-4 py-2.5">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* API Explorer */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar - Endpoint List */}
        <div className="space-y-2">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.name);
            return (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between glass rounded-lg px-4 py-2.5 hover:bg-elevated] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="size-4 text-gold" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </button>
                {isExpanded && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                    {category.endpoints.map((endpoint, idx) => {
                      const isSelected = selectedEndpoint === endpoint;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedEndpoint(endpoint)}
                          className={`
                            w-full text-left rounded-lg px-3 py-2 text-sm transition-colors
                            ${
                              isSelected
                                ? "bg-elevated-strong text-foreground"
                                : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <MethodBadge method={endpoint.method} />
                            <span className="font-mono text-xs truncate">
                              {endpoint.path.split("/").pop()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content - Selected Endpoint */}
        <div className="space-y-6">
          {selectedEndpoint ? (
            <EndpointDetails
              endpoint={selectedEndpoint}
              language={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Code2 className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select an endpoint to view documentation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MethodBadge({ method }: { method: HTTPMethod }) {
  const colors = {
    GET: "bg-accent/15 text-accent",
    POST: "bg-gold/15 text-gold",
    PUT: "bg-success/15 text-success",
    DELETE: "bg-danger/15 text-danger",
    PATCH: "bg-warn/15 text-warn",
  };

  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${colors[method]}`}
    >
      {method}
    </span>
  );
}

function EndpointDetails({
  endpoint,
  language,
  onLanguageChange,
}: {
  endpoint: Endpoint;
  language: "javascript" | "python" | "curl";
  onLanguageChange: (lang: "javascript" | "python" | "curl") => void;
}) {
  const exampleCode = generateExampleCode(endpoint, language);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-sm">{endpoint.path}</code>
        </div>
        <p className="text-muted-foreground">{endpoint.description}</p>
      </div>

      {/* Parameters */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="glass rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Parameters</h3>
          <div className="space-y-3">
            {endpoint.parameters.map((param) => (
              <div key={param.name} className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-gold">{param.name}</code>
                    {param.required && (
                      <span className="text-xs text-danger">required</span>
                    )}
                    <span className="text-xs text-muted-foreground">{param.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
                  {param.example && (
                    <code className="text-xs text-muted-foreground mt-1 block">
                      Example: {param.example}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Headers */}
      {endpoint.headers && endpoint.headers.length > 0 && (
        <div className="glass rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Headers</h3>
          <div className="space-y-2">
            {endpoint.headers.map((header) => (
              <div key={header.name} className="flex items-center justify-between text-sm">
                <code className="font-mono text-gold">{header.name}</code>
                <span className="text-muted-foreground">{header.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Body */}
      {endpoint.body && (
        <div>
          <h3 className="font-semibold mb-3">Request Body</h3>
          <CodeBlock code={endpoint.body} language="json" />
        </div>
      )}

      {/* Example Request */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Example Request</h3>
          <div className="flex gap-2">
            {(["javascript", "python", "curl"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`
                  px-3 py-1 text-xs rounded-md transition-colors
                  ${
                    language === lang
                      ? "bg-elevated-strong text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {lang === "curl" ? "cURL" : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <CodeBlock code={exampleCode} language={language === "curl" ? "bash" : language} />
      </div>

      {/* Response */}
      <div>
        <h3 className="font-semibold mb-3">Response</h3>
        <CodeBlock code={endpoint.response} language="json" />
      </div>

      {/* Status Codes */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold mb-4">Status Codes</h3>
        <div className="space-y-2">
          {endpoint.statusCodes.map((status) => (
            <div key={status.code} className="flex items-center gap-3 text-sm">
              <code
                className={`font-mono font-semibold ${
                  status.code < 300
                    ? "text-success"
                    : status.code < 400
                    ? "text-accent"
                    : "text-danger"
                }`}
              >
                {status.code}
              </code>
              <span className="text-muted-foreground">{status.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Try It Button */}
      <Button variant="gold" className="w-full">
        Try It (Demo)
      </Button>
    </div>
  );
}

function generateExampleCode(
  endpoint: Endpoint,
  language: "javascript" | "python" | "curl"
): string {
  const path = endpoint.path.replace(/{address}/g, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
    .replace(/{wallet}/g, "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
    .replace(/{id}/g, "key_abc123");

  if (language === "curl") {
    let curl = `curl -X ${endpoint.method} https://api.credlayer.io${path}`;
    if (endpoint.headers) {
      endpoint.headers.forEach((header) => {
        curl += ` \\\n  -H "${header.name}: ${header.name === "Authorization" ? "Bearer YOUR_API_KEY" : header.description}"`;
      });
    }
    if (endpoint.body) {
      curl += ` \\\n  -d '${endpoint.body.replace(/\n/g, "").replace(/\s+/g, " ")}'`;
    }
    return curl;
  }

  if (language === "python") {
    if (endpoint.method === "GET") {
      return `from credlayer import CredLayer

client = CredLayer(api_key="YOUR_API_KEY")
response = client${path.replace("/v1", "").replace(/\//g, ".")}()
print(response)`;
    }
    return `from credlayer import CredLayer

client = CredLayer(api_key="YOUR_API_KEY")
response = client${path.replace("/v1", "").replace(/\//g, ".")}(${endpoint.body ? "\n  data=" + endpoint.body.replace(/\n/g, "") : ""})
print(response)`;
  }

  // JavaScript
  if (endpoint.method === "GET") {
    return `import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({ apiKey: 'YOUR_API_KEY' });

const response = await client${path.replace("/v1", "").replace(/\//g, ".")}();
console.log(response);`;
  }

  return `import { CredLayer } from '@credlayer/sdk';

const client = new CredLayer({ apiKey: 'YOUR_API_KEY' });

const response = await client${path.replace("/v1", "").replace(/\//g, ".")}(${endpoint.body ? endpoint.body.replace(/\n/g, " ").replace(/\s+/g, " ") : ""});
console.log(response);`;
}
