# Research: Remove Sentry Logging

## Overview
Research findings for removing Sentry integration from the Next.js application and replacing with console logging.

## Key Research Areas

### 1. Sentry Integration Points in Next.js
**Decision**: Complete removal of all Sentry touchpoints
**Rationale**: Clean removal prevents partial integration issues and reduces complexity
**Alternatives considered**:
- Feature flagging: Rejected - adds unnecessary complexity for temporary need
- Commenting out: Rejected - leaves dead code that could cause confusion

### 2. Console Logging Format
**Decision**: Structured console logging with timestamp, level, and message
**Rationale**: Provides sufficient debugging information while keeping output readable
**Alternatives considered**:
- JSON logging: Rejected - harder to read in development console
- Unstructured logging: Rejected - lacks consistency and searchability
- Winston/Pino: Rejected - adds dependency when native console is sufficient

### 3. Error Boundary Handling
**Decision**: Replace Sentry error boundaries with simple console error logging
**Rationale**: Maintains error boundary functionality without external dependency
**Alternatives considered**:
- Remove error boundaries: Rejected - would reduce error handling robustness
- Custom error tracking: Rejected - violates YAGNI principle

### 4. Performance Metrics
**Decision**: Log performance metrics to console using Performance API
**Rationale**: Browser Performance API provides native metrics without dependencies
**Alternatives considered**:
- Remove performance tracking: Rejected - user wants to maintain metrics
- Custom performance library: Rejected - unnecessary complexity

### 5. Environment Variables
**Decision**: Remove all Sentry-related environment variables
**Rationale**: Clean removal prevents configuration errors
**Alternatives considered**:
- Keep variables with empty values: Rejected - could cause confusion

## Technical Findings

### Files Requiring Modification
1. **Configuration Files**:
   - `next.config.ts` - Remove withSentryConfig wrapper
   - `package.json` - Remove @sentry/nextjs dependency
   - `.env` files - Remove SENTRY_* variables

2. **Sentry-Specific Files (to delete)**:
   - `sentry.server.config.ts`
   - `sentry.edge.config.ts`
   - `sentry.client.config.ts` (if exists)

3. **Instrumentation Files**:
   - `src/instrumentation.ts` - Remove Sentry initialization
   - `src/instrumentation-client.ts` - Remove Sentry initialization

4. **Error Boundaries**:
   - `src/app/global-error.tsx` - Replace Sentry error reporting
   - `src/app/dashboard/overview/@bar_stats/error.tsx` - Replace Sentry error reporting

### Console Logger Implementation
```typescript
// Proposed logger structure
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface Logger {
  error(message: string, error?: Error): void;
  warn(message: string, data?: any): void;
  info(message: string, data?: any): void;
  debug(message: string, data?: any): void;
  performance(metric: string, value: number): void;
}
```

### Testing Strategy
- Unit tests for new console logger
- Integration tests to verify error handling still works
- E2E tests to confirm no Sentry calls are made
- Performance tests to ensure logging doesn't impact performance

## Resolved Clarifications
All clarifications from the specification have been addressed:
- ✅ Error logging approach: Console only
- ✅ Removal type: Permanent deletion
- ✅ Performance metrics: Maintain and redirect to console
- ✅ Data export: Not needed
- ✅ Log format: Standard (timestamp, level, message)

## Risk Assessment
- **Low Risk**: Removing monitoring doesn't affect core functionality
- **Mitigation**: Console logging provides fallback debugging capability
- **Rollback**: Can be re-added via new feature spec if needed

## Recommendations
1. Create console logger utility first
2. Add tests for logger before replacing Sentry
3. Remove Sentry incrementally to verify each change
4. Keep git commits atomic for easy rollback if needed
5. Document console log format for team consistency