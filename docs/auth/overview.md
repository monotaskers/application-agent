---
title: "Authentication System Overview"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/auth/"
  - "src/features/auth/"
  - "src/middleware.ts"
  - "src/utils/supabase/middleware.ts"
  - "src/app/auth/callback/route.ts"
---

# Authentication System Overview

## Overview

The SDG Application uses **Supabase Auth** as the authentication provider, implementing a comprehensive authentication and authorization system. The system supports multiple authentication methods, automatic session management, and a fine-grained permission-based authorization system.

## Architecture

The authentication system follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Client Components               │
│  (useAuth, useHasPermission hooks)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Server Components & API Routes      │
│  (requireAuth, requirePermission)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Middleware Layer                 │
│  (Session refresh, route protection)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Supabase Auth                    │
│  (JWT tokens, session management)       │
└─────────────────────────────────────────┘
```

### Key Components

1. **Authentication Gateways** (`src/lib/auth/gateways/`)
   - **Server Gateway**: Server-side authentication and authorization
   - **Client Gateway**: Client-side hooks for authentication state
   - **API Gateway**: Wrappers for API route protection

2. **Permission System** (`src/lib/auth/permissions.ts`)
   - Permission registry and definitions
   - Role-based default permissions
   - Custom role support

3. **Session Management** (`src/middleware.ts`, `src/utils/supabase/middleware.ts`)
   - Automatic token refresh
   - Cookie synchronization
   - Route protection

4. **Profile Management** (`src/lib/auth/profile.ts`)
   - Automatic profile creation on sign-up
   - Profile update functionality

## Authentication Methods

The system supports multiple authentication methods:

### 1. Magic Link (Passwordless)

Users can sign in using a magic link sent to their email address. This is a passwordless authentication method.

**Flow:**
1. User enters email address
2. System sends magic link email
3. User clicks link in email
4. System verifies token and creates session
5. User is redirected to dashboard

**Implementation:**
- Component: `src/features/auth/components/passwordless-auth-form.tsx`
- Uses Supabase `signInWithOtp()` method
- Supports automatic user creation

### 2. OAuth Providers

The system supports OAuth authentication through Supabase Auth.

**Supported Providers:**
- **Google OAuth**: Sign in with Google account

**Flow:**
1. User clicks OAuth provider button
2. Redirected to provider's authentication page
3. User authorizes application
4. Provider redirects back with authorization code
5. System exchanges code for session
6. User is redirected to dashboard

**Implementation:**
- Component: `src/features/auth/components/google-oauth-button.tsx`
- Uses Supabase `signInWithOAuth()` method
- Callback handled in `src/app/auth/callback/route.ts`

### 3. Email/Password (Future)

Email/password authentication can be added by implementing the standard Supabase email/password flow.

## Session Management

### Token-Based Sessions

Sessions are managed using JWT tokens:

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for refreshing access tokens
- **Storage**: HTTP-only cookies (secure, not accessible via JavaScript)

### Automatic Token Refresh

The Next.js middleware automatically refreshes expired tokens:

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

The middleware:
- Refreshes expired access tokens using refresh tokens
- Syncs session cookies between requests
- Protects routes requiring authentication
- Redirects unauthenticated users to sign-in

### Session Lifecycle

1. **Sign In**: User authenticates, session created
2. **Token Refresh**: Middleware refreshes tokens automatically
3. **Sign Out**: Session destroyed, cookies cleared
4. **Expiration**: Tokens expire, user must sign in again

## User Profile Management

### Automatic Profile Creation

When a user signs up (via Magic Link or OAuth), a profile is automatically created:

```typescript
// src/app/auth/callback/route.ts
if (user) {
  // Check if profile exists
  const { error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist, create it
  if (profileError && profileError.code === "PGRST116") {
    await createProfile({
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    });
  }
}
```

### Profile Structure

User profiles contain:
- `id`: User ID (matches Supabase Auth user ID)
- `full_name`: User's full name
- `avatar_url`: URL to user's avatar image

## Role System

### System Roles

Users are assigned one of three system roles:

1. **member**: Basic user with limited permissions
2. **admin**: Administrative user with expanded permissions
3. **superadmin**: Full access to all features

### Role Assignment

- **Default Role**: New users are assigned `member` role by default
- **Role Storage**: Roles stored in `app_metadata.role` (not user-editable)
- **Role Updates**: Only superadmins can update user roles

### Custom Roles

In addition to system roles, users can be assigned custom roles:

- **Custom Role Permissions**: Override system role permissions
- **Flexible Permissions**: Fine-grained permission control
- **Management**: Superadmins can create and assign custom roles

See [Permission System Documentation](./permissions.md) for details.

## Security Considerations

### Token Security

- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- **Secure Cookies**: Cookies marked as secure in production
- **Same-Site Policy**: CSRF protection via SameSite cookie attribute
- **Token Expiration**: Short-lived access tokens, long-lived refresh tokens

### Route Protection

- **Middleware Protection**: Routes protected at middleware level
- **API Route Protection**: API routes use authentication wrappers
- **Server Component Protection**: Server components check authentication
- **Client Component Protection**: Client components use hooks for conditional rendering

### Input Validation

- **Zod Schemas**: All authentication inputs validated with Zod
- **Email Validation**: Email addresses validated before sending magic links
- **Error Handling**: User-friendly error messages without exposing system details

## Configuration

### Environment Variables

Required environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

### Supabase Configuration

OAuth providers must be configured in Supabase Dashboard:

1. Navigate to Authentication > Providers
2. Enable desired providers (Google, etc.)
3. Configure OAuth credentials
4. Set redirect URLs

## Related Documentation

- [Authentication Flows](./flows.md) - Detailed authentication flow documentation
- [Permission System](./permissions.md) - Permission system and authorization
- [Authorization Patterns](./authorization.md) - Authorization implementation patterns
- [Auth Providers](./providers.md) - Provider configuration and setup
- [Authentication & Authorization Pattern](../patterns/authentication-authorization.md) - Implementation patterns

## Code References

- **Auth Gateways**: `src/lib/auth/gateways/`
- **Permission System**: `src/lib/auth/permissions.ts`
- **Role Management**: `src/lib/auth/roles.ts`
- **Profile Management**: `src/lib/auth/profile.ts`
- **Middleware**: `src/middleware.ts`, `src/utils/supabase/middleware.ts`
- **Auth Callback**: `src/app/auth/callback/route.ts`
- **Auth Components**: `src/features/auth/components/`
