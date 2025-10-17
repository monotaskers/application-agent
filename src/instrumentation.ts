import { logger } from '@/lib/logger';

export async function register(): Promise<void> {
  // Log initialization based on runtime environment
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logger.info('Server instrumentation initialized', {
      runtime: 'nodejs',
      nodeVersion: process.version
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    logger.info('Edge runtime instrumentation initialized', {
      runtime: 'edge'
    });
  }
}

// Replace Sentry's captureRequestError with console logging
export const onRequestError = (
  error: unknown,
  request: Request,
  context?: any
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorObj = error instanceof Error ? error : new Error(errorMessage);

  logger.error(`Request error: ${request.method} ${request.url}`, errorObj);
  logger.debug('Request error context', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    context
  });
};
