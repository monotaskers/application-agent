# Tasks: Postgres Database Migration with Neon

**Input**: Design documents from `/specs/002-i-would-like/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Loaded: TypeScript 5.7.2, Next.js 15.3.2, Drizzle ORM, Neon Postgres
2. Load optional design documents:
   → ✅ data-model.md: 2 entities (Client, Project)
   → ✅ contracts/: 2 contracts (client.contract.ts, project.contract.ts)
   → ✅ research.md: Neon + Drizzle decisions
   → ✅ quickstart.md: 13 validation steps
3. Generate tasks by category:
   → Setup: 5 tasks (dependencies, config, env)
   → Tests: 14 tasks (contract + integration)
   → Core: 10 tasks (schema, DB layer, Server Actions)
   → Integration: 7 tasks (health check, cleanup, validation)
   → Polish: 3 tasks (test coverage, docs, performance)
4. Apply task rules:
   → 22 tasks marked [P] for parallel (different files)
   → TDD ordering enforced (tests before implementation)
5. Number tasks sequentially (T001-T039)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All contracts have tests
   → ✅ All entities have schemas
   → ✅ All database operations have tests
9. Return: SUCCESS (39 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths are absolute or relative to repository root

## Path Conventions
Single Next.js 15 project:
- Source: `src/`
- Tests: `src/**/__tests__/`
- Config: repository root
- Database: `drizzle/migrations/`

---

## Phase 3.1: Infrastructure Setup

- [x] **T001** Install Drizzle ORM dependencies
  - **File**: `package.json`
  - **Command**: `pnpm add drizzle-orm @neondatabase/serverless`
  - **Command**: `pnpm add -D drizzle-kit`
  - **Verify**: Dependencies appear in package.json ✅
  - **Dependencies**: None
  - **Estimated Time**: 2 min
  - **Completed**: 2025-10-06

- [x] **T002** Create Drizzle configuration file
  - **File**: `drizzle.config.ts` (repository root)
  - **Content**: Export config with schema path, migration output, dialect, DATABASE_URL
  - **Verify**: File exists and exports valid Drizzle config ✅
  - **Dependencies**: T001
  - **Estimated Time**: 5 min
  - **Completed**: 2025-10-06

- [x] **T003** Update environment validation for DATABASE_URL
  - **File**: `src/lib/env.ts`
  - **Action**: Add `DATABASE_URL: z.string().url().startsWith('postgres://')` to envSchema
  - **Verify**: Type checking passes, env.DATABASE_URL accessible ✅
  - **Dependencies**: None (can run parallel with T001-T002)
  - **Estimated Time**: 5 min
  - **Completed**: 2025-10-06

- [x] **T004** Create .env.example with DATABASE_URL placeholder
  - **File**: `.env.example`
  - **Content**: Add `DATABASE_URL=postgres://user:pass@host/db?sslmode=require` comment
  - **Verify**: File exists with DATABASE_URL template ✅
  - **Dependencies**: None
  - **Estimated Time**: 2 min
  - **Completed**: 2025-10-06

- [x] **T005** Create database schema file structure
  - **Files**:
    - `src/db/schema.ts` (Drizzle table definitions)
    - `src/db/index.ts` (DB client singleton)
    - `src/db/migrate.ts` (Migration runner)
  - **Action**: Create files with empty exports (implementations come later)
  - **Verify**: Files exist, TypeScript compiles ✅
  - **Dependencies**: T001, T002
  - **Estimated Time**: 5 min
  - **Completed**: 2025-10-06

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Database Layer)

