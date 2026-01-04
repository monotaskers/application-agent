# Design System Documentation

**Welcome to the Design System Documentation**

This directory contains all design documentation, brand guidelines, design principles, and design agent workflows.

---

## 📚 Documentation Structure

### Core Documents

| Document                                                           | Purpose                                                    | Status                             |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------- |
| **[`brand.md`](./brand.md)**                                       | Brand guidelines, colors, typography, spacing, components  | 🔄 Draft (needs stakeholder input) |
| **[`project.md`](./project.md)**                                   | Project-specific design requirements, personas, user flows | ✅ Complete                        |
| **[`design-principles.md`](./design-principles.md)**               | Core design philosophy and standards checklist             | ✅ Complete                        |
| **[`ocupop-design-principles.md`](./ocupop-design-principles.md)** | Ocupop agency design principles and standards              | ✅ Complete                        |
| **[`theme-controls.md`](./theme-controls.md)**                      | Theme system guide, customization, and controls           | ✅ Complete                        |
| **[`AGENTS.md`](./AGENTS.md)**                                     | Quick reference guide for design agents                    | ✅ Complete                        |

### Design Reviews

All design reviews are stored in [`reviews/`](./reviews/) and follow the naming convention:

```
YYYY-MM-DD-[feature]-[type].md
```

**Review Types:**

- `creative` - Creative direction
- `art` - Art direction
- `compliance` - Brand compliance
- `ui-analysis` - UI analysis
- `accessibility` - Accessibility review
- `brand-audit` - Brand audit
- `workflow-summary` - Complete workflow summary

**Recent Reviews:**

- [`2025-11-19-design-onboarding-review.md`](./reviews/2025-11-19-design-onboarding-review.md) - Onboarding flow specification
- [`2025-11-09-stakeholder-interview-responses.md`](./reviews/2025-11-09-stakeholder-interview-responses.md) - Brand guidelines interview
- [`2025-11-09-brand-audit.md`](./reviews/2025-11-09-brand-audit.md) - Figma design system audit
- [`2025-01-27-suppliers-index-*.md`](./reviews/) - Supplier Index feature reviews

### Templates

Templates for creating new design documents are in [`templates/`](./templates/):

- [`template_brand.md`](./templates/template_brand.md) - Brand guidelines template
- [`template_project.md`](./templates/template_project.md) - Project requirements template

---

## 🎨 Design System Overview

### Brand Identity

**Primary Colors:**

- **Purple (Iris)** `#4B4DED` - Primary brand color, CTAs, active states
- **Robin's Egg** `#ABE6E0` - Secondary brand color, links, interactive elements
- **Light Robin's Egg** - Accent color, decorative elements (use sparingly)

**Typography:**

- **Font**: Inter (Google Fonts)
- **Weights**: Medium (500), Bold (700)
- **Scale**: H2 (40px), Body (16px), Small (14px) - _Full scale needs completion_

**Spacing:**

- **Base Unit**: 8px
- **Scale**: 8, 16, 24, 32, 40, 48, 56, 64px

**Status**: See [`brand.md`](./brand.md) for complete specifications and gaps requiring stakeholder input.

### Project Requirements

**Key Design Principles:**

1. **Zero Blank Screens** - Never show empty states without guidance
2. **Front-Loaded Value** - Auto-scoring shown immediately
3. **Plain Language Over Jargon** - ~9th grade reading level
4. **Explainability Over Education** - Micro explanations, not long tutorials
5. **Partnership Tone** - Supportive, not judgmental
6. **Scoring Transparency** - Clear explanation of how scores are calculated

**Target Personas:**

- **Michael** (Procurement Strategist) - Desktop-first, wants value fast
- **Emma** (New Sustainability Lead) - Needs guidance, easily overwhelmed
- **Sarah** (Executive) - Will skip onboarding, needs quick insights
- **Alex** (Sophisticated Supplier) - Advanced user, desktop-first
- **Mom & Pop Supplier** - Basic proficiency, mobile-friendly needed

See [`project.md`](./project.md) for complete project requirements.

---

## 🤖 Design Agents

The design system includes six specialized AI agents accessible via Cursor commands:

### Quick Reference

