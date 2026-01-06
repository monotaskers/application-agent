---
title: "Auth Provider Configuration"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/features/auth/components/google-oauth-button.tsx"
  - "src/app/auth/callback/route.ts"
  - "supabase/config.toml"
---

# Auth Provider Configuration

## Overview

The SDG Application uses **Supabase Auth** as the authentication provider. This document describes how to configure authentication providers, including OAuth providers and email-based authentication.

## Supabase Auth

Supabase Auth provides:
- Email/password authentication
- Magic Link (passwordless) authentication
- OAuth providers (Google, GitHub, etc.)
- JWT token-based sessions
- Automatic token refresh

## Provider Configuration

### Environment Variables

Required environment variables for Supabase Auth:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

### Supabase Dashboard Configuration

Authentication providers are configured in the Supabase Dashboard:

1. Navigate to **Authentication > Providers**
2. Enable desired providers
3. Configure provider-specific settings
4. Set redirect URLs

## Magic Link (Passwordless)

Magic Link authentication requires no additional configuration beyond Supabase setup.

### Configuration

No additional configuration required. Supabase handles:
- Email sending
- Token generation
- Token validation

### Email Templates

Email templates can be customized in Supabase Dashboard:
- Navigate to **Authentication > Email Templates**
- Customize Magic Link email template

### Implementation

Magic Link is implemented in:
- Component: `src/features/auth/components/passwordless-auth-form.tsx`
- Uses: `supabase.auth.signInWithOtp()`

## Google OAuth

Google OAuth allows users to sign in with their Google account.

### Prerequisites

1. Google Cloud Project
2. OAuth 2.0 credentials (Client ID and Client Secret)
3. Authorized redirect URIs configured

### Google Cloud Console Setup

1. **Create OAuth 2.0 Credentials**
   - Navigate to Google Cloud Console
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth client ID**
   - Select **Web application**
   - Configure authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
     - `https://your-domain.com/auth/callback` (if using custom domain)

2. **Enable Required APIs**
   - Ensure Google+ API is enabled (if required)
   - OAuth consent screen configured

3. **Get Credentials**
   - Copy Client ID
   - Copy Client Secret

### Supabase Configuration

1. **Enable Google Provider**
   - Navigate to Supabase Dashboard
   - Go to **Authentication > Providers**
   - Enable **Google** provider

2. **Configure Credentials**
   - Enter **Client ID** from Google Cloud Console
   - Enter **Client Secret** from Google Cloud Console

3. **Set Redirect URLs**
   - Add redirect URL: `https://your-domain.com/auth/callback`
   - Supabase automatically handles OAuth callback

### Implementation

Google OAuth is implemented in:
- Component: `src/features/auth/components/google-oauth-button.tsx`
- Uses: `supabase.auth.signInWithOAuth({ provider: "google" })`

### OAuth Flow

```typescript
const { error: oauthError } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: getAuthCallbackUrl(),
    queryParams: {
      access_type: "offline",  // Request refresh token
      prompt: "consent",        // Force consent screen
    },
  },
});
```

### Callback Handling

OAuth callback is handled in `src/app/auth/callback/route.ts`:

```typescript
if (code) {
  // OAuth callback (Google)
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  
  if (user) {
    // Extract OAuth metadata
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
    const avatarUrl = user.user_metadata?.avatar_url || null;
    
    // Create profile if doesn't exist
    await createProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
    });
  }
}
```

## GitHub OAuth (Future)

GitHub OAuth can be added following similar steps.

### Prerequisites

1. GitHub OAuth App
2. Client ID and Client Secret

### GitHub Setup

1. **Create OAuth App**
   - Navigate to GitHub Settings > Developer settings > OAuth Apps
   - Click **New OAuth App**
   - Set Authorization callback URL:
     - `https://your-project.supabase.co/auth/v1/callback`

2. **Get Credentials**
   - Copy Client ID
   - Generate Client Secret

