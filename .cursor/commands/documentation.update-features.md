---
description: Update feature documentation for React feature modules
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific feature is provided (e.g., "companies"), only update documentation for that feature.

## Instructions

1. **Scan Feature Directories**
   - Scan `src/features/` for all feature directories
   - If specific feature provided in arguments, filter to that feature only
   - Identify feature structure: components, hooks, schemas, types, lib, utils

2. **Analyze Feature Structure**
   - Document feature components in `components/`
   - Document feature hooks in `hooks/`
   - Document schemas in `schemas/`
   - Document types in `types/`
   - Document utilities in `lib/` and `utils/`
   - Identify feature dependencies and relationships

3. **Update Documentation Files**
   - Create or update `docs/features/{feature-name}.md`
   - Update `docs/architecture/features.md` with feature overview
   - Document feature's purpose, structure, and usage
   - Document feature's integration with other features

4. **Documentation Format**
   - Feature overview and purpose
   - Feature structure (directory layout)
   - Component documentation (with links)
   - Hook documentation (with links)
   - Schema documentation (with links)
   - Usage examples
   - Integration patterns

5. **Check for Missing Documentation**
   - Identify features without documentation
   - Flag features with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Features scanned
- Features updated
- Features created
- Features missing documentation
- Files created/updated with paths

## Key Rules

- Document the vertical slice architecture pattern
- Include links to component, hook, and schema documentation
- Document feature dependencies
- Include usage examples
- Update last_updated date in frontmatter
- Reference related API routes and pages
