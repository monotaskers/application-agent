---
description: Update hook documentation for React hooks
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific hook is provided (e.g., "use-companies"), only update documentation for that hook.

## Instructions

1. **Scan Hook Directories**
   - Scan `src/hooks/` for shared hooks
   - Scan `src/features/*/hooks/` for feature-specific hooks
   - If specific hook provided in arguments, filter to that hook only
   - Identify hook files (`.ts` or `.tsx` files)

2. **Analyze Hook Structure**
   - Extract hook parameters from function signature
   - Extract return values and their types
   - Identify hook dependencies (other hooks, API calls, etc.)
   - Extract JSDoc comments if present
   - Identify hook usage patterns

3. **Update Documentation Files**
   - Create or update `docs/hooks/{hook-name}.md`
   - Update `docs/hooks/README.md` hook index
   - Document hook parameters, return values, and usage

4. **Documentation Format**
   - Hook overview and purpose
   - Parameters table with types and descriptions
   - Return value documentation
   - Usage examples
   - Error handling
   - Related hooks

5. **Check for Missing Documentation**
   - Identify hooks without documentation
   - Flag hooks with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Hooks scanned
- Hooks updated
- Hooks created
- Hooks missing documentation
- Files created/updated with paths

## Key Rules

- Extract parameters from TypeScript function signatures
- Document return value structure and types
- Include usage examples with code
- Document error states and loading states
- Include dependencies and side effects
- Update last_updated date in frontmatter
- Reference related features and API routes
