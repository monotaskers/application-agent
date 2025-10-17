# Data Model: Remove Sentry Logging

## Overview
This feature primarily involves removing existing integration rather than adding new data models. However, we define the structure for the replacement console logger.

## Entities

### 1. LogEntry
**Purpose**: Structure for console log messages
**Location**: `src/lib/logger.ts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | Date | Yes | When the log entry was created |
| level | LogLevel | Yes | Severity level (error, warn, info, debug) |
| message | string | Yes | The log message |
| data | unknown | No | Additional context data |
| error | Error | No | Error object if applicable |

**Validation Rules**:
- timestamp must be valid Date
- level must be one of: 'error', 'warn', 'info', 'debug'
- message must be non-empty string
- error must be Error instance if provided

### 2. PerformanceMetric
**Purpose**: Structure for performance metrics logging
**Location**: `src/lib/logger.ts`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | Date | Yes | When the metric was recorded |
| name | string | Yes | Metric identifier |
| value | number | Yes | Metric value (typically milliseconds) |
| unit | string | No | Unit of measurement (default: 'ms') |

**Validation Rules**:
- timestamp must be valid Date
- name must be non-empty string
- value must be positive number
- unit must be valid measurement unit if provided

## Enumerations

### LogLevel
```typescript
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];
```

### MetricUnit
```typescript
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
```

## State Transitions
The logger is stateless - each log entry is independent. No state management required.

## Relationships
- LogEntry and PerformanceMetric are independent entities
- Both are consumed by the Logger service
- No persistence layer - all output goes directly to console

## Type Definitions

### Logger Interface
```typescript
export interface ILogger {
  error(message: string, error?: Error): void;
  warn(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
  performance(name: string, value: number, unit?: MetricUnit): void;
}
```

### Configuration Type
```typescript
export interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  includeTimestamp: boolean;
  includeStackTrace: boolean;
}
```

## Removal Impact

### Entities Being Removed
1. All Sentry-specific error contexts
2. Sentry user identification data
3. Sentry transaction spans
4. Sentry breadcrumbs
5. Sentry tags and custom context

### Data Migration
- No data migration required
- Existing logs in Sentry remain accessible via Sentry dashboard
- New logs will only appear in console/stdout

## Validation Schemas (Zod)

```typescript
import { z } from 'zod';

export const LogLevelSchema = z.enum(['error', 'warn', 'info', 'debug']);

export const LogEntrySchema = z.object({
  timestamp: z.date(),
  level: LogLevelSchema,
  message: z.string().min(1),
  data: z.unknown().optional(),
  error: z.instanceof(Error).optional()
});

export const PerformanceMetricSchema = z.object({
  timestamp: z.date(),
  name: z.string().min(1),
  value: z.number().positive(),
  unit: z.string().default('ms')
});

export type LogEntry = z.infer<typeof LogEntrySchema>;
export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;
```