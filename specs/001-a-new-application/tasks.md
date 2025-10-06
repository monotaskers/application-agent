# Tasks: Client and Project Management

**Input**: Design documents from `/Users/tombeck/Projects/Monotasker/application-agent/specs/001-a-new-application/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: tech stack (Next.js 15, React 19, TypeScript 5.7), libraries (Clerk, Zod, TanStack Query, Shadcn/UI)
2. Load design documents:
   → data-model.md: 2 entities (Client, Project) with branded types
   → contracts/: 2 API contracts (client-api.md, project-api.md)
   → research.md: localStorage storage, Server Actions, TanStack Query
   → quickstart.md: 45+ validation scenarios
3. Generate tasks by category:
   → Setup: Feature directory structure, dependencies
   → Schemas: Zod schemas with branded types
   → Tests: Contract tests, integration tests (TDD)
   → Server Actions: Client and project mutations
   → Hooks: TanStack Query wrappers
   → Components: UI components with Shadcn/UI
   → Pages: Next.js App Router pages
   → Integration: End-to-end scenarios
4. Task ordering: TDD - all tests before implementations
5. Tasks numbered T001-T045
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to repository root: `/Users/tombeck/Projects/Monotasker/application-agent/`

## Path Conventions
Next.js 15 App Router structure:
- **Feature code**: `src/features/clients-projects/`
- **App pages**: `src/app/(dashboard)/`
- **Tests**: Co-located in `src/features/clients-projects/__tests__/`

---

## Phase 3.1: Setup & Foundation

- [ ] **T001** Create feature directory structure at `src/features/clients-projects/` with subdirectories: `components/`, `hooks/`, `schemas/`, `types/`, `actions/`, `__tests__/`

- [ ] **T002** Create components subdirectories at `src/features/clients-projects/components/` with: `clients/`, `projects/`, `shared/`

- [ ] **T003** [P] Create test subdirectories at `src/features/clients-projects/__tests__/` with: `components/`, `hooks/`, `schemas/`, `actions/`, `integration/`

---

## Phase 3.2: Schemas & Types (Foundation Layer)

**CRITICAL: Complete before any Server Actions or components**

- [ ] **T004** [P] Create Client branded types in `src/features/clients-projects/types/client.types.ts`:
  - `ClientId` branded type with helper function
  - `Client` interface with all fields from data-model.md
  - `CreateClientInput`, `UpdateClientInput`, `ClientFilters` types
  - Export all types

- [ ] **T005** [P] Create Project branded types in `src/features/clients-projects/types/project.types.ts`:
  - `ProjectId` branded type with helper function
  - `ProjectStatus` enum (Planning, Active, OnHold, Completed, Cancelled)
  - `Project` interface with all fields from data-model.md
  - `CreateProjectInput`, `UpdateProjectInput`, `ProjectFilters` types
  - Export all types

- [ ] **T006** [P] Create shared types in `src/features/clients-projects/types/index.ts`:
  - `OrganizationId` branded type
  - `Result<T, E>` type for error handling
  - Re-export client and project types

- [ ] **T007** [P] Create Client Zod schema in `src/features/clients-projects/schemas/client.schema.ts`:
  - `clientSchema` with all validation rules from data-model.md
  - `createClientInputSchema` (omit id, timestamps, organizationId, deletedAt)
  - `updateClientInputSchema` (partial of create schema)
  - `clientFiltersSchema`
  - Export all schemas and inferred types

- [ ] **T008** [P] Create Project Zod schema in `src/features/clients-projects/schemas/project.schema.ts`:
  - `projectStatusSchema` enum
  - `projectSchema` with all validation rules from data-model.md
  - Custom refinement: endDate must be >= startDate
  - `createProjectInputSchema` (omit id, timestamps, organizationId, default status to Planning)
  - `updateProjectInputSchema` (partial of create schema)
  - `projectFiltersSchema`
  - Export all schemas and inferred types

---

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4

**CRITICAL: These tests MUST be written and MUST FAIL before ANY Server Action implementation**

### Schema Tests

- [ ] **T009** [P] Test Client schema in `src/features/clients-projects/__tests__/schemas/client.schema.test.ts`:
  - Valid client data passes validation
  - Invalid email fails validation
  - Missing required fields (companyName, contactPerson, email, phone) fail
  - Field length constraints enforced (companyName max 200, etc.)
  - Optional fields (address, notes) validated when provided

- [ ] **T010** [P] Test Project schema in `src/features/clients-projects/__tests__/schemas/project.schema.test.ts`:
  - Valid project data passes validation
  - Invalid status enum value fails
  - End date before start date fails refinement
  - Missing required fields (name, startDate) fail
  - Optional fields (description, clientId, budget, notes) validated when provided
  - Positive budget constraint enforced

### Server Action Contract Tests - Client

- [ ] **T011** [P] Contract test createClient in `src/features/clients-projects/__tests__/actions/createClient.test.ts`:
  - Valid input → success result with Client
  - Invalid email → validation error
  - Missing required fields → validation error
  - Auto-generates UUID for id
  - Sets organizationId from auth()
  - Sets createdAt and updatedAt timestamps
  - Sets deletedAt to null
  - Test MUST FAIL (no implementation yet)

- [ ] **T012** [P] Contract test getClients in `src/features/clients-projects/__tests__/actions/getClients.test.ts`:
  - No filters → returns all active clients for organization
  - includeDeleted: true → returns all clients including soft-deleted
  - search filter → filters by companyName or contactPerson (case-insensitive)
  - Organization isolation: only returns clients for current org
  - Test MUST FAIL (no implementation yet)

- [ ] **T013** [P] Contract test getClientById in `src/features/clients-projects/__tests__/actions/getClientById.test.ts`:
  - Valid UUID → success with Client
  - Non-existent UUID → NotFoundError
  - Client from different org → NotFoundError (authorization)
  - Test MUST FAIL (no implementation yet)

- [ ] **T014** [P] Contract test updateClient in `src/features/clients-projects/__tests__/actions/updateClient.test.ts`:
  - Valid partial update → success with updated Client
  - Invalid data → validation error
  - Non-existent id → NotFoundError
  - Updates updatedAt timestamp
  - Test MUST FAIL (no implementation yet)

- [ ] **T015** [P] Contract test softDeleteClient in `src/features/clients-projects/__tests__/actions/softDeleteClient.test.ts`:
  - Valid id → success, sets deletedAt timestamp
  - Non-existent id → NotFoundError
  - Client with projects → succeeds, projects retain clientId
  - Test MUST FAIL (no implementation yet)

### Server Action Contract Tests - Project

- [ ] **T016** [P] Contract test createProject in `src/features/clients-projects/__tests__/actions/createProject.test.ts`:
  - Valid input with client → success result with Project
  - Valid input without client (clientId: null) → success
  - Missing required fields → validation error
  - End date before start date → validation error
  - Defaults status to 'Planning' if not provided
  - Auto-generates UUID for id
  - Sets organizationId from auth()
  - Test MUST FAIL (no implementation yet)

- [ ] **T017** [P] Contract test getProjects in `src/features/clients-projects/__tests__/actions/getProjects.test.ts`:
  - No filters → returns all projects for organization
  - search filter → filters by name or description
  - clientId filter → returns projects for specific client
  - status filter → returns projects with specific status
  - Date range filters → filters by startDate/endDate ranges
  - Organization isolation enforced
  - Test MUST FAIL (no implementation yet)

- [ ] **T018** [P] Contract test getProjectById in `src/features/clients-projects/__tests__/actions/getProjectById.test.ts`:
  - Valid UUID → success with Project
  - Non-existent UUID → NotFoundError
  - Project from different org → NotFoundError
  - Test MUST FAIL (no implementation yet)

- [ ] **T019** [P] Contract test updateProject in `src/features/clients-projects/__tests__/actions/updateProject.test.ts`:
  - Valid partial update → success with updated Project
  - Invalid data → validation error
  - End date before start date → validation error
  - Non-existent id → NotFoundError
  - Updates updatedAt timestamp
  - Test MUST FAIL (no implementation yet)

- [ ] **T020** [P] Contract test updateProjectStatus in `src/features/clients-projects/__tests__/actions/updateProjectStatus.test.ts`:
  - Valid status change → success
  - Invalid status enum → validation error
  - Non-existent id → NotFoundError
  - Test MUST FAIL (no implementation yet)

- [ ] **T021** [P] Contract test deleteProject in `src/features/clients-projects/__tests__/actions/deleteProject.test.ts`:
  - Valid id → success (hard delete)
  - Non-existent id → NotFoundError
  - Client relationship unaffected
  - Test MUST FAIL (no implementation yet)

### Integration Tests

- [ ] **T022** [P] Integration test: Create client → create project → verify relationship in `src/features/clients-projects/__tests__/integration/client-project-relationship.test.ts`:
  - Create client
  - Create project linked to client
  - Verify client appears in project details
  - Verify project appears in client's projects list
  - Test MUST FAIL (no implementation yet)

- [ ] **T023** [P] Integration test: Soft-delete client with projects in `src/features/clients-projects/__tests__/integration/soft-delete-client.test.ts`:
  - Create client and linked project
  - Soft-delete client
  - Verify client hidden from getClients()
  - Verify project still accessible via getProjectById()
  - Verify project shows client name (read-only)
  - Test MUST FAIL (no implementation yet)

- [ ] **T024** [P] Integration test: Filter and search across clients and projects in `src/features/clients-projects/__tests__/integration/filtering.test.ts`:
  - Create multiple clients with varied names
  - Create multiple projects with varied statuses and clients
  - Test client search by company name
  - Test project filter by status
  - Test project filter by client
  - Test project filter by date range
  - Test MUST FAIL (no implementation yet)

---

## Phase 3.4: Server Actions Implementation (ONLY after tests failing)

**Prerequisites: All Phase 3.3 tests written and failing**

### Storage Layer

- [ ] **T025** Create localStorage storage service in `src/features/clients-projects/actions/storage.ts`:
  - `getClients(orgId)` - retrieve all clients for organization from localStorage
  - `saveClient(orgId, client)` - save/update client in localStorage
  - `getProjects(orgId)` - retrieve all projects for organization from localStorage
  - `saveProject(orgId, project)` - save/update project in localStorage
  - Use storage keys: `clients:{orgId}` and `projects:{orgId}`
  - Handle JSON serialization/deserialization
  - Handle Date object serialization

### Client Server Actions

- [ ] **T026** Implement createClient in `src/features/clients-projects/actions/client.actions.ts`:
  - Validate input with clientSchema
  - Generate UUID for id
  - Get organizationId from `auth()` (Clerk)
  - Set timestamps (createdAt, updatedAt)
  - Set deletedAt to null
  - Save to localStorage via storage service
  - Return Result<Client, ValidationError>
  - Verify T011 test passes

- [ ] **T027** Implement getClients in `src/features/clients-projects/actions/client.actions.ts`:
  - Get organizationId from `auth()`
  - Retrieve clients from localStorage
  - Filter by organizationId
  - Apply filters (search, includeDeleted)
  - Default: exclude soft-deleted (deletedAt !== null)
  - Return Result<Client[], Error>
  - Verify T012 test passes

- [ ] **T028** Implement getClientById in `src/features/clients-projects/actions/client.actions.ts`:
  - Validate id is UUID
  - Get organizationId from `auth()`
  - Retrieve client from localStorage
  - Verify client belongs to organization
  - Return Result<Client, NotFoundError>
  - Verify T013 test passes

- [ ] **T029** Implement updateClient in `src/features/clients-projects/actions/client.actions.ts`:
  - Validate input with updateClientInputSchema
  - Get organizationId from `auth()`
  - Retrieve existing client, verify ownership
  - Merge updates
  - Update updatedAt timestamp
  - Save to localStorage
  - Call `revalidatePath('/clients')` and `revalidatePath(/clients/${id})`
  - Return Result<Client, ValidationError | NotFoundError>
  - Verify T014 test passes

- [ ] **T030** Implement softDeleteClient in `src/features/clients-projects/actions/client.actions.ts`:
  - Get organizationId from `auth()`
  - Retrieve existing client, verify ownership
  - Set deletedAt to current Date
  - Update updatedAt timestamp
  - Save to localStorage
  - Call `revalidatePath('/clients')`
  - Return Result<void, NotFoundError>
  - Verify T015 test passes

### Project Server Actions

- [ ] **T031** Implement createProject in `src/features/clients-projects/actions/project.actions.ts`:
  - Validate input with projectSchema
  - Generate UUID for id
  - Get organizationId from `auth()`
  - Default status to 'Planning' if not provided
  - Set timestamps (createdAt, updatedAt)
  - If clientId provided, verify client exists and belongs to org
  - Save to localStorage via storage service
  - Call `revalidatePath('/projects')`
  - Return Result<Project, ValidationError>
  - Verify T016 test passes

- [ ] **T032** Implement getProjects in `src/features/clients-projects/actions/project.actions.ts`:
  - Get organizationId from `auth()`
  - Retrieve projects from localStorage
  - Filter by organizationId
  - Apply filters (search, clientId, status, date ranges)
  - Return Result<Project[], Error>
  - Verify T017 test passes

- [ ] **T033** Implement getProjectById in `src/features/clients-projects/actions/project.actions.ts`:
  - Validate id is UUID
  - Get organizationId from `auth()`
  - Retrieve project from localStorage
  - Verify project belongs to organization
  - Return Result<Project, NotFoundError>
  - Verify T018 test passes

- [ ] **T034** Implement updateProject in `src/features/clients-projects/actions/project.actions.ts`:
  - Validate input with updateProjectInputSchema
  - Get organizationId from `auth()`
  - Retrieve existing project, verify ownership
  - Merge updates
  - Update updatedAt timestamp
  - Save to localStorage
  - Call `revalidatePath('/projects')` and `revalidatePath(/projects/${id})`
  - Return Result<Project, ValidationError | NotFoundError>
  - Verify T019 test passes

- [ ] **T035** Implement updateProjectStatus in `src/features/clients-projects/actions/project.actions.ts`:
  - Validate status is valid enum value
  - Delegate to updateProject with { status }
  - Verify T020 test passes

- [ ] **T036** Implement deleteProject in `src/features/clients-projects/actions/project.actions.ts`:
  - Get organizationId from `auth()`
  - Retrieve existing project, verify ownership
  - Remove from localStorage (hard delete)
  - Call `revalidatePath('/projects')`
  - Return Result<void, NotFoundError>
  - Verify T021 test passes

---

## Phase 3.5: TanStack Query Hooks

**Prerequisites: Server Actions implemented (T026-T036)**

### Client Hooks

- [ ] **T037** [P] Create useClients hook in `src/features/clients-projects/hooks/use-clients.ts`:
  - Wrap getClients Server Action with useQuery
  - Query key: `['clients', filters]`
  - Accept optional ClientFilters parameter
  - Return query result with clients data, loading, error states
  - Enable refetchOnWindowFocus for collaboration

- [ ] **T038** [P] Create useClientMutations hook in `src/features/clients-projects/hooks/use-client-mutations.ts`:
  - Wrap createClient, updateClient, softDeleteClient with useMutation
  - Invalidate `['clients']` query on success
  - Return mutation functions and states (isPending, error)
  - Support optimistic updates

### Project Hooks

- [ ] **T039** [P] Create useProjects hook in `src/features/clients-projects/hooks/use-projects.ts`:
  - Wrap getProjects Server Action with useQuery
  - Query key: `['projects', filters]`
  - Accept optional ProjectFilters parameter
  - Return query result with projects data, loading, error states

- [ ] **T040** [P] Create useProjectMutations hook in `src/features/clients-projects/hooks/use-project-mutations.ts`:
  - Wrap createProject, updateProject, updateProjectStatus, deleteProject with useMutation
  - Invalidate `['projects']` query on success
  - Return mutation functions and states
  - Support optimistic updates

---

## Phase 3.6: UI Components

**Prerequisites: Hooks implemented (T037-T040), Shadcn/UI components available**

### Shared Components

- [ ] **T041** [P] Create EmptyState component in `src/features/clients-projects/components/shared/EmptyState.tsx`:
  - Props: title, description, actionLabel?, onAction?
  - Display centered empty state message
  - Optional action button
  - Max 50 lines (simple component)

### Client Components

- [ ] **T042** Create ClientList component in `src/features/clients-projects/components/clients/ClientList.tsx`:
  - Use useClients hook to fetch data
  - Display clients in table/card layout using Shadcn/UI components
  - Handle loading, error, and empty states
  - Search input for filtering by companyName/contactPerson
  - "Create Client" button
  - Link each client to `/clients/[id]` page
  - Max 200 lines - split if exceeds

- [ ] **T043** Create ClientForm component in `src/features/clients-projects/components/clients/ClientForm.tsx`:
  - Use React Hook Form with zodResolver(createClientInputSchema)
  - Form fields: companyName, contactPerson, email, phone, address (optional), notes (optional)
  - Use Shadcn/UI form components (Input, Textarea, Button)
  - Use useClientMutations hook for create/update
  - Display validation errors from Zod
  - Loading state during submission
  - Props: mode ('create' | 'edit'), initialData? (for edit mode)
  - Max 200 lines

- [ ] **T044** Create ClientDetails component in `src/features/clients-projects/components/clients/ClientDetails.tsx`:
  - Accept client prop
  - Display all client fields
  - Show associated projects (use useProjects with clientId filter)
  - Edit and Delete buttons
  - Handle soft-delete with confirmation dialog
  - Max 150 lines

### Project Components

- [ ] **T045** Create ProjectStatusBadge component in `src/features/clients-projects/components/projects/ProjectStatusBadge.tsx`:
  - Props: status (ProjectStatus)
  - Display badge with color coding:
    - Planning: blue
    - Active: green
    - OnHold: yellow
    - Completed: gray
    - Cancelled: red
  - Use Shadcn/UI Badge component
  - Max 30 lines

- [ ] **T046** Create ProjectList component in `src/features/clients-projects/components/projects/ProjectList.tsx`:
  - Use useProjects hook to fetch data
  - Display projects in table/card layout
  - Show ProjectStatusBadge for each project
  - Display client name (or "No Client") with link if client exists
  - Handle soft-deleted clients (show name read-only, no link)
  - Search input, status filter, client filter
  - "Create Project" button
  - Link each project to `/projects/[id]` page
  - Max 200 lines

- [ ] **T047** Create ProjectForm component in `src/features/clients-projects/components/projects/ProjectForm.tsx`:
  - Use React Hook Form with zodResolver(createProjectInputSchema)
  - Form fields: name, description (optional), clientId (select dropdown or combobox), status (select), startDate (date picker), endDate (optional date picker), budget (optional number), notes (optional)
  - Fetch clients for dropdown using useClients hook
  - Use Shadcn/UI form components
  - Use useProjectMutations hook for create/update
  - Validate endDate >= startDate (schema handles this)
  - Display validation errors
  - Props: mode ('create' | 'edit'), initialData?
  - Max 200 lines

- [ ] **T048** Create ProjectDetails component in `src/features/clients-projects/components/projects/ProjectDetails.tsx`:
  - Accept project prop
  - Display all project fields
  - Show ProjectStatusBadge
  - Display client information section:
    - If client exists (active): Show client name with link to `/clients/[clientId]`
    - If client soft-deleted: Show client name read-only with "(Deleted)" indicator
    - If no client: Show "No Client"
  - Edit and Delete buttons
  - Status quick-change dropdown
  - Handle delete with confirmation dialog
  - Max 200 lines

---

## Phase 3.7: App Router Pages

**Prerequisites: Components implemented (T041-T048)**

### Client Pages

- [ ] **T049** Create clients list page at `src/app/(dashboard)/clients/page.tsx`:
  - Server Component (default)
  - Import and render ClientList component
  - Add page metadata (title, description)
  - Max 50 lines (thin page wrapper)

- [ ] **T050** Create client details page at `src/app/(dashboard)/clients/[id]/page.tsx`:
  - Server Component
  - Extract id from params
  - Fetch client using getClientById Server Action
  - Handle not found (return notFound())
  - Render ClientDetails component with client data
  - Add metadata with client name
  - Max 80 lines

### Project Pages

- [ ] **T051** Create projects list page at `src/app/(dashboard)/projects/page.tsx`:
  - Server Component
  - Import and render ProjectList component
  - Add page metadata
  - Max 50 lines

- [ ] **T052** Create project details page at `src/app/(dashboard)/projects/[id]/page.tsx`:
  - Server Component
  - Extract id from params
  - Fetch project using getProjectById Server Action
  - If project has clientId, fetch client using getClientById (handle soft-deleted)
  - Handle not found
  - Render ProjectDetails component with project and optional client data
  - Add metadata with project name
  - Max 80 lines

---

## Phase 3.8: Component Tests

**Prerequisites: Components implemented (T041-T048)**

- [ ] **T053** [P] Test EmptyState component in `src/features/clients-projects/__tests__/components/EmptyState.test.tsx`:
  - Renders title and description
  - Renders action button when provided
  - Calls onAction when button clicked
  - Uses React Testing Library

- [ ] **T054** [P] Test ClientForm component in `src/features/clients-projects/__tests__/components/ClientForm.test.tsx`:
  - Renders all form fields
  - Shows validation errors for invalid data
  - Calls create mutation on submit (create mode)
  - Calls update mutation on submit (edit mode)
  - Populates initial data in edit mode
  - Shows loading state during submission

- [ ] **T055** [P] Test ProjectForm component in `src/features/clients-projects/__tests__/components/ProjectForm.test.tsx`:
  - Renders all form fields
  - Loads clients for dropdown
  - Shows validation errors (email, date range)
  - Calls create mutation on submit
  - Handles clientId as optional

- [ ] **T056** [P] Test ProjectStatusBadge component in `src/features/clients-projects/__tests__/components/ProjectStatusBadge.test.tsx`:
  - Renders correct color for each status
  - Displays status text correctly

---

## Phase 3.9: Integration & End-to-End

**Prerequisites: All components and pages implemented**

- [ ] **T057** Verify T022 integration test passes: Create client → create project → verify relationship

- [ ] **T058** Verify T023 integration test passes: Soft-delete client with projects

- [ ] **T059** Verify T024 integration test passes: Filter and search across clients and projects

- [ ] **T060** Run quickstart.md manual validation:
  - Execute all steps from quickstart.md
  - Verify all acceptance criteria pass
  - Document any issues or edge cases found
  - Take screenshots for documentation

---

## Phase 3.10: Polish & Finalization

- [ ] **T061** [P] Add JSDoc documentation to all exported functions, components, and types:
  - Server Actions: Full JSDoc with param descriptions, return types, examples
  - Components: Component description, prop descriptions, usage examples
  - Hooks: Hook purpose, parameters, return value descriptions
  - Types and schemas: Type/field descriptions

- [ ] **T062** Run test coverage report:
  - Execute `pnpm run test:coverage`
  - Verify coverage meets 80% minimum for all categories (statements, branches, functions, lines)
  - Add tests for any gaps below 80%

- [ ] **T063** Run type checking and linting:
  - Execute `pnpm run type-check` - verify ZERO TypeScript errors
  - Execute `pnpm run lint` - verify ZERO ESLint warnings
  - Execute `pnpm run format` - apply Prettier formatting

- [ ] **T064** Create feature index file at `src/features/clients-projects/index.ts`:
  - Export public API: hooks, components, types, schemas
  - Do not export Server Actions (they're server-only)
  - Do not export internal utilities

- [ ] **T065** Update CLAUDE.md with feature-specific notes (if not already done by update-agent-context script):
  - Recent changes: "Added client and project management feature"
  - Known patterns: Server Actions with localStorage, TanStack Query usage
  - Testing approach: TDD with Vitest + RTL

---

## Dependencies

### Sequential Dependencies
- **T001-T003** (Setup) must complete before all other tasks
- **T004-T008** (Schemas & Types) must complete before T009-T024 (Tests) and T025-T036 (Server Actions)
- **T009-T024** (All Tests) must complete and FAIL before T025-T036 (Server Actions)
- **T025** (Storage layer) blocks T026-T036 (Server Actions that use storage)
- **T026-T036** (Server Actions) block T037-T040 (Hooks that wrap Server Actions)
- **T037-T040** (Hooks) block T041-T048 (Components that use hooks)
- **T041-T048** (Components) block T049-T052 (Pages that render components) and T053-T056 (Component tests)
- **T049-T052** (Pages) block T057-T060 (Integration tests and manual validation)

### Parallel Opportunities
- T004-T008: All schemas/types can be built in parallel (different files)
- T009-T024: All tests can be written in parallel (different test files)
- T026-T030: Client Server Actions can be implemented in parallel with T031-T036 (Project Server Actions) - same file but independent functions
- T037-T040: All hooks can be built in parallel (different files)
- T041, T045: Simple components (EmptyState, ProjectStatusBadge) can be built early in parallel
- T053-T056: Component tests can run in parallel (different test files)

---

## Parallel Execution Examples

### Example 1: Schema & Type Creation (T004-T008)
```bash
# All can run simultaneously - different files
Task: "Create Client branded types in src/features/clients-projects/types/client.types.ts"
Task: "Create Project branded types in src/features/clients-projects/types/project.types.ts"
Task: "Create shared types in src/features/clients-projects/types/index.ts"
Task: "Create Client Zod schema in src/features/clients-projects/schemas/client.schema.ts"
Task: "Create Project Zod schema in src/features/clients-projects/schemas/project.schema.ts"
```

### Example 2: Contract Test Writing (T011-T021)
```bash
# All client action tests in parallel
Task: "Contract test createClient in src/features/clients-projects/__tests__/actions/createClient.test.ts"
Task: "Contract test getClients in src/features/clients-projects/__tests__/actions/getClients.test.ts"
Task: "Contract test getClientById in src/features/clients-projects/__tests__/actions/getClientById.test.ts"
Task: "Contract test updateClient in src/features/clients-projects/__tests__/actions/updateClient.test.ts"
Task: "Contract test softDeleteClient in src/features/clients-projects/__tests__/actions/softDeleteClient.test.ts"

