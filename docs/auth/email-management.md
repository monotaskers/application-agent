# Email Management Strategy

## Overview

This application maintains a distinction between two email fields:

1. **`auth.users.email`** - The email used for authentication (from Supabase Auth)
   - Set automatically by Supabase during sign-up/OAuth
   - Used for login, password resets, magic links
   - Cannot be easily changed (requires auth flow)
   - **Source of truth for authentication**

2. **`profiles.email`** - The email stored in the profile table
   - Optional field for business/contact purposes
   - Can differ from auth email (e.g., personal vs work email)
   - Can be updated independently
   - **Source of truth for business operations**

## Current Behavior

### OAuth Users (Google, etc.)
- `auth.users.email` = Email from OAuth provider (e.g., Google account email)
- `profiles.email` = **NULL** (not set during OAuth profile creation)
- Profile created in `src/app/auth/callback/route.ts` via `createProfile()`
- Only `full_name` and `avatar_url` are synced from OAuth metadata

### Admin-Created Users
- `auth.users.email` = Email provided during user creation
- `profiles.email` = Same email (set explicitly in `createUser()`)
- Both fields are synchronized

### Magic Link Users
- `auth.users.email` = Email used for magic link
- `profiles.email` = **NULL** (not set during profile creation)
- Similar to OAuth users

## Recommended Strategy

### 1. Initial Sync on Profile Creation
When a profile is created (especially for OAuth users), sync `auth.users.email` to `profiles.email` as a default:

```typescript
// In createProfile()
const profileData = {
  id: user.id,
  email: user.email || null, // Sync from auth.users.email initially
  // ... other fields
};
```

**Rationale**: Provides a sensible default while allowing later customization.

### 2. Allow Independent Updates
- Users/admins can update `profiles.email` independently
- `auth.users.email` should only change through proper auth flows
- Use `profiles.email` for business operations (company assignment, search, etc.)
- Use `auth.users.email` for authentication operations

### 3. Search and Lookup Strategy
When searching for users by email, check both fields:

```typescript
// Priority: profiles.email first, then auth.users.email
const user = await findUserByEmail(email) {
  // First check profiles.email
  const profileMatch = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();
  
  if (profileMatch) return profileMatch;
  
  // Fallback to auth.users.email
  const authUsers = await supabase.auth.admin.listUsers();
  const authMatch = authUsers.users.find(u => u.email === email);
  if (authMatch) {
    // Return profile for this auth user
    return await getProfileById(authMatch.id);
  }
}
```

### 4. Display Strategy
- **Primary display**: Use `profiles.email` if set, otherwise fallback to `auth.users.email`
- **Authentication context**: Always show `auth.users.email`
- **Business context**: Prefer `profiles.email`

### 5. Migration for Existing OAuth Users
For existing OAuth users with NULL `profiles.email`:
- Option A: Sync `auth.users.email` to `profiles.email` on next profile update
- Option B: Create a one-time migration script
- Option C: Handle in application layer (fallback logic)

## Implementation Recommendations

### Update `createProfile()` to sync email
```typescript
const profileData = {
  id: user.id,
  email: user.email || null, // Sync from auth.users.email
  // ... rest of fields
};
```

### Update user lookup utilities
- Create `findUserByEmail()` that checks both fields
- Update seed script to use this utility
- Update role update script to use this utility

### Update display components
- Show both emails when they differ
- Allow users to set/update `profiles.email` independently
- Clear indication of which email is used for authentication

## Benefits

1. **Flexibility**: Users can maintain different emails for auth vs business
2. **Backward Compatibility**: Existing OAuth users work without migration
3. **Clear Separation**: Authentication vs business operations
4. **Search Reliability**: Can find users by either email

## Considerations

1. **Uniqueness**: Currently `profiles.email` uniqueness is checked, but OAuth users might have NULL
2. **Company Assignment**: Currently uses `auth.users.email` for domain matching - should also check `profiles.email`
3. **Search**: Need to search both fields for comprehensive results

