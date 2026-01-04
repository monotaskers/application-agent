---
description: Validate WCAG compliance and inclusive design using Accessibility Champion agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Accessibility Champion Agent Context**

   - Read `.cursor/agents/design/05-accessibility-champion.md` to understand the agent's role
   - Load design context files:
     - `docs/design/principles.md` - Accessibility section (should be 🔴 HIGH)
     - Check for UI Analyzer's technical accessibility checks
     - Review Creative Director's design decisions

2. **Determine Review Scope**

   - If user specified a component/feature, focus on that
   - If no specific target, review current context or recent changes
   - Consider both technical WCAG checks and inclusive design patterns

3. **Execute Accessibility Review**

   - Follow WCAG 2.1 Level AA checklist
   - Evaluate perceivable, operable, understandable, and robust criteria
   - Consider inclusive design (cognitive, motor, visual, auditory needs)
   - Review assistive technology compatibility
   - Check for common accessibility issues

4. **Generate Accessibility Review Report**

   - Create report in `docs/design/reviews/YYYY-MM-DD-[feature]-accessibility.md`
   - Use the Accessibility Champion template structure
   - Document WCAG compliance status
   - List issues by priority (critical, high, medium)
   - Provide specific fixes with WCAG criterion references

5. **Provide Inclusive Design Guidance**
   - Immediate actions required
   - Enhancements beyond minimum compliance
   - Future considerations for AAA standards
   - Sign-off checklist

## Output Format

Generate an accessibility review report following the template from the Accessibility Champion agent. Include:

- Context loaded checklist
- WCAG 2.1 Level AA compliance checklist (all 4 principles)
- Inclusive design considerations (cognitive, motor, visual, auditory)
- Assistive technology testing notes
- Issues found by priority level
- Recommendations (immediate, enhancements, future)
- Compliance status and score
- Sign-off checklist

## Key Rules

- **Accessibility is non-negotiable** - flag all violations
- Reference specific WCAG criteria (e.g., WCAG 1.4.3)
- Provide specific fixes, not just problems
- Include file paths and line numbers for issues
- When conflicts arise between aesthetics and accessibility, accessibility wins
- Save reports to `docs/design/reviews/` directory
- Use WCAG 2.1 Level AA as minimum standard
