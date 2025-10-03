<!--
Sync Impact Report - Constitution Update
========================================
Version change: [Initial] → 1.0.0
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (7 principles)
  - Development Standards
  - Quality Gates
  - Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check references validated
  ✅ spec-template.md - Requirements alignment confirmed
  ✅ tasks-template.md - Task categorization principles aligned
Follow-up TODOs: None
-->

# Application Agent Constitution

## Core Principles

### I. Simplicity First (KISS)
Design simplicity is a non-negotiable foundation. Choose straightforward solutions over complex ones in all cases. Simple solutions are easier to understand, maintain, and debug. Complexity must be explicitly justified in the Complexity Tracking section of any plan that introduces it.

**Rationale**: Complex solutions increase maintenance burden, onboarding time, and bug surface area. Simple code compounds value over time.

### II. YAGNI (You Aren't Gonna Need It)
Build functionality only when explicitly required, never on speculation. Features must be driven by current user needs documented in feature specifications, not anticipated future requirements.

**Rationale**: Speculative features create maintenance debt, increase complexity, and often solve non-existent problems. They violate the fail-fast principle by delaying validation.

### III. Test-First Development (NON-NEGOTIABLE)
Test-Driven Development (TDD) is mandatory for all features:
- Tests MUST be written before implementation
- Tests MUST fail before implementation begins
- Red-Green-Refactor cycle MUST be strictly followed
- Minimum 80% code coverage required with NO EXCEPTIONS

**Rationale**: TDD ensures testable design, documents intent, catches regressions early, and validates that requirements are implementable before writing production code.

### IV. Type Safety & Validation
Strict TypeScript enforcement and comprehensive validation are mandatory:
- ZERO use of `any` type (use `unknown` if type truly unknown)
- ALL external data MUST be validated with Zod schemas
- Explicit return types required for all functions and components
- `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` MUST be enabled
- NEVER use `@ts-ignore` or `@ts-expect-error` - fix type issues properly
- MUST use `ReactElement` instead of `JSX.Element` for React 19 compatibility

**Rationale**: Type safety prevents entire classes of runtime errors. Validation at boundaries ensures data integrity and fail-fast behavior.

### V. Vertical Slice Architecture
Organize code by features, not layers. Each feature should be self-contained with co-located tests, components, hooks, and business logic. Shared components live in `/components/`, feature-specific code in `/features/[feature]/`.

**Rationale**: Feature-based organization improves discoverability, reduces coupling, and makes it easier to understand the full scope of a feature's implementation.

### VI. Fail Fast Principle
Validate inputs early and throw errors immediately at system boundaries:
- Validate API inputs with Zod before processing
- Check environment variables at startup, not runtime
- Use branded types for domain-specific values (e.g., UserIds)
- Return explicit error states, never silently fail

**Rationale**: Early failure detection reduces debugging time, prevents cascading failures, and makes error states explicit and handleable.

### VII. Package Manager Discipline
MUST use `pnpm` exclusively for all package management operations. NEVER use `npm` or `yarn`. This applies to all install, run, add, and remove commands. If `pnpm-lock.yaml` exists, NEVER create `package-lock.json` or `yarn.lock`.

**Rationale**: Consistent package manager usage prevents lock file conflicts, ensures reproducible builds, and maintains workspace integrity.

## Development Standards

### Code Organization
- **MAXIMUM 500 lines per file** - refactor if larger
- **MAXIMUM 200 lines per component** - split into smaller components
- **MAXIMUM 50 lines per function** - extract helper functions
- **Co-locate tests** in `__tests__/` folders next to implementation
- **Vertical slices** for features: `/features/[feature]/{components,hooks,api,schemas,types,__tests__}`

### Documentation Requirements
- **ALL exported functions and components MUST have JSDoc** with description, parameters, return types, and usage examples
- **Complex algorithms MUST have inline comments** explaining the approach
- **File-level JSDoc required** for non-trivial modules (`@fileoverview`, `@module`)
- **Type definitions MUST include descriptions** for non-obvious properties

### State Management Hierarchy (STRICT)
1. **Local State**: `useState` ONLY for component-specific state
2. **Context**: For cross-component state within a single feature
3. **URL State**: MUST use search params for shareable/bookmarkable state
4. **Server State**: MUST use TanStack Query for ALL API data fetching
5. **Global State**: Zustand ONLY when truly needed app-wide (requires justification)

### Security Requirements (MANDATORY)
- **MUST sanitize ALL user inputs** with Zod before processing
- **MUST validate file uploads**: type, size, and content
- **MUST prevent XSS** with proper escaping (NEVER use `dangerouslySetInnerHTML` without sanitization)
- **MUST implement CSRF protection** for forms
- **MUST validate environment variables** with Zod at startup
- **NEVER store sensitive data** in localStorage or client state

## Quality Gates

### Pre-Commit Checklist (ALL REQUIRED)
- [ ] TypeScript compiles with ZERO errors (`pnpm run type-check`)
- [ ] Tests written and passing with 80%+ coverage (`pnpm run test:coverage`)
- [ ] ESLint passes with ZERO warnings (`pnpm run lint`)
- [ ] Prettier formatting applied (`pnpm run format`)
- [ ] All components have complete JSDoc documentation
- [ ] Zod schemas validate ALL external data
- [ ] ALL states handled (loading, error, empty, success)
- [ ] Error boundaries implemented for features
- [ ] Accessibility requirements met (ARIA labels, keyboard nav)
- [ ] No `console.log` statements in production code
- [ ] Component files under 200 lines
- [ ] No prop drilling beyond 2 levels

### Constitution Compliance Checks
All implementation plans MUST include a Constitution Check section that validates:
1. **Simplicity**: Are we using the simplest approach that could work?
2. **YAGNI**: Are we building only what's needed now?
3. **TDD**: Are tests written before implementation?
4. **Type Safety**: Are we avoiding `any` and validating external data?
5. **Architecture**: Does the feature follow vertical slice patterns?
6. **File Size**: Will any file exceed 500 lines? (If yes, justify)
7. **Package Manager**: Are we using `pnpm` exclusively?

Any violations MUST be documented in the Complexity Tracking section with explicit justification or the approach must be simplified.

## Governance

### Amendment Procedure
1. **Proposal**: Document proposed change with rationale and impact analysis
2. **Review**: Evaluate impact on existing templates and features
3. **Approval**: Requires explicit sign-off from project maintainers
4. **Migration**: Update dependent templates, re-validate existing features
5. **Versioning**: Increment version following semantic versioning rules

### Versioning Policy
Constitution version follows `MAJOR.MINOR.PATCH` format:
- **MAJOR**: Backward incompatible governance changes or principle removals/redefinitions
- **MINOR**: New principles added or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance Enforcement
- **ALL implementation plans** (`plan.md`) MUST verify constitutional compliance
- **Pre-commit gates** enforce automated quality standards
- **Code reviews** MUST check for principle violations
- **Complexity deviations** require documented justification or rejection
- Runtime development guidance is provided in [CLAUDE.md](../../CLAUDE.md) for agent-specific implementation details

### Hierarchy of Authority
1. **Constitution** (this document) - Non-negotiable principles and governance
2. **Templates** (`.specify/templates/`) - Structured workflows implementing constitutional principles
3. **Agent Guidance** (`CLAUDE.md`) - Technology-specific implementation patterns
4. **Feature Specs** - User requirements constrained by constitutional principles

When conflicts arise, higher-level documents take precedence.

**Version**: 1.0.0 | **Ratified**: 2025-10-03 | **Last Amended**: 2025-10-03
