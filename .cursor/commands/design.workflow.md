---
description: Execute complete design workflow using all design agents in sequence
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Design Context**

   - Load `docs/design/design-principles.md`
   - Load `docs/design/brand.md` (if exists)
   - Load `docs/design/project.md` (if exists)
   - Check if design review directory exists: `docs/design/reviews/`

2. **Determine Workflow Stage**

   - If user provided feature name, use that
   - If starting new feature, begin with Creative Director
   - If feature exists, determine current stage:
     - No design docs → Start with Creative Director
     - Has creative direction → Move to Art Director
     - Has art direction → Move to Brand Guardian
     - Has compliance check → Move to UI Analyzer
     - Has UI analysis → Move to Accessibility Champion

3. **Execute Design Workflow Steps**

   **Step 1: Creative Direction** (if needed)

   - Load Creative Director agent: `.cursor/agents/design/02-creative-director.md`
   - Generate creative direction document
   - Save to `docs/design/reviews/YYYY-MM-DD-[feature]-creative.md`

   **Step 2: Art Direction** (if needed)

   - Load Art Director agent: `.cursor/agents/design/03-art-director.md`
   - Generate art direction document
   - Save to `docs/design/reviews/YYYY-MM-DD-[feature]-art.md`

   **Step 3: Brand Compliance** (if needed)

   - Load Brand Guardian agent: `.cursor/agents/design/01-brand-guardian.md`
   - Validate against brand guidelines
   - Generate compliance report
   - Save to `docs/design/reviews/YYYY-MM-DD-[feature]-compliance.md`

   **Step 4: UI Analysis** (if needed)

   - Load UI Analyzer agent: `.cursor/agents/design/04-ui-analyzer.md`
   - Run automated tests or provide manual checklist
   - Generate UI analysis report
   - Save to `docs/design/reviews/YYYY-MM-DD-[feature]-ui-analysis.md`

   **Step 5: Accessibility Review** (if needed)

   - Load Accessibility Champion agent: `.cursor/agents/design/05-accessibility-champion.md`
   - Validate WCAG compliance
   - Generate accessibility review
   - Save to `docs/design/reviews/YYYY-MM-DD-[feature]-accessibility.md`

4. **Generate Workflow Summary**

   - List all documents created
   - Summarize status of each stage
   - Identify any blockers or items needing review
   - Provide next steps

5. **Provide Integration Notes**
   - How agents worked together
   - Any conflicts or issues resolved
   - Recommendations for next iteration

## Output Format

Provide a workflow summary including:

- Feature name and date
- Stages completed
- Documents created with paths
- Status of each stage (✅ Complete | ⚠️ Needs Review | ❌ Blocked)
- Blockers or items requiring human review
- Next steps in the workflow

## Key Rules

- Only execute stages that are needed (don't repeat completed work)
- Reference previous agent outputs when moving to next stage
- Save all documents to `docs/design/reviews/` directory
- Use consistent naming: `YYYY-MM-DD-[feature]-[type].md`
- Provide clear next steps
- Document any conflicts between agents that need resolution

## Workflow Order

1. Creative Director → Strategic approach
2. Art Director → Visual execution
3. Brand Guardian → Compliance check
4. UI Analyzer → Automated testing
5. Accessibility Champion → WCAG validation

**Note**: Some stages can run in parallel (e.g., Brand Guardian can validate during implementation), but this workflow follows the recommended sequence.
