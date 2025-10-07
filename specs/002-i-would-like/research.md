# Research: Postgres Database Migration with Neon

**Feature**: 002-i-would-like | **Date**: 2025-10-06
**Status**: Complete

## Executive Summary

Research for migrating from localStorage to Neon Serverless Postgres using Drizzle ORM in a Next.js 15 application. Key findings:
- Drizzle ORM + Neon combination provides type-safe, serverless-optimized database access
- Optimistic locking via version column (integer, auto-incrementing)
- Multi-tenant isolation via Clerk organization IDs in WHERE clauses
- Connection pooling via `@neondatabase/serverless` driver
- Zero-downtime migration possible (localStorage → Database, then remove localStorage layer)

## 1. Neon Serverless Postgres Setup

**Decision**: Use Neon Serverless Postgres with `@neondatabase/serverless` driver

**Rationale**:
- Serverless-native (autoscales, no connection pooling overhead)
- Built-in connection pooling via serverless driver
- WebSocket-based connections work with Next.js Edge Runtime
- Free tier sufficient for MVP (<10K rows, <3GB storage)
- Simple setup: connection string → instant usage

**Alternatives Considered**:
- **Supabase**: More features (auth, storage) but unnecessary complexity for this use case
- **PlanetScale**: MySQL-based, would require different ORM patterns
- **Vercel Postgres**: Good integration but less flexible than Neon for future scaling

**Implementation Notes**:
```typescript
// Using @neondatabase/serverless for optimal performance
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

**Best Practices**:
- Store `DATABASE_URL` in `.env.local` (Neon provides this in dashboard)
- Use connection pooling mode (built into serverless driver)
- Enable prepared statements for query performance
- Set statement timeout (30s default is reasonable for MVP)

## 2. Drizzle ORM Configuration for Next.js 15

**Decision**: Use Drizzle ORM with `drizzle-orm` and `drizzle-kit` for migrations

**Rationale**:
- Lightest ORM (20KB vs Prisma's 3MB)
- True type inference (types generated from schema, not vice versa)
- SQL-like query builder (easier to understand and debug)
- First-class serverless support
- Built-in migration system via `drizzle-kit`
- No code generation step (Prisma requires `prisma generate`)

**Alternatives Considered**:
- **Prisma**: Heavier, slower cold starts, more complex for simple CRUD
- **Kysely**: More low-level, SQL-first (good for complex queries but overkill here)
- **Raw SQL with Postgres.js**: No type safety, more boilerplate

**Configuration**:
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Migration Commands**:
```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Open Drizzle Studio (DB viewer)
pnpm drizzle-kit studio
```

**Best Practices**:
- Define schema in TypeScript (`schema.ts`)
- Use `drizzle-kit generate` to create SQL migrations
- Version control migrations in `drizzle/migrations/`
- Run migrations in CI/CD before deployment
- Use Drizzle's `sql` tagged template for complex queries

## 3. Optimistic Locking Implementation

**Decision**: Use integer `version` column with auto-increment on updates

**Rationale**:
- Standard optimistic locking pattern
- Integer comparison is fast and reliable
- Drizzle supports this pattern naturally with `where` clauses
- Clear conflict detection (compare expected vs actual version)
- No need for timestamps (simpler, no clock skew issues)

**Alternatives Considered**:
- **Updated_at timestamp**: Prone to clock skew, requires timestamp comparison logic
- **Row hash/checksum**: More complex, harder to debug
- **Database locks (pessimistic)**: Doesn't match user requirement for optimistic approach

**Implementation Pattern**:
```typescript
// Schema definition
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: integer('version').notNull().default(1),
  // ... other fields
});

// Update with version check
const result = await db.update(clients)
  .set({
    companyName: 'New Name',
    version: sql`${clients.version} + 1`  // Increment version
  })
  .where(and(
    eq(clients.id, clientId),
    eq(clients.version, expectedVersion)  // Check current version
  ))
  .returning();

if (result.length === 0) {
  throw new Error('Conflict: Record was modified by another user');
}
```

**Edge Cases Handled**:
- No rows returned → conflict detected, return error to client
- Multiple concurrent updates → only first succeeds, others get conflict
- Version wraparound → Not a concern for 32-bit integers (2 billion updates)

## 4. Multi-Tenant Row-Level Security

**Decision**: Use Clerk `organizationId` in all WHERE clauses (application-level RLS)

**Rationale**:
- Clerk already provides authenticated `organizationId`
- Simpler than database-level RLS (Postgres policies)
- More flexible (can add custom logic)
- Easier to debug (queries visible in logs)
- Sufficient for MVP security requirements

**Alternatives Considered**:
- **Postgres RLS policies**: More secure but adds complexity, harder to debug
- **Separate databases per org**: Massive overhead, not serverless-friendly
- **Schema-per-tenant**: Complex migrations, query complexity

**Implementation Pattern**:
```typescript
// All queries MUST include organizationId filter
export async function getClients(orgId: OrganizationId) {
  return await db.select()
    .from(clients)
    .where(eq(clients.organizationId, orgId));  // ALWAYS filter by org
}

