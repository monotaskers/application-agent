---
description: Update authentication and authorization documentation
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty). If a specific authentication component is provided (e.g., "permissions", "flows"), focus on that area.

## Instructions

1. **Scan Authentication Code**
   - Scan `src/lib/auth/` for authentication utilities and gateways
   - Scan `src/features/auth/` for authentication features
   - Scan `src/middleware.ts` and `src/utils/supabase/middleware.ts` for auth middleware
   - Scan `src/lib/auth/permissions.ts` for permission definitions
   - Scan `src/lib/auth/permission-checker.ts` for permission checking logic
   - Identify authentication flows (OAuth, Magic Link, email/password, etc.)
   - Identify authorization patterns (role-based, permission-based)

2. **Analyze Authentication Patterns**
   - Extract authentication methods and providers
   - Extract permission system structure
   - Extract authorization patterns (API routes, server components, client components)
   - Extract authentication flows and user journeys
   - Extract session management patterns
   - Extract token handling and refresh logic

3. **Update Documentation Files**
   - Create or update `docs/auth/overview.md` - Authentication system overview
   - Create or update `docs/auth/flows.md` - Authentication flows documentation
   - Create or update `docs/auth/permissions.md` - Permission system documentation
   - Create or update `docs/auth/authorization.md` - Authorization patterns
   - Create or update `docs/auth/providers.md` - Auth provider configuration
   - Update `docs/patterns/authentication-authorization.md` - Pattern documentation
   - Document new authentication methods or providers
   - Document permission changes and new permissions

4. **Documentation Format**
   - Include authentication flow diagrams (Mermaid)
   - Include code examples for each authentication method
   - Include permission structure and hierarchy
   - Include authorization patterns for different contexts
   - Include configuration examples
   - Include security considerations

5. **Check for Missing Documentation**
   - Identify authentication features without documentation
   - Flag incomplete authentication documentation
   - Check for outdated authentication flows
   - Verify permission documentation matches code

## Output Format

Provide a summary including:

- Authentication components scanned
- Documentation files updated
- Documentation files created
- Missing documentation identified
- Files created/updated with paths

## Key Rules

- Document all authentication methods and providers
- Include permission system structure and hierarchy
- Document authorization patterns for API routes, server components, and client components
- Include security considerations for authentication
- Use Mermaid diagrams for authentication flows
- Reference related code files in frontmatter
- Update last_updated date in frontmatter
- Cross-reference security documentation

## Authentication Documentation Standards

### Authentication Overview Template

```markdown
---
title: "Authentication System Overview"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/"
  - "src/features/auth/"
  - "src/middleware.ts"
---

# Authentication System Overview

## Overview

Brief description of the authentication system

## Architecture

High-level architecture diagram

## Authentication Methods

- OAuth providers
- Magic Link
- Email/Password
- etc.

## Session Management

How sessions are managed

## Security Considerations

Security measures for authentication
```

### Authentication Flow Template

```markdown
---
title: "{Flow Name} Authentication Flow"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/flows/{flow-name}.ts"
---

# {Flow Name} Authentication Flow

## Overview

Description of the authentication flow

## Flow Diagram

Mermaid sequence diagram

## Step-by-Step Flow

1. User initiates flow
2. Authentication request
3. Provider callback
4. Session creation
5. Token handling

## Configuration

Required configuration

## Error Handling

How errors are handled

## Security Considerations

Security measures for this flow
```

### Permission System Documentation Template

```markdown
---
title: "Permission System"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/permissions.ts"
  - "src/lib/auth/permission-checker.ts"
---

# Permission System

## Overview

Description of the permission system

## Permission Structure

Hierarchical permission structure

## Permission Matching

Wildcard matching rules

## Permission Resolution

How permissions are resolved (system roles, custom roles)

## Usage Examples

Code examples for permission checking
```
