# Data Model: Postgres Database Migration with Neon

**Feature**: 002-i-would-like | **Date**: 2025-10-06
**Status**: Design Phase

## Overview

Database schema for Clients and Projects with multi-tenant isolation, optimistic locking, and soft delete support. Uses Drizzle ORM with PostgreSQL types.

## Entity Relationship Diagram

```
┌─────────────────┐
│  Organization   │ (Clerk - external system)
│  (Implicit)     │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌────────────┐        ┌──────────────┐
│  Clients   │        │  Projects    │
│            │◄───────│              │
│  (Soft     │  N:1   │  (Status     │
│   Delete)  │        │   Lifecycle) │
└────────────┘        └──────────────┘

Legend:
- Organization: Managed by Clerk (organizationId used for RLS)
- Clients: Can be soft-deleted (deletedAt timestamp)
- Projects: Reference optional Client, follow status lifecycle
- Both: Support optimistic locking (version column)
```

## Database Schema (Drizzle)

### clients Table

```typescript
import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Multi-tenant Isolation
  organizationId: varchar('organization_id', { length: 255 }).notNull(),

  // Core Attributes
  companyName: varchar('company_name', { length: 200 }).notNull(),
  contactPerson: varchar('contact_person', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),

  // Optional Attributes
  address: varchar('address', { length: 500 }),
  notes: text('notes'),

  // Optimistic Locking
  version: integer('version').notNull().default(1),

  // Soft Delete Support
  deletedAt: timestamp('deleted_at', { withTimezone: true }),

  // Audit Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Indexes
// CREATE INDEX idx_clients_org_id ON clients(organization_id);
// CREATE INDEX idx_clients_org_deleted ON clients(organization_id, deleted_at) WHERE deleted_at IS NULL;
```

**Field Specifications**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique client identifier |
| `organizationId` | VARCHAR(255) | NOT NULL, INDEXED | Clerk org ID for multi-tenancy |
| `companyName` | VARCHAR(200) | NOT NULL | Company/organization name |
| `contactPerson` | VARCHAR(100) | NOT NULL | Primary contact name |
| `email` | VARCHAR(255) | NOT NULL | Contact email (validated by Zod) |
| `phone` | VARCHAR(50) | NOT NULL | Contact phone (E.164 format) |
| `address` | VARCHAR(500) | NULLABLE | Optional physical address |
| `notes` | TEXT | NULLABLE | Optional notes/comments |
| `version` | INTEGER | NOT NULL, DEFAULT 1 | Optimistic locking version |
| `deletedAt` | TIMESTAMP WITH TZ | NULLABLE | Soft delete timestamp (NULL = active) |
| `createdAt` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules** (enforced by existing Zod schemas):
- `companyName`: 1-200 characters
- `contactPerson`: 1-100 characters
- `email`: Valid email format
- `phone`: E.164 format recommended (validated by Zod)
- `address`: Max 500 characters
- `notes`: Max 2000 characters

### projects Table

```typescript
export const projects = pgTable('projects', {
  // Primary Key
  id: uuid('id').primaryKey().defaultRandom(),

  // Multi-tenant Isolation
  organizationId: varchar('organization_id', { length: 255 }).notNull(),

  // Core Attributes
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),

  // Foreign Key Relationship
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),

  // Status & Lifecycle
  status: varchar('status', { length: 50 }).notNull().default('Planning'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),

  // Financial (Optional)
  budget: integer('budget'), // Stored in cents (smallest currency unit)

  // Additional Details
  notes: text('notes'),

  // Optimistic Locking
  version: integer('version').notNull().default(1),

  // Audit Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Indexes
// CREATE INDEX idx_projects_org_id ON projects(organization_id);
// CREATE INDEX idx_projects_client_id ON projects(client_id);
// CREATE INDEX idx_projects_status ON projects(organization_id, status);
// CREATE INDEX idx_projects_dates ON projects(organization_id, start_date, end_date);
```

**Field Specifications**:

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique project identifier |
| `organizationId` | VARCHAR(255) | NOT NULL, INDEXED | Clerk org ID for multi-tenancy |
| `name` | VARCHAR(200) | NOT NULL | Project name |
| `description` | TEXT | NULLABLE | Optional project description |
| `clientId` | UUID | FOREIGN KEY → clients(id), ON DELETE SET NULL | Optional client association |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'Planning' | Project status (enum) |
| `startDate` | TIMESTAMP WITH TZ | NOT NULL | Project start date |
| `endDate` | TIMESTAMP WITH TZ | NULLABLE | Optional project end date |
| `budget` | INTEGER | NULLABLE | Budget in cents (avoid floating point) |
| `notes` | TEXT | NULLABLE | Optional notes/comments |
| `version` | INTEGER | NOT NULL, DEFAULT 1 | Optimistic locking version |
| `createdAt` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updatedAt` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Status Enum Values**:
- `Planning`: Initial planning phase
- `Active`: Currently in progress
- `OnHold`: Temporarily paused
- `Completed`: Successfully finished
- `Cancelled`: Terminated before completion

**State Transitions**:
```
Planning → Active → OnHold → Active → Completed
    ↓                                      ↑
    └──────────→ Cancelled ←──────────────┘