# All project action tests in parallel
Task: "Contract test createProject in src/features/clients-projects/__tests__/actions/createProject.test.ts"
Task: "Contract test getProjects in src/features/clients-projects/__tests__/actions/getProjects.test.ts"
Task: "Contract test getProjectById in src/features/clients-projects/__tests__/actions/getProjectById.test.ts"
Task: "Contract test updateProject in src/features/clients-projects/__tests__/actions/updateProject.test.ts"
Task: "Contract test updateProjectStatus in src/features/clients-projects/__tests__/actions/updateProjectStatus.test.ts"
Task: "Contract test deleteProject in src/features/clients-projects/__tests__/actions/deleteProject.test.ts"
```

### Example 3: Hooks Creation (T037-T040)
```bash
# All hooks in parallel - different files
Task: "Create useClients hook in src/features/clients-projects/hooks/use-clients.ts"
Task: "Create useClientMutations hook in src/features/clients-projects/hooks/use-client-mutations.ts"
Task: "Create useProjects hook in src/features/clients-projects/hooks/use-projects.ts"
Task: "Create useProjectMutations hook in src/features/clients-projects/hooks/use-project-mutations.ts"
```

---

## Notes

- **[P] tasks** = different files, no dependencies, safe to parallelize
- **TDD is NON-NEGOTIABLE**: All T009-T024 tests must be written and FAILING before any T025-T036 implementation
- **Verify tests fail** before implementing (Red phase of Red-Green-Refactor)
- **Component file size limit**: Max 200 lines per component. Split if approaching limit (ClientList, ProjectList, ClientForm, ProjectForm most at risk)
- **Commit after each task** or logical grouping of related tasks
- **Avoid**: Vague tasks, implementing before tests, modifying same file in parallel tasks

---

## Validation Checklist
*GATE: All must pass before feature considered complete*

- [x] All contracts have corresponding tests (T011-T021)
- [x] All entities have schema tasks (T007-T008)
- [x] All tests come before implementation (T009-T024 before T025-T036)
- [x] Parallel tasks are truly independent (verified above)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Test coverage requirement (80%) included (T062)
- [x] Type checking and linting included (T063)
- [x] Documentation requirement included (T061)
- [x] Manual validation included (T060)

---

**Total Tasks**: 65
**Estimated Parallel Groups**: 8 groups can run concurrently
**Critical Path**: Setup → Schemas → Tests → Storage → Server Actions → Hooks → Components → Pages → Integration → Polish

Ready for execution following TDD principles and constitutional requirements.
