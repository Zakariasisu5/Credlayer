import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { useState } from "react";

type ErrorCode = {
  code: number;
  name: string;
  description: string;
  cause: string;
  resolution: string;
  example: string;
};

const ERROR_CODES: ErrorCode[] = [
  {
    code: 200,
    name: "OK",
    description: "The request was successful",
    cause: "Request completed without errors",
    resolution: "No action needed",
    example: `{
  "status": 200,
  "data": {
    "address": "0xd8dA...",
    "score": 892
  }
}`,
  },
  {
    code: 201,
    name: "Created",
    description: "Resource created successfully",
    cause: "POST request created a new resource",
    resolution: "No action needed",
    example: `{
  "status": 201,
  "data": {
    "id": "key_abc123",
    "created_at": "2024-01-15T10:30:00Z"
  }
}`,
  },
  {
    code: 400,
    name: "Bad Request",
    description: "The request was malformed or invalid",
    cause: "Missing required parameters, invalid JSON syntax, or incorrect data types",
    resolution: "Check your request body and parameters. Ensure all required fields are included and properly formatted",
    example: `{
  "error": {
    "code": 400,
    "message": "Invalid request body",
    "details": "Field 'address' is required"
  }
}`,
  },
  {
    code: 401,
    name: "Unauthorized",
    description: "Authentication failed or API key is invalid",
    cause: "Missing, expired, or invalid API key in Authorization header",
    resolution: "Verify your API key is correct and included in the Authorization header as 'Bearer YOUR_API_KEY'",
    example: `{
  "error": {
    "code": 401,
    "message": "Invalid API key",
    "details": "Authentication failed"
  }
}`,
  },
  {
    code: 403,
    name: "Forbidden",
    description: "You don't have permission to access this resource",
    cause: "API key lacks required permissions or accessing restricted endpoint",
    resolution: "Check your API key permissions or upgrade your plan to access this endpoint",
    example: `{
  "error": {
    "code": 403,
    "message": "Permission denied",
    "details": "Your API key doesn't have access to AI analysis"
  }
}`,
  },
  {
    code: 404,
    name: "Not Found",
    description: "The requested resource doesn't exist",
    cause: "Invalid endpoint URL or wallet address not found in database",
    resolution: "Verify the endpoint URL and resource ID. For wallet addresses, ensure the address is valid and has on-chain activity",
    example: `{
  "error": {
    "code": 404,
    "message": "Wallet not found",
    "details": "No reputation data for this address"
  }
}`,
  },
  {
    code: 409,
    name: "Conflict",
    description: "Request conflicts with current resource state",
    cause: "Attempting to create a resource that already exists",
    resolution: "Check if the resource already exists. Use PUT to update instead of POST to create",
    example: `{
  "error": {
    "code": 409,
    "message": "Resource already exists",
    "details": "API key with this name already exists"
  }
}`,
  },
  {
    code: 422,
    name: "Validation Error",
    description: "Request validation failed",
    cause: "Parameters are present but fail validation rules (invalid format, out of range, etc.)",
    resolution: "Review validation errors and correct the invalid fields",
    example: `{
  "error": {
    "code": 422,
    "message": "Validation failed",
    "details": {
      "address": "Invalid Ethereum address format",
      "limit": "Must be between 1 and 100"
    }
  }
}`,
  },
  {
    code: 429,
    name: "Too Many Requests",
    description: "Rate limit exceeded",
    cause: "Too many requests in a short time period",
    resolution: "Implement exponential backoff and respect Retry-After header. Consider upgrading your plan for higher limits",
    example: `{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded",
    "details": "Limit: 100 req/min",
    "retry_after": 45
  }
}`,
  },
  {
    code: 500,
    name: "Internal Server Error",
    description: "An unexpected error occurred on the server",
    cause: "Server-side error or temporary system issue",
    resolution: "Retry the request after a short delay. If the error persists, contact support",
    example: `{
  "error": {
    "code": 500,
    "message": "Internal server error",
    "details": "Please try again later",
    "request_id": "req_abc123"
  }
}`,
  },
  {
    code: 503,
    name: "Service Unavailable",
    description: "Service is temporarily unavailable",
    cause: "Scheduled maintenance or temporary outage",
    resolution: "Wait and retry. Check status page for service status updates",
    example: `{
  "error": {
    "code": 503,
    "message": "Service unavailable",
    "details": "Scheduled maintenance in progress",
    "retry_after": 300
  }
}`,
  },
];

