import { env } from "@/lib/env";
import {
  agentConfigSchema,
  type AgentConfiguration,
} from "./schemas/agent-config.schema";

/**
 * Loads and validates agent configuration from environment variables.
 *
 * Uses the validated environment variables from `@/lib/env` to build
 * an agent configuration object that matches the AgentConfiguration schema.
 *
 * @returns Validated agent configuration object
 * @throws {Error} If environment variables are invalid or missing
 *
 * @example
 * ```typescript
 * const config = loadAgentConfig();
 * // Returns: { agentName: "appname-assistant", agentUrl: "http://localhost:8000/", ... }
 * ```
 */
export function loadAgentConfig(): AgentConfiguration {
  const config: AgentConfiguration = {
    agentName: env.COPILOTKIT_AGENT_NAME,
    agentUrl: env.COPILOTKIT_AGENT_URL,
    timeout: env.COPILOTKIT_TIMEOUT,
    retryAttempts: env.COPILOTKIT_RETRY_ATTEMPTS,
    retryDelay: env.COPILOTKIT_RETRY_DELAY,
  };

  // Validate the constructed config against the schema
  return agentConfigSchema.parse(config);
}
