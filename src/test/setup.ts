/**
 * @fileoverview Vitest test setup file
 * @module test/setup
 */

import { cleanup } from "@testing-library/react";
import { afterEach, expect, beforeAll } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock environment variables for tests
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

  global.ResizeObserver = class ResizeObserver {
    observe() {
      // Mock implementation
    }
    unobserve() {
      // Mock implementation
    }
    disconnect() {
      // Mock implementation
    }
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
