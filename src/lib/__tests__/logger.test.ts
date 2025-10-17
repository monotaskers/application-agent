/**
 * Unit tests for console logger
 * Following TDD approach - these tests are written before implementation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsoleLogger } from '../logger';
import { LogLevel, DEFAULT_LOGGER_CONFIG } from '../logger.types';
import type { LoggerConfig } from '../logger.types';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock console methods
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock Date to have consistent timestamps in tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-17T10:30:45.123Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should use default configuration when none provided', () => {
      logger = new ConsoleLogger();
      logger.info('test');
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should accept custom configuration', () => {
      const config: LoggerConfig = {
        enabled: false,
        minLevel: 'error',
        includeTimestamp: false,
        includeStackTrace: false
      };
      logger = new ConsoleLogger(config);
      logger.info('test'); // Should not log due to minLevel
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });
  });

  describe('error method', () => {
    beforeEach(() => {
      logger = new ConsoleLogger();
    });

    it('should log error messages with timestamp and level', () => {
      logger.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [ERROR]',
        'Test error message'
      );
    });

    it('should include error stack trace when Error object provided', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [ERROR]',
        'Error occurred',
        '\n',
        error
      );
    });

    it('should respect includeStackTrace config', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, includeStackTrace: false });
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [ERROR]',
        'Error occurred',
        '\n',
        'Error: Test error'
      );
    });
  });

  describe('warn method', () => {
    beforeEach(() => {
      logger = new ConsoleLogger();
    });

    it('should log warning messages', () => {
      logger.warn('Warning message');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [WARN]',
        'Warning message'
      );
    });

    it('should include additional data when provided', () => {
      const data = { userId: 123, action: 'delete' };
      logger.warn('User action warning', data);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [WARN]',
        'User action warning',
        data
      );
    });
  });

  describe('info method', () => {
    beforeEach(() => {
      logger = new ConsoleLogger();
    });

    it('should log info messages', () => {
      logger.info('Information message');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [INFO]',
        'Information message'
      );
    });

    it('should include additional data when provided', () => {
      const data = { status: 'ready', port: 3000 };
      logger.info('Server started', data);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [INFO]',
        'Server started',
        data
      );
    });
  });

  describe('debug method', () => {
    it('should not log debug messages when minLevel is info', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, minLevel: 'info' });
      logger.debug('Debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log debug messages when minLevel is debug', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, minLevel: 'debug' });
      logger.debug('Debug message');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [DEBUG]',
        'Debug message'
      );
    });

    it('should include additional data when provided', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, minLevel: 'debug' });
      const data = { query: 'SELECT * FROM users', timing: 45 };
      logger.debug('Database query', data);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [DEBUG]',
        'Database query',
        data
      );
    });
  });

  describe('performance method', () => {
    beforeEach(() => {
      logger = new ConsoleLogger();
    });

    it('should log performance metrics with default unit', () => {
      logger.performance('page-load', 245);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [PERF]',
        'page-load: 245ms'
      );
    });

    it('should log performance metrics with custom unit', () => {
      logger.performance('memory-usage', 1024, 'KB');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [PERF]',
        'memory-usage: 1024KB'
      );
    });

    it('should handle different metric units', () => {
      logger.performance('cpu-usage', 85, '%');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [PERF]',
        'cpu-usage: 85%'
      );
    });
  });

  describe('log level filtering', () => {
    it('should respect minimum log level', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, minLevel: 'warn' });

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should log all levels when minLevel is debug', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, minLevel: 'debug' });

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('enabled flag', () => {
    it('should not log anything when disabled', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, enabled: false });

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');
      logger.performance('metric', 100);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('timestamp formatting', () => {
    it('should include timestamp when includeTimestamp is true', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, includeTimestamp: true });
      logger.info('test');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[2025-10-17T10:30:45.123Z] [INFO]',
        'test'
      );
    });

    it('should exclude timestamp when includeTimestamp is false', () => {
      logger = new ConsoleLogger({ ...DEFAULT_LOGGER_CONFIG, includeTimestamp: false });
      logger.info('test');
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[INFO]',
        'test'
      );
    });
  });

  describe('singleton instance', () => {
    it('should provide a default singleton instance', () => {
      const { logger: defaultLogger } = require('../logger');
      expect(defaultLogger).toBeDefined();
      expect(defaultLogger.info).toBeDefined();
      expect(defaultLogger.error).toBeDefined();
      expect(defaultLogger.warn).toBeDefined();
      expect(defaultLogger.debug).toBeDefined();
      expect(defaultLogger.performance).toBeDefined();
    });
  });
});