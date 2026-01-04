---
description: Update architectural pattern documentation
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Scan Pattern Documentation**
   - Check `docs/patterns/` for existing pattern documentation
   - Scan codebase for new patterns or pattern changes
   - Identify architectural decisions and patterns

2. **Analyze Code Patterns**
   - Identify Server Component patterns
   - Identify Client Component patterns
   - Identify data fetching patterns
   - Identify state management patterns
   - Identify authentication patterns
   - Identify error handling patterns

3. **Update Documentation Files**
   - Create or update `docs/patterns/{pattern-name}.md`
   - Update `docs/patterns/README.md` pattern index
   - Document pattern usage, examples, and best practices

4. **Documentation Format**
   - Pattern overview and purpose
   - When to use the pattern
   - Implementation examples
   - Best practices
   - Related patterns

5. **Check for Missing Documentation**
   - Identify patterns without documentation
   - Flag patterns with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Patterns scanned
- Patterns updated
- Patterns created
- Patterns missing documentation
- Files created/updated with paths

## Key Rules

- Document when to use each pattern
- Include code examples
- Document best practices and anti-patterns
- Reference related patterns
- Update last_updated date in frontmatter
- Include architecture decision rationale
