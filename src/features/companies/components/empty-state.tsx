/**
 * @fileoverview Empty state component for company lists
 * @module features/companies/components/empty-state
 */

import { type ReactElement } from "react";
import { Building2 } from "lucide-react";

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** Message to display */
  message: string;
}

/**
 * Empty state component for company lists
 *
 * Displays a message when no companies are found.
 *
 * @param props - Component props
 * @returns React element containing empty state
 */
export function EmptyState({ message }: EmptyStateProps): ReactElement {
  return (
    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
      <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">No companies found</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
