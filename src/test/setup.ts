/**
 * Vitest Test Setup
 *
 * @fileoverview Global test setup for Vitest and React Testing Library.
 * Configures Jest DOM matchers and test environment.
 *
 * @module test/setup
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { db, clients, projects } from '@/db';
import { sql } from 'drizzle-orm';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Clear database tables before each test for isolation
beforeEach(async () => {
  try {
    // Truncate tables in correct order (projects first due to foreign key)
    await db.delete(projects);
    await db.delete(clients);
  } catch (error) {
    // Ignore errors if DATABASE_URL is not set (for non-database tests)
    if (process.env.DATABASE_URL) {
      console.warn('Failed to clear database tables:', error);
    }
  }
});

// Mock Next.js environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Mock Next.js server modules
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock Clerk authentication
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() =>
    Promise.resolve({
      userId: 'test-user-id',
      orgId: 'test-org-id',
    })
  ),
  currentUser: vi.fn(() => Promise.resolve(null)),
}));

// Mock matchMedia for components that use responsive hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as never;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as never;
