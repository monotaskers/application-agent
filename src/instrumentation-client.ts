// This file configures client-side instrumentation and error tracking
// Replaces Sentry with console logging for error and performance monitoring
import { logger } from '@/lib/logger';

// Initialize client-side logging
if (typeof window !== 'undefined') {
  logger.info('Client instrumentation initialized', {
    userAgent: window.navigator.userAgent,
    url: window.location.href,
  });

  // Add global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    logger.error(`Uncaught error: ${event.message}`, event.error);
  });

  // Add handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    logger.error('Unhandled promise rejection', error);
  });
}

// Replace Sentry's router transition tracking with performance logging
export const onRouterTransitionStart = (pathname: string): void => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigationStart = window.performance.now();
    logger.performance('route-transition-start', navigationStart);
    logger.debug('Navigation started', { pathname });
  }
};
