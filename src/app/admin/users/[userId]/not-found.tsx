/**
 * @fileoverview Not found page for user detail route
 * @module app/admin/users/[userId]/not-found
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
 * Not found page for user detail route
 *
 * Rendered automatically when `notFound()` is called from the server component.
 * Provides a user-friendly 404 message with navigation options.
 *
 * @returns React element containing not found UI
 */
export default function UserNotFound(): ReactElement {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            User Not Found
          </CardTitle>
          <CardDescription>
            The user you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The user may have been removed, or the link you followed may be
            incorrect.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="primary">
              <Link href="/admin/users">Back to Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
