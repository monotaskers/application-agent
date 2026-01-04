---
description: Update API route documentation for Next.js API routes
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific route is provided (e.g., "suppliers"), only update documentation for that route.

## Instructions

1. **Scan API Routes**
   - Scan `src/app/api/` for all route files (`route.ts`, `[id]/route.ts`, etc.)
   - If specific route provided in arguments, filter to that route only
   - Identify new routes, modified routes, and deleted routes

2. **Analyze Route Structure**
   - Extract HTTP methods (GET, POST, PUT, DELETE, etc.)
   - Extract route paths and dynamic segments
   - Extract request/response types from TypeScript
   - Extract authentication/authorization requirements
   - Extract query parameters and path parameters
   - Extract request body schemas (if using Zod)

3. **Update Documentation Files**
   - For each route, create or update `docs/api/routes/{route-name}.md`
   - Update `docs/api/examples.md` with usage examples
   - Update `docs/api/authentication.md` if auth patterns change
   - Document error responses and status codes

4. **Documentation Format**
   - Include endpoint path and HTTP method
   - Include TypeScript types for request/response
   - Include authentication requirements
   - Include query parameters and path parameters
   - Include example requests and responses
   - Include error handling documentation

5. **Check for Missing Documentation**
   - Identify routes without documentation
   - Flag routes with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Routes scanned
- Routes updated
- Routes created
- Routes missing documentation
- Files created/updated with paths

## Key Rules

- Use TypeScript types from the code, not inferred types
- Document all HTTP methods for each route
- Include authentication/authorization requirements
- Include error response types and status codes
- Use Next.js/React patterns in examples
- Reference related schemas and types
- Update last_updated date in frontmatter