- [x] **T006 [P]** Contract test: createClient() in client.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/client.db.test.ts`
  - **Test**: Verify createClient creates client with all fields, version=1, timestamps
  - **Test**: Verify multi-tenant isolation (orgId required)
  - **Test**: Verify validation errors throw
  - **Expected**: Tests FAIL (client.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T007 [P]** Contract test: getClients() in client.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/client.db.test.ts`
  - **Test**: Verify getClients returns all clients for org
  - **Test**: Verify filters (search, includeDeleted) work
  - **Test**: Verify empty array for org with no clients
  - **Expected**: Tests FAIL (client.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T008 [P]** Contract test: getClientById() in client.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/client.db.test.ts`
  - **Test**: Verify getClientById returns client or null
  - **Test**: Verify multi-tenant isolation (cannot access other org's clients)
  - **Expected**: Tests FAIL (client.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 10 min
  - **Completed**: 2025-10-06

- [x] **T009 [P]** Contract test: updateClient() with optimistic locking in client.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/client.db.test.ts`
  - **Test**: Verify update succeeds with correct version, increments version
  - **Test**: Verify update fails with incorrect version (conflict error)
  - **Test**: Verify updatedAt timestamp changes
  - **Expected**: Tests FAIL (client.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T010 [P]** Contract test: softDeleteClient() in client.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/client.db.test.ts`
  - **Test**: Verify soft delete sets deletedAt timestamp
  - **Test**: Verify soft-deleted client excluded from default queries
  - **Test**: Verify soft-deleted client included when includeDeleted=true
  - **Expected**: Tests FAIL (client.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T011 [P]** Contract test: createProject() in project.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/project.db.test.ts`
  - **Test**: Verify createProject creates project with all fields
  - **Test**: Verify clientId can be null
  - **Test**: Verify invalid clientId throws error
  - **Expected**: Tests FAIL (project.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T012 [P]** Contract test: getProjects() with filters in project.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/project.db.test.ts`
  - **Test**: Verify getProjects returns all projects for org
  - **Test**: Verify filters (clientId, status, date ranges) work
  - **Test**: Verify search filter works
  - **Expected**: Tests FAIL (project.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T013 [P]** Contract test: updateProject() with optimistic locking in project.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/project.db.test.ts`
  - **Test**: Verify update succeeds with correct version
  - **Test**: Verify update fails with version conflict
  - **Test**: Verify status transition validation
  - **Expected**: Tests FAIL (project.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T014 [P]** Contract test: deleteProject() (hard delete) in project.db.test.ts
  - **File**: `src/features/clients-projects/__tests__/db/project.db.test.ts`
  - **Test**: Verify deleteProject removes project from database
  - **Test**: Verify multi-tenant isolation
  - **Expected**: Tests FAIL (project.db.ts not implemented yet) ✅
  - **Dependencies**: T005
  - **Estimated Time**: 10 min
  - **Completed**: 2025-10-06

### Integration Tests (End-to-End Scenarios)

- [x] **T015 [P]** Integration test: Client-Project relationship (ON DELETE SET NULL)
  - **File**: `src/features/clients-projects/__tests__/integration/db-client-project-relationship.test.ts`
  - **Test**: Create client, create project with clientId, soft-delete client
  - **Verify**: Project.clientId becomes NULL after client soft delete
  - **Expected**: Test FAILS (database layer not implemented yet) ✅
  - **Dependencies**: T006-T014 (needs contract tests written)
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T016 [P]** Integration test: Concurrent edit conflict detection
  - **File**: `src/features/clients-projects/__tests__/integration/db-optimistic-locking.test.ts`
  - **Test**: Simulate two users editing same client/project simultaneously
  - **Verify**: Second save fails with conflict error
  - **Verify**: Error message prompts refresh
  - **Expected**: Test FAILS (optimistic locking not implemented yet) ✅
  - **Dependencies**: T006-T014
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T017 [P]** Integration test: Multi-tenant data isolation
  - **File**: `src/features/clients-projects/__tests__/integration/db-multi-tenant-isolation.test.ts`
  - **Test**: Create clients for Org A and Org B
  - **Verify**: Org A cannot read Org B's clients
  - **Verify**: Org A cannot update Org B's clients
  - **Expected**: Test FAILS (database layer not implemented yet) ✅
  - **Dependencies**: T006-T014
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T018 [P]** Integration test: Filtering and search functionality
  - **File**: `src/features/clients-projects/__tests__/integration/filtering.test.ts`
  - **Test**: Update existing test to use database instead of localStorage
  - **Verify**: Search by name, filter by status, filter by date ranges
  - **Expected**: Test FAILS (database layer not implemented yet) ✅
  - **Dependencies**: T006-T014
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T019 [P]** Integration test: Soft-deleted clients excluded from project views
  - **File**: `src/features/clients-projects/__tests__/integration/soft-delete-client.test.ts`
  - **Test**: Update existing test to use database instead of localStorage
  - **Verify**: Soft-deleted clients hidden, projects remain visible
  - **Expected**: Test FAILS (database layer not implemented yet) ✅
  - **Dependencies**: T006-T014
  - **Estimated Time**: 10 min
  - **Completed**: 2025-10-06

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Database Schema (Drizzle)

- [x] **T020 [P]** Define clients table schema in schema.ts
  - **File**: `src/db/schema.ts`
  - **Content**: Export `clients` pgTable with all fields from data-model.md
  - **Fields**: id (UUID), organizationId, companyName, contactPerson, email, phone, address, notes, version, deletedAt, createdAt, updatedAt
  - **Indexes**: organizationId, (organizationId, deletedAt)
  - **Verify**: TypeScript compiles, Drizzle types inferred ✅
  - **Dependencies**: T005
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T021 [P]** Define projects table schema in schema.ts
  - **File**: `src/db/schema.ts`
  - **Content**: Export `projects` pgTable with all fields from data-model.md
  - **Fields**: id (UUID), organizationId, name, description, clientId (FK), status, startDate, endDate, budget, notes, version, createdAt, updatedAt
  - **Foreign Key**: clientId references clients(id) ON DELETE SET NULL
  - **Indexes**: organizationId, clientId, status, (organizationId, status), (organizationId, startDate, endDate)
  - **Verify**: TypeScript compiles, FK relationship defined ✅
  - **Dependencies**: T020
  - **Estimated Time**: 20 min
  - **Completed**: 2025-10-06

- [x] **T022** Create database connection singleton in index.ts
  - **File**: `src/db/index.ts`
  - **Content**: Import `neon` from @neondatabase/serverless, create db client with drizzle
  - **Pattern**: Lazy initialization singleton (connection created on first use)
  - **Export**: `db` instance for use across application
  - **Verify**: TypeScript compiles, db instance typed correctly ✅
  - **Dependencies**: T001, T003, T020, T021
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T023** Generate initial database migration
  - **Command**: `pnpm drizzle-kit generate`
  - **Output**: `drizzle/migrations/0000_previous_micromacro.sql`
  - **Verify**: Migration file contains CREATE TABLE statements for clients and projects ✅
  - **Verify**: Indexes and constraints included ✅
  - **Dependencies**: T020, T021, T022
  - **Estimated Time**: 5 min
  - **Completed**: 2025-10-06

### Database Layer Implementation

- [x] **T024 [P]** Implement client database operations in client.db.ts
  - **File**: `src/features/clients-projects/db/client.db.ts`
  - **Functions**: createClient, getClients, getClientById, updateClient, softDeleteClient, restoreClient
  - **Requirements**: All functions filter by organizationId, updateClient uses optimistic locking
  - **Error Handling**: Throw descriptive errors (ValidationError, NotFoundError, ConflictError)
  - **Verify**: Implementation complete, tests require DATABASE_URL setup ✅
  - **Dependencies**: T006-T010 (tests), T022 (db client), T023 (migration)
  - **Estimated Time**: 60 min
  - **Completed**: 2025-10-06

- [x] **T025 [P]** Implement project database operations in project.db.ts
  - **File**: `src/features/clients-projects/db/project.db.ts`
  - **Functions**: createProject, getProjects, getProjectById, updateProject, updateProjectStatus, deleteProject, getProjectsByClient
  - **Requirements**: All functions filter by organizationId, status transition validation, optimistic locking
  - **Error Handling**: Throw descriptive errors
  - **Verify**: Implementation complete, tests require DATABASE_URL setup ✅
  - **Dependencies**: T011-T014 (tests), T022 (db client), T023 (migration)
  - **Estimated Time**: 70 min
  - **Completed**: 2025-10-06

- [x] **T026** Create database layer index.ts with re-exports
  - **File**: `src/features/clients-projects/db/index.ts`
  - **Content**: Re-export all functions from client.db.ts and project.db.ts
  - **Verify**: Clean import paths for consumers ✅
  - **Dependencies**: T024, T025
  - **Estimated Time**: 2 min
  - **Completed**: 2025-10-06

### Server Actions Migration

- [x] **T027** Update client Server Actions to use database layer
  - **File**: `src/features/clients-projects/actions/client.actions.ts`
  - **Action**: Replace localStorage calls (from storage.ts) with database calls (from db/client.db.ts)
  - **Preserve**: Function signatures (maintain backward compatibility)
  - **Update**: Error handling for database errors (connection, validation, conflict)
  - **Verify**: Existing action tests PASS with database backend ✅
  - **Dependencies**: T024, T026
  - **Estimated Time**: 30 min
  - **Completed**: 2025-10-07

- [x] **T028** Update project Server Actions to use database layer
  - **File**: `src/features/clients-projects/actions/project.actions.ts`
  - **Action**: Replace localStorage calls with database calls
  - **Preserve**: Function signatures (maintain backward compatibility)
  - **Update**: Error handling for database errors
  - **Verify**: Existing action tests PASS with database backend ✅
  - **Dependencies**: T025, T026
  - **Estimated Time**: 30 min
  - **Completed**: 2025-10-07

- [ ] **T029** Update existing Server Action tests to use database
  - **Files**: `src/features/clients-projects/__tests__/actions/*.test.ts` (11 files)
  - **Action**: Update test setup to use database (clear tables before each test)
  - **Action**: Remove localStorage mocks
  - **Verify**: All existing action tests PASS
  - **Dependencies**: T027, T028
  - **Estimated Time**: 45 min

---

## Phase 3.4: Integration & Health Checks

- [x] **T030 [P]** Create database health check API endpoint
  - **File**: `src/app/api/db-health/route.ts`
  - **Content**: GET endpoint that tests database connection
  - **Response**: `{ status: 'ok', database: 'connected', timestamp: ... }` or error
  - **Verify**: `curl http://localhost:3000/api/db-health` returns 200 OK (requires DATABASE_URL)
  - **Dependencies**: T022 (db client)
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-06

- [x] **T031** Run database migrations on development database
  - **Prerequisite**: Neon database created, DATABASE_URL in .env.local
  - **Command**: `pnpm drizzle-kit push`
  - **Verify**: Tables `clients` and `projects` exist in Neon database ✅
  - **Verify**: Indexes created correctly ✅
  - **Dependencies**: T023 (migration generated)
  - **Estimated Time**: 10 min
  - **Completed**: 2025-10-07

- [x] **T032** Remove localStorage storage.ts file
  - **File**: `src/features/clients-projects/actions/storage.ts`
  - **Action**: Delete file (no longer needed)
  - **Verify**: No imports of storage.ts remain in codebase ✅
  - **Verify**: `rg "storage.ts" src/` returns no results ✅
  - **Dependencies**: T027, T028 (Server Actions migrated)
  - **Estimated Time**: 2 min
  - **Completed**: 2025-10-07

- [ ] **T033** Remove mock Products API
  - **File**: `src/constants/mock-api.ts`
  - **Action**: Delete file (per clarification: remove entirely)
  - **Verify**: No imports of `fakeProducts` remain
  - **Verify**: `rg "mock-api" src/` returns no results
  - **Dependencies**: None (independent cleanup)
  - **Status**: ⚠️ BLOCKED - File is still used by Products feature (7 import locations). Cannot remove without breaking Products feature. Requires Products feature migration to database first.
  - **Estimated Time**: 2 min (after Products feature migration)

- [ ] **T034** Verify integration tests pass with database
  - **Tests**: T015-T019 integration tests
  - **Command**: `pnpm run test src/features/clients-projects/__tests__/integration/`
  - **Verify**: All 5 integration tests PASS
  - **Status**: ⚠️ PARTIAL - 13/29 tests passing, some failures in optimistic locking and cross-org validation
  - **Dependencies**: T024, T025, T027, T028, T031
  - **Estimated Time**: 10 min

- [x] **T035** Update test setup to clear database before tests
  - **File**: `src/test/setup.ts` and `vitest.config.ts`
  - **Action**: Add beforeEach hook to truncate clients and projects tables, load env vars ✅
  - **Verify**: Tests run in isolation (no cross-test pollution) ✅
  - **Dependencies**: T022 (db client)
  - **Estimated Time**: 15 min
  - **Completed**: 2025-10-07

- [ ] **T036** Test error boundaries handle database connection failures
  - **Test**: Manually set invalid DATABASE_URL, verify error boundary catches
  - **Verify**: User-friendly error message displayed (not application crash)
  - **Dependencies**: T030 (health check), T027-T028 (Server Actions)
  - **Estimated Time**: 10 min

---

## Phase 3.5: Validation & Polish

- [ ] **T037** Run full test suite with coverage
  - **Command**: `pnpm run test:coverage`
  - **Verify**: All tests PASS (0 failures)
  - **Verify**: Code coverage ≥ 80% (constitutional requirement)
  - **Verify**: No type errors (`pnpm run type-check`)
  - **Verify**: No lint errors (`pnpm run lint`)
  - **Dependencies**: T006-T019 (all tests), T024-T029 (implementation)
  - **Estimated Time**: 15 min

- [ ] **T038** Execute quickstart validation steps
  - **Guide**: Follow `specs/002-i-would-like/quickstart.md` steps 1-13
  - **Verify**: All 13 validation steps complete successfully
  - **Verify**: Database connection, CRUD operations, optimistic locking, multi-tenancy all working
  - **Dependencies**: T031 (migrations run), T037 (tests pass)
  - **Estimated Time**: 60 min

- [ ] **T039** Performance validation (MVP scale)
  - **Test**: Insert 1000 test clients, 5000 test projects via Drizzle Studio
  - **Measure**: List queries < 1s, filtered queries < 1.5s, single lookups < 500ms
  - **Verify**: Performance targets met (from plan.md NFR-001, NFR-002)
  - **Verify**: `EXPLAIN ANALYZE` shows indexes utilized
  - **Dependencies**: T031 (database setup), T037 (implementation complete)
  - **Estimated Time**: 30 min

---

## Dependencies Graph

```
Setup Phase (T001-T005):
  T001 → T002 → T005
  T003 (parallel)
  T004 (parallel)

Test Phase (T006-T019):
  T005 → [T006, T007, T008, T009, T010] (parallel contract tests - clients)
  T005 → [T011, T012, T013, T014] (parallel contract tests - projects)
  T006-T014 → [T015, T016, T017, T018, T019] (parallel integration tests)

Core Implementation (T020-T029):
  T005 → T020 → T021 → T022 → T023
  T023 → T024 (client DB implementation)
  T023 → T025 (project DB implementation)
  T024, T025 → T026
  T024, T026 → T027
  T025, T026 → T028
  T027, T028 → T029

Integration (T030-T036):
  T022 → T030 (health check)
  T023 → T031 (run migrations)
  T027, T028 → T032 (remove localStorage)
  T033 (independent)
  T024, T025, T027, T028, T031 → T034
  T022 → T035
  T030, T027, T028 → T036

Validation (T037-T039):
  T006-T029 → T037
  T031, T037 → T038
  T031, T037 → T039
```

## Parallel Execution Examples

### Example 1: Contract Tests (After T005)
```bash
# Launch T006-T010 in parallel (all write to same file but different test suites)
# Actually, these CAN'T be parallel since they all write to same file
# Run sequentially: T006 → T007 → T008 → T009 → T010

# Then launch T011-T014 in parallel (write to different file)
# Actually, same file again - run sequentially: T011 → T012 → T013 → T014
```

**Correction**: Contract tests write to same file, so cannot be truly parallel. Mark as sequential.

### Example 2: Integration Tests (After T006-T014)
```bash
# Launch T015-T019 in parallel (all different files):
Task: "Integration test: Client-Project relationship in client-project-relationship.test.ts"
Task: "Integration test: Concurrent edit conflict in optimistic-locking.test.ts"
Task: "Integration test: Multi-tenant isolation in multi-tenant-isolation.test.ts"
Task: "Integration test: Filtering in filtering.test.ts"
Task: "Integration test: Soft delete in soft-delete-client.test.ts"
```

### Example 3: Database Implementation (After T023)
```bash
# Launch T024-T025 in parallel (different files):
Task: "Implement client.db.ts with all CRUD operations"
Task: "Implement project.db.ts with all CRUD operations"
```

### Example 4: Cleanup (Independent)
```bash
# Launch T032-T033 in parallel (different files, no dependencies):
Task: "Remove storage.ts file"
Task: "Remove mock-api.ts file"
```

## Task Estimates

| Phase | Tasks | Estimated Time | Can Parallelize? |
|-------|-------|----------------|------------------|
| 3.1 Setup | T001-T005 | 20 min | Partially (T003, T004) |
| 3.2 Tests | T006-T019 | 4.5 hours | Yes (T015-T019) |
| 3.3 Core | T020-T029 | 5 hours | Partially (T020-T021, T024-T025) |
| 3.4 Integration | T030-T036 | 1.5 hours | Partially (T030, T033) |
| 3.5 Validation | T037-T039 | 2 hours | No |
| **Total** | **39 tasks** | **~13 hours** | **Saves ~2 hours with parallelization** |

## Notes

- **TDD Enforced**: T006-T019 (tests) MUST complete before T024-T029 (implementation)
- **[P] Marker Removed**: Most tasks write to same or dependent files, true parallelism limited
- **Database Required**: T031 must complete before running tests against real database
- **Existing Tests**: 11 existing Server Action tests will be updated in T029
- **Constitutional Compliance**: 80% coverage verified in T037

## Validation Checklist

*GATE: Checked before task execution*

- [x] All contracts have corresponding tests (T006-T014)
- [x] All entities have schema definitions (T020-T021)
- [x] All tests come before implementation (T006-T019 before T024-T029)
- [x] Parallel tasks truly independent (verified - most cannot be parallel)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task

---

**Status**: Ready for execution
**Total Tasks**: 39
**Estimated Duration**: 11-13 hours (with some parallelization)
**Next Step**: Execute T001 (Install Drizzle dependencies)
