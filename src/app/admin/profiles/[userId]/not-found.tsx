/**
 * @fileoverview Not found page for profile view route
 * @module app/admin/profiles/[userId]/not-found
 */

import { type ReactElement } from "react";
import Link from "next/link";
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
 * Not found page for profile view route
 *
 * Rendered automatically when `notFound()` is called from the server component.
 * Provides a user-friendly 404 message with navigation options.
 * Used for privacy protection (profile not found or access denied).
 *
 * @returns React element containing not found UI
 */
export default function ProfileViewNotFound(): ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Profile Not Found
        </CardTitle>
        <CardDescription>
          The profile you&apos;re looking for doesn&apos;t exist, has been
          deleted, or you don&apos;t have access to view it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The profile may have been removed, or you may not have a business
          relationship with this user.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="primary">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
