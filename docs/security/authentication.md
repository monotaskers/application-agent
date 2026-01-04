---
title: "Authentication and Authorization"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/"
  - "src/utils/supabase/middleware.ts"
  - "src/middleware.ts"
  - "src/lib/auth/permissions.ts"
---

# Authentication and Authorization

## Overview

The application uses Supabase Auth for authentication and implements a permission-based authorization system. All protected routes require authentication, and operations check permissions before execution.

## Authentication

### Supabase Auth

**Location**: `src/utils/supabase/`, `src/lib/auth/`

The application uses Supabase Auth with JWT tokens for authentication:

- **Passwordless Authentication**: Magic links and OTP (One-Time Password)
- **Session Management**: Secure cookies with automatic refresh
- **Token Storage**: Secure HTTP-only cookies (managed by Supabase)

### Authentication Flow

1. **User Signs In**: User requests magic link or OTP
2. **Email/OTP Sent**: Supabase sends authentication email/OTP
3. **User Verifies**: User clicks link or enters OTP
4. **Session Created**: Supabase creates session with JWT token
5. **Cookies Set**: Secure cookies set for session management
6. **Middleware Validates**: Middleware validates session on each request

### Middleware Protection

**Location**: `src/middleware.ts`, `src/utils/supabase/middleware.ts`

Middleware automatically protects routes and refreshes sessions:

```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

**Protected Routes**:
- `/admin/*` - Requires authentication
- `/superadmin/*` - Requires authentication

**Unprotected Routes**:
- `/auth/*` - Authentication pages
- Public pages (if any)

### API Route Authentication

**Location**: `src/lib/auth/gateways/api.ts`

API routes use authentication wrappers:

#### withAuth

Requires authentication for route access:

```typescript
import { withAuth } from "@/lib/auth/gateways/api";

export const GET = withAuth(async (request, { user, role }) => {
  // User is authenticated
  return NextResponse.json({ userId: user.id });
});
```

#### withRole

Requires specific role:

```typescript
import { withRole } from "@/lib/auth/gateways/api";

export const GET = withRole("admin", async (request, { user, role }) => {
  // User has admin role
  return NextResponse.json({ adminData: "..." });
});
```

#### withPermission

Requires specific permission:

```typescript
import { withPermission } from "@/lib/auth/gateways/api";
import { PERMISSIONS } from "@/lib/auth/permissions";

export const DELETE = withPermission(
  PERMISSIONS.users.delete,
  async (request, { user, role }) => {
    // User has delete permission
    // Delete user
  }
);
```

### Server Component Authentication

**Location**: `src/lib/auth/gateways/server.ts`

Server components check authentication and permissions:

```typescript
import { requireAuth, requirePermission } from "@/lib/auth/gateways/server";
import { PERMISSIONS } from "@/lib/auth/permissions";

export default async function Page(): Promise<ReactElement> {
  // Require authentication
  const { user } = await requireAuth();
  
  // Check permission
  await requirePermission(PERMISSIONS.users.view);
  
  // Render page
}
```

## Authorization

### Permission-Based Access Control (RBAC)

**Location**: `src/lib/auth/permissions.ts`, `src/lib/auth/permission-checker.ts`

The application uses a permission-based authorization system:

- **Roles**: member, admin, superadmin (hierarchical)
- **Permissions**: Granular permissions for specific operations
- **Custom Roles**: Support for custom roles with specific permissions

### Role Hierarchy

```
superadmin > admin > member
```

- **member**: Basic user permissions
- **admin**: Administrative permissions for their company
- **superadmin**: Full system access

### Permission System

Permissions are defined in `src/lib/auth/permissions.ts`:

```typescript
export const PERMISSIONS = {
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  companies: {
    view: "companies.view",
    create: "companies.create",
    update: "companies.update",
    delete: "companies.delete",
  },
  // ... more permissions
} as const;
```

### Permission Checking

#### Server-Side Permission Check

```typescript
import { hasPermission } from "@/lib/auth/permission-checker";
import { PERMISSIONS } from "@/lib/auth/permissions";

const canEdit = await hasPermission(user, PERMISSIONS.companies.edit);
if (canEdit) {
  // Allow edit operation
}
```

#### Client-Side Permission Check

```typescript
import { usePermission } from "@/lib/auth/gateways/components";
import { PERMISSIONS } from "@/lib/auth/permissions";

function MyComponent(): ReactElement {
  const canDelete = usePermission(PERMISSIONS.users.delete);
  
  return (
    <>
      {canDelete && <DeleteButton />}
    </>
  );
}
```

### Row Level Security (RLS)

Database tables use Row Level Security policies to enforce access control at the database level:

- Users can only access data they're authorized to see
- Policies check user roles and permissions
- Prevents unauthorized data access even if application logic fails

## Security Measures

### Session Security

- **Secure Cookies**: HTTP-only, secure, same-site cookies
- **Token Refresh**: Automatic token refresh before expiration
- **Session Validation**: Every request validates session

### Passwordless Authentication

- **Magic Links**: Time-limited, single-use links
- **OTP**: One-time passwords with expiration
- **No Password Storage**: No passwords stored in database

### Token Security

- **JWT Tokens**: Signed tokens with expiration
- **Token Validation**: Server validates token on each request
- **Token Refresh**: Automatic refresh before expiration

## Error Handling

### Authentication Errors

```typescript
// Unauthenticated
{
  error: "UNAUTHORIZED",
  message: "Authentication required",
  status: 401
}

// Insufficient permissions
{
  error: "FORBIDDEN",
  message: "Permission 'users.delete' required",
  status: 403
}
```

### Redirect on Authentication Failure

Middleware redirects unauthenticated users to sign-in:

```typescript
if (!user && isProtectedRoute) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/sign-in";
  return NextResponse.redirect(url);
}
```

## Best Practices

1. **Always check authentication** - Verify user is authenticated before operations
2. **Check permissions** - Verify user has permission for specific operations
3. **Fail securely** - Default to denying access on errors
4. **Use server-side checks** - Client-side checks are for UX, server-side is for security
5. **Validate tokens** - Always validate JWT tokens server-side
6. **Use RLS policies** - Database-level security as final layer
7. **Log authentication events** - Log authentication failures for security monitoring

## Security Considerations

### Session Hijacking Prevention

- Secure, HTTP-only cookies prevent JavaScript access
- SameSite cookie attribute prevents CSRF
- Token expiration limits exposure window

### Token Theft Prevention

- Tokens stored in secure cookies (not localStorage)
- HTTPS required for all communications
- Token validation on every request

### Brute Force Prevention

- Rate limiting on authentication endpoints (Supabase handles)
- OTP expiration limits
- Magic link expiration limits

## Related Documentation

- [Security Overview](./overview.md) - Overall security strategy
- [Input Validation](./input-validation.md) - Authentication input validation
- [Data Protection](./data-protection.md) - Secure data handling
- [Authentication Pattern](../../patterns/authentication-authorization.md) - Authentication patterns
