# Research: Client and Project Management

**Date**: 2025-10-06
**Feature**: Client and Project Management
**Context**: Next.js 15 application with existing Clerk auth, Shadcn/UI components

## Research Topics & Decisions

### 1. Next.js 15 Server Actions for Mutations

**Decision**: Use Server Actions for all create/update/delete operations

**Rationale**:
- Native Next.js 15 feature with first-class TypeScript support
- Type-safe data mutations without manual API route creation
- Automatic request deduplication and revalidation
- Progressive enhancement (works without JavaScript)
- Simplified error handling with `useFormState` hook
- Integrates seamlessly with React 19 `useOptimistic` for instant UI updates

**Alternatives Considered**:
- **API Routes**: More boilerplate, manual revalidation, additional testing complexity
- **tRPC**: Additional dependency (violates YAGNI), overkill for simple CRUD operations
- **GraphQL**: Significant complexity overhead for straightforward data operations

**Implementation Notes**:
- Mark all Server Actions with `'use server'` directive
- Use `revalidatePath()` after mutations to refresh cached data
- Return typed `Result<T, E>` for error handling
- Validate inputs with Zod before processing

---

### 2. Data Storage Strategy (MVP)

**Decision**: Start with localStorage for client-side MVP, design for easy migration to server-side persistence

**Rationale**:
- Fastest path to working prototype (KISS principle)
- No backend/database setup required for initial validation
- Clear migration path when serverside storage is needed
- Allows full focus on UI/UX and business logic first
- localStorage provides sufficient persistence for MVP testing

**Alternatives Considered**:
- **Immediate database integration (Prisma + PostgreSQL)**: Adds significant complexity before feature validation, violates YAGNI
- **IndexedDB**: More complex API than localStorage, unnecessary for MVP data volume
- **In-memory only**: No persistence, poor UX for testing

**Migration Plan** (for future iteration):
1. Create storage interface/abstraction layer
2. Implement localStorage adapter (current)
3. When ready: Implement database adapter (Prisma)
4. Swap adapters via dependency injection
5. Keep interface unchanged, transparent to components

**Implementation Notes**:
- Store data as JSON in localStorage
- Use organization ID as key prefix for isolation
- Handle serialization/deserialization in service layer
- Abstract storage behind service functions for easy swapping

---

### 3. State Management for Server Data

**Decision**: TanStack Query v5 for server state management

**Rationale**:
- Already in project dependencies (no new installation)
- Industry-standard for async server state
- Built-in caching, background refetching, stale-while-revalidate
- Automatic request deduplication
- Optimistic updates support
- DevTools for debugging

**Alternatives Considered**:
- **SWR**: Similar features but TanStack Query already available
- **Pure React state (useState/useReducer)**: Insufficient for complex data fetching patterns, manual cache management
- **Zustand**: Better for client state, not optimized for server data

**Implementation Notes**:
- Create custom hooks (`use-clients.ts`, `use-projects.ts`) wrapping `useQuery`
- Create mutation hooks (`use-client-mutations.ts`, `use-project-mutations.ts`) wrapping `useMutation`
- Configure query keys for automatic cache invalidation: `['clients'], ['clients', id], ['projects'], ['projects', id]`
- Enable `refetchOnWindowFocus` for real-time collaboration scenarios

---

### 4. Form Handling

**Decision**: React Hook Form + Zod resolver

**Rationale**:
- Type-safe form handling with minimal re-renders
- Seamless integration with Zod schemas (constitutional requirement)
- Excellent DX with TypeScript inference
- Built-in validation state management
- Server Action integration via `action` prop
- Already have Zod for data validation

**Alternatives Considered**:
- **Formik**: More boilerplate, less TypeScript support, higher re-render frequency
- **Native forms**: Insufficient built-in validation, manual state management
- **TanStack Form**: New library, less mature ecosystem than RHF

**Implementation Notes**:
- Define Zod schemas first (`client.schema.ts`, `project.schema.ts`)
- Use `zodResolver` from `@hookform/resolvers/zod`
- Infer form types from schemas: `z.infer<typeof clientSchema>`
- Handle errors with `formState.errors`
- Use `useFormState` for Server Action integration

---

### 5. Soft Delete Implementation

**Decision**: Add `deletedAt: Date | null` timestamp field, filter in queries

**Rationale**:
- Industry-standard pattern for soft deletes
- Reversible (can implement restore functionality later)
- Maintains data integrity and audit trail
- Provides timestamp for when deletion occurred
- Safer than hard delete for user data

**Alternatives Considered**:
- **Boolean flag (`isDeleted`)**: Less information (no deletion timestamp)
- **Hard delete**: Irreversible, data loss, breaks referential integrity
- **Archive table**: Additional complexity, harder to query relationships

**Implementation Notes**:
- `deletedAt: Date | null` - null means active, Date means soft-deleted
- Filter active records: `where: { deletedAt: null }`
- Soft delete: `update: { deletedAt: new Date() }`
- Restore (future): `update: { deletedAt: null }`
- Include deleted client names in project views (read-only)

---

### 6. Team-Based Data Isolation

**Decision**: Use Clerk's organization ID as team identifier, filter all queries by org ID

**Rationale**:
- Clerk provides multi-tenancy via organizations out-of-the-box
- Type-safe with branded types
- No additional authentication/authorization code needed
- Automatic org context via `auth()` in Server Actions
- Users can switch orgs via Clerk UI components

**Alternatives Considered**:
- **Custom team model**: Unnecessary complexity, reinvents Clerk functionality, violates KISS
- **User-level isolation**: Doesn't support team collaboration requirement
- **Row-level security (RLS)**: Database-specific, adds complexity, not needed for MVP

**Implementation Notes**:
- Get org ID in Server Actions: `const { orgId } = auth()`
- Filter all queries: `where: { organizationId: orgId }`
- Add `organizationId` to Client and Project entities
- Validate org membership before mutations
- Use branded type: `type OrganizationId = string & { __brand: 'OrganizationId' }`

---

## Summary

All technical decisions align with constitutional principles:
- **KISS**: Using built-in Next.js features, avoiding additional frameworks
- **YAGNI**: localStorage for MVP, migrate to database only when needed
- **Type Safety**: Zod validation everywhere, branded types for IDs
- **TDD**: All patterns support testability
- **Vertical Slice**: Feature-scoped organization maintained

No blockers identified. Ready to proceed with Phase 1 design and contracts.
