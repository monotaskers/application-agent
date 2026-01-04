---
description: Validate component or feature against brand guidelines using Brand Guardian agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Brand Guardian Agent Context**

   - Read `.cursor/agents/design/01-brand-guardian.md` to understand the agent's role and decision framework
   - Load design context files:
     - `docs/design/principles.md` - Core design standards
     - `docs/design/brand.md` - Project-specific brand guidelines
     - `docs/design/project.md` - Project requirements and overrides

2. **Identify Target for Review**

   - If user provided a component/feature name, focus on that
   - If no specific target, review recent changes or current file context
   - Determine scope: single component, feature, or full page

3. **Execute Brand Compliance Check**

   - Follow the Brand Guardian decision framework
   - Check color compliance (hex codes, palette usage)
   - Validate typography (font families, sizes, weights)
   - Verify spacing system (base unit multiples)
   - Check logo usage if applicable
   - Flag white-label considerations

4. **Generate Compliance Report**

   - Create report in `docs/design/reviews/YYYY-MM-DD-[feature]-compliance.md`
   - Use the Brand Guardian report template
   - Include status: ✅ APPROVED | ⚠️ NEEDS REVIEW | ❌ CRITICAL VIOLATIONS
   - Document all findings with specific file paths and line numbers
   - Reference strictness levels from principles.md

5. **Provide Actionable Feedback**
   - List critical violations that must be fixed
   - Flag items needing human review with clear questions
   - Provide specific recommendations for fixes
   - Reference exact brand.md specifications

## Output Format

Generate a brand compliance report following the template structure from the Brand Guardian agent. Include:

- Context loaded checklist
- Status summary
- Automated checks results
- Critical violations (if any)
- Items flagged for review (if any)
- Compliance summary with scores
- Next steps with actionable items

## Key Rules

- Use absolute paths for all file references
- Reference specific line numbers for violations
- Apply strictness levels from principles.md (🔴 HIGH = zero tolerance, 🟡 MEDIUM = flag for review, 🟢 LOW = note only)
- Save reports to `docs/design/reviews/` directory
- Always reference brand.md specifications when flagging violations
