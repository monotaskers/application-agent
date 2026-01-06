import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'zenprospect-production.s3.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  // Disable webpack caching to resolve build issues
  webpack: (config) => {
    // Disable filesystem cache
    config.cache = false;
    return config;
  },
  // Configure body size limits for file uploads (50MB)
  // Note: middlewareClientMaxBodySize is experimental and may need to be configured
  // at the deployment level (e.g., Vercel) for production
  experimental: {
    middlewareClientMaxBodySize: '50mb',
  },
  // These packages are used by Sentry internally and need special handling
  // Remove from serverExternalPackages since they're not direct dependencies
  // serverExternalPackages: []
};

let configWithPlugins = baseConfig;

// Conditionally enable Sentry configuration
if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  // Check if all required Sentry credentials are available for source map uploads
  const hasSentryCredentials =
    process.env.SENTRY_AUTH_TOKEN &&
    process.env.NEXT_PUBLIC_SENTRY_ORG &&
    process.env.NEXT_PUBLIC_SENTRY_PROJECT;

  // Build Sentry config conditionally to satisfy TypeScript's exactOptionalPropertyTypes
  const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options
    org: process.env.NEXT_PUBLIC_SENTRY_ORG ?? '',
    project: process.env.NEXT_PUBLIC_SENTRY_PROJECT ?? '',
    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Disable source map uploads if credentials are missing (prevents warnings)
    sourcemaps: {
      disable: !hasSentryCredentials,
    },

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    // Only applies when source map uploads are enabled
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Disable Sentry telemetry
    telemetry: false
  };

  // Only add authToken if credentials are available (satisfies exactOptionalPropertyTypes)
  if (hasSentryCredentials && process.env.SENTRY_AUTH_TOKEN) {
    sentryConfig.authToken = process.env.SENTRY_AUTH_TOKEN;
  }

  configWithPlugins = withSentryConfig(baseConfig, sentryConfig);
}

const nextConfig = configWithPlugins;
export default nextConfig;
