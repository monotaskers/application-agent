# Implementation Plan: Postgres Database Migration with Neon

**Branch**: `002-i-would-like` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-i-would-like/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ All clarifications resolved in spec
   → Detected Project Type: Next.js 15 web application (frontend + backend)
   → Set Structure Decision: Single Next.js app with App Router
3. Fill the Constitution Check section
   → ✅ Completed
4. Evaluate Constitution Check section
   → ✅ No violations detected
   → Update Progress Tracking: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → ✅ Complete
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ✅ Complete
7. Re-evaluate Constitution Check section
   → ✅ No new violations
8. Plan Phase 2 → Describe task generation approach
   → ✅ Complete
9. STOP - Ready for /tasks command
   → ✅ Ready
```

## Summary

Migrate the application from browser localStorage to a Neon Postgres database for persistent, multi-user data storage. The feature involves:
- Replacing localStorage-based client and project storage with Postgres database operations
- Implementing Drizzle ORM for type-safe database queries
- Adding optimistic locking for concurrent edit conflict detection
- Removing mock Products API (fakeProducts)
- Maintaining backward compatibility with existing hooks and component interfaces
- Supporting multi-tenant data isolation via Clerk organization IDs

The technical approach uses Neon's serverless Postgres with Drizzle ORM, leveraging Next.js Server Actions for database mutations and TanStack Query for client-side state management.

## Technical Context

**Language/Version**: TypeScript 5.7.2, React 19, Next.js 15.3.2
**Primary Dependencies**: Drizzle ORM, Neon Serverless Postgres, TanStack Query 5.90, Zod 3.24
**Storage**: Neon Serverless Postgres (multi-tenant with organization isolation)
**Testing**: Vitest 3.2.4, React Testing Library 16.3, Drizzle Kit for migrations
**Target Platform**: Next.js App Router (Server Components + Server Actions)
**Project Type**: Single Next.js 15 web application
**Performance Goals**: MVP scale, <1s for typical queries, adequate for <50 concurrent users
**Constraints**: Online-only (no offline support), optimistic locking for concurrency, maintain existing API surface
**Scale/Scope**: <10,000 clients and <50,000 projects per organization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First (KISS)** | ✅ PASS | Using Drizzle ORM (simpler than Prisma), straightforward migration from localStorage to database, no unnecessary abstraction layers |
| **II. YAGNI** | ✅ PASS | Only building database persistence for Clients/Projects (existing entities), removing unused mock Products API, no speculative features |
| **III. Test-First Development** | ✅ PASS | TDD approach: write contract tests → write integration tests → implement to make tests pass. Existing tests provide regression safety |
| **IV. Type Safety & Validation** | ✅ PASS | Drizzle provides full type safety, existing Zod schemas remain for validation, branded types (ClientId, ProjectId) preserved |
| **V. Vertical Slice Architecture** | ✅ PASS | Database layer added to existing `/features/clients-projects/` structure, co-located with actions, hooks, schemas |
| **VI. Fail Fast Principle** | ✅ PASS | Environment validation for DATABASE_URL, Zod validation at boundaries, explicit error handling for connection failures |
| **VII. Package Manager Discipline** | ✅ PASS | Using `pnpm` exclusively (confirmed in package.json with pnpm-lock.yaml) |

**Additional Checks**:
- **File Size Limits**: No files expected to exceed 500 lines (migration files, schema files, actions all modular)
- **Component Size**: No UI changes required, existing components stay under 200 lines
- **State Management Hierarchy**: Following TanStack Query for server state (correct tier), no new global state needed
- **Security Requirements**: Zod validation remains, environment variables validated at startup, Clerk org ID for row-level security

**Conclusion**: No constitutional violations. Plan proceeds to Phase 0.

## Project Structure

### Documentation (this feature)
```
specs/002-i-would-like/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── client.contract.ts
│   └── project.contract.ts
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── app/                       # Next.js App Router
│   └── api/
│       └── db-health/        # New: Database health check endpoint
│           └── route.ts
├── features/
│   └── clients-projects/
│       ├── __tests__/        # Existing tests (will be updated)
│       │   ├── db/           # New: Database layer tests
│       │   │   ├── client.db.test.ts
│       │   │   └── project.db.test.ts
│       │   ├── actions/      # Existing: Server Actions tests (update for DB)
│       │   ├── schemas/      # Existing: Zod schema tests
│       │   └── integration/  # Existing: Integration tests (update for DB)
│       ├── actions/
│       │   ├── storage.ts    # TO BE REMOVED (localStorage)
│       │   ├── client.actions.ts  # UPDATE: Change from localStorage to DB
│       │   └── project.actions.ts # UPDATE: Change from localStorage to DB
│       ├── db/               # New: Database layer
│       │   ├── client.db.ts  # Client database operations
│       │   ├── project.db.ts # Project database operations
│       │   └── index.ts      # Re-exports
│       ├── hooks/            # Existing: React hooks (no changes needed)
│       ├── schemas/          # Existing: Zod schemas (no changes needed)
│       └── types/            # Existing: TypeScript types (no changes needed)
├── db/                       # New: Database configuration
│   ├── schema.ts            # Drizzle schema definitions
│   ├── index.ts             # Database connection and client export
│   └── migrate.ts           # Migration runner
├── lib/
│   └── env.ts               # UPDATE: Add DATABASE_URL validation
└── constants/
    └── mock-api.ts          # TO BE REMOVED (mock Products API)