### Supabase Configuration

1. Enable **GitHub** provider in Supabase Dashboard
2. Enter Client ID and Client Secret
3. Configure redirect URLs

### Implementation

GitHub OAuth would be implemented similarly to Google OAuth:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: "github",
  options: {
    redirectTo: getAuthCallbackUrl(),
  },
});
```

## Email/Password (Future)

Email/password authentication can be added if needed.

### Configuration

1. **Enable Email Provider**
   - Navigate to Supabase Dashboard
   - Go to **Authentication > Providers**
   - Enable **Email** provider

2. **Configure Settings**
   - Set password requirements
   - Configure email templates
   - Set up email verification (optional)

### Implementation

Email/password would use standard Supabase methods:

```typescript
// Sign up
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

## Redirect URLs

### Callback URL Configuration

The application uses a callback route at `/auth/callback`:

- **Local Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://your-domain.com/auth/callback`

### Supabase Redirect URLs

Configure in Supabase Dashboard:
- Navigate to **Authentication > URL Configuration**
- Add Site URL: `https://your-domain.com`
- Add Redirect URLs:
  - `https://your-domain.com/auth/callback`
  - `http://localhost:3000/auth/callback` (development)

### OAuth Provider Redirect URLs

For OAuth providers (Google, GitHub, etc.), configure:
- **Google Cloud Console**: `https://your-project.supabase.co/auth/v1/callback`
- **GitHub OAuth App**: `https://your-project.supabase.co/auth/v1/callback`

## Email Configuration

### SMTP Configuration (Optional)

For custom email sending, configure SMTP in Supabase:

1. Navigate to **Project Settings > Auth**
2. Configure SMTP settings:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - From Email

### Email Templates

Customize email templates in Supabase Dashboard:
- Navigate to **Authentication > Email Templates**
- Customize templates:
  - Magic Link
  - Email Verification
  - Password Reset
  - Email Change

## Security Considerations

### OAuth Security

- **HTTPS Required**: OAuth requires HTTPS in production
- **Secure Redirects**: Validate redirect URLs to prevent open redirects
- **State Parameter**: Supabase automatically handles state parameter for CSRF protection

### Token Security

- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies
- **Secure Cookies**: Cookies marked as secure in production
- **SameSite Policy**: CSRF protection via SameSite cookie attribute

### Environment Variables

- **Never Commit Secrets**: Never commit `SUPABASE_SERVICE_ROLE_KEY` to version control
- **Use Environment Variables**: Store secrets in environment variables
- **Rotate Keys**: Rotate keys regularly

## Testing Providers

### Local Development

For local development, configure:
- Local redirect URLs: `http://localhost:3000/auth/callback`
- Supabase project with local redirect URLs enabled

### Testing OAuth

1. **Test OAuth Flow**
   - Click OAuth provider button
   - Complete OAuth consent
   - Verify callback handling
   - Check profile creation

2. **Test Error Handling**
   - Test invalid credentials
   - Test network errors
   - Test callback errors

### Testing Magic Link

1. **Test Magic Link Flow**
   - Enter email address
   - Check email for magic link
   - Click magic link
   - Verify authentication

2. **Test Error Handling**
   - Test invalid email
   - Test expired token
   - Test rate limiting

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure redirect URLs match exactly in Google/GitHub and Supabase
   - Check for trailing slashes
   - Verify HTTPS in production

2. **Magic Link Not Received**
   - Check spam folder
   - Verify email address
   - Check Supabase email logs

3. **Token Refresh Issues**
   - Verify cookie settings
   - Check middleware configuration
   - Ensure HTTPS in production

### Debugging

Enable Supabase logging:
- Navigate to **Project Settings > Logs**
- Check authentication logs
- Review error messages

## Related Documentation

- [Authentication Flows](./flows.md) - Detailed authentication flow documentation
- [Authentication Overview](./overview.md) - Authentication system overview
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) - Official Supabase documentation
