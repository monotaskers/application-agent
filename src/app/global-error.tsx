'use client';

import NextError from 'next/error';
import { useEffect, ReactElement } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string };
}): ReactElement {
  useEffect(() => {
    // Log the error to console instead of Sentry
    logger.error('Global application error', error);

    // Also log the error digest if available for debugging
    if (error.digest) {
      logger.debug('Error digest for tracking', { digest: error.digest });
    }
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
