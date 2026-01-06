import { z } from "zod";

/**
 * Zod schema for validating chat messages.
 *
 * Represents a single message in the conversation with validation rules
 * for content, role, timestamp, and status.
 *
 * @module schemas/chat-message
 */
export const chatMessageSchema = z.object({
  id: z.string().uuid("Message ID must be a valid UUID"),
  content: z.string().min(1, "Message content cannot be empty"),
  role: z.enum(["user", "assistant"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'assistant'" }),
  }),
  timestamp: z.date({
    required_error: "Timestamp is required",
    invalid_type_error: "Timestamp must be a valid Date",
  }),
  status: z.enum(["sending", "sent", "error"], {
    errorMap: () => ({
      message: "Status must be 'sending', 'sent', or 'error'",
    }),
  }),
  errorMessage: z.string().optional(),
});

/**
 * TypeScript type inferred from chat message schema.
 */
export type ChatMessage = z.infer<typeof chatMessageSchema>;
