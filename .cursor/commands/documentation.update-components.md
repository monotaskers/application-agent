---
description: Update component documentation for React components
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific component is provided (e.g., "Button"), only update documentation for that component.

## Instructions

1. **Scan Component Directories**
   - Scan `src/components/` for shared components
   - Scan `src/features/*/components/` for feature-specific components
   - If specific component provided in arguments, filter to that component only
   - Identify component files (`.tsx` files)

2. **Analyze Component Structure**
   - Extract component props from TypeScript interfaces
   - Extract component exports and variants
   - Identify component dependencies
   - Extract JSDoc comments if present
   - Identify component usage patterns

3. **Update Documentation Files**
   - Create or update `docs/components/{component-name}.md`
   - Update `docs/components/ui/{component-name}.md` for UI components
   - Update `docs/components/README.md` component index
   - Document component props, usage, and examples

4. **Documentation Format**
   - Component overview and purpose
   - Props table with types and descriptions
   - Usage examples
   - Variants and styling
   - Accessibility considerations
   - Related components

5. **Check for Missing Documentation**
   - Identify components without documentation
   - Flag components with incomplete documentation
   - Generate list of missing docs

## Output Format

Provide a summary including:

- Components scanned
- Components updated
- Components created
- Components missing documentation
- Files created/updated with paths

## Key Rules

- Extract props from TypeScript interfaces/types
- Include default values for optional props
- Include usage examples with code
- Document accessibility features (ARIA, keyboard nav)
- Include variant documentation if using CVA
- Update last_updated date in frontmatter
- Reference related hooks and features
