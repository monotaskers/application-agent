"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RiErrorWarningLine } from "@remixicon/react";
import { ReactElement } from "react";

export default function AreaStatsError({
  error,
}: {
  error: Error;
}): ReactElement {
  return (
    <Alert variant="destructive">
      <RiErrorWarningLine className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load area statistics: {error.message}
      </AlertDescription>
    </Alert>
  );
}
