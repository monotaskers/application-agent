"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RiErrorWarningLine } from "@remixicon/react";
import { ReactElement } from "react";

export default function SalesError({ error }: { error: Error }): ReactElement {
  return (
    <Alert variant="destructive">
      <RiErrorWarningLine className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load sales data: {error.message}
      </AlertDescription>
    </Alert>
  );
}
