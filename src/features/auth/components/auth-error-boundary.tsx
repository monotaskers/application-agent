"use client";

import React, { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AuthErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for auth-related components
 * Catches errors in auth components and displays a user-friendly error message
 *
 * Features:
 * - Catches React errors in auth component tree
 * - Provides error recovery UI
 * - Logs errors for debugging
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 * @param props.fallback - Optional custom fallback UI
 * @returns JSX element containing error boundary
 */
export class AuthErrorBoundary extends Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console for debugging
    console.error("Auth error boundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex flex-col items-center justify-center space-y-4 p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-lg font-semibold font-sans">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            We encountered an error while processing your request. Please try
            again.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-sans">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs font-sans">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <Button
            onClick={this.handleReset}
            className="bg-[#5EA500] hover:bg-[#4d8500] font-sans font-bold"
            aria-label="Retry authentication"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
