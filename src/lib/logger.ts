/**
 * Console logger implementation to replace Sentry integration
 * Provides structured logging with timestamp, level, and message formatting
 */

import {
  LogLevel,
  MetricUnit,
  DEFAULT_LOGGER_CONFIG,
  type ILogger,
  type LoggerConfig,
  type LogEntry,
  type PerformanceMetric
} from './logger.types';

/**
 * Console logger implementation
 * Replaces Sentry with structured console output
 */
export class ConsoleLogger implements ILogger {
  private config: LoggerConfig;
  private logLevelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      ...DEFAULT_LOGGER_CONFIG,
      ...config
    };
  }

  /**
   * Check if a log level should be output based on minimum level configuration
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const minPriority = this.logLevelPriority[this.config.minLevel];
    const currentPriority = this.logLevelPriority[level];
    return currentPriority >= minPriority;
  }

  /**
   * Format the log prefix with timestamp and level
   */
  private formatPrefix(level: string): string {
    if (this.config.includeTimestamp) {
      const timestamp = new Date().toISOString();
      return `[${timestamp}] [${level}]`;
    }
    return `[${level}]`;
  }

  /**
   * Log an error with optional Error object
   */
  error(message: string, error?: Error): void {
    if (!this.shouldLog('error')) return;

    const prefix = this.formatPrefix('ERROR');

    if (error) {
      if (this.config.includeStackTrace && error.stack) {
        console.error(prefix, message, '\n', error);
      } else {
        console.error(prefix, message, '\n', error.toString());
      }
    } else {
      console.error(prefix, message);
    }
  }

  /**
   * Log a warning with optional data
   */
  warn(message: string, data?: unknown): void {
    if (!this.shouldLog('warn')) return;

    const prefix = this.formatPrefix('WARN');

    if (data !== undefined) {
      console.warn(prefix, message, data);
    } else {
      console.warn(prefix, message);
    }
  }

  /**
   * Log an info message with optional data
   */
  info(message: string, data?: unknown): void {
    if (!this.shouldLog('info')) return;

    const prefix = this.formatPrefix('INFO');

    if (data !== undefined) {
      console.info(prefix, message, data);
    } else {
      console.info(prefix, message);
    }
  }

  /**
   * Log a debug message with optional data
   */
  debug(message: string, data?: unknown): void {
    if (!this.shouldLog('debug')) return;

    const prefix = this.formatPrefix('DEBUG');

    if (data !== undefined) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }

  /**
   * Log a performance metric with name, value, and optional unit
   */
  performance(name: string, value: number, unit: MetricUnit = 'ms'): void {
    if (!this.shouldLog('info')) return;

    const prefix = this.formatPrefix('PERF');
    const metricMessage = `${name}: ${value}${unit}`;

    console.info(prefix, metricMessage);
  }
}

/**
 * Default logger instance for application use
 * Configured with default settings
 */
export const logger: ILogger = new ConsoleLogger();

/**
 * Factory function to create a custom logger instance
 */
export function createLogger(config?: Partial<LoggerConfig>): ILogger {
  return new ConsoleLogger(config);
}

/**
 * Type guard to check if an object is a valid Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Helper function to format log entries for structured logging
 * Can be used for custom formatting needs
 */
export function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, data, error } = entry;
  const parts: string[] = [];

  parts.push(`[${timestamp.toISOString()}]`);
  parts.push(`[${level.toUpperCase()}]`);
  parts.push(message);

  if (data !== undefined) {
    parts.push(JSON.stringify(data));
  }

  if (error) {
    parts.push(`\nError: ${error.message}`);
    if (error.stack) {
      parts.push(`\nStack: ${error.stack}`);
    }
  }

  return parts.join(' ');
}

/**
 * Helper function to format performance metrics
 */
export function formatPerformanceMetric(metric: PerformanceMetric): string {
  const { timestamp, name, value, unit } = metric;
  return `[${timestamp.toISOString()}] [PERF] ${name}: ${value}${unit}`;
}