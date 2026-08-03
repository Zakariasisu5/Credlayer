import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | { message: string };
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const errorMessage = message || error?.message || "An unexpected error occurred. Please try again.";

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="glass rounded-full p-4 mb-4">
        <AlertCircle className="size-8 text-danger" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        {errorMessage}
      </p>
      {onRetry && (
        <Button variant="gold" onClick={onRetry}>
          <RefreshCw className="size-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export function InlineError({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-danger", className)}>
      <AlertCircle className="size-4" />
      <span>{message}</span>
    </div>
  );
}