| Agent                         | Command                     | Purpose                               |
| ----------------------------- | --------------------------- | ------------------------------------- |
| **Brand Guardian** 🛡️         | `/design.brand-guardian`    | Brand compliance validation           |
| **Creative Director** 🎨      | `/design.creative-director` | Strategic design direction            |
| **Art Director** 🖼️           | `/design.art-director`      | Visual execution details              |
| **UI Analyzer** 🔍            | `/design.ui-analyzer`       | Automated UI/UX validation            |
| **Accessibility Champion** ♿ | `/design.accessibility`     | WCAG compliance validation            |
| **Brand Auditor** 🔍          | `/design.brand-auditor`     | Extract brand from existing materials |

### Unified Workflow

Use `/design.workflow [feature-name]` to execute the complete design workflow:

1. Creative Director → Strategic approach
2. Art Director → Visual execution
3. Brand Guardian → Compliance check
4. UI Analyzer → Automated testing
5. Accessibility Champion → WCAG validation

### Common Workflows

**Starting a New Feature:**

```bash
# 1. Get strategic direction
/design.creative-director [feature name]

# 2. Define visual execution
/design.art-director [feature name]

# 3. Validate compliance
/design.brand-guardian [component/feature]
```

**Validating Existing Work:**

```bash
# Quick brand check
/design.brand-guardian [component name]

# Full validation
/design.ui-analyzer [feature name]
/design.accessibility [feature name]
```

**Complete Documentation:** See [`AGENTS.md`](./AGENTS.md) for detailed agent documentation.

**Agent Files:** Located in `.cursor/agents/design/01-06-*.md`

---

## 🚀 Quick Start Guide

### For Developers

1. **Check Brand Guidelines** - Review [`brand.md`](./brand.md) for colors, typography, spacing
2. **Review Project Requirements** - See [`project.md`](./project.md) for feature-specific requirements
3. **Understand Theme System** - See [`theme-controls.md`](./theme-controls.md) for theme customization
4. **Validate with Brand Guardian** - Run `/design.brand-guardian` before committing
5. **Check Design Reviews** - Look for existing reviews in [`reviews/`](./reviews/) for similar features

### For Designers

1. **Understand Brand** - Start with [`brand.md`](./brand.md) and [`project.md`](./project.md)
2. **Use Design Agents** - Run `/design.creative-director` for new features
3. **Follow Review Process** - Use templates in [`templates/`](./templates/) for new reviews
4. **Document Decisions** - Save all reviews in [`reviews/`](./reviews/) with proper naming

### For Product Managers

1. **Review Project Requirements** - See [`project.md`](./project.md) for personas and success metrics
2. **Check Design Reviews** - Review completed design reviews in [`reviews/`](./reviews/)
3. **Understand Design Principles** - Review [`design-principles.md`](./design-principles.md) for standards

---

## 📋 Design System Status

### ✅ Complete

- [x] Design principles documentation
- [x] Project requirements and personas
- [x] Design agent system
- [x] Onboarding flow specification
- [x] Stakeholder interview responses
- [x] Brand audit from Figma

### 🔄 In Progress / Needs Completion

- [ ] **Brand Guidelines** - Needs stakeholder input for:
  - Semantic colors (success, error, warning)
  - Complete typography scale (H1, H3-H6, captions)
  - Brand personality and tone
  - Logo guidelines
  - Component specifications
  - Neutral color palette
  - Shadow system

### 📝 Gaps Requiring Action

See [`brand.md`](./brand.md) "Gaps Requiring Stakeholder Input" section for complete list.

**Critical (Blocks Full Usage):**

1. Semantic colors
2. Complete typography scale
3. Brand personality
4. Logo guidelines

**High Priority:** 5. Component specifications 6. Neutral color palette 7. Shadow system 8. Grid system

---

## 🔗 Key Resources

### Design Files

