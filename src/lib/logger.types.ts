/**
 * Logger type definitions and interfaces for console logging
 * Replaces Sentry integration with structured console output
 */

import { z } from 'zod';

/**
 * Log severity levels
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/**
 * Units for performance metrics
 */
export const MetricUnit = {
  MILLISECONDS: 'ms',
  SECONDS: 's',
  BYTES: 'bytes',
  KILOBYTES: 'KB',
  MEGABYTES: 'MB',
  COUNT: 'count',
  PERCENTAGE: '%'
} as const;

export type MetricUnit = typeof MetricUnit[keyof typeof MetricUnit];

/**
 * Zod schema for log level validation
 */
export const LogLevelSchema = z.enum(['error', 'warn', 'info', 'debug']);

/**
 * Structure for console log messages
 */
export const LogEntrySchema = z.object({
  timestamp: z.date(),
  level: LogLevelSchema,
  message: z.string().min(1),
  data: z.unknown().optional(),
  error: z.instanceof(Error).optional()
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

/**
 * Structure for performance metrics logging
 */
export const PerformanceMetricSchema = z.object({
  timestamp: z.date(),
  name: z.string().min(1),
  value: z.number().positive(),
  unit: z.string().default('ms')
});

export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  includeTimestamp: boolean;
  includeStackTrace: boolean;
}

/**
 * Main logger interface - defines the public API
 */
export interface ILogger {
  error(message: string, error?: Error): void;
  warn(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
  performance(name: string, value: number, unit?: MetricUnit): void;
}

/**
 * Default logger configuration
 */
export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  enabled: true,
  minLevel: 'info',
  includeTimestamp: true,
  includeStackTrace: true
};