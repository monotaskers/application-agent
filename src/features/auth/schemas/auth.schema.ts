import { z } from "zod";

/**
 * Schema for passwordless email authentication input
 * Used for Magic Link and OTP email flows
 */
export const passwordlessEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Schema for OTP verification input
 * Used when user enters the 6-digit code from email
 */
export const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
  type: z.literal("email"),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type PasswordlessEmailInput = z.infer<typeof passwordlessEmailSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
