import { z } from "zod";
import { chatMessageSchema } from "./chat-message.schema";

/**
 * Zod schema for validating chat sessions.
 *
 * Represents the current conversation state within a single browser session
 * with message history, open/closed status, and error state.
 *
 * @module schemas/chat-session
 */
export const chatSessionSchema = z.object({
  messages: z.array(chatMessageSchema, {
    required_error: "Messages array is required",
  }),
  isOpen: z.boolean({
    required_error: "isOpen is required",
    invalid_type_error: "isOpen must be a boolean",
  }),
  isLoading: z.boolean({
    required_error: "isLoading is required",
    invalid_type_error: "isLoading must be a boolean",
  }),
  error: z.string().nullable(),
});

/**
 * TypeScript type inferred from chat session schema.
 */
export type ChatSession = z.infer<typeof chatSessionSchema>;
