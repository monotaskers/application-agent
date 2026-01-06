# Email Management - Implementation Summary

## Problem Statement

The application maintains two separate email fields:
- **`auth.users.email`**: Authentication email (from OAuth/Magic Link)
- **`profiles.email`**: Business/contact email (stored in profiles table)

**Issue**: OAuth users (e.g., Google sign-in) have `auth.users.email` set but `profiles.email` is NULL, making it difficult to find users by email in scripts and business operations.

## Solution Implemented

### 1. Profile Creation Sync (`src/lib/auth/profile.ts`)
- Updated `createProfile()` to sync `auth.users.email` to `profiles.email` on initial profile creation
- This ensures OAuth users have a default email value in their profile
- Users can still update `profiles.email` independently later

```typescript
const profileData = {
  id: user.id,
  email: input?.email ?? user.email ?? null, // Sync from auth.users.email
  // ... other fields
};
```

### 2. Email Lookup Utility (`src/features/users/lib/find-user-by-email.ts`)
- Created `findUserByEmail()` function that checks both fields:
  1. First checks `profiles.email` (business email)
  2. Falls back to `auth.users.email` (authentication email)
- This ensures we can find OAuth users even if `profiles.email` is NULL

### 3. User Service Updates
- Updated `getUserById()` and `getUsers()` to fallback to `auth.users.email` when `profiles.email` is NULL
- This ensures the `User` type always has a useful email value for display/search

### 4. Script Updates
- **`scripts/update-user-role.ts`**: Now uses `findUserByEmail()` to find users by either email field
- **`scripts/seed-users.ts`**: Enhanced to check both `profiles.email` and `auth.users.email` to avoid duplicates
- If an OAuth user exists but has NULL `profiles.email`, the seed script will update it

## Current Behavior

### OAuth Users (Google, etc.)
- ✅ `auth.users.email` = Email from OAuth provider
- ✅ `profiles.email` = **Now synced from auth.users.email** (was NULL before)
- ✅ Can be found by email in scripts and searches
- ✅ Can update `profiles.email` independently if needed

### Admin-Created Users
- ✅ `auth.users.email` = Email provided during creation
- ✅ `profiles.email` = Same email (explicitly set)
- ✅ Both fields synchronized

### Magic Link Users
- ✅ `auth.users.email` = Email used for magic link
- ✅ `profiles.email` = **Now synced from auth.users.email** (was NULL before)

## Migration for Existing OAuth Users

For existing OAuth users with NULL `profiles.email`:

### Option 1: Automatic Sync (Recommended)
The next time they update their profile, `profiles.email` will remain NULL unless explicitly set. However, the application now:
- Falls back to `auth.users.email` when displaying/searching
- Can find them using `findUserByEmail()`

### Option 2: One-Time Migration Script
Create a script to sync `auth.users.email` to `profiles.email` for all users with NULL `profiles.email`:

```typescript
// scripts/sync-profile-emails.ts
const { data: profiles } = await supabase
  .from("profiles")
  .select("id")
  .is("email", null);

for (const profile of profiles) {
  const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
  if (authUser?.user?.email) {
    await supabase
      .from("profiles")
      .update({ email: authUser.user.email })
      .eq("id", profile.id);
  }
}
```

## Recommendations

### ✅ Immediate Actions
1. **Test the update-user-role script** with `t@ocupop.com`:
   ```bash
   pnpm tsx scripts/update-user-role.ts t@ocupop.com superadmin
   ```
   This should now find the OAuth user even if `profiles.email` is NULL.

2. **Run seed script** - It will now handle existing OAuth users gracefully:
   ```bash
   pnpm tsx scripts/seed-users.ts
   ```

### 🔄 Future Enhancements
1. **Display Both Emails**: When `profiles.email` differs from `auth.users.email`, show both in the UI
2. **Email Validation**: Add UI to allow users to set/update `profiles.email` independently
3. **Search Enhancement**: Update user search to query both fields for comprehensive results
4. **Company Assignment**: Consider checking both emails for company domain matching

## Testing Checklist

- [ ] Test `update-user-role.ts` with OAuth user email (`t@ocupop.com`)
- [ ] Test `seed-users.ts` with existing OAuth users
- [ ] Verify new OAuth users have `profiles.email` synced
- [ ] Verify admin-created users still work correctly
- [ ] Test user search/lookup in application
- [ ] Verify user display shows correct email

## Related Files

- `src/lib/auth/profile.ts` - Profile creation with email sync
- `src/features/users/lib/find-user-by-email.ts` - Email lookup utility
- `src/features/users/lib/user-service.ts` - User service with email fallback
- `scripts/update-user-role.ts` - Role update script (updated)
- `scripts/seed-users.ts` - User seeding script (updated)
- `docs/auth/email-management.md` - Detailed strategy documentation

