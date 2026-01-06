---
description: Extract brand guidelines from existing materials using Brand Auditor agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Brand Auditor Agent Context**

   - Read `.cursor/agents/design/06-brand-auditor.md` to understand the agent's role
   - Load template: `docs/design/templates/template_brand.md`
   - Load principles: `docs/design/principles.md` (for strictness defaults)

2. **Identify Source Materials**

   - Extract URLs, file paths, or material descriptions from user input
   - Determine what materials are available for analysis
   - Note any missing materials that would be helpful

3. **Execute Brand Audit**

   - Follow the Brand Auditor analysis framework
   - Extract color palette (primary, secondary, accent, semantic colors)
   - Analyze typography system (fonts, scale, weights)
   - Identify spacing system (base unit, scale)
   - Discover component patterns
   - Document logo usage
   - Analyze brand voice and tone from copy

4. **Generate Brand Audit Report**

   - Create report in `docs/design/reviews/YYYY-MM-DD-brand-audit.md`
   - Use the Brand Auditor template structure
   - Document all extracted values with confidence levels
   - Identify gaps requiring stakeholder input
   - List recommended clarification questions

5. **Generate Initial Brand.md**

   - Create `docs/design/brand.md` from template
   - Fill in extracted values (colors, typography, spacing)
   - Mark sections needing stakeholder input
   - Include confidence levels for each section

6. **Provide Next Steps**
   - Stakeholder interview questions
   - Additional materials needed
   - Follow-up analysis required

## Output Format

Generate a brand audit report following the template from the Brand Auditor agent. Include:

- Source materials analyzed
- Color palette extracted with confidence levels
- Typography system extracted
- Spacing system analysis
- Component patterns discovered
- Logo usage patterns
- Brand voice and tone analysis
- Gaps identified (need stakeholder input)
- Generated brand.md status
- Next steps and stakeholder questions

## Key Rules

- Mark confidence levels (HIGH, MEDIUM, LOW) for all extracted values
- Clearly identify gaps requiring stakeholder input
- Use brand template structure for generated brand.md
- Reference principles.md for strictness defaults
- Save audit report to `docs/design/reviews/` directory
- Generate brand.md in `docs/design/` directory
- Provide specific stakeholder interview questions
