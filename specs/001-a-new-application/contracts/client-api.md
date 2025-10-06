# Client API Contract

**Feature**: Client and Project Management
**Entity**: Client
**Implementation**: Next.js Server Actions

## Base Types

```typescript
import { z } from 'zod'

// Branded types
type ClientId = string & { readonly __brand: 'ClientId' }
type OrganizationId = string & { readonly __brand: 'OrganizationId' }

// Result type for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## Schemas

### Client Schema

```typescript
const clientSchema = z.object({
  id: z.string().uuid().brand<'ClientId'>(),
  organizationId: z.string().brand<'OrganizationId'>(),
  companyName: z.string().min(1).max(200).trim(),
  contactPerson: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  phone: z.string().min(1), // TODO: E.164 validation
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

type Client = z.infer<typeof clientSchema>
```

### Input Schemas

```typescript
const createClientInputSchema = clientSchema.pick({
  companyName: true,
  contactPerson: true,
  email: true,
  phone: true,
  address: true,
  notes: true,
})

type CreateClientInput = z.infer<typeof createClientInputSchema>

const updateClientInputSchema = createClientInputSchema.partial()

type UpdateClientInput = z.infer<typeof updateClientInputSchema>

const clientFiltersSchema = z.object({
  search: z.string().optional(),
  includeDeleted: z.boolean().optional().default(false),
})

type ClientFilters = z.infer<typeof clientFiltersSchema>
```

---

## Server Actions

### createClient

**Purpose**: Create a new client within the authenticated user's organization

**Signature**:
```typescript
'use server'
async function createClient(
  data: CreateClientInput
): Promise<Result<Client, ValidationError>>
```

**Input Validation**:
- Validate with `createClientInputSchema`
- Auto-generate UUID for `id`
- Get `organizationId` from `auth()`
- Set `createdAt` and `updatedAt` to current timestamp
- Set `deletedAt` to `null`

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    companyName: "Acme Corporation",
    contactPerson: "John Doe",
    email: "john@acme.com",
    phone: "+1234567890",
    address: "123 Main St, City, State 12345",
    notes: "Important client for Q4",
    deletedAt: null,
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
      email: 'Invalid email format',
      companyName: 'Company name is required'
    }
  }
}
```

**Revalidation**: `revalidatePath('/clients')`

---

### getClients

**Purpose**: Retrieve all active clients for the authenticated user's organization

**Signature**:
```typescript
'use server'
async function getClients(
  filters?: ClientFilters
): Promise<Result<Client[], Error>>
```

**Input Validation**:
- Validate with `clientFiltersSchema` if filters provided
- Get `organizationId` from `auth()`

**Filtering Logic**:
- Default: Return only active clients (`deletedAt: null`)
- If `includeDeleted: true`: Return all clients
- If `search` provided: Filter by `companyName` or `contactPerson` (case-insensitive)

**Success Response**:
```typescript
{
  success: true,
  data: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      organizationId: "org_2abc123",
      companyName: "Acme Corporation",
      // ... rest of fields
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      organizationId: "org_2abc123",
      companyName: "Beta Industries",
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
    message: 'Failed to fetch clients'
  }
}
```

---

### getClientById

**Purpose**: Retrieve a single client by ID

**Signature**:
```typescript
'use server'
async function getClientById(
  id: ClientId
): Promise<Result<Client, NotFoundError>>
```

**Input Validation**:
- Validate `id` is valid UUID
- Get `organizationId` from `auth()`
- Verify client belongs to user's organization

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    companyName: "Acme Corporation",
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
    message: 'Client not found'
  }
}
```

---

### getActiveClients

**Purpose**: Retrieve only active (non-deleted) clients

**Signature**:
```typescript
'use server'
async function getActiveClients(): Promise<Result<Client[], Error>>
```

**Input Validation**:
- Get `organizationId` from `auth()`

**Filtering Logic**:
- Return clients where `deletedAt` is `null`
- Filter by `organizationId`

**Success Response**: Same as `getClients` but only active clients

---

### updateClient

**Purpose**: Update an existing client's information

**Signature**:
```typescript
'use server'
async function updateClient(
  id: ClientId,
  data: UpdateClientInput
): Promise<Result<Client, ValidationError | NotFoundError>>
```

**Input Validation**:
- Validate with `updateClientInputSchema`
- Verify client exists and belongs to user's organization
- Update `updatedAt` to current timestamp

**Success Response**:
```typescript
{
  success: true,
  data: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    organizationId: "org_2abc123",
    companyName: "Acme Corporation (Updated)",
    contactPerson: "Jane Doe",
    // ... rest of fields with updated values
    updatedAt: "2025-10-06T12:30:00Z"
  }
}
```

**Error Responses**:
```typescript
// Validation error
{
  success: false,
  error: {
    type: 'ValidationError',
    message: 'Invalid input data',
    fields: { email: 'Invalid email format' }
  }
}

// Not found
{
  success: false,
  error: {
    type: 'NotFoundError',
    message: 'Client not found'
  }
}
```

**Revalidation**:
- `revalidatePath('/clients')`
- `revalidatePath(/clients/${id})`

---

### softDeleteClient

**Purpose**: Soft-delete a client (hide from UI but preserve data and relationships)

**Signature**:
```typescript
'use server'
async function softDeleteClient(
  id: ClientId
): Promise<Result<void, NotFoundError>>
```

**Input Validation**:
- Verify client exists and belongs to user's organization

**Mutation Logic**:
- Set `deletedAt` to current timestamp
- Update `updatedAt` to current timestamp
- **Do NOT** modify or remove related projects
- Projects retain `clientId` reference

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
    message: 'Client not found'
  }
}
```

**Revalidation**: `revalidatePath('/clients')`

---

### restoreClient (Future / Nice-to-Have)

**Purpose**: Restore a soft-deleted client

**Signature**:
```typescript
'use server'
async function restoreClient(
  id: ClientId
): Promise<Result<Client, NotFoundError>>
```

**Input Validation**:
- Verify client exists, is soft-deleted, and belongs to user's organization

**Mutation Logic**:
- Set `deletedAt` to `null`
- Update `updatedAt` to current timestamp

**Success Response**: Same as `getClientById`

**Error Response**: Same as `softDeleteClient`

**Revalidation**: `revalidatePath('/clients')`

**Note**: This action may be deferred to a later iteration (violates YAGNI unless explicitly requested)

---

## Authorization

All Server Actions must:
1. Call `auth()` from `@clerk/nextjs/server`
2. Extract `orgId`
3. Throw `UnauthorizedError` if `orgId` is null
4. Filter all queries by `organizationId: orgId`
5. Verify mutations only affect data belonging to `orgId`

## Testing Requirements

Each Server Action must have:
1. **Contract test**: Validates input/output schema conformance
2. **Happy path test**: Valid input → success result
3. **Validation test**: Invalid input → validation error
4. **Authorization test**: Data isolation by organization
5. **Edge case tests**: Missing fields, malformed data, not found scenarios

Tests must be written BEFORE implementation (TDD).
All tests must FAIL initially (red phase).
