import { z } from "zod";

/**
 * Zod schema for validating agent configuration.
 *
 * Represents the runtime configuration for the CopilotKit agent including
 * agent name, URL, timeout, and retry settings.
 *
 * @module schemas/agent-config
 */
export const agentConfigSchema = z.object({
  agentName: z.string().min(1, "Agent name must be a non-empty string"),
  agentUrl: z.string().url("Agent URL must be a valid URL"),
  timeout: z.number().positive("Timeout must be a positive number"),
  retryAttempts: z
    .number()
    .int()
    .nonnegative("Retry attempts must be a non-negative integer"),
  retryDelay: z
    .number()
    .nonnegative("Retry delay must be a non-negative number"),
});

/**
 * TypeScript type inferred from agent configuration schema.
 */
export type AgentConfiguration = z.infer<typeof agentConfigSchema>;
