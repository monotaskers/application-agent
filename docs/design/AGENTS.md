# Design Agents Quick Reference

Quick reference guide for the design agent system in Cursor.

## Available Agents

### 01. Brand Guardian 🛡️

**Command**: `/design.brand-guardian`  
**Role**: Brand compliance enforcer with autonomous validation  
**When to Use**:

- Before committing brand-related code
- When implementing new components
- To validate against brand guidelines

**Output**: Compliance report in `docs/design/reviews/YYYY-MM-DD-[feature]-compliance.md`

---

### 02. Creative Director 🎨

**Command**: `/design.creative-director`  
**Role**: Strategic design decisions and concept validation  
**When to Use**:

- At the start of a new feature
- When making high-level design decisions
- To define design approach and user experience priorities

**Output**: Creative direction document in `docs/design/reviews/YYYY-MM-DD-[feature]-creative.md`

---

### 03. Art Director 🖼️

**Command**: `/design.art-director`  
**Role**: Visual harmony and aesthetic execution  
**When to Use**:

- After creative direction is defined
- To specify visual details and component aesthetics
- To define motion and interaction patterns

**Output**: Art direction document in `docs/design/reviews/YYYY-MM-DD-[feature]-art.md`

---

### 04. UI Analyzer 🔍

**Command**: `/design.ui-analyzer`  
**Role**: Automated UI/UX validation with Playwright  
**When to Use**:

- After implementation is complete
- To validate brand compliance technically
- To check component consistency and responsive behavior

**Output**: UI analysis report in `docs/design/reviews/YYYY-MM-DD-[feature]-ui-analysis.md`

---

### 05. Accessibility Champion ♿

**Command**: `/design.accessibility`  
**Role**: Inclusive design and WCAG compliance  
**When to Use**:

- Before shipping any feature
- To validate WCAG 2.1 Level AA compliance
- To ensure inclusive design patterns

**Output**: Accessibility review in `docs/design/reviews/YYYY-MM-DD-[feature]-accessibility.md`

---

### 06. Brand Auditor 🔍

**Command**: `/design.brand-auditor`  
**Role**: Extract brand guidelines from existing work  
**When to Use**:

- When starting a new project with existing materials
- To extract colors, typography, and spacing from websites/code
- To generate initial brand.md from templates

**Output**: Brand audit report and generated `docs/design/brand.md`

---

## Unified Workflow

### `/design.workflow [feature-name]`

Executes the complete design workflow in sequence:

1. **Creative Director** → Strategic approach
2. **Art Director** → Visual execution
3. **Brand Guardian** → Compliance check
4. **UI Analyzer** → Automated testing
5. **Accessibility Champion** → WCAG validation

**Example**:

```bash
/design.workflow user dashboard
```

---

## Agent Hierarchy

```
Level 0: Brand Auditor (builds foundation)
    ↓
Level 1: Brand Guardian (veto power)
    ↓
Level 2: Creative Director (strategic)
    ↓
Level 3: Art Director (execution)
    ↓
Level 4: UI Analyzer (validation)
    ↓
Level 5: Accessibility Champion (non-negotiable)
```

---

## Common Workflows

### Starting a New Feature

```bash
# 1. Get strategic direction
/design.creative-director [feature name]

# 2. Define visual execution
/design.art-director [feature name]

# 3. Validate compliance
/design.brand-guardian [component/feature]
```

### Validating Existing Work

```bash
# Quick brand check
/design.brand-guardian [component name]

# Full validation
/design.ui-analyzer [feature name]
/design.accessibility [feature name]
```

### Extracting Brand Guidelines

```bash
# Analyze existing materials
/design.brand-auditor [URLs or file paths]
```

---

## File Locations

- **Agent Files**: `.cursor/agents/design/01-06-*.md`
- **Commands**: `.cursor/commands/design.*.md`
- **Design Reviews**: `docs/design/reviews/`
- **Brand Guidelines**: `docs/design/brand.md`
- **Design Principles**: `docs/design/principles.md`
- **Project Requirements**: `docs/design/project.md`

---

## Design Review Naming

All reviews follow this pattern:

```
YYYY-MM-DD-[feature]-[type].md
```

**Types**:

- `creative` - Creative direction
- `art` - Art direction
- `compliance` - Brand compliance
- `ui-analysis` - UI analysis
- `accessibility` - Accessibility review
- `brand-audit` - Brand audit

**Example**: `2025-01-15-user-dashboard-creative.md`

---

## Integration with Design System

All agents reference:

- `docs/design/principles.md` - Core design standards
- `docs/design/brand.md` - Brand guidelines
- `docs/design/project.md` - Project requirements

Agents validate against:

- Color palette from brand.md
- Typography system from brand.md
- Spacing system (base unit multiples)
- Component patterns
- Accessibility standards

---

## Quick Tips

1. **Start with Creative Director** for new features
2. **Use Brand Guardian** frequently during development
3. **Run Accessibility Champion** before any merge
4. **Reference previous reviews** when working on related features
5. **Use workflow command** for complete end-to-end process

---

## Getting Help

- **Full Documentation**: `docs/design/CLAUDE.md`
- **Agent Details**: `.cursor/agents/design/[agent-name].md`
- **Review Examples**: `docs/design/reviews/`

---

_Last updated: January 2025_
