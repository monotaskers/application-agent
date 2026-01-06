/**
 * @fileoverview Not found page for profile route
 * @module app/admin/profile/not-found
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
 * Not found page for profile route
 *
 * Rendered automatically when `notFound()` is called from the server component.
 * Provides a user-friendly 404 message with navigation options.
 *
 * @returns React element containing not found UI
 */
export default function ProfileNotFound(): ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Profile Not Found
        </CardTitle>
        <CardDescription>
          Your profile doesn&apos;t exist or has been deleted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your profile may have been removed, or there may be an issue with your
          account.
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
