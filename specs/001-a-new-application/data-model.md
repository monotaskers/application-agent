# Data Model: Client and Project Management

**Date**: 2025-10-06
**Feature**: Client and Project Management

## Entity Definitions

### Client Entity

Represents a business or individual client within an organization's portfolio.

```typescript
interface Client {
  // Identity
  id: ClientId                      // Branded UUID string
  organizationId: OrganizationId    // Clerk organization ID (branded)

  // Core Information
  companyName: string               // Required, 1-200 characters
  contactPerson: string             // Required, 1-100 characters
  email: string                     // Required, valid email format
  phone: string                     // Required, E.164 format recommended

  // Optional Details
  address?: string                  // Optional, max 500 characters
  notes?: string                    // Optional, max 2000 characters

  // Soft Delete Support
  deletedAt: Date | null            // null = active, Date = soft-deleted

  // Audit Timestamps
  createdAt: Date                   // Auto-set on creation
  updatedAt: Date                   // Auto-update on modification
}
```

**Validation Rules** (Zod schema):
- `companyName`: Required, min 1 char, max 200 chars, trimmed
- `contactPerson`: Required, min 1 char, max 100 chars, trimmed
- `email`: Required, valid email format (Zod `.email()`)
- `phone`: Required, min 1 char (format validation TBD - consider E.164)
- `address`: Optional, max 500 chars if provided
- `notes`: Optional, max 2000 chars if provided

**Relationships**:
- One-to-Many with Project: A client can have 0 to N projects
- Relationship preserved when client is soft-deleted

**Business Rules**:
- Duplicate company names allowed (different clients may have same name)
- Soft-deleted clients remain in system but hidden from UI
- Projects linked to soft-deleted clients still display client name (read-only)

---

### Project Entity

Represents a project or engagement, optionally associated with a client.

```typescript
interface Project {
  // Identity
  id: ProjectId                     // Branded UUID string
  organizationId: OrganizationId    // Clerk organization ID (branded)

  // Core Information
  name: string                      // Required, 1-200 characters
  description?: string              // Optional, max 2000 characters

  // Relationships
  clientId: ClientId | null         // Optional reference to Client

  // Status & Lifecycle
  status: ProjectStatus             // Enum: Planning | Active | OnHold | Completed | Cancelled
  startDate: Date                   // Required
  endDate: Date | null              // Optional

  // Financial (Optional)
  budget?: number                   // Optional, positive number (cents/smallest currency unit)

  // Additional Details
  notes?: string                    // Optional, max 2000 characters

  // Audit Timestamps
  createdAt: Date                   // Auto-set on creation
  updatedAt: Date                   // Auto-update on modification
}
```

**Validation Rules** (Zod schema):
- `name`: Required, min 1 char, max 200 chars, trimmed
- `description`: Optional, max 2000 chars if provided
- `clientId`: Optional, must be valid ClientId format if provided
- `status`: Required, must be one of enum values
- `startDate`: Required, valid Date
- `endDate`: Optional, valid Date if provided, must be >= startDate
- `budget`: Optional, positive number if provided
- `notes`: Optional, max 2000 chars if provided

**Relationships**:
- Many-to-One with Client: Each project associated with 0 or 1 client
- Projects can exist without a client (`clientId: null`)

**Business Rules**:
- Default status is "Planning" when created
- Client association is optional (projects can be client-independent)
- Client association can be added, changed, or removed after creation
- Projects linked to soft-deleted clients remain accessible

---

### ProjectStatus Enum

Defines the valid lifecycle states for a project.

```typescript
enum ProjectStatus {
  Planning = 'Planning',       // Initial planning phase
  Active = 'Active',           // Currently in progress
  OnHold = 'OnHold',          // Temporarily paused
  Completed = 'Completed',     // Successfully finished
  Cancelled = 'Cancelled'      // Terminated before completion
}
```

**State Transitions** (not enforced, but recommended flow):
- `Planning` → `Active` (project starts)
- `Active` → `OnHold` (temporary pause)
- `OnHold` → `Active` (resume)
- `Active` → `Completed` (successful finish)
- `Active` → `Cancelled` (termination)
- Any status → `Cancelled` (allowed)

---

## Branded Types

For type safety and preventing ID confusion:

```typescript
// Client ID
type ClientId = string & { readonly __brand: 'ClientId' }

// Project ID
type ProjectId = string & { readonly __brand: 'ProjectId' }

// Organization ID (from Clerk)
type OrganizationId = string & { readonly __brand: 'OrganizationId' }
```

**Helper functions**:
```typescript
const createClientId = (id: string): ClientId => id as ClientId
const createProjectId = (id: string): ProjectId => id as ProjectId
const createOrgId = (id: string): OrganizationId => id as OrganizationId
```

---

## Filter Types

### ClientFilters

```typescript
interface ClientFilters {
  search?: string              // Search company name or contact person
  includeDeleted?: boolean     // Include soft-deleted clients (default: false)
}
```

### ProjectFilters

```typescript
interface ProjectFilters {
  search?: string              // Search project name or description
  clientId?: ClientId          // Filter by client
  status?: ProjectStatus       // Filter by status
  startDateFrom?: Date         // Filter by start date range
  startDateTo?: Date
  endDateFrom?: Date           // Filter by end date range (null handled specially)
  endDateTo?: Date
}
```

---

## Storage Strategy (MVP)

**Current**: localStorage with JSON serialization

**Storage Keys**:
- Clients: `clients:{organizationId}`
- Projects: `projects:{organizationId}`

**Data Structure** in localStorage:
```json
{
  "clients:{orgId}": [
    { "id": "uuid", "companyName": "Acme Corp", ... }
  ],
  "projects:{orgId}": [
    { "id": "uuid", "name": "Website Redesign", ... }
  ]
}
```

**Future Migration Path**:
- Abstract storage behind service interface
- Swap localStorage adapter for Prisma/database adapter
- No changes to business logic or components

---

## Validation Summary

All external data validated with Zod at boundaries:
- Form submissions → Zod schema validation
- Server Action inputs → Zod schema validation
- API responses → Zod schema validation (defensive)

Branded types prevent accidental ID misuse at compile time.

No `any` types used anywhere in data model.
