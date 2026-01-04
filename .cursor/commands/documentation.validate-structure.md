---
description: Validate documentation structure and formatting
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Verify Directory Structure**
   - Check that all documentation files are in correct directories
   - Verify naming conventions are followed
   - Check for misplaced documentation files

2. **Check Frontmatter**
   - Verify all documentation files have required frontmatter
   - Check for required fields: title, last_updated, version, status
   - Validate frontmatter format (YAML)
   - Check related_files references are valid

3. **Validate Markdown Formatting**
   - Check markdown syntax is valid
   - Verify code blocks are properly formatted
   - Check for broken markdown links
   - Validate table formatting

4. **Check Internal Links**
   - Verify all internal links are valid
   - Check for broken file references
   - Verify cross-references between documentation

5. **Verify Table of Contents**
   - Check README files have up-to-date TOC
   - Verify index files are current
   - Check for missing entries in indexes

## Output Format

Provide a validation report including:

- Structure issues found
- Frontmatter issues
- Markdown formatting issues
- Broken links
- Missing table of contents entries

## Key Rules

- Validate all documentation files
- Provide specific file paths and line numbers for issues
- Categorize issues by severity
- Provide actionable fixes
