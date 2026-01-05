# Database Context Maintenance Documentation

## Overview

This documentation provides a complete guide for maintaining database context across all related files. **The remote Supabase database is the single source of truth** for the schema. All local files are derived from and synchronized with the remote database.

### Recent Schema Changes

- **Companies Table**: Added `companies` table to support company/organization entities. The `profiles` table now includes a nullable `company_id` foreign key. Users with `@ocupop.com` email addresses are automatically assigned to the default "Ocupop" company. See migration `20250127000000_add_companies_table.sql` for details.

## ⚠️ Before You Start

**CRITICAL:** Before making any schema-related changes or assumptions:

1. **Always verify against remote schema** - Check `docs/database/schema.md` and `docs/database/schema.sql` first
2. **Never assume local files are accurate** - Local schema files may be out of sync
3. **Remote database is authoritative** - All schema decisions must align with production database
4. **No database schema changes** - All columns are required; no columns should be removed

See `docs/CONTEXT.md` for complete context on schema management and development policies.

## Database Management Philosophy

**Remote-First Approach**: 
- The remote Supabase database is the authoritative source of truth
- Schema changes are made directly on the remote database (via Supabase Dashboard SQL Editor)
- Local files (`schema.sql`, `base_schema.sql`, `database.types.ts`) are generated from the remote database
- No migration files are used - the remote database state is the canonical schema

## File Structure

The database context consists of several interconnected files:

### Core Files

- `docs/database/schema.md` - Human-readable schema documentation (manually maintained, must match remote)
- `docs/database/schema.sql` - SQL schema export from remote database (auto-generated)
- `supabase/schemas/base_schema.sql` - Base schema definition file (synced from schema.sql)
- `src/types/database.types.ts` - Auto-generated TypeScript types from remote database

### Feature-Specific Documentation

- Additional feature-specific documentation files may exist in `docs/database/` for specific features

## Maintenance Workflow

### 1. Schema Update Workflow

**IMPORTANT**: All schema changes must be made directly on the remote database via the Supabase Dashboard SQL Editor. The remote database is the source of truth.

When database schema changes are made on the remote:

1. **Make Changes on Remote Database**:
   - Use Supabase Dashboard → SQL Editor to execute schema changes
   - Test changes thoroughly on remote before proceeding
   - Document what changes were made

2. **Export Updated Schema from Remote**:
   ```bash
   # Export from linked remote instance (always use this)
   supabase db dump --linked -s public -f docs/database/schema.sql
   ```

3. **Update Base Schema File**:
   ```bash
   # Sync base_schema.sql with exported schema
   cp docs/database/schema.sql supabase/schemas/base_schema.sql
   ```

4. **Regenerate TypeScript Types**:
   ```bash
   # Generate types from remote database
   supabase gen types typescript --linked > src/types/database.types.ts
   
   # Verify types compile
   pnpm run type-check
   ```

5. **Update Schema Documentation**:

   - Review `schema.md` for any new tables, columns, or constraints
   - Update table descriptions, relationships, and indexes
   - Document any breaking changes
   - Use the agent prompts below to automate documentation updates

6. **Update Feature-Specific Docs** (if applicable):

   - Review and update any feature-specific documentation files in `docs/database/`
   - Update relationship diagrams if entity relationships change
   - Document any schema fixes or discrepancies

7. **Sync Local Database** (optional, for local development):
   ```bash
   # Reset local database to match remote (this will wipe local data)
   supabase db reset
   ```

### 2. File Synchronization Checklist

After any schema change on the remote database, verify:

- [ ] `schema.sql` has been exported from remote and matches remote database structure
- [ ] `supabase/schemas/base_schema.sql` is synchronized with `schema.sql`
- [ ] `database.types.ts` has been regenerated from remote and reflects all tables, columns, and relationships
- [ ] `schema.md` documents all tables and their purposes (manually updated to match remote)
- [ ] TypeScript code compiles without type errors (`pnpm run type-check`)
- [ ] Zod schemas in code match remote database structure
- [ ] Local database has been reset if needed for development (`supabase db reset`)

### 3. Documentation Update Procedures

#### Updating schema.md

When adding new tables or columns:

1. Add table section with:

   - Purpose statement
   - Column table with types and descriptions
   - Constraints (primary keys, foreign keys, checks)
   - Indexes
   - RLS policies (if applicable)
   - Triggers
   - Notes on usage patterns

2. Update relationships diagram if structure changes

3. Update indexes summary section

#### Updating TypeScript Types

Types are auto-generated, but verify:

- All new tables appear in `Database['public']['Tables']`
- Foreign key relationships are correctly typed
- JSONB columns use `Json` type
- Enums are properly typed
- Functions include correct argument and return types

#### Updating Feature Documentation

When feature-specific changes occur:

- Update any relevant feature-specific documentation files
- Regenerate ER diagrams if structure changes
- Document any schema fixes or workarounds

## Creating schema.md

If `schema.md` doesn't exist, create it by generating human-readable documentation from `schema.sql`:

### Steps to Create schema.md

1. **Ensure schema.sql is current**:
   ```bash
   supabase db dump --linked -s public -f docs/database/schema.sql
   ```

2. **Generate schema.md using AI agent**:
   Use the prompt below with an AI agent to generate comprehensive documentation from `schema.sql`

3. **Review and refine**:
   - Verify all tables are documented
   - Check that relationships are clearly explained
   - Ensure indexes and constraints are documented

### Prompt for Creating schema.md

```
Please create docs/database/schema.md by analyzing docs/database/schema.sql (or supabase/schemas/base_schema.sql). 

Generate comprehensive human-readable documentation that includes:
- Overview section explaining the database purpose
- For each table:
  - Purpose statement (use existing COMMENT ON TABLE if available)
  - Complete column table with types, nullability, defaults, and descriptions (use COMMENT ON COLUMN if available)
  - All constraints (primary keys, foreign keys, check constraints)
  - Indexes
  - RLS policies (if applicable)
  - Triggers
  - Notes on usage patterns and relationships
- Relationships diagram showing foreign key relationships between tables
- Indexes summary section
- Functions documentation (if any)

Use clear markdown formatting with proper headings, tables, and code blocks. Preserve any existing comments from the SQL schema.
```

## Agent Prompts for Documentation Updates

Use these prompts with AI agents to automate documentation maintenance:

### Updating schema.md After Schema Changes

```
I've updated the database schema. Please review docs/database/schema.sql (or supabase/schemas/base_schema.sql) and update docs/database/schema.md to reflect any new tables, columns, constraints, indexes, or relationships. Maintain the existing documentation format and structure.
```

### Verifying Documentation Consistency

```
Please verify that the database documentation is consistent:
1. Compare docs/database/schema.sql with docs/database/schema.md - ensure all tables and columns are documented
2. Check that src/types/database.types.ts matches the schema structure
3. Identify any discrepancies or missing documentation
```

## Key Commands Reference

### Schema Export

```bash
# Export from linked project
supabase db dump --linked -s public -f docs/database/schema.sql

# Export specific tables
supabase db dump --linked -s public -t table_name -f output.sql
```

### Type Generation

```bash
# Generate from linked project
supabase gen types typescript --linked > src/types/database.types.ts

# Generate from local instance
supabase gen types typescript --local > src/types/database.types.ts
```

### Local Database Management

```bash
# Reset local database (wipes local data, syncs with remote if linked)
supabase db reset

# Start local Supabase services
supabase start

# Stop local Supabase services
supabase stop

# Check local database status
supabase status
```

**Note**: We do not use migrations. Schema changes are made directly on the remote database via Supabase Dashboard.

## Best Practices

