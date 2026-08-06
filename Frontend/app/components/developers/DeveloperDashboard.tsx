import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useUsageStats, useRecentRequests } from "@/hooks/api/useDeveloper";
import { LoadingState, CardSkeleton } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";

type TimeRange = "24h" | "7d" | "30d";

export function DeveloperDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  
  const { data: statsResponse, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useUsageStats(timeRange);
  const { data: requestsResponse, isLoading: requestsLoading } = useRecentRequests();

  const stats = statsResponse?.data;
  const recentRequests = requestsResponse?.data.data || [];
  
  const successRate = stats ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2) : "0";
  const errorRate = stats ? ((stats.failedRequests / stats.totalRequests) * 100).toFixed(2) : "0";

  if (statsLoading) {
    return (
      <div className="max-w-6xl space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
            <BarChart3 className="size-3.5" />
            Developer Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold">API Usage & Analytics</h1>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (statsError) {
    // Check if it's a network error (no backend)
    const isNetworkError = statsError instanceof Error && 
      (statsError.message.includes('Network Error') || 
       statsError.message.includes('ECONNREFUSED') ||
       statsError.message.includes('Failed to fetch'));
    
    return (
      <div className="max-w-6xl">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
            <BarChart3 className="size-3.5" />
            Developer Dashboard
          </div>
          <h1 className="text-3xl font-semibold mb-8">API Usage & Analytics</h1>
        </div>
        
        {isNetworkError ? (
          <div className="glass-strong rounded-2xl p-8 text-center border-l-4 border-warn">
            <Activity className="size-12 text-warn mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-3">Backend Not Connected</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
              The CredLayer API backend is not currently running. This dashboard will display real-time
              analytics once you connect the backend.
            </p>
            <div className="glass rounded-xl p-6 text-left max-w-2xl mx-auto">
              <p className="font-semibold mb-3">What you'll see here:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  <span>Total API requests and success rates</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  <span>Response time metrics and performance charts</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  <span>Status code distribution (200, 400, 500, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  <span>Recent API requests with timestamps</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                  <span>Most popular endpoints and usage patterns</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              See <code className="glass px-2 py-1 rounded font-mono">BACKEND_INTEGRATION_GUIDE.md</code> for
              backend setup instructions
            </p>
          </div>
        ) : (
          <ErrorState
            title="Failed to load dashboard"
            error={statsError as Error}
            onRetry={() => refetchStats()}
          />
        )}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl">
        <EmptyState
          icon={BarChart3}
          title="No usage data available"
          description="Start making API requests to see your usage statistics here"
        />
      </div>
    );
  }

  const statusEntries = Object.entries(stats.requestsByStatus ?? {})
    .map(([code, count]) => [code, Number(count)] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return (

    <div className="max-w-6xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
          <BarChart3 className="size-3.5" />
          Developer Dashboard
        </div>
        <h1 className="text-3xl font-semibold">API Usage & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your API usage, performance metrics, and request analytics in real-time.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        {(["24h", "7d", "30d"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`
              px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
              ${
                timeRange === range
                  ? "bg-gold text-background"
                  : "bg-elevated] hover:bg-elevated-strong"
              }
            `}
          >
            {range === "24h" ? "Last 24 Hours" : range === "7d" ? "Last 7 Days" : "Last 30 Days"}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Total Requests"
          value={stats.totalRequests.toLocaleString()}
          color="text-gold"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Success Rate"
          value={`${successRate}%`}
          color="text-success"
        />
        <MetricCard
          icon={Clock}
          label="Avg Response Time"
          value={`${stats.averageResponseTime}ms`}
          color="text-accent"
        />
        <MetricCard
          icon={XCircle}
          label="Error Rate"
          value={`${errorRate}%`}
          color="text-danger"
        />
      </div>

      



      {/* Response status distribution (real data) */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Responses by status code</h2>
        {statusEntries.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No request data yet"
            description="Status code distribution appears here once your API keys start receiving traffic."
          />
        ) : (
          <div className="space-y-4">
            {statusEntries.map(([code, count]) => (
              <div key={code}>
                <div className="mb-2 flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <code className="font-mono text-muted-foreground">HTTP {code}</code>
                  <span className="font-semibold">{count.toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-elevated-strong">
                  <div
                    className={`h-full rounded-full ${
                      Number(code) < 400 ? "bg-success/60" : "bg-danger/60"
                    }`}
                    style={{
                      width: `${stats.totalRequests ? (count / stats.totalRequests) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Rate Limit Progress */}
      <div className="glass rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-gold" />
            <h2 className="text-lg sm:text-xl font-semibold">Rate Limit Usage</h2>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {stats.rateLimit.remaining.toLocaleString()} / {stats.rateLimit.limit.toLocaleString()}{" "}
            remaining
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">Usage ({stats.rateLimit.period})</span>
              <span className="font-semibold">
                {(((stats.rateLimit.limit - stats.rateLimit.remaining) / stats.rateLimit.limit) * 100).toFixed(1)}% used
              </span>
            </div>
            <div className="h-3 bg-elevated-strong rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full transition-all"
                style={{ width: `${((stats.rateLimit.limit - stats.rateLimit.remaining) / stats.rateLimit.limit) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
            <p>
              You have {stats.rateLimit.remaining.toLocaleString()} requests
              remaining. Resets at {new Date(stats.rateLimit.reset).toLocaleString()}.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Endpoints */}
        <div className="glass rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Top Endpoints</h2>
          {stats.topEndpoints.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No endpoint data"
              description="API usage statistics will appear here"
            />
          ) : (
            <div className="space-y-4">
              {stats.topEndpoints.map((endpoint, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <code className="text-xs sm:text-sm font-mono text-muted-foreground truncate flex-1">
                      {endpoint.endpoint}
                    </code>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-semibold">
                        {endpoint.requests.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground w-10 sm:w-12 text-right">
                        {((endpoint.requests / stats.totalRequests) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-elevated-strong rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/60 rounded-full"
                      style={{ width: `${(endpoint.requests / stats.totalRequests) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="glass rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Requests</h2>
          {requestsLoading ? (
            <LoadingState message="Loading requests..." size="sm" />
          ) : recentRequests.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No recent requests"
              description="Your API requests will appear here"
            />
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-elevated] rounded-lg"
                >
                  <div className="flex-1 min-w-0 w-full">
                    <code className="text-xs font-mono text-muted-foreground block truncate">
                      {req.method} {req.endpoint}
                    </code>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={req.statusCode} />
                      <span className="text-xs text-muted-foreground">{req.responseTime}ms</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(req.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatusCard
          icon={CheckCircle2}
          label="Successful"
          count={stats.successfulRequests}
          percentage={Number(successRate)}
          color="text-success"
        />
        <StatusCard
          icon={XCircle}
          label="Failed"
          count={stats.failedRequests}
          percentage={Number(errorRate)}
          color="text-danger"
        />
        <StatusCard
          icon={Activity}
          label="Total"
          count={stats.totalRequests}
          percentage={100}
          color="text-gold"
        />
      </div>

      {/* Quick Links */}
      <div className="glass rounded-xl p-4 sm:p-6 bg-accent/5 border-accent/20">
        <h3 className="font-semibold mb-3">Need Help?</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <a
            href="/app/developers/rate-limits"
            className="flex items-center gap-2 text-accent hover:brightness-110 transition-all"
          >
            <Zap className="size-4" />
            <span>View Rate Limits</span>
          </a>
          <a
            href="/app/developers/errors"
            className="flex items-center gap-2 text-accent hover:brightness-110 transition-all"
          >
            <AlertCircle className="size-4" />
            <span>Error Code Reference</span>
          </a>
          <a
            href="/app/developers/api-keys"
            className="flex items-center gap-2 text-accent hover:brightness-110 transition-all"
          >
            <Activity className="size-4" />
            <span>Manage API Keys</span>
          </a>
          <a
            href="/app/developers/api-reference"
            className="flex items-center gap-2 text-accent hover:brightness-110 transition-all"
          >
            <BarChart3 className="size-4" />
            <span>API Documentation</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`size-5 ${color}`} />
      </div>
      <div className="text-2xl font-semibold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}


function StatusBadge({ status }: { status: number }) {
  const isSuccess = status >= 200 && status < 300;
  const isClientError = status >= 400 && status < 500;
  const isServerError = status >= 500;

  return (
    <span
      className={`
        px-2 py-0.5 rounded text-xs font-medium font-mono
        ${isSuccess ? "bg-success/20 text-success" : ""}
        ${isClientError ? "bg-warn/20 text-warn" : ""}
        ${isServerError ? "bg-danger/20 text-danger" : ""}
      `}
    >
      {status}
    </span>
  );
}

function StatusCard({
  icon: Icon,
  label,
  count,
  percentage,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  percentage: number;
  color: string;
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`size-5 ${color}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-semibold mb-2">{count.toLocaleString()}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-elevated-strong rounded-full overflow-hidden">
          <div
            className={`h-full ${color.replace("text-", "bg-")}/60 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
