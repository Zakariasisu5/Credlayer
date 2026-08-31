"use client";

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 bg-red-950/20 border border-red-800/50 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="size-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="font-semibold text-red-200 mb-2">Component Error</h2>
                <p className="text-sm text-red-300 mb-2">
                  An error occurred while loading this component.
                </p>
                <p className="text-xs text-red-400 font-mono bg-red-950/40 p-2 rounded">
                  {this.state.error?.message || "Unknown error"}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
