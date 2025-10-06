/**
 * EmptyState Component
 *
 * @fileoverview Reusable empty state component for displaying "no data" messages
 * with optional call-to-action.
 *
 * @module features/clients-projects/components/shared/EmptyState
 */

import { ReactElement } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  /** Title text for the empty state */
  title: string;
  /** Description text explaining the empty state */
  description: string;
  /** Optional label for the action button */
  actionLabel?: string;
  /** Optional callback when action button is clicked */
  onAction?: () => void;
}

/**
 * EmptyState component for displaying when no data is available.
 *
 * @param props - Component props
 * @returns Centered empty state message with optional action button
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No clients yet"
 *   description="Get started by creating your first client"
 *   actionLabel="Create Client"
 *   onAction={() => router.push('/clients/new')}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
