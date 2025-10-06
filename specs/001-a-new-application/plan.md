
# Implementation Plan: Client and Project Management

**Branch**: `001-a-new-application` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/Users/tombeck/Projects/Monotasker/application-agent/specs/001-a-new-application/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Build a client and project management feature for the existing Next.js 15 application that enables team-based tracking of client information and associated projects. The system will support CRUD operations for clients (with soft-delete), project management with status tracking (Planning, Active, On Hold, Completed, Cancelled), and maintain relationships between clients and projects. Authentication via existing Clerk integration ensures team-based data isolation.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19, Next.js 15.3
**Primary Dependencies**: Next.js 15 (App Router), React 19, Clerk (authentication), Zod (validation), TanStack Query (server state), Shadcn/UI (components)
**Storage**: Client-side state + Server Actions (Next.js 15), localStorage for client-side caching, future server-side persistence TBD
**Testing**: Vitest, React Testing Library, minimum 80% coverage required
**Target Platform**: Web (modern browsers), server-rendered with client-side interactivity
**Project Type**: Next.js web application with App Router
**Performance Goals**: <200ms p95 for UI interactions, optimistic UI updates for better UX
**Constraints**: Must integrate with existing Clerk authentication, follow Next.js 15 Server Components/Actions patterns, maintain <200 lines per component
**Scale/Scope**: Initial MVP for small-to-medium teams (10-100 users per organization), 100s of clients/projects per team

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Assessment

1. **✅ Simplicity (KISS)**: Using Next.js built-in features (Server Components, Server Actions) instead of separate backend. Leveraging existing Clerk auth rather than custom solution. Simple CRUD operations without premature optimization.

2. **✅ YAGNI**: Building only specified features (client/project CRUD, filtering, soft-delete). Not adding speculative features like reporting, time tracking, or advanced permissions beyond team-based access.

3. **✅ TDD (NON-NEGOTIABLE)**: Plan includes contract tests, integration tests, and unit tests written BEFORE implementation. Tests must fail before code is written.

4. **✅ Type Safety & Validation**: All entities will have Zod schemas. Client/Project types will use branded types for IDs. All form inputs validated before submission. No `any` types allowed.

5. **✅ Vertical Slice Architecture**: Feature organized as `/src/features/clients-projects/` with co-located components, hooks, schemas, types, and tests. Follows constitutional requirement for feature-based organization.

6. **✅ Fail Fast**: Zod validation at all boundaries (form submission, API responses). Error states explicitly handled in UI. Status enums prevent invalid states.

7. **✅ Package Manager**: Using `pnpm` exclusively as required by constitution.

8. **File Size Compliance**: All components kept under 200 lines. List and form components will be split if approaching limits. Largest anticipated files: ClientList (~150 lines), ProjectList (~150 lines), data schemas (~100 lines).

**Status**: ✅ PASS - No constitutional violations. Approach aligns with all 7 core principles.

## Project Structure

### Documentation (this feature)
```
specs/001-a-new-application/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── client-api.md
│   └── project-api.md
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

This is a Next.js 15 application with App Router. Feature will follow vertical slice architecture:

```
src/
├── features/
│   └── clients-projects/           # NEW: This feature
│       ├── components/
│       │   ├── clients/
│       │   │   ├── ClientList.tsx          # Includes inline filtering UI
│       │   │   ├── ClientForm.tsx
│       │   │   └── ClientDetails.tsx
│       │   ├── projects/
│       │   │   ├── ProjectList.tsx
│       │   │   ├── ProjectForm.tsx
│       │   │   ├── ProjectDetails.tsx
│       │   │   ├── ProjectFilters.tsx
│       │   │   └── ProjectStatusBadge.tsx
│       │   └── shared/
│       │       └── EmptyState.tsx
│       ├── hooks/
│       │   ├── use-clients.ts
│       │   ├── use-client-mutations.ts
│       │   ├── use-projects.ts
│       │   └── use-project-mutations.ts
│       ├── schemas/
│       │   ├── client.schema.ts
│       │   └── project.schema.ts
│       ├── types/
│       │   ├── client.types.ts
│       │   └── project.types.ts
│       ├── actions/
│       │   ├── client.actions.ts
│       │   └── project.actions.ts
│       ├── __tests__/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── schemas/
│       │   └── integration/
│       └── index.ts                # Public API exports
├── app/
│   ├── (dashboard)/               # Existing or NEW route group
│   │   ├── clients/
│   │   │   ├── page.tsx           # Clients list page
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Client details page
│   │   └── projects/
│   │       ├── page.tsx           # Projects list page
│   │       └── [id]/
│   │           └── page.tsx       # Project details page
│   └── api/                        # If needed for non-Server Action endpoints
└── lib/
    └── validations/               # Shared validation utilities (if needed)
