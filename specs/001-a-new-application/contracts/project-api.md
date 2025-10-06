# Project API Contract

**Feature**: Client and Project Management
**Entity**: Project
**Implementation**: Next.js Server Actions

## Base Types

```typescript
import { z } from 'zod'

// Branded types
type ProjectId = string & { readonly __brand: 'ProjectId' }
type ClientId = string & { readonly __brand: 'ClientId' }
type OrganizationId = string & { readonly __brand: 'OrganizationId' }

// Result type for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## Schemas

### Project Status Enum

```typescript
const projectStatusSchema = z.enum([
  'Planning',
  'Active',
  'OnHold',
  'Completed',
  'Cancelled'
])

type ProjectStatus = z.infer<typeof projectStatusSchema>
```

### Project Schema

```typescript
const projectSchema = z.object({
  id: z.string().uuid().brand<'ProjectId'>(),
  organizationId: z.string().brand<'OrganizationId'>(),
  name: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  clientId: z.string().uuid().brand<'ClientId'>().nullable(),
  status: projectStatusSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  budget: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine(
  (data) => !data.endDate || data.endDate >= data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
)

type Project = z.infer<typeof projectSchema>
```

### Input Schemas

```typescript
const createProjectInputSchema = projectSchema.pick({
  name: true,
  description: true,
  clientId: true,
  status: true,
  startDate: true,
  endDate: true,
  budget: true,
  notes: true,
}).partial({ status: true }) // Status optional on create (defaults to Planning)

type CreateProjectInput = z.infer<typeof createProjectInputSchema>

const updateProjectInputSchema = createProjectInputSchema.partial()

type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>

const projectFiltersSchema = z.object({
  search: z.string().optional(),
  clientId: z.string().uuid().brand<'ClientId'>().optional(),
  status: projectStatusSchema.optional(),
  startDateFrom: z.coerce.date().optional(),
  startDateTo: z.coerce.date().optional(),
  endDateFrom: z.coerce.date().optional(),
  endDateTo: z.coerce.date().optional(),
})

type ProjectFilters = z.infer<typeof projectFiltersSchema>
```

---

## Server Actions

### createProject

**Purpose**: Create a new project within the authenticated user's organization

**Signature**:
```typescript
'use server'
async function createProject(
  data: CreateProjectInput
): Promise<Result<Project, ValidationError>>
```

**Input Validation**:
- Validate with `createProjectInputSchema`
- Auto-generate UUID for `id`
- Get `organizationId` from `auth()`
- Default `status` to `'Planning'` if not provided
- Set `createdAt` and `updatedAt` to current timestamp

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "770e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    clientId: "550e8400-e29b-41d4-a716-446655440000",
    status: "Planning",
    startDate: "2025-10-15T00:00:00Z",
    endDate: "2025-12-31T00:00:00Z",
    budget: 50000,
    notes: "Prioritize mobile responsiveness",
    createdAt: "2025-10-06T12:00:00Z",
    updatedAt: "2025-10-06T12:00:00Z"
  }
}
```

**Error Response**:
```typescript
{
  success: false,
  error: {
    type: 'ValidationError',
    message: 'Invalid input data',
    fields: {
      name: 'Project name is required',
      endDate: 'End date must be after start date'
    }
  }
}
```

**Revalidation**: `revalidatePath('/projects')`

---

### getProjects

**Purpose**: Retrieve all projects for the authenticated user's organization

**Signature**:
```typescript
'use server'
async function getProjects(
  filters?: ProjectFilters
): Promise<Result<Project[], Error>>
```

**Input Validation**:
- Validate with `projectFiltersSchema` if filters provided
- Get `organizationId` from `auth()`

**Filtering Logic**:
- If `search` provided: Filter by `name` or `description` (case-insensitive)
- If `clientId` provided: Filter by exact match
- If `status` provided: Filter by exact match
- If date range provided: Filter within range (inclusive)

**Success Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "770e8400-e29b-41d4-a716-446655440000",
      organizationId: "org_2abc123",
      name: "Website Redesign",
      // ... rest of fields
    },
    {
      id: "880e8400-e29b-41d4-a716-446655440001",
      organizationId: "org_2abc123",
      name: "Mobile App Development",
      // ... rest of fields
    }
  ]
}
```

**Error Response**:
```typescript
{
  success: false,
  error: {
    type: 'Error',
    message: 'Failed to fetch projects'
  }
}
```

---

### getProjectById

**Purpose**: Retrieve a single project by ID

**Signature**:
```typescript
'use server'
async function getProjectById(
  id: ProjectId
): Promise<Result<Project, NotFoundError>>
```

**Input Validation**:
- Validate `id` is valid UUID
- Get `organizationId` from `auth()`
- Verify project belongs to user's organization

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "770e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    name: "Website Redesign",
    // ... rest of fields
  }
}
```