// Updates and deletes also require orgId check
export async function updateClient(
  orgId: OrganizationId,
  clientId: ClientId,
  data: UpdateClientInput
) {
  return await db.update(clients)
    .set(data)
    .where(and(
      eq(clients.id, clientId),
      eq(clients.organizationId, orgId)  // Security: prevent cross-org updates
    ));
}
```

**Security Checklist**:
- [ ] All SELECT queries filter by `organizationId`
- [ ] All UPDATE queries check `organizationId` in WHERE clause
- [ ] All DELETE queries check `organizationId` in WHERE clause
- [ ] `organizationId` validated via Zod before use
- [ ] Index on `(organization_id, id)` for performance

## 5. Migration Strategy from localStorage

**Decision**: Zero-downtime migration - replace localStorage calls with database calls

**Rationale**:
- No existing production data (per clarification: new deployment only)
- Can remove localStorage layer immediately after database implementation
- Existing tests provide regression safety
- Server Actions already abstract storage mechanism

**Alternatives Considered**:
- **Dual-write (localStorage + DB)**: Unnecessary complexity for new deployment
- **Background migration job**: No existing data to migrate
- **Blue-green deployment**: Overkill for MVP

**Migration Steps**:
1. Implement database layer (`client.db.ts`, `project.db.ts`)
2. Write tests for database operations
3. Update Server Actions to call DB layer instead of localStorage
4. Run tests to verify backward compatibility
5. Remove `storage.ts` (localStorage implementation)
6. Remove `mock-api.ts` (Products API)
7. Deploy with database enabled

**Rollback Plan**:
- Keep localStorage code in git history
- Monitor error rates post-deployment
- If issues detected, redeploy previous version
- Database can be wiped (no production data yet)

## 6. Connection Pooling & Serverless Patterns

**Decision**: Use Neon's built-in pooling via `@neondatabase/serverless`

**Rationale**:
- Neon serverless driver handles connection pooling automatically
- No need for external pooler (e.g., PgBouncer)
- WebSocket connections work in serverless environments
- Auto-scales based on request volume
- Cold start optimization built-in

**Alternatives Considered**:
- **PgBouncer**: External service, adds complexity
- **Prisma Data Proxy**: Adds latency, costs money
- **Connection per request**: Exhausts database connections quickly

**Connection Configuration**:
```typescript
// Database singleton pattern for Next.js
// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Lazy initialization (connection created on first use)
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql);
  }
  return _db;
}

export const db = getDb();
```

**Best Practices**:
- Export singleton `db` instance (reused across requests)
- No manual connection management needed
- Set `connectionTimeoutMillis` if needed (default 30s is fine)
- Monitor connection count in Neon dashboard
- Use prepared statements for frequently-run queries

## 7. Environment Variables & Configuration

**Decision**: Validate DATABASE_URL with Zod at application startup

**Rationale**:
- Fail fast if database not configured
- Follows existing pattern in `lib/env.ts`
- Provides clear error messages
- Prevents runtime failures

**Implementation**:
```typescript
// lib/env.ts (UPDATE)
import { z } from 'zod';

export const envSchema = z.object({
  // Existing env vars...
  DATABASE_URL: z.string().url().startsWith('postgres://'),
});

export const env = envSchema.parse(process.env);
```

**Environment Files**:
```bash
# .env.local (development)
DATABASE_URL=postgres://user:pass@host/db?sslmode=require

# .env.production (set in Vercel/hosting platform)
DATABASE_URL=postgres://user:pass@host/db?sslmode=require
```

## 8. Testing Strategy

**Decision**: Test pyramid - Unit (DB layer) → Integration (Server Actions) → E2E (Quickstart)

**Rationale**:
- Existing tests provide regression safety
- DB layer tests ensure core operations work
- Integration tests verify Server Action updates
- Quickstart validates end-to-end flow

**Test Database Strategy**:
```typescript
// Use in-memory SQLite for unit tests (faster)
// Use Neon preview branch for integration tests

// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup-db.ts'],
  },
});

// src/test/setup-db.ts
import { beforeEach, afterEach } from 'vitest';
import { db } from '@/db';

beforeEach(async () => {
  // Clear test database
  await db.delete(clients).execute();
  await db.delete(projects).execute();
});
```

**Test Coverage Targets**:
- DB layer: 100% (pure functions, easy to test)
- Server Actions: 90%+ (updated for DB calls)
- Integration: 85%+ (multi-entity workflows)
- Overall: 80%+ (constitutional requirement)

## Decision Matrix

| Area | Option Chosen | Rationale |
|------|---------------|-----------|
| **Database** | Neon Serverless Postgres | Serverless-optimized, free tier, built-in pooling |
| **ORM** | Drizzle ORM | Lightweight, type-safe, serverless-friendly |
| **Locking** | Optimistic (version column) | Matches requirements, simple implementation |
| **Multi-tenancy** | App-level RLS (orgId filter) | Simpler than DB-level RLS, sufficient for MVP |
| **Migration** | Direct replacement | No existing data, can replace localStorage immediately |
| **Connection** | Neon serverless driver | Built-in pooling, no external services needed |
| **Testing** | Test pyramid (unit → integration → E2E) | Matches existing pattern, comprehensive coverage |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Connection limit exceeded | Low | High | Use Neon pooling, monitor connection count |
| Optimistic lock conflicts | Medium | Low | Clear error messages, UI guidance to refresh |
| Database unavailable | Low | High | Health check endpoint, error boundaries in UI |
| Slow queries | Low | Medium | Add indexes on `(organization_id, *)`, monitor query performance |
| Version conflicts missed | Low | High | Comprehensive tests for concurrent updates |

## Dependencies to Add

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^0.10.0",
    "drizzle-orm": "^0.37.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28.0"
  }
}
```

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Design data models and contracts
3. → Generate database schema with Drizzle
4. → Write contract tests for DB operations
5. → Update CLAUDE.md with Drizzle/Neon patterns

---
**Research Status**: Complete | **Ready for Phase 1**: ✅
