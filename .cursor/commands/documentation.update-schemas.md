---
description: Update schema documentation for Zod validation schemas
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific schema is provided (e.g., "company"), only update documentation for that schema.

## Instructions

1. **Scan Schema Directories**
   - Scan `src/features/*/schemas/` for schema files
   - If specific schema provided in arguments, filter to that schema only
   - Identify schema files (`.ts` files with Zod schemas)

2. **Analyze Schema Structure**
   - Extract schema definition from Zod
   - Extract field types and validation rules
   - Identify schema relationships and dependencies
   - Extract TypeScript type inference
   - Identify schema usage (forms, API validation, etc.)

3. **Update Documentation Files**
   - Create or update `docs/schemas/{schema-name}.md`
   - Update `docs/schemas/README.md` schema index
   - Document schema structure, validation rules, and type inference

4. **Documentation Format**
   - Schema overview and purpose
   - Schema definition
   - Fields table with types and validation rules
   - Type inference documentation
   - Usage examples
   - Related schemas

5. **Check for Missing Documentation**
   - Identify schemas without documentation
   - Flag schemas with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Schemas scanned
- Schemas updated
- Schemas created
- Schemas missing documentation
- Files created/updated with paths

## Key Rules

- Extract schema from Zod definition
- Document all validation rules for each field
- Include TypeScript type inference
- Include usage examples (forms, API validation)
- Document schema relationships
- Update last_updated date in frontmatter
- Reference related features and API routes
