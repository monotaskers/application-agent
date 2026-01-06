---
description: Check for outdated documentation by comparing code and documentation timestamps
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Compare Timestamps**
   - Compare code file modification times with documentation file times
   - Identify documentation files older than their related code files
   - Flag documentation that may be outdated

2. **Check for Missing Documentation**
   - Scan codebase for new files without corresponding documentation
   - Check for new API routes, components, hooks, features
   - Generate list of missing documentation

3. **Check for Orphaned Documentation**
   - Identify documentation referencing deleted code files
   - Check for broken file references in frontmatter
   - Flag documentation for removed features

4. **Check for TODO/FIXME Comments**
   - Scan documentation files for TODO or FIXME comments
   - Flag incomplete documentation sections
   - Generate list of documentation tasks

5. **Generate Report**
   - Create comprehensive report of findings
   - Categorize issues (outdated, missing, orphaned, incomplete)
   - Prioritize issues by importance

## Output Format

Provide a report including:

### Outdated Documentation
- List of documentation files that are older than related code
- Last updated dates
- Related code files

### Missing Documentation
- New code files without documentation
- File paths and types (API routes, components, hooks, etc.)

### Orphaned Documentation
- Documentation referencing deleted code
- Broken file references

### Incomplete Documentation
- Documentation with TODO/FIXME comments
- Sections marked as incomplete

## Key Rules

- Compare file modification times accurately
- Check all documentation types (API, features, components, hooks, etc.)
- Provide actionable recommendations
- Prioritize critical documentation updates
- Include file paths for easy navigation
