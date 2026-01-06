/**
 * @fileoverview Error boundary for user detail page
 * @module app/admin/users/[userId]/error
 */

"use client";

import { useEffect, type ReactElement } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

/**
 * Props for UserDetailError component
 */
interface UserDetailErrorProps {
  /** Error object */
  error: Error & { digest?: string };
  /** Function to reset the error boundary */
  reset: () => void;
}

/**
 * Error boundary component for user detail page
 *
 * Catches errors during server rendering or client-side rendering
 * and displays a user-friendly error message with recovery options.
 * Logs errors to Sentry for monitoring.
 *
 * @param props - Component props
 * @returns React element containing error UI
 */
export default function UserDetailError({
  error,
  reset,
}: UserDetailErrorProps): ReactElement {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Error Loading User
          </CardTitle>
          <CardDescription>
            An unexpected error occurred while loading the user information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "An unknown error occurred"}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
            <Button asChild variant="primary">
              <Link href="/admin/users">Back to Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
