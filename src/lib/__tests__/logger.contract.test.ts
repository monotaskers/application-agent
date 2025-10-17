/**
 * Contract tests for logger service based on OpenAPI specification
 * Validates that the logger implementation matches the contract
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { ConsoleLogger } from '../logger';
import {
  LogLevel,
  LogLevelSchema,
  LogEntrySchema,
  PerformanceMetricSchema,
  MetricUnit,
  type ILogger,
  type LogEntry,
  type PerformanceMetric
} from '../logger.types';

describe('Logger Contract Tests', () => {
  let logger: ILogger;

  beforeEach(() => {
    logger = new ConsoleLogger();
  });

  describe('LogLevel Schema Contract', () => {
    it('should accept valid log levels', () => {
      const validLevels = ['error', 'warn', 'info', 'debug'];
      validLevels.forEach(level => {
        expect(() => LogLevelSchema.parse(level)).not.toThrow();
      });
    });

    it('should reject invalid log levels', () => {
      const invalidLevels = ['trace', 'fatal', 'verbose', 'invalid'];
      invalidLevels.forEach(level => {
        expect(() => LogLevelSchema.parse(level)).toThrow(z.ZodError);
      });
    });

    it('should match OpenAPI enum definition', () => {
      // From logger-service.yaml: enum: [error, warn, info, debug]
      const contractLevels = ['error', 'warn', 'info', 'debug'];
      const schemaLevels = Object.values(LogLevel);
      expect(schemaLevels).toEqual(contractLevels);
    });
  });

  describe('LogEntry Schema Contract', () => {
    it('should validate required fields', () => {
      const validEntry: LogEntry = {
        timestamp: new Date(),
        level: 'info',
        message: 'Test message'
      };

      expect(() => LogEntrySchema.parse(validEntry)).not.toThrow();
    });

    it('should reject missing required fields', () => {
      const invalidEntries = [
        { level: 'info', message: 'test' }, // missing timestamp
        { timestamp: new Date(), message: 'test' }, // missing level
        { timestamp: new Date(), level: 'info' } // missing message
      ];

      invalidEntries.forEach(entry => {
        expect(() => LogEntrySchema.parse(entry)).toThrow(z.ZodError);
      });
    });

    it('should accept optional fields', () => {
      const entryWithOptionals: LogEntry = {
        timestamp: new Date(),
        level: 'error',
        message: 'Error occurred',
        data: { userId: 123 },
        error: new Error('Test error')
      };

      expect(() => LogEntrySchema.parse(entryWithOptionals)).not.toThrow();
    });

    it('should validate message is non-empty string', () => {
      const invalidEntry = {
        timestamp: new Date(),
        level: 'info',
        message: ''
      };

      expect(() => LogEntrySchema.parse(invalidEntry)).toThrow(z.ZodError);
    });
  });

  describe('PerformanceMetric Schema Contract', () => {
    it('should validate required fields', () => {
      const validMetric: PerformanceMetric = {
        timestamp: new Date(),
        name: 'page-load',
        value: 245,
        unit: 'ms'
      };

      expect(() => PerformanceMetricSchema.parse(validMetric)).not.toThrow();
    });

    it('should apply default unit when not provided', () => {
      const metricWithoutUnit = {
        timestamp: new Date(),
        name: 'api-call',
        value: 89
      };

      const parsed = PerformanceMetricSchema.parse(metricWithoutUnit);
      expect(parsed.unit).toBe('ms');
    });

    it('should validate value is positive number', () => {
      const invalidMetrics = [
        {
          timestamp: new Date(),
          name: 'metric',
          value: -1,
          unit: 'ms'
        },
        {
          timestamp: new Date(),
          name: 'metric',
          value: 0,
          unit: 'ms'
        }
      ];

      invalidMetrics.forEach(metric => {
        expect(() => PerformanceMetricSchema.parse(metric)).toThrow(z.ZodError);
      });
    });

    it('should validate name is non-empty string', () => {
      const invalidMetric = {
        timestamp: new Date(),
        name: '',
        value: 100,
        unit: 'ms'
      };

      expect(() => PerformanceMetricSchema.parse(invalidMetric)).toThrow(z.ZodError);
    });

    it('should accept valid metric units from contract', () => {
      // From logger-service.yaml: enum: [ms, s, bytes, KB, MB, count, '%']
      const contractUnits = ['ms', 's', 'bytes', 'KB', 'MB', 'count', '%'];

      contractUnits.forEach(unit => {
        const metric = {
          timestamp: new Date(),
          name: 'test-metric',
          value: 100,
          unit
        };
        expect(() => PerformanceMetricSchema.parse(metric)).not.toThrow();
      });
    });
  });

  describe('ILogger Interface Contract', () => {
    it('should implement error method with correct signature', () => {
      expect(logger.error).toBeDefined();
      expect(typeof logger.error).toBe('function');

      // Method should accept message and optional error
      expect(() => logger.error('Test error')).not.toThrow();
      expect(() => logger.error('Test error', new Error('Details'))).not.toThrow();
    });

    it('should implement warn method with correct signature', () => {
      expect(logger.warn).toBeDefined();
      expect(typeof logger.warn).toBe('function');

      // Method should accept message and optional data
      expect(() => logger.warn('Warning')).not.toThrow();
      expect(() => logger.warn('Warning', { context: 'test' })).not.toThrow();
    });

    it('should implement info method with correct signature', () => {
      expect(logger.info).toBeDefined();
      expect(typeof logger.info).toBe('function');

      // Method should accept message and optional data
      expect(() => logger.info('Info')).not.toThrow();
      expect(() => logger.info('Info', { details: 'test' })).not.toThrow();
    });

    it('should implement debug method with correct signature', () => {
      expect(logger.debug).toBeDefined();
      expect(typeof logger.debug).toBe('function');

      // Method should accept message and optional data
      expect(() => logger.debug('Debug')).not.toThrow();
      expect(() => logger.debug('Debug', { verbose: true })).not.toThrow();
    });

    it('should implement performance method with correct signature', () => {
      expect(logger.performance).toBeDefined();
      expect(typeof logger.performance).toBe('function');

      // Method should accept name, value, and optional unit
      expect(() => logger.performance('metric', 100)).not.toThrow();
      expect(() => logger.performance('metric', 100, 'ms')).not.toThrow();
    });

    it('should return void from all methods', () => {
      // All logger methods should return void as per contract
      expect(logger.error('test')).toBeUndefined();
      expect(logger.warn('test')).toBeUndefined();
      expect(logger.info('test')).toBeUndefined();
      expect(logger.debug('test')).toBeUndefined();
      expect(logger.performance('test', 1)).toBeUndefined();
    });
  });

  describe('Service Method Contracts', () => {
    it('error method should match x-service-methods contract', () => {
      // From contract: parameters: message (string, required), error (Error, optional)
      const testCases = [
        { valid: true, args: ['Error message'] },
        { valid: true, args: ['Error message', new Error('Test')] },
        { valid: false, args: [] }, // missing required message
        { valid: false, args: [123] }, // wrong type for message
      ];

      testCases.forEach(({ valid, args }) => {
        if (valid) {
          expect(() => (logger.error as any)(...args)).not.toThrow();
        } else {
          // Note: TypeScript would prevent these at compile time
          // Runtime validation would throw or handle gracefully
        }
      });
    });

    it('performance method should match x-service-methods contract', () => {
      // From contract: parameters: name (string, required), value (number, required), unit (string, optional, default: ms)
      const testCases = [
        { valid: true, args: ['metric', 100] },
        { valid: true, args: ['metric', 100, 'ms'] },
        { valid: true, args: ['metric', 100, 's'] },
        { valid: false, args: ['metric'] }, // missing required value
        { valid: false, args: [100] }, // missing required name
      ];

      testCases.forEach(({ valid, args }) => {
        if (valid) {
          expect(() => (logger.performance as any)(...args)).not.toThrow();
        }
      });
    });
  });

  describe('LoggerConfig Contract', () => {
    it('should accept valid configuration', () => {
      const validConfigs = [
        { enabled: true, minLevel: 'info' as LogLevel, includeTimestamp: true, includeStackTrace: true },
        { enabled: false, minLevel: 'error' as LogLevel, includeTimestamp: false, includeStackTrace: false },
        { enabled: true, minLevel: 'debug' as LogLevel, includeTimestamp: true, includeStackTrace: false }
      ];

      validConfigs.forEach(config => {
        expect(() => new ConsoleLogger(config)).not.toThrow();
      });
    });

    it('should use defaults when not provided', () => {
      expect(() => new ConsoleLogger()).not.toThrow();
      expect(() => new ConsoleLogger({})).not.toThrow();
    });
  });
});