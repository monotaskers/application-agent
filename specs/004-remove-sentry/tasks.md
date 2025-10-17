# Tasks: Remove Sentry Logging

**Input**: Design documents from `/specs/004-remove-sentry/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.x, Next.js 15, React 19
   → Structure: Next.js App Router web application
2. Load design documents:
   → data-model.md: Logger entities (LogEntry, PerformanceMetric)
   → contracts/logger-service.yaml: Logger service interface
   → research.md: Sentry removal approach decisions
3. Generate tasks by category:
   → Logger creation: Types, implementation, tests
   → Sentry removal: Error boundaries, instrumentation, config
   → Cleanup: Dependencies, environment variables
   → Verification: Quickstart validation steps
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Logger must exist before removing Sentry
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Validate task completeness
7. Return: SUCCESS (18 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Logger Setup (Create Before Removing)

### Logger Tests First (TDD) ⚠️ MUST COMPLETE BEFORE IMPLEMENTATION
- [ ] T001 [P] Create logger type definitions and interfaces in src/lib/logger.types.ts
- [ ] T002 [P] Write logger unit tests in src/lib/__tests__/logger.test.ts (must fail initially)
- [ ] T003 [P] Write logger contract tests based on contracts/logger-service.yaml

### Logger Implementation
- [ ] T004 Implement console logger in src/lib/logger.ts with LogLevel enum and ILogger interface
- [ ] T005 Add formatted output methods (timestamp, level, message) to logger implementation
- [ ] T006 Add performance metrics logging method using Performance API

## Phase 3.2: Remove Sentry Integration

### Error Boundaries
- [ ] T007 Replace Sentry error reporting in src/app/global-error.tsx with console logger
- [ ] T008 [P] Replace Sentry error reporting in src/app/dashboard/overview/@bar_stats/error.tsx with console logger

### Instrumentation Files
- [ ] T009 [P] Remove Sentry initialization from src/instrumentation.ts
- [ ] T010 [P] Remove Sentry initialization from src/instrumentation-client.ts

### Configuration Files
- [ ] T011 Remove withSentryConfig wrapper from next.config.ts
- [ ] T012 [P] Delete sentry.server.config.ts file
- [ ] T013 [P] Delete sentry.edge.config.ts file
- [ ] T014 [P] Remove SENTRY_* environment variables from .env and .env.local files

## Phase 3.3: Cleanup

- [ ] T015 Remove @sentry/nextjs dependency using `pnpm remove @sentry/nextjs`
- [ ] T016 Run `pnpm install` to update lockfile without Sentry

## Phase 3.4: Verification

- [ ] T017 Run quickstart verification steps to confirm Sentry removal
- [ ] T018 [P] Verify no Sentry network calls in browser DevTools

## Dependencies
- Logger tests (T001-T003) before logger implementation (T004-T006)
- Logger implementation (T004-T006) before Sentry removal (T007-T014)
- All Sentry removal (T007-T014) before dependency cleanup (T015-T016)
- Everything before verification (T017-T018)

## Parallel Execution Examples

### Group 1: Logger Setup (T001-T003)
```
# Launch T001-T003 together (different files):
Task: "Create logger type definitions in src/lib/logger.types.ts"
Task: "Write logger unit tests in src/lib/__tests__/logger.test.ts"
Task: "Write logger contract tests based on contracts/logger-service.yaml"
```

### Group 2: Instrumentation Cleanup (T009-T010)
```
# Launch T009-T010 together (different files):
Task: "Remove Sentry from src/instrumentation.ts"
Task: "Remove Sentry from src/instrumentation-client.ts"
```

### Group 3: Config File Deletion (T012-T014)
```
# Launch T012-T014 together (independent deletions):
Task: "Delete sentry.server.config.ts"
Task: "Delete sentry.edge.config.ts"
Task: "Remove SENTRY_* environment variables"
```

## Notes
- **TDD Required**: T002-T003 tests MUST fail before T004-T006 implementation
- **Order Critical**: Logger must exist before removing Sentry to avoid breaking error handling
- **Atomic Commits**: Commit after each task for easy rollback if needed
- **Verification**: T017-T018 confirm complete Sentry removal

## Task Validation Checklist
✅ All contracts have tests (logger-service.yaml → T003)
✅ All entities have implementations (LogEntry, PerformanceMetric → T004-T006)
✅ All Sentry files identified for removal (per research.md)
✅ All quickstart scenarios covered (T017-T018)
✅ No conflicting parallel tasks (different files only)

## Estimated Completion Time
- Phase 3.1 (Logger): 2-3 hours
- Phase 3.2 (Sentry Removal): 1-2 hours
- Phase 3.3 (Cleanup): 30 minutes
- Phase 3.4 (Verification): 30 minutes
- **Total**: 4-6 hours

## Success Criteria
1. All tests pass (especially T002-T003 after implementation)
2. No Sentry imports remain in codebase
3. Application starts without Sentry initialization
4. Errors log to console with proper formatting
5. Performance metrics appear in console
6. No network calls to Sentry domains
7. Smaller bundle size after Sentry removal