1. **Remote database is source of truth** - Always make schema changes on the remote database first
2. **Export schema immediately after remote changes** - Keep `schema.sql` and `supabase/schemas/base_schema.sql` synchronized with remote
3. **Regenerate types immediately** - Don't manually edit `database.types.ts`, always regenerate from remote
4. **Document breaking changes** - Update relevant documentation when schema changes
5. **Test type compilation** - Run `pnpm run type-check` after type generation
6. **Keep docs in sync** - Update `schema.md` when structure changes (use agent prompts below)
7. **Document relationships** - Update ER diagrams when foreign keys change
8. **Sync base schema** - Always copy `schema.sql` to `supabase/schemas/base_schema.sql` after export
9. **Reset local DB when needed** - Use `supabase db reset` to sync local database with remote state
10. **Never create migration files** - All changes go directly to remote database

## Troubleshooting

### Types Don't Match Schema

- Regenerate types from remote: `supabase gen types typescript --linked > src/types/database.types.ts`
- Verify schema export is current: `supabase db dump --linked -s public -f docs/database/schema.sql`
- Ensure remote database changes have been exported

### Schema Export Fails

- Verify Supabase CLI is linked: `supabase projects list`
- Check connection string permissions
- Try using `--db-url` with explicit connection string

### Documentation Out of Sync

- Export fresh schema from remote: `supabase db dump --linked -s public -f docs/database/schema.sql`
- Compare `schema.sql` or `supabase/schemas/base_schema.sql` with `schema.md` table listings
- Check for missing tables or columns in documentation
- Review recent remote database changes via Supabase Dashboard
- Ensure `supabase/schemas/base_schema.sql` is synchronized with `schema.sql`

## File Dependencies

```
Remote Supabase Database (SOURCE OF TRUTH)
    ↓
    ├─→ schema.sql (exported via: supabase db dump --linked)
    ├─→ base_schema.sql (copied from schema.sql)
    ├─→ database.types.ts (generated via: supabase gen types --linked)
    └─→ schema.md (manually maintained based on schema.sql)
         └─→ Feature-specific docs (manually maintained)
```

**Key Points:**
- Remote database is the single source of truth
- All local files are derived from remote
- Schema changes must be made on remote first
- Local files are regenerated/updated after remote changes

## Maintenance Schedule

- **After each remote schema change**: Export schema, sync base_schema.sql, regenerate types, update docs
- **Before releases**: Complete synchronization checklist

## Resetting Local Database to Match Remote

If your local database has diverged from remote or you want a fresh start:

### Reset Process

1. **Export remote schema** (if not already current):
   ```bash
   supabase db dump --linked -s public -f docs/database/schema.sql
   ```

2. **Update base schema file**:
   ```bash
   cp docs/database/schema.sql supabase/schemas/base_schema.sql
   ```

3. **Reset local database** (this will wipe all local data):
   ```bash
   supabase db reset
   ```

4. **Regenerate TypeScript types**:
   ```bash
   supabase gen types typescript --linked > src/types/database.types.ts
   ```

5. **Verify synchronization**:
   ```bash
   pnpm run type-check
   ```

**Note**: The local database reset will remove all local data. The local database is primarily for development and testing. Production data lives on the remote database.

## Quick Reference

### Making Schema Changes

1. Make changes on remote via Supabase Dashboard SQL Editor
2. Export schema: `supabase db dump --linked -s public -f docs/database/schema.sql`
3. Sync base schema: `cp docs/database/schema.sql supabase/schemas/base_schema.sql`
4. Regenerate types: `supabase gen types typescript --linked > src/types/database.types.ts`
5. Update documentation: Use agent prompts above to update `schema.md`

### Verifying Everything is in Sync

```bash
# Run automated validation script
pnpm run validate:schema
```

## Related Documentation

- Supabase CLI: https://supabase.com/docs/reference/cli
- Schema Documentation: `docs/database/schema.md`
