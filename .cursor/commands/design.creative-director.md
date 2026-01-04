---
description: Get strategic design direction for a feature using Creative Director agent
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Instructions

1. **Load Creative Director Agent Context**

   - Read `.cursor/agents/design/02-creative-director.md` to understand the agent's role
   - Load design context files:
     - `docs/design/principles.md` - Design philosophy
     - `docs/design/brand.md` - Brand personality and positioning
     - `docs/design/project.md` - Business goals and user needs

2. **Understand the Feature Request**

   - Extract feature name and purpose from user input
   - Identify user needs and business objectives
   - Determine scope and constraints

3. **Execute Creative Direction Process**

   - Follow the Creative Director decision framework
   - Define strategic context (project goal, user need, brand position)
   - Develop design approach with rationale
   - Make creative decisions with alternatives considered
   - Define design requirements (must have, should have, nice to have)
   - Establish user experience priorities and success criteria
   - Provide visual direction for Art Director

4. **Generate Creative Direction Document**

   - Create document in `docs/design/reviews/YYYY-MM-DD-[feature]-creative.md`
   - Use the Creative Director template structure
   - Document all decisions with rationale
   - Reference principles.md strictness levels
   - Include hand-off notes for Art Director

5. **Provide Strategic Guidance**
   - Clear design approach in 2-3 sentences
   - Key decisions that must be preserved
   - Areas where interpretation is welcome
   - Areas requiring precision

## Output Format

Generate a creative direction document following the template from the Creative Director agent. Include:

- Context review checklist
- Strategic context (project goal, user need, brand position)
- Design approach with concept and rationale
- Creative decisions with alternatives considered
- Design requirements (must/should/nice to have)
- User experience priorities and success criteria
- Creative direction for Art Director
- Content strategy
- Technical considerations
- Approval criteria checklist

## Key Rules

- Always ground decisions in user needs and business objectives
- Reference brand.md personality and project.md goals
- Apply principles.md with appropriate strictness levels
- Document tradeoffs and risks
- Provide clear hand-off to Art Director
- Save documents to `docs/design/reviews/` directory
