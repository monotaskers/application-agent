
# Implementation Plan: Remove Sentry Logging

**Branch**: `004-remove-sentry` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-remove-sentry/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Remove all Sentry error tracking and monitoring integration from the Next.js application. Replace Sentry's error and performance logging with console output using a standard format (timestamp, level, message). This is a permanent removal with all Sentry-related code, dependencies, and configuration being deleted.

## Technical Context
**Language/Version**: TypeScript 5.x / Node.js 20.x
**Primary Dependencies**: Next.js 15, React 19, @sentry/nextjs (to be removed)
**Storage**: N/A (no data storage changes)
**Testing**: Vitest, React Testing Library
**Target Platform**: Web application (Node.js server + browser)
**Project Type**: web - Next.js application with App Router
**Performance Goals**: Maintain existing performance, console logging should not add significant overhead
**Constraints**: Console output must be structured (timestamp, level, message), no external monitoring services
**Scale/Scope**: Complete removal of Sentry from entire application codebase

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Simplicity (KISS)**: Removing complex external dependency (Sentry) and replacing with simple console logging
- ✅ **YAGNI**: Removing monitoring that's not currently needed per user requirement
- ✅ **Test-First (TDD)**: Tests will be written to verify Sentry removal doesn't break error handling
- ✅ **Type Safety**: Console logger will maintain TypeScript types for log levels and formatting
- ✅ **Vertical Slice**: Changes will be feature-focused (error handling feature)
- ✅ **Fail Fast**: Error handling will continue to fail fast with console output
- ✅ **Package Manager**: Will use `pnpm remove` to uninstall Sentry packages

**Verdict**: ✅ PASS - This removal aligns with all constitutional principles by simplifying the codebase

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/                     # Next.js App Router
│   ├── global-error.tsx     # Global error boundary (uses Sentry)
│   └── dashboard/
│       └── overview/
│           └── @bar_stats/
│               └── error.tsx # Error boundary (uses Sentry)
├── components/              # Shared components
├── lib/                     # Utilities and shared logic
│   └── logger.ts           # NEW: Console logger utility
├── instrumentation.ts      # Server instrumentation (uses Sentry)
└── instrumentation-client.ts # Client instrumentation (uses Sentry)

# Root configuration files
├── sentry.server.config.ts  # Sentry server config (to be removed)
├── sentry.edge.config.ts    # Sentry edge config (to be removed)
├── next.config.ts           # Next.js config (contains Sentry plugin)
└── package.json             # Dependencies (contains @sentry/nextjs)
```

**Structure Decision**: Next.js web application with App Router. Sentry is integrated at multiple levels - configuration files, instrumentation, error boundaries, and Next.js configuration.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Logger utility creation tasks (types, implementation, tests) [P]
- Sentry removal tasks for each integration point
- Configuration cleanup tasks [P]
- Verification tasks from quickstart scenarios

**Ordering Strategy**:
- TDD order: Logger tests before implementation
- Dependency order: Create logger before removing Sentry
- Remove Sentry config last to prevent build errors
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**Key Task Categories**:
1. Create console logger utility (3-4 tasks)
2. Remove Sentry from error boundaries (2-3 tasks)
3. Remove Sentry instrumentation (2 tasks)
4. Remove Sentry configuration files (3-4 tasks)
5. Update Next.js config (1 task)
6. Remove Sentry dependencies (1 task)
7. Verification and testing (3-4 tasks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No violations - feature aligns with all constitutional principles*

This feature actually reduces complexity by:
- Removing external dependency (Sentry SDK)
- Simplifying error handling to console output
- Reducing configuration surface area
- Eliminating network calls for error reporting


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