export function ErrorCodes() {
  const [selectedCode, setSelectedCode] = useState<ErrorCode>(ERROR_CODES[3]); // 401 as default

  const successCodes = ERROR_CODES.filter((e) => e.code >= 200 && e.code < 300);
  const clientErrors = ERROR_CODES.filter((e) => e.code >= 400 && e.code < 500);
  const serverErrors = ERROR_CODES.filter((e) => e.code >= 500);

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <AlertCircle className="size-3.5" />
          Error Codes
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold">HTTP Status Codes</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Complete reference for all HTTP status codes returned by the CredLayer API with
          causes and resolutions.
        </p>
      </div>

      {/* Quick Reference */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <StatusCard
          icon={CheckCircle2}
          title="Success"
          codes="2xx"
          description="Request completed successfully"
          color="text-success"
        />
        <StatusCard
          icon={AlertCircle}
          title="Client Error"
          codes="4xx"
          description="Problem with the request"
          color="text-warn"
        />
        <StatusCard
          icon={XCircle}
          title="Server Error"
          codes="5xx"
          description="Server-side issue"
          color="text-danger"
        />
      </div>

      {/* Error Code Browser */}
      <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-4 sm:gap-6">
        {/* Sidebar - Error List */}
        <div className="space-y-3 sm:space-y-4">
          {/* Success Codes */}
          <div>
            <h3 className="text-sm font-semibold mb-2 px-2">Success (2xx)</h3>
            <div className="space-y-1">
              {successCodes.map((error) => (
                <button
                  key={error.code}
                  onClick={() => setSelectedCode(error)}
                  className={`
                    w-full text-left rounded-lg px-3 py-2 transition-colors
                    ${
                      selectedCode.code === error.code
                        ? "bg-elevated-strong text-foreground"
                        : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-success font-semibold">
                      {error.code}
                    </span>
                    <span className="text-sm truncate">{error.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Client Errors */}
          <div>
            <h3 className="text-sm font-semibold mb-2 px-2">Client Errors (4xx)</h3>
            <div className="space-y-1">
              {clientErrors.map((error) => (
                <button
                  key={error.code}
                  onClick={() => setSelectedCode(error)}
                  className={`
                    w-full text-left rounded-lg px-3 py-2 transition-colors
                    ${
                      selectedCode.code === error.code
                        ? "bg-elevated-strong text-foreground"
                        : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-warn font-semibold">
                      {error.code}
                    </span>
                    <span className="text-sm">{error.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Server Errors */}
          <div>
            <h3 className="text-sm font-semibold mb-2 px-2">Server Errors (5xx)</h3>
            <div className="space-y-1">
              {serverErrors.map((error) => (
                <button
                  key={error.code}
                  onClick={() => setSelectedCode(error)}
                  className={`
                    w-full text-left rounded-lg px-3 py-2 transition-colors
                    ${
                      selectedCode.code === error.code
                        ? "bg-elevated-strong text-foreground"
                        : "text-muted-foreground hover:bg-elevated] hover:text-foreground"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-danger font-semibold">
                      {error.code}
                    </span>
                    <span className="text-sm">{error.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Selected Error Details */}
        {selectedCode && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-3xl font-mono font-semibold ${
                    selectedCode.code < 300
                      ? "text-success"
                      : selectedCode.code < 500
                      ? "text-warn"
                      : "text-danger"
                  }`}
                >
                  {selectedCode.code}
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{selectedCode.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCode.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="size-4 text-gold" />
                Common Cause
              </h3>
              <p className="text-sm text-muted-foreground">{selectedCode.cause}</p>
            </div>

            <div className="glass rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                How to Resolve
              </h3>
              <p className="text-sm text-muted-foreground">{selectedCode.resolution}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Example Response</h3>
              <CodeBlock code={selectedCode.example} language="json" />
            </div>

            <div className="glass rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold mb-3">Handling in Code</h3>
              <CodeBlock
                language="javascript"
                code={`try {
  const response = await client.wallets.get(address);
  // Handle success
} catch (error) {
  if (error.status === ${selectedCode.code}) {
    console.error('${selectedCode.name}:', error.message);
    // ${selectedCode.resolution}
  }
}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  codes,
  description,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  codes: string;
  description: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <Icon className={`size-6 ${color} mb-3`} />
      <div className="font-semibold mb-1">{title}</div>
      <div className={`text-2xl font-mono font-semibold ${color} mb-2`}>{codes}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