```

**Validation Rules** (enforced by existing Zod schemas):
- `name`: 1-200 characters
- `description`: Max 2000 characters
- `status`: One of enum values (Planning|Active|OnHold|Completed|Cancelled)
- `startDate`: Valid timestamp
- `endDate`: Must be after `startDate` (if provided)
- `budget`: Positive integer (cents)
- `notes`: Max 2000 characters

## Relationships

### Client → Projects (1:N)
- **Cardinality**: One client can have many projects
- **Nullability**: Projects can exist without a client (`clientId` is nullable)
- **Referential Integrity**: `ON DELETE SET NULL` - when client deleted, project's `clientId` becomes NULL
- **Query Pattern**:
  ```typescript
  // Get all projects for a client
  db.select()
    .from(projects)
    .where(and(
      eq(projects.clientId, clientId),
      eq(projects.organizationId, orgId)
    ));
  ```

### Organization → Clients (1:N, implicit)
- **Cardinality**: One organization has many clients
- **Enforcement**: Application-level via `organizationId` filter in all queries
- **Query Pattern**:
  ```typescript
  // All queries MUST include organizationId
  db.select()
    .from(clients)
    .where(eq(clients.organizationId, orgId));
  ```

### Organization → Projects (1:N, implicit)
- **Cardinality**: One organization has many projects
- **Enforcement**: Application-level via `organizationId` filter in all queries
- **Query Pattern**:
  ```typescript
  // All queries MUST include organizationId
  db.select()
    .from(projects)
    .where(eq(projects.organizationId, orgId));
  ```

## Indexes

### Performance Indexes

```sql
-- Clients table
CREATE INDEX idx_clients_org_id ON clients(organization_id);
CREATE INDEX idx_clients_org_deleted ON clients(organization_id, deleted_at)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_clients_version ON clients(id, version); -- Optimistic locking