```

**Structure Decision**: Next.js 15 App Router with vertical slice architecture. The feature is organized under `/src/features/clients-projects/` following constitutional principles. All feature-specific code (components, hooks, schemas, actions, tests) is co-located. Pages in `/src/app/` are thin route handlers that compose feature components. Server Actions in `/actions/` handle data mutations. This structure maintains clear separation of concerns while keeping related code together.

**Component Design Notes**:
- `ClientList` and `ProjectList` components include inline filtering UI (search, status filters) rather than separate filter components, following KISS principle
- Form components handle both create and edit modes via a `mode` prop to reduce duplication
- All components maintain <200 line limit per constitutional requirements

## Phase 0: Outline & Research

Since this is a Next.js 15 application with existing infrastructure (Clerk auth, Shadcn/UI), most technical decisions are already made. Research focuses on Next.js 15 specific patterns and best practices for this feature.

### Research Topics

1. **Next.js 15 Server Actions for Mutations**
   - Decision: Use Server Actions for all create/update/delete operations
   - Rationale: Native Next.js 15 feature, type-safe, eliminates need for API routes, automatic revalidation
   - Alternatives considered: API routes (more boilerplate), tRPC (additional dependency)

2. **Data Storage Strategy (MVP)**
   - Decision: Start with localStorage for client-side MVP, design for easy migration to server-side
   - Rationale: Fastest path to working prototype, clear migration path to database later
   - Alternatives considered: Immediate database integration (violates YAGNI - adds complexity before validating feature)
   - Migration plan: Abstract storage behind service layer, swap implementation when server-side storage needed

3. **State Management for Server Data**
   - Decision: TanStack Query v5 for server state management
   - Rationale: Already in dependencies, perfect for async server data, handles caching/revalidation
   - Alternatives considered: SWR (similar but TanStack Query already available), pure React state (insufficient for complex data fetching)

4. **Form Handling**
   - Decision: React Hook Form + Zod resolver
   - Rationale: Type-safe, integrates with Zod schemas (constitutional requirement), minimal re-renders
   - Alternatives considered: Formik (more boilerplate), native forms (insufficient validation)

5. **Soft Delete Implementation**
   - Decision: Add `deletedAt` timestamp field, filter in queries
   - Rationale: Standard pattern, reversible, maintains data integrity
   - Alternatives considered: Boolean flag (less info), hard delete (irreversible)

6. **Team-Based Data Isolation**
   - Decision: Use Clerk's organization ID as team identifier, filter all queries by org ID
   - Rationale: Clerk provides org management out-of-box, type-safe, no additional auth needed
   - Alternatives considered: Custom team model (unnecessary complexity, violates KISS)

**Output**: research.md (created below)

## Phase 1: Design & Contracts

### Entities & Data Model

**Client Entity**:
```typescript
interface Client {
  id: ClientId                    // Branded string (UUID)
  organizationId: OrganizationId  // Clerk org ID (branded string)
  companyName: string             // Required, 1-200 chars
  contactPerson: string           // Required, 1-100 chars
  email: string                   // Required, valid email format
  phone: string                   // Required, validated format
  address?: string                // Optional, max 500 chars
  notes?: string                  // Optional, max 2000 chars
  deletedAt: Date | null          // Null = active, Date = soft-deleted
  createdAt: Date
  updatedAt: Date
}
```

**Project Entity**:
```typescript
interface Project {
  id: ProjectId                   // Branded string (UUID)
  organizationId: OrganizationId  // Clerk org ID (branded string)
  name: string                    // Required, 1-200 chars
  description?: string            // Optional, max 2000 chars
  clientId: ClientId | null       // Optional reference to Client
  status: ProjectStatus           // Enum: Planning | Active | OnHold | Completed | Cancelled
  startDate: Date                 // Required
  endDate: Date | null            // Optional
  budget?: number                 // Optional, positive number
  notes?: string                  // Optional, max 2000 chars
  createdAt: Date
  updatedAt: Date
}
```

### API Contracts (Server Actions)

**Client Actions** (`/features/clients-projects/actions/client.actions.ts`):
```typescript
// CREATE
createClient(data: CreateClientInput): Promise<Result<Client, ValidationError>>

