# Context Documentation for AI Agents and Developers

**Last Updated:** 2025-12-19  
**Purpose:** This document provides critical context for both AI agents and human developers to ensure accurate understanding of the codebase.

## Database Schema Source of Truth

**CRITICAL:** The remote Supabase production database is the **single source of truth** for all database schema information.

- **Remote Database:** Production Supabase instance (authoritative source)
- **Reference Document:** `docs/database/remote-schema-reference.md` (snapshot from remote database)
- **Local Documentation:** `docs/database/schema.md` (must match remote exactly)
- **TypeScript Types:** `src/types/database.types.ts` (auto-generated from remote)

### Important Schema Facts


## Backward Compatibility Policy

**No backward compatibility is maintained.** The project does not support old schemas or deprecated API versions.

- ❌ Do NOT add code to handle "old schema" fields
- ❌ Do NOT maintain legacy API response formats
- ✅ Use the remote database schema as the authoritative reference
- ✅ Remove legacy/deprecated code references

## Code Quality Standards

### TypeScript

- **Must use** `ReactElement` (not `JSX.Element`) for component return types
- **Never use** `any` type (use `unknown` or proper types)
- **Zod schemas** must match database schema exactly
- **All external data** must be validated with Zod

### Package Manager

- **MUST use** `pnpm` (never npm, yarn, or bun)
- All examples and commands must use `pnpm`

## Architecture Patterns

### Server-Side Rendering (SSR)

All detail pages use hybrid Server/Client Component architecture:

1. **Server Component** (`page.tsx`) - Fetches data, handles auth
2. **Client Component** (`*-client.tsx`) - Handles interactivity
3. **Shared Utility** (`fetch-*-server.ts`) - Reusable server-side fetching

See `docs/patterns/server-side-rendering.md` for complete documentation.

### State Management Hierarchy

1. Local state (`useState`) for component-specific state
2. URL state (search params) for shareable state
3. Server state (TanStack Query) for API data
4. Global state (Zustand) only when truly needed app-wide

## Documentation Maintenance

### When Schema Changes

1. Pull fresh schema from remote: `docs/database/remote-schema-reference.md`
2. Update `docs/database/schema.md` to match exactly
3. Regenerate TypeScript types from remote
4. Update all Zod schemas to match
5. Run schema validation: `pnpm run validate:schema`
6. Update schema change log: `docs/database/schema-change-log.md`
7. Update this context document if policies change

### When Adding Features

1. Follow vertical slice architecture
2. Document all public APIs
3. Update relevant documentation files

## Common Pitfalls to Avoid

- ❌ Using deprecated fields that don't exist in remote DB
- ❌ Maintaining backward compatibility code
- ❌ Using `npm` or `yarn` instead of `pnpm`
- ❌ Missing Zod validation on external data
- ❌ Using `any` types or `@ts-ignore` without proper justification
- ❌ Assuming local schema files are accurate (always check remote)
- ❌ **Creating duplicate entity fetching logic** - Always use `useEntityList`, `useEntityQuery`, or `fetchEntityServer`
- ❌ **Reimplementing column layout logic** - Always use `useColumnLayout` hook

## Quick Reference Links

- **Remote Schema:** `docs/database/remote-schema-reference.md` (authoritative)
- **Schema Documentation:** `docs/database/schema.md` (must match remote)
- **Schema Validation:** `docs/database/schema-validation.md` (validation process)
- **Schema Change Log:** `docs/database/schema-change-log.md` (change history)
- **Database README:** `docs/database/README.md` (maintenance guide)
- **Development Guidelines:** `AGENTS.md`
- **Design System:** `.cursor/rules/design_system_rules.mdc`
- **SSR Patterns:** `docs/patterns/server-side-rendering.md`
- **DRY Patterns:**
  - `docs/patterns/entity-list-pattern.md` - Entity list fetching
  - `docs/patterns/entity-query-pattern.md` - Single entity fetching
  - `docs/patterns/server-side-fetching-pattern.md` - Server-side utilities
  - `docs/patterns/column-layout-pattern.md` - Column layout management

## Validation Commands

```bash
# Validate schema synchronization
pnpm run validate:schema

# Or run script directly
./scripts/validate-schema-sync.sh
```

---

**For AI Agents:** Always verify schema information against `docs/database/remote-schema-reference.md` before making assumptions about database structure. The remote database is authoritative.

**For Developers:** When in doubt, check the remote database schema directly or consult `docs/database/remote-schema-reference.md`.