-- Projects table
CREATE INDEX idx_projects_org_id ON projects(organization_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(organization_id, status);
CREATE INDEX idx_projects_dates ON projects(organization_id, start_date, end_date);
CREATE INDEX idx_projects_version ON projects(id, version); -- Optimistic locking
```

**Index Rationale**:
- `idx_clients_org_id`: Fast org-level client lookups
- `idx_clients_org_deleted`: Filtered index for active clients only
- `idx_projects_org_id`: Fast org-level project lookups
- `idx_projects_client_id`: Fast client→projects relationship queries
- `idx_projects_status`: Fast status-based filtering
- `idx_projects_dates`: Fast date range queries
- Version indexes: Optimize optimistic locking checks

## Data Constraints

### Database-Level Constraints

```sql
-- Clients
ALTER TABLE clients
  ADD CONSTRAINT chk_company_name_length CHECK (length(company_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_contact_person_length CHECK (length(contact_person) BETWEEN 1 AND 100),
  ADD CONSTRAINT chk_email_length CHECK (length(email) BETWEEN 1 AND 255),
  ADD CONSTRAINT chk_version_positive CHECK (version > 0);

-- Projects
ALTER TABLE projects
  ADD CONSTRAINT chk_name_length CHECK (length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_status_valid CHECK (status IN ('Planning', 'Active', 'OnHold', 'Completed', 'Cancelled')),
  ADD CONSTRAINT chk_end_date_after_start CHECK (end_date IS NULL OR end_date >= start_date),
  ADD CONSTRAINT chk_budget_positive CHECK (budget IS NULL OR budget > 0),
  ADD CONSTRAINT chk_version_positive CHECK (version > 0);
```

### Application-Level Constraints (Zod)

Existing Zod schemas (`client.schema.ts`, `project.schema.ts`) remain unchanged and provide:
- Input validation before database operations
- Type inference for TypeScript types
- Branded type creation (ClientId, ProjectId)
- Error message customization

## Migration Strategy

### Initial Migration (0000_initial.sql)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(255) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(500),
  notes TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Planning',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  budget INTEGER,
  notes TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_clients_org_id ON clients(organization_id);
CREATE INDEX idx_clients_org_deleted ON clients(organization_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_clients_version ON clients(id, version);

CREATE INDEX idx_projects_org_id ON projects(organization_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(organization_id, status);
CREATE INDEX idx_projects_dates ON projects(organization_id, start_date, end_date);
CREATE INDEX idx_projects_version ON projects(id, version);

-- Add constraints
ALTER TABLE clients
  ADD CONSTRAINT chk_company_name_length CHECK (length(company_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_contact_person_length CHECK (length(contact_person) BETWEEN 1 AND 100),
  ADD CONSTRAINT chk_email_length CHECK (length(email) BETWEEN 1 AND 255),
  ADD CONSTRAINT chk_version_positive CHECK (version > 0);

ALTER TABLE projects
  ADD CONSTRAINT chk_name_length CHECK (length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_status_valid CHECK (status IN ('Planning', 'Active', 'OnHold', 'Completed', 'Cancelled')),
  ADD CONSTRAINT chk_end_date_after_start CHECK (end_date IS NULL OR end_date >= start_date),
  ADD CONSTRAINT chk_budget_positive CHECK (budget IS NULL OR budget > 0),
  ADD CONSTRAINT chk_version_positive CHECK (version > 0);
```

## Type Mappings

### TypeScript ↔ PostgreSQL

| TypeScript Type | PostgreSQL Type | Drizzle Type | Notes |
|-----------------|-----------------|--------------|-------|
| `ClientId` (branded UUID string) | `UUID` | `uuid()` | Auto-generated via `defaultRandom()` |
| `ProjectId` (branded UUID string) | `UUID` | `uuid()` | Auto-generated via `defaultRandom()` |
| `OrganizationId` (branded string) | `VARCHAR(255)` | `varchar()` | From Clerk |
| `string` (1-200 chars) | `VARCHAR(200)` | `varchar()` | Name fields |
| `string` (email) | `VARCHAR(255)` | `varchar()` | Email field |
| `string` (long text) | `TEXT` | `text()` | Notes, description |
| `number` (integer) | `INTEGER` | `integer()` | Version, budget (cents) |
| `Date` | `TIMESTAMP WITH TIME ZONE` | `timestamp({ withTimezone: true })` | All date fields |
| `ProjectStatus` enum | `VARCHAR(50)` | `varchar()` | Validated by constraint |

### Branded Type Preservation

```typescript
// Existing branded types are preserved
import type { ClientId } from '@/features/clients-projects/types/client.types';
import type { ProjectId } from '@/features/clients-projects/types/project.types';

// Database layer returns branded types
export async function getClient(id: ClientId): Promise<Client | null> {
  const result = await db.select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  return result[0] ? mapDbClientToClient(result[0]) : null;
}

// Mapper functions ensure type safety
function mapDbClientToClient(dbClient: typeof clients.$inferSelect): Client {
  return {
    id: dbClient.id as ClientId,  // Cast to branded type
    organizationId: dbClient.organizationId as OrganizationId,
    companyName: dbClient.companyName,
    // ... rest of mapping
  };
}
```

## Query Patterns

### Common Query Examples

```typescript
// 1. Get all active clients for an organization
await db.select()
  .from(clients)
  .where(and(
    eq(clients.organizationId, orgId),
    isNull(clients.deletedAt)
  ))
  .orderBy(clients.companyName);

// 2. Get all projects for a client
await db.select()
  .from(projects)
  .where(and(
    eq(projects.clientId, clientId),
    eq(projects.organizationId, orgId)
  ))
  .orderBy(desc(projects.startDate));

// 3. Update client with optimistic locking
const result = await db.update(clients)
  .set({
    companyName: newName,
    updatedAt: new Date(),
    version: sql`${clients.version} + 1`
  })
  .where(and(
    eq(clients.id, clientId),
    eq(clients.organizationId, orgId),
    eq(clients.version, expectedVersion)
  ))
  .returning();

if (result.length === 0) {
  throw new Error('Conflict: Client was modified by another user');
}

// 4. Soft delete client
await db.update(clients)
  .set({ deletedAt: new Date() })
  .where(and(
    eq(clients.id, clientId),
    eq(clients.organizationId, orgId)
  ));

// 5. Filter projects by status and date range
await db.select()
  .from(projects)
  .where(and(
    eq(projects.organizationId, orgId),
    eq(projects.status, 'Active'),
    gte(projects.startDate, startRange),
    lte(projects.startDate, endRange)
  ));
```

---
**Data Model Status**: Complete | **Ready for Contracts**: ✅
