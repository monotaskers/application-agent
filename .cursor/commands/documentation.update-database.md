---
description: Update database documentation for Supabase schema and migrations
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Scan Database Files**
   - Check `supabase/migrations/` for new migration files
   - Check `docs/database/schema.sql` if it exists
   - Check `src/types/database.types.ts` for TypeScript types
   - Identify schema changes, new tables, modified tables

2. **Analyze Database Structure**
   - Extract table definitions from migrations
   - Extract RLS (Row Level Security) policies
   - Extract database functions and triggers
   - Extract foreign key relationships
   - Extract indexes and constraints

3. **Update Documentation Files**
   - Update `docs/database/schema.md` with schema changes
   - Update `docs/database/schema.sql` if schema file exists
   - Update `docs/database/patterns.md` with access patterns
   - Update `docs/database/rls.md` with RLS policies
   - Document migration rationale

4. **Documentation Format**
   - Schema overview
   - Table definitions with columns and types
   - Relationships and foreign keys
   - RLS policies
   - Database functions
   - Access patterns

5. **Check for Missing Documentation**
   - Identify tables without documentation
   - Flag missing RLS policy documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Migrations scanned
- Schema changes identified
- Documentation files updated
- Missing documentation items
- Files created/updated with paths

## Key Rules

- Document all table schemas
- Document RLS policies and their purposes
- Document database functions and triggers
- Include migration rationale
- Update TypeScript types documentation
- Update last_updated date in frontmatter
- Reference related features and API routes