drizzle/                      # New: Drizzle migration files
├── migrations/
│   └── 0000_initial.sql
└── meta/

drizzle.config.ts            # New: Drizzle configuration
.env.local                   # UPDATE: Add DATABASE_URL
```

**Structure Decision**: Single Next.js application with App Router. Database layer lives in `/src/db/` for global access, with feature-specific database operations in `/src/features/clients-projects/db/`. This follows the vertical slice pattern while allowing database infrastructure to be shared.

## Phase 0: Outline & Research

**Status**: In Progress

**Research Areas**:
1. ✅ Neon Serverless Postgres setup and best practices
2. ✅ Drizzle ORM configuration for Next.js 15 App Router
3. ✅ Optimistic locking implementation patterns
4. ✅ Multi-tenant row-level security patterns
5. ✅ Migration strategy from localStorage to database
6. ✅ Connection pooling and serverless database patterns

**Output**: See [research.md](./research.md)

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

**Phase 1 Tasks**:
1. **Extract entities** → `data-model.md`:
   - Client entity (with soft delete, optimistic locking)
   - Project entity (with optimistic locking)
   - Organization isolation (implicit via Clerk orgId)

2. **Generate database contracts**:
   - Client CRUD operations contract
   - Project CRUD operations contract
   - Migration scripts

3. **Generate contract tests** (must fail initially):
   - Client database operations tests
   - Project database operations tests
   - Optimistic locking conflict tests
   - Organization isolation tests

4. **Extract test scenarios** from user stories:
   - Cross-device data persistence
   - Multi-user real-time collaboration
   - Concurrent edit conflict detection
   - Connection failure error handling

5. **Update CLAUDE.md** with database context:
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Add Drizzle ORM patterns
   - Add Neon connection setup
   - Keep under 150 lines

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base
2. Generate infrastructure tasks:
   - Setup Neon database (obtain connection string)
   - Configure Drizzle ORM and migration runner
   - Add DATABASE_URL to environment validation
3. Generate database schema tasks:
   - Create clients table schema
   - Create projects table schema
   - Write initial migration
4. Generate database layer tasks (following TDD):
   - Write client DB operation tests → implement client DB operations
   - Write project DB operation tests → implement project DB operations
   - Write optimistic locking tests → implement version checking
5. Generate server action migration tasks:
   - Update client.actions.ts to use DB layer
   - Update project.actions.ts to use DB layer
   - Remove storage.ts (localStorage)
6. Generate cleanup tasks:
   - Remove mock-api.ts (Products API)
   - Update environment documentation
7. Generate integration test updates:
   - Update existing tests to work with database
   - Add database-specific edge case tests
8. Generate validation tasks:
   - Run full test suite with coverage
   - Execute quickstart.md validation
   - Verify backward compatibility

**Ordering Strategy**:
- Infrastructure first (database setup)
- Schema and migrations
- TDD: DB layer tests before implementation
- Server Action updates (preserving interfaces)
- Cleanup and validation
- Mark [P] for parallel tasks (independent test files)

**Estimated Output**: ~35-40 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

*No constitutional violations detected - section intentionally left empty*

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