// READ
getClients(filters?: ClientFilters): Promise<Result<Client[], Error>>
getClientById(id: ClientId): Promise<Result<Client, NotFoundError>>
getActiveClients(): Promise<Result<Client[], Error>>

// UPDATE
updateClient(id: ClientId, data: UpdateClientInput): Promise<Result<Client, ValidationError | NotFoundError>>

// SOFT DELETE
softDeleteClient(id: ClientId): Promise<Result<void, NotFoundError>>

// RESTORE (nice-to-have, may defer to later iteration)
restoreClient(id: ClientId): Promise<Result<Client, NotFoundError>>
```

**Project Actions** (`/features/clients-projects/actions/project.actions.ts`):
```typescript
// CREATE
createProject(data: CreateProjectInput): Promise<Result<Project, ValidationError>>

// READ
getProjects(filters?: ProjectFilters): Promise<Result<Project[], Error>>
getProjectById(id: ProjectId): Promise<Result<Project, NotFoundError>>
getProjectsByClient(clientId: ClientId): Promise<Result<Project[], Error>>
getProjectsByStatus(status: ProjectStatus): Promise<Result<Project[], Error>>

// UPDATE
updateProject(id: ProjectId, data: UpdateProjectInput): Promise<Result<Project, ValidationError | NotFoundError>>
updateProjectStatus(id: ProjectId, status: ProjectStatus): Promise<Result<Project, NotFoundError>>
assignClientToProject(projectId: ProjectId, clientId: ClientId | null): Promise<Result<Project, ValidationError>>

// DELETE
deleteProject(id: ProjectId): Promise<Result<void, NotFoundError>>
```

### Test Scenarios

**Client Management Tests**:
1. Create client with valid data → success
2. Create client with invalid email → validation error
3. Create client with missing required fields → validation error
4. List clients (active only) → excludes soft-deleted
5. Soft-delete client with projects → client hidden, projects retain reference
6. Search clients by company name → filtered results
7. Update client info → changes persisted
8. Create duplicate client name (same org) → allowed (business rule: duplicate names OK)

**Project Management Tests**:
1. Create project with client → linked correctly
2. Create project without client → allowed, clientId = null
3. Update project status → status changed, validation passed
4. Filter projects by status → correct results
5. Filter projects by date range → correct results
6. View project with soft-deleted client → client name shown read-only
7. Assign client to existing project → reference updated
8. Remove client from project → clientId set to null

**Integration Tests** (matching acceptance scenarios from spec):
1. End-to-end: Create client → create project → link → verify both visible
2. End-to-end: Soft-delete client → verify projects still accessible with client name
3. End-to-end: Filter and search across multiple projects and clients
4. End-to-end: Update project status through lifecycle

### Quickstart Validation

Steps to manually verify the feature works:
1. Navigate to `/clients` → see empty state
2. Create new client "Acme Corp" → appears in list
3. Navigate to `/projects` → see empty state
4. Create new project "Website Redesign" linked to Acme Corp → appears in list
5. Click project → see client info displayed
6. Update project status to "Active" → status badge updates
7. Filter projects by status "Active" → only active projects shown
8. Navigate to client details → see linked project listed
9. Soft-delete client → client disappears from list
10. View project → client name still shown (read-only)

**Output**: data-model.md, contracts/, quickstart.md (created below)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Zod schemas → schema definition tasks [P]
- Each Server Action → contract test task [P] + implementation task
- Each UI component → component test task [P] + implementation task
- Integration tests from quickstart scenarios
- Route pages to compose components

**Ordering Strategy**:
- TDD order: ALL tests before implementations
- Dependency order:
  1. Schemas & types (foundation)
  2. Server Actions with tests
  3. Hooks with tests
  4. Components with tests
  5. Pages (composition layer)
  6. Integration tests
- Mark [P] for parallel execution where files are independent

**Estimated Output**: ~35-40 numbered, ordered tasks covering:
- 2 schema files
- 10 Server Actions (5 client, 5 project)
- 8 hooks (4 client, 4 project)
- 10 components
- 4 pages
- ~20 test files (contract, unit, integration)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No violations detected. Approach fully compliant with constitutional principles.

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
- [x] All NEEDS CLARIFICATION resolved (completed in /clarify phase)
- [x] Complexity deviations documented (none exist)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