**Error Response**:
```typescript
{
  success: false,
  error: {
    type: 'NotFoundError',
    message: 'Project not found'
  }
}
```

---

### getProjectsByClient

**Purpose**: Retrieve all projects associated with a specific client

**Signature**:
```typescript
'use server'
async function getProjectsByClient(
  clientId: ClientId
): Promise<Result<Project[], Error>>
```

**Input Validation**:
- Validate `clientId` is valid UUID
- Get `organizationId` from `auth()`

**Filtering Logic**:
- Filter by `clientId` (exact match)
- Filter by `organizationId`
- Include projects where client is soft-deleted (preserve relationship)

**Success Response**: Same as `getProjects` but filtered by client

---

### getProjectsByStatus

**Purpose**: Retrieve all projects with a specific status

**Signature**:
```typescript
'use server'
async function getProjectsByStatus(
  status: ProjectStatus
): Promise<Result<Project[], Error>>
```

**Input Validation**:
- Validate `status` is valid enum value
- Get `organizationId` from `auth()`

**Success Response**: Same as `getProjects` but filtered by status

---

### updateProject

**Purpose**: Update an existing project's information

**Signature**:
```typescript
'use server'
async function updateProject(
  id: ProjectId,
  data: UpdateProjectInput
): Promise<Result<Project, ValidationError | NotFoundError>>
```

**Input Validation**:
- Validate with `updateProjectInputSchema`
- Verify project exists and belongs to user's organization
- Update `updatedAt` to current timestamp

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "770e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    name: "Website Redesign (Updated)",
    // ... rest of fields with updated values
    updatedAt: "2025-10-06T12:30:00Z"
  }
}
```

**Error Responses**: Same as `updateClient` (validation or not found)

**Revalidation**:
- `revalidatePath('/projects')`
- `revalidatePath(/projects/${id})`

---

### updateProjectStatus

**Purpose**: Update only the status of a project (convenience method)

**Signature**:
```typescript
'use server'
async function updateProjectStatus(
  id: ProjectId,
  status: ProjectStatus
): Promise<Result<Project, NotFoundError>>
```

**Input Validation**:
- Validate `status` is valid enum value
- Verify project exists and belongs to user's organization

**Success Response**: Same as `updateProject`

**Revalidation**:
- `revalidatePath('/projects')`
- `revalidatePath(/projects/${id})`

---

### assignClientToProject

**Purpose**: Assign or reassign a client to a project (or set to null)

**Signature**:
```typescript
'use server'
async function assignClientToProject(
  projectId: ProjectId,
  clientId: ClientId | null
): Promise<Result<Project, ValidationError>>
```

**Input Validation**:
- Validate `projectId` is valid UUID
- Validate `clientId` is valid UUID or null
- Verify project exists and belongs to user's organization
- If `clientId` provided, verify client exists and belongs to same organization

**Success Response**: Same as `updateProject`

**Error Response**:
```typescript
{
  success: false,
  error: {
    type: 'ValidationError',
    message: 'Invalid client assignment',
    fields: {
      clientId: 'Client not found or does not belong to organization'
    }
  }
}
```

**Revalidation**:
- `revalidatePath('/projects')`
- `revalidatePath(/projects/${projectId})`

---

### deleteProject

**Purpose**: Permanently delete a project (hard delete, not soft)

**Signature**:
```typescript
'use server'
async function deleteProject(
  id: ProjectId
): Promise<Result<void, NotFoundError>>
```

**Input Validation**:
- Verify project exists and belongs to user's organization

**Mutation Logic**:
- Permanently remove project from storage
- No cascade effects (clients remain unchanged)

**Success Response**:
```typescript
{
  success: true,
  data: undefined
}
```

**Error Response**:
```typescript
{
  success: false,
  error: {
    type: 'NotFoundError',
    message: 'Project not found'
  }
}
```

**Revalidation**: `revalidatePath('/projects')`

---

## Authorization

All Server Actions must:
1. Call `auth()` from `@clerk/nextjs/server`
2. Extract `orgId`
3. Throw `UnauthorizedError` if `orgId` is null
4. Filter all queries by `organizationId: orgId`
5. Verify mutations only affect data belonging to `orgId`

## Client Reference Handling

When displaying projects:
- If `clientId` is null: Display "No Client" or similar indicator
- If `clientId` references active client: Display client name (clickable link)
- If `clientId` references soft-deleted client: Display client name (read-only, no link, with indicator like "(Deleted)")

## Testing Requirements

Each Server Action must have:
1. **Contract test**: Validates input/output schema conformance
2. **Happy path test**: Valid input → success result
3. **Validation test**: Invalid input → validation error
4. **Authorization test**: Data isolation by organization
5. **Edge case tests**:
   - Project without client (`clientId: null`)
   - Project with soft-deleted client
   - End date before start date validation
   - Invalid status enum values

Tests must be written BEFORE implementation (TDD).
All tests must FAIL initially (red phase).
