---
description: Define visual execution details using Art Director agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Art Director Agent Context**

   - Read `.cursor/agents/design/03-art-director.md` to understand the agent's role
   - Load design context files:
     - `docs/design/brand.md` - Visual specifications
     - `docs/design/principles.md` - Visual design standards
     - Check for Creative Director's strategic direction document

2. **Review Creative Direction**

   - If Creative Director document exists, load it for context
   - Understand strategic intent and visual direction provided
   - Identify areas of flexibility vs. precision required

3. **Execute Art Direction Process**

   - Follow the Art Director template structure
   - Define visual system (hierarchy, color application, typography, imagery)
   - Design component aesthetics with all states
   - Specify motion and interaction details
   - Define responsive behavior for all breakpoints
   - Document implementation notes (design tokens, variants, assets)

4. **Generate Art Direction Document**

   - Create document in `docs/design/reviews/YYYY-MM-DD-[feature]-art.md`
   - Use the Art Director template structure
   - Reference all values from brand.md design tokens
   - Include quality checklist before handoff

5. **Provide Visual Specifications**
   - Production-ready specifications
   - All values reference brand.md tokens
   - Complete state definitions (default, hover, active, disabled, error)
   - Responsive behavior clearly specified

## Output Format

Generate an art direction document following the template from the Art Director agent. Include:

- Context loaded checklist
- Visual system (hierarchy, color, typography, imagery)
- Component aesthetics for each component
- Motion and interaction specifications
- Responsive design behavior
- Implementation notes (tokens, variants, assets)
- Quality checklist

## Key Rules

- All visual values must reference brand.md specifications
- Use brand.md spacing system (base unit multiples)
- Document all component states
- Specify responsive behavior for mobile, tablet, desktop
- Reference Creative Director's strategic direction
- Save documents to `docs/design/reviews/` directory
- Ensure specifications are production-ready
