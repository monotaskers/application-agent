---
description: Sync documentation with code changes automatically
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Detect Code Changes**
   - Identify new files in the codebase
   - Identify modified files
   - Identify deleted files
   - Check git status or file modification times

2. **Map Code to Documentation**
   - Map API routes to `docs/api/routes/`
   - Map features to `docs/features/`
   - Map components to `docs/components/`
   - Map hooks to `docs/hooks/`
   - Map schemas to `docs/schemas/`
   - Map pages to `docs/pages/`

3. **Update Existing Documentation**
   - Update documentation for modified code files
   - Ensure documentation matches current code structure
   - Update examples and usage patterns

4. **Create Missing Documentation**
   - Generate documentation for new code files
   - Use appropriate templates for each documentation type
   - Include basic structure and examples

5. **Remove Orphaned Documentation**
   - Archive or remove documentation for deleted code
   - Update indexes and cross-references
   - Clean up broken links

## Output Format

Provide a summary including:

- Code changes detected
- Documentation files updated
- Documentation files created
- Documentation files removed/archived
- Files created/updated with paths

## Key Rules

- Only update documentation for actual code changes
- Use appropriate documentation templates
- Maintain documentation structure and standards
- Update cross-references when files are moved/deleted
- Preserve existing documentation content when possible
- Update last_updated dates