- **Figma**: [Design System](https://www.figma.com/design/EBt7NKA0DOGf5choLHkS2s/SDG-Supplier-Assessment-Tool)
- **Design Tokens**: `src/app/globals.css` (OKLCH color system)
- **Theme System**: `src/app/theme.css` (see [`theme-controls.md`](./theme-controls.md) for details)
- **Typography**: `src/lib/font.ts`

### Code Integration

- **Component Library**: ReUI (`@reui/*` packages)
- **Styling**: Tailwind CSS v4
- **Design Tokens**: CSS variables in `globals.css`

### External References

- **Design Inspiration**: Stripe, Figma, Carbon Graph, Brightest (see [`project.md`](./project.md))
- **Standards**: WCAG 2.1 Level AA (minimum), SASB, ISSB, GHG Protocol

---

## 📖 Documentation Standards

### Naming Conventions

**Design Reviews:**

```
YYYY-MM-DD-[feature]-[type].md
```

**Examples:**

- `2025-11-19-onboarding-review.md`
- `2025-01-27-suppliers-index-creative.md`
- `2025-01-27-suppliers-index-accessibility.md`

### File Organization

- **Core Docs**: Root of `docs/design/`
- **Reviews**: `docs/design/reviews/`
- **Templates**: `docs/design/templates/`
- **Agent Files**: `.cursor/agents/design/`

### Version Control

- All design documents should be versioned
- Include "Last Updated" date in documents
- Document rationale for major changes

---

## 🎯 Design Principles Summary

### Core Philosophy

1. **Users First** - Prioritize user needs, workflows, and ease of use
2. **Simplicity & Clarity** - Clean, uncluttered interface with unambiguous labels
3. **Focus & Efficiency** - Help users achieve goals quickly with minimal friction
4. **Consistency** - Uniform design language across entire application
5. **Accessibility** - WCAG 2.1 Level AA minimum, inclusive by default
6. **Performance** - Fast load times and snappy interactions

### Project-Specific Principles

1. **Zero Blank Screens** - Never show empty states without guidance
2. **Front-Loaded Value** - Show auto-scoring immediately
3. **Plain Language** - ~9th grade reading level, avoid jargon
4. **Partnership Tone** - Supportive, not judgmental
5. **Scoring Transparency** - Clear explanation of calculations

See [`design-principles.md`](./design-principles.md) and [`project.md`](./project.md) for complete details.

---

## 🤝 Contributing

### Adding New Design Reviews

1. Use templates from [`templates/`](./templates/)
2. Follow naming convention: `YYYY-MM-DD-[feature]-[type].md`
3. Save in [`reviews/`](./reviews/)
4. Reference relevant core documents (brand.md, project.md, principles.md)

### Updating Brand Guidelines

1. Propose change in design review meeting
2. Document rationale for change
3. Update `brand.md` with new version number
4. Update design tokens in code (`src/app/globals.css`)
5. Communicate changes to team

### Using Design Agents

1. Review [`AGENTS.md`](./AGENTS.md) for agent capabilities
2. Use appropriate agent command for your task
3. Review generated output in [`reviews/`](./reviews/)
4. Iterate based on agent feedback

---

## 📞 Getting Help

### Documentation

- **Full Agent Guide**: [`AGENTS.md`](./AGENTS.md)
- **Brand Guidelines**: [`brand.md`](./brand.md)
- **Project Requirements**: [`project.md`](./project.md)
- **Design Principles**: [`design-principles.md`](./design-principles.md)
- **Theme Controls**: [`theme-controls.md`](./theme-controls.md)

### Design Reviews

Browse [`reviews/`](./reviews/) for examples of:

- Creative direction documents
- Art direction specifications
- Brand compliance reports
- UI analysis reports
- Accessibility reviews

### Agent Details

See individual agent files in `.cursor/agents/design/`:

- `01-brand-guardian.md`
- `02-creative-director.md`
- `03-art-director.md`
- `04-ui-analyzer.md`
- `05-accessibility-champion.md`
- `06-brand-auditor.md`

---

## 🔄 Maintenance

### Regular Reviews

- **Brand Guidelines**: Review quarterly or as needed
- **Design Reviews**: Archive old reviews, keep active ones accessible
- **Agent System**: Update agent files as capabilities evolve

### Keeping Current

- Update "Last Updated" dates when making changes
- Version documents for major updates
- Document rationale for significant changes
- Keep design reviews organized by date

---

_This README provides an overview of the design system. For specific details, refer to the individual documents referenced above._

**Last Updated**: 2025-01-27  
**Version**: 1.1
