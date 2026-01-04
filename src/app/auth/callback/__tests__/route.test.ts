/**
 * @fileoverview Tests for auth callback route handler
 * @module app/auth/callback/__tests__/route.test
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";

// Mock Supabase server client
const mockVerifyOtp = vi.fn();
const mockExchangeCodeForSession = vi.fn();
const mockSupabaseClient = {
  auth: {
    verifyOtp: mockVerifyOtp,
    exchangeCodeForSession: mockExchangeCodeForSession,
  },
};

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}));

// Mock NextResponse
vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...actual,
    NextResponse: {
      redirect: vi.fn((url: string) => ({
        url,
        status: 302,
      })),
    },
  };
});

/**
 * Test suite for auth callback route handler.
 *
 * Tests Magic Link callback, OAuth callback, and error handling.
 */
describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle Magic Link callback with token_hash", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?token_hash=abc123&type=email"
    );

    const response = await GET(request);

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      token_hash: "abc123",
      type: "email",
    });
    expect(response.url).toContain("/admin/overview");
  });

  it("should handle OAuth callback with code", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?code=oauth_code_123"
    );

    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("oauth_code_123");
    expect(response.url).toContain("/admin/overview");
  });

  it("should redirect to sign-in on invalid Magic Link", async () => {
    mockVerifyOtp.mockResolvedValue({
      error: { message: "Invalid token" },
    });

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?token_hash=invalid&type=email"
    );

    const response = await GET(request);

    expect(response.url).toContain("/auth/sign-in");
    expect(response.url).toContain("error=invalid_link");
  });

  it("should redirect to sign-in on OAuth error", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: { message: "Invalid grant" },
    });

    const request = new NextRequest(
      "http://localhost:3000/auth/callback?code=invalid_code"
    );

    const response = await GET(request);

    expect(response.url).toContain("/auth/sign-in");
    expect(response.url).toContain("error=oauth_error");
  });

  it("should redirect to sign-in when no callback parameters provided", async () => {
    const request = new NextRequest("http://localhost:3000/auth/callback");

    const response = await GET(request);

    expect(mockVerifyOtp).not.toHaveBeenCalled();
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    expect(response.url).toContain("/auth/sign-in");
  });
});
