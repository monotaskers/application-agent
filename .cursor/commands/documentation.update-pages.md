---
description: Update page documentation for Next.js App Router pages
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific route is provided (e.g., "admin/companies"), only update documentation for that route.

## Instructions

1. **Scan Page Directories**
   - Scan `src/app/` for page files (`page.tsx`, `layout.tsx`, etc.)
   - If specific route provided in arguments, filter to that route only
   - Identify page structure, layouts, and middleware usage

2. **Analyze Page Structure**
   - Extract route paths and dynamic segments
   - Identify Server Components vs Client Components
   - Extract data fetching patterns
   - Identify authentication/authorization requirements
   - Extract layout structure
   - Identify error boundaries and loading states

3. **Update Documentation Files**
   - Create or update `docs/pages/{route-name}.md`
   - Update `docs/pages/routing.md` with routing structure
   - Update `docs/patterns/server-side-rendering.md` if SSR patterns change
   - Document routing, layouts, and middleware

4. **Documentation Format**
   - Page overview and purpose
   - Route path and structure
   - Server/Client component breakdown
   - Data fetching patterns
   - Authentication requirements
   - Layout structure
   - Error handling

5. **Check for Missing Documentation**
   - Identify pages without documentation
   - Flag pages with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Pages scanned
- Pages updated
- Pages created
- Pages missing documentation
- Files created/updated with paths

## Key Rules

- Document Server Component vs Client Component patterns
- Document data fetching strategies (SSR, SSG, ISR)
- Include authentication/authorization requirements
- Document layout hierarchy
- Include error boundary documentation
- Update last_updated date in frontmatter
- Reference related features and API routes
