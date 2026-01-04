import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest, NextResponse } from "next/server";
import { loadAgentConfig } from "@/features/copilotkit/lib/agent-config";

/**
 * Service adapter for CopilotKit runtime.
 *
 * Uses ExperimentalEmptyAdapter for single-agent setup. This is sufficient
 * for the initial implementation. If multi-agent support is needed in the
 * future, replace with an appropriate multi-agent adapter.
 *
 * Migration path: Replace ExperimentalEmptyAdapter with a multi-agent adapter
 * (e.g., from @copilotkit/runtime) when multiple agents are required.
 */
const serviceAdapter = new ExperimentalEmptyAdapter();

/**
 * Creates a CopilotRuntime instance with environment-based configuration.
 *
 * Loads agent configuration from environment variables and creates an
 * HttpAgent instance pointing to the configured agent backend URL.
 *
 * @returns Configured CopilotRuntime instance
 * @throws {Error} If agent configuration is invalid
 */
function createRuntime(): CopilotRuntime {
  const config = loadAgentConfig();

  return new CopilotRuntime({
    agents: {
      [config.agentName]: new HttpAgent({ url: config.agentUrl }),
    },
  });
}

/**
 * POST handler for CopilotKit runtime requests.
 *
 * Handles all CopilotKit runtime requests including chat messages,
 * context updates, and agent interactions. Includes error handling
 * and timeout management.
 *
 * @param req - Next.js request object
 * @returns Response with CopilotKit runtime result
 */
export const POST = async (req: NextRequest): Promise<Response> => {
  try {
    const runtime = createRuntime();
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    return await handleRequest(req);
  } catch (error) {
    console.error("CopilotKit runtime error:", error);
    return NextResponse.json(
      {
        error: "Failed to process CopilotKit request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
