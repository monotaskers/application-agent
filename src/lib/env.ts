import { z } from "zod";

/**
 * Environment variable schema for Supabase authentication and CopilotKit
 * Validates required environment variables at runtime
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1)
    .optional()
    .describe("Optional: Required for admin operations"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("NEXT_PUBLIC_APP_URL must be a valid URL")
    .optional()
    .describe(
      "Optional: Base URL of the application. Used for auth redirects. Falls back to window.location.origin if not set."
    ),
  COPILOTKIT_AGENT_URL: z
    .string()
    .url("COPILOTKIT_AGENT_URL must be a valid URL")
    .optional()
    .default("http://localhost:8000/")
    .describe(
      "CopilotKit agent backend URL (defaults to localhost for development)"
    ),
  COPILOTKIT_AGENT_NAME: z
    .string()
    .min(1, "COPILOTKIT_AGENT_NAME must be a non-empty string")
    .optional()
    .default("appname-assistant")
    .describe("CopilotKit agent identifier (defaults to 'appname-assistant')"),
  COPILOTKIT_TIMEOUT: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .optional()
    .default("30000")
    .transform((val) =>
      typeof val === "string" ? Number.parseInt(val, 10) : val
    )
    .pipe(z.number().positive("COPILOTKIT_TIMEOUT must be a positive number"))
    .describe("Request timeout in milliseconds (defaults to 30000)"),
  COPILOTKIT_RETRY_ATTEMPTS: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .optional()
    .default("3")
    .transform((val) =>
      typeof val === "string" ? Number.parseInt(val, 10) : val
    )
    .pipe(
      z
        .number()
        .int()
        .nonnegative("COPILOTKIT_RETRY_ATTEMPTS must be a non-negative integer")
    )
    .describe("Number of retry attempts on failure (defaults to 3)"),
  COPILOTKIT_RETRY_DELAY: z
    .union([z.string().regex(/^\d+$/), z.number()])
    .optional()
    .default("1000")
    .transform((val) =>
      typeof val === "string" ? Number.parseInt(val, 10) : val
    )
    .pipe(
      z
        .number()
        .nonnegative("COPILOTKIT_RETRY_DELAY must be a non-negative number")
    )
    .describe("Delay between retries in milliseconds (defaults to 1000)"),
  BASE_API_URL: z
    .string()
    .url("BASE_API_URL must be a valid URL")
    .optional()
    .describe("Optional: Base URL for external API services"),
});

/**
 * Lazy validation cache
 */
let validatedEnv: z.infer<typeof envSchema> | null = null;

/**
 * Get validated environment variables with lazy validation
 * Only validates when first accessed, not at module load time
 * Uses safeParse to allow builds to proceed with missing env vars
 */
function getValidatedEnv(): z.infer<typeof envSchema> {
  if (validatedEnv) {
    return validatedEnv;
  }

  const envData = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    COPILOTKIT_AGENT_URL: process.env.COPILOTKIT_AGENT_URL,
    COPILOTKIT_AGENT_NAME: process.env.COPILOTKIT_AGENT_NAME,
    COPILOTKIT_TIMEOUT: process.env.COPILOTKIT_TIMEOUT,
    COPILOTKIT_RETRY_ATTEMPTS: process.env.COPILOTKIT_RETRY_ATTEMPTS,
    COPILOTKIT_RETRY_DELAY: process.env.COPILOTKIT_RETRY_DELAY,
    BASE_API_URL: process.env.BASE_API_URL,
  };

  const result = envSchema.safeParse(envData);

  if (result.success) {
    validatedEnv = result.data;
  } else {
    // During build or when env vars are missing, use placeholder values
    // This allows builds to complete, but runtime will fail when Supabase client is created
    validatedEnv = {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        "https://placeholder.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      COPILOTKIT_AGENT_URL:
        process.env.COPILOTKIT_AGENT_URL || "http://localhost:8000/",
      COPILOTKIT_AGENT_NAME:
        process.env.COPILOTKIT_AGENT_NAME || "appname-assistant",
      COPILOTKIT_TIMEOUT: process.env.COPILOTKIT_TIMEOUT
        ? Number.parseInt(process.env.COPILOTKIT_TIMEOUT, 10)
        : 30000,
      COPILOTKIT_RETRY_ATTEMPTS: process.env.COPILOTKIT_RETRY_ATTEMPTS
        ? Number.parseInt(process.env.COPILOTKIT_RETRY_ATTEMPTS, 10)
        : 3,
      COPILOTKIT_RETRY_DELAY: process.env.COPILOTKIT_RETRY_DELAY
        ? Number.parseInt(process.env.COPILOTKIT_RETRY_DELAY, 10)
        : 1000,
      BASE_API_URL: process.env.BASE_API_URL,
    } as z.infer<typeof envSchema>;
  }

  return validatedEnv;
}

/**
 * Validated environment variables
 * Uses lazy validation - only validates when first accessed, not at module load time
 * This prevents build failures when env vars aren't set during build
 */
export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop: string | symbol) {
    const validated = getValidatedEnv();
    return validated[prop as keyof typeof validated];
  },
});

/**
 * Validates environment variables and returns result
 * Use this for graceful error handling instead of throwing
 *
 * @returns Validation result with success status and data/error
 */
export function validateEnv(): {
  success: boolean;
  data?: z.infer<typeof envSchema>;
  error?: z.ZodError;
} {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    COPILOTKIT_AGENT_URL: process.env.COPILOTKIT_AGENT_URL,
    COPILOTKIT_AGENT_NAME: process.env.COPILOTKIT_AGENT_NAME,
    COPILOTKIT_TIMEOUT: process.env.COPILOTKIT_TIMEOUT,
    COPILOTKIT_RETRY_ATTEMPTS: process.env.COPILOTKIT_RETRY_ATTEMPTS,
    COPILOTKIT_RETRY_DELAY: process.env.COPILOTKIT_RETRY_DELAY,
    BASE_API_URL: process.env.BASE_API_URL,
  });

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}

/**
 * Gets the base URL for the application
 * Used for auth redirects and other URL construction
 *
 * @returns The base URL (with trailing slash removed)
 */
export function getAppUrl(): string {
  // In browser, prefer environment variable or fall back to window.location.origin
  if (typeof window !== "undefined") {
    return env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }

  // On server, use environment variable or throw error
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback for server-side rendering (should not happen in production)
  throw new Error(
    "NEXT_PUBLIC_APP_URL must be set in production. Set it in your Vercel environment variables."
  );
}
