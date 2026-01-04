/**
 * Type declarations for Vitest with jest-dom matchers
 * This file extends Vitest's expect with jest-dom matchers types
 */

import "@testing-library/jest-dom";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type {
  Assertion as VitestAssertion,
  AsymmetricMatchersContaining as VitestAsymmetricMatchers,
} from "vitest";

declare module "vitest" {
  interface Assertion<T = unknown>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends jest.Matchers<void, unknown>,
      TestingLibraryMatchers<unknown, void> {}
}

// Export types to prevent unused import warnings
export type { VitestAssertion, VitestAsymmetricMatchers };
