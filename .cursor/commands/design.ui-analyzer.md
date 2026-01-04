---
description: Run automated UI validation tests using UI Analyzer agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load UI Analyzer Agent Context**

   - Read `.cursor/agents/design/04-ui-analyzer.md` to understand the agent's role
   - Load design context files:
     - `docs/design/brand.md` - Specifications to validate against
     - `docs/design/principles.md` - Standards to enforce
     - `docs/design/project.md` - Performance requirements

2. **Determine Test Scope**

   - If user specified a component/feature, focus tests on that
   - If no specific target, run full suite
   - Check if Playwright is configured (if not, provide setup instructions)

3. **Execute UI Analysis**

   - If Playwright configured: Run automated tests
   - If not configured: Provide manual validation checklist
   - Validate brand compliance (colors, typography, spacing)
   - Check component consistency
   - Test responsive behavior
   - Run technical accessibility checks
   - Measure performance metrics

4. **Generate Analysis Report**

   - Create report in `docs/design/reviews/YYYY-MM-DD-[feature]-ui-analysis.md`
   - Use the UI Analyzer report template
   - Include executive summary with test results
   - Document all violations with file paths and line numbers
   - Provide recommendations prioritized by severity

5. **Provide Actionable Findings**
   - Critical issues that must be fixed
   - High priority improvements
   - Medium/low priority enhancements
   - Visual regression notes if applicable

## Output Format

Generate a UI analysis report following the template from the UI Analyzer agent. Include:

- Context validation checklist
- Executive summary (tests passed/failed/warnings)
- Brand compliance results (colors, typography, spacing, logo)
- Component consistency findings
- Responsive behavior validation
- Accessibility technical checks
- Performance metrics
- Recommendations prioritized by severity
- Next steps

## Key Rules

- If Playwright not configured, provide setup instructions and manual checklist
- Reference specific file paths and line numbers for violations
- Prioritize findings (critical, high, medium, low)
- Reference brand.md specifications when flagging violations
- Save reports to `docs/design/reviews/` directory
- Provide actionable recommendations, not just problems
