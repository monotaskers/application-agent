import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats bytes to a human-readable string.
 *
 * @param bytes - The number of bytes to format.
 * @param decimals - The number of decimal places to show (default: 2).
 * @returns A formatted string representing the bytes (e.g., "1.5 MB").
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Generates a stable, deterministic ID from a prefix and variable string inputs.
 *
 * Uses a simple hash algorithm to create consistent IDs that are the same
 * for identical inputs. This is useful for generating stable IDs for React
 * components, charts, or other elements that need consistent identifiers
 * between server and client renders.
 *
 * @param prefix - A prefix string to prepend to the generated ID (e.g., "assessment", "chart").
 * @param inputs - Variable number of string inputs to hash together.
 * @returns A stable ID string in the format `{prefix}-{hash}`.
 *
 * @example
 * ```ts
 * generateStableId("assessment", "maturity", "supplier-123");
 * // Returns: "assessment-abc123xyz"
 *
 * generateStableId("chart", "pie", "dashboard", "user-456");
 * // Returns: "chart-def456uvw"
 * ```
 */
export function generateStableId(prefix: string, ...inputs: string[]): string {
  // Create a combined string from all inputs
  // This ensures the same inputs always produce the same ID
  const input = inputs.join("-");

  // Simple hash function for stable IDs (not cryptographic)
  // Uses left shift and addition to create a deterministic hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `${prefix}-${Math.abs(hash).toString(36)}`;
}
