---
title: "Data Protection"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/utils/supabase/"
  - "src/lib/auth/"
  - "src/features/*/lib/"
---

# Data Protection

## Overview

The application implements multiple layers of data protection to ensure sensitive information is handled securely throughout its lifecycle. This includes encryption in transit, secure storage, access control, and data privacy measures.

## Data Protection Measures

### Encryption in Transit

**HTTPS Enforcement**

- All communications use HTTPS (TLS/SSL encryption)
- Supabase connections use encrypted connections
- API requests use encrypted connections
- No unencrypted data transmission

**Implementation**:
- Next.js automatically enforces HTTPS in production
- Supabase client uses HTTPS endpoints
- External API calls use HTTPS

### Secure Storage

**Database Security**

- **Row Level Security (RLS)**: Database-level access control
- **Encrypted Connections**: All database connections encrypted
- **Parameterized Queries**: Prevents SQL injection
- **Backup Encryption**: Database backups encrypted

**Supabase Storage**

- **Access Control**: Bucket-level and file-level access control
- **Encrypted Storage**: Files stored with encryption
- **Secure URLs**: Signed URLs for temporary access
- **Private Buckets**: Sensitive files in private buckets

### Access Control

**Authentication Required**

- All protected resources require authentication
- Unauthenticated users redirected to sign-in
- API routes check authentication before processing

**Authorization Checks**

- Permission-based access control
- Role-based access control
- Resource-level authorization
- Database RLS policies

**Location**: `src/lib/auth/permissions.ts`, `src/lib/auth/permission-checker.ts`

### Data Privacy

**Personal Information Protection**

- User data access controlled by permissions
- Company data isolated by company boundaries
- PII (Personally Identifiable Information) handled securely
- Data minimization principles followed

**Data Retention**

- Soft deletes for audit trails
- Data retention policies
- User data deletion on request

## Secure Data Handling

### Database Queries

**Parameterized Queries**

Supabase client automatically uses parameterized queries:

```typescript
// Safe - Supabase handles parameterization
const { data } = await supabase
  .from("users")
  .select("*")
  .eq("id", userId); // Parameterized automatically
```

**No Raw SQL**

- No raw SQL queries in application code
- All queries go through Supabase client
- Database functions used for complex operations

### Sensitive Data Handling

**Environment Variables**

- Sensitive configuration in environment variables
- Environment variables validated at startup
- No secrets in code or version control

**Location**: `src/lib/env.ts`

**API Keys and Tokens**

- Stored in environment variables
- Never exposed to client-side code
- Rotated regularly
- Service role key used only server-side

**User Data**

- User data access controlled by permissions
- Company data isolated by company boundaries
- Sensitive fields not logged
- Data encrypted in transit and at rest

### Error Handling

**No Information Leakage**

Error responses don't expose sensitive information:

```typescript
// Good - Generic error message
{
  error: "INTERNAL_SERVER_ERROR",
  message: "An error occurred. Please try again.",
  status: 500
}

// Bad - Exposes internal details
{
  error: "Database connection failed: postgres://user:pass@host/db",
  status: 500
}
```

**Error Logging**

- Detailed errors logged server-side only
- User-friendly messages sent to client
- Sensitive data not included in logs
- Error tracking with Sentry (production)

## Data Access Patterns

### Company Data Isolation

Users can only access data for their company:

```typescript
// Automatically filtered by company
const { data } = await supabase
  .from("companies")
  .select("*")
  .eq("company_id", userCompanyId);
```

### User Data Access

Users can only access their own profile or with proper permissions:

```typescript
// Check permission before access
await requirePermission(PERMISSIONS.users.view);

// Fetch user data
const user = await getUser(userId);
```

### Resource-Level Authorization

Check permissions before operations:

```typescript
// Check permission
const canEdit = await hasPermission(user, PERMISSIONS.companies.edit);

if (!canEdit) {
  return createErrorResponse("FORBIDDEN", "Permission denied", 403);
}

// Proceed with operation
```

## Secure File Storage

**Location**: `src/features/interviews/lib/interview-storage.ts`, `src/app/api/auth/avatar/route.ts`

### Supabase Storage

- **Private Buckets**: Sensitive files in private buckets
- **Access Control**: File-level access control
- **Signed URLs**: Temporary signed URLs for file access
- **Secure Upload**: Files uploaded with authentication

### File Access Control

```typescript
// Upload with authentication
const { error } = await supabase.storage
  .from("avatars")
  .upload(filePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

// Generate signed URL for access
const { data } = await supabase.storage
  .from("avatars")
  .createSignedUrl(filePath, 3600); // 1 hour expiration
```

## Data Transmission Security

### API Requests

- **HTTPS Only**: All API requests use HTTPS
- **Authentication**: JWT tokens in Authorization headers
- **Secure Cookies**: Session cookies with secure flags

### External API Calls

- **HTTPS**: All external API calls use HTTPS
- **Authentication**: JWT tokens for external API authentication
- **Timeout**: Request timeouts to prevent hanging connections
- **Error Handling**: Secure error handling without information leakage

## Compliance Considerations

### Data Privacy

- **User Consent**: User consent for data processing
- **Data Minimization**: Only collect necessary data
- **Data Retention**: Retain data only as long as necessary
- **Right to Deletion**: Users can request data deletion

### Audit Trails

- **Soft Deletes**: Deleted records marked, not removed
- **Timestamps**: Created/updated timestamps on all records
- **User Tracking**: Track who created/updated records
- **Change Logs**: Log important data changes

## Best Practices

1. **Encrypt in transit** - Always use HTTPS
2. **Encrypt at rest** - Use encrypted storage
3. **Control access** - Implement proper access control
4. **Minimize data** - Only collect necessary data
5. **Secure storage** - Use secure storage solutions
6. **Validate input** - Validate all data inputs
7. **Log securely** - Don't log sensitive information
8. **Handle errors securely** - Don't expose sensitive information in errors

## Security Considerations

### SQL Injection Prevention

- Supabase client uses parameterized queries
- No raw SQL queries
- Database functions for complex operations

### Data Exposure Prevention

- No sensitive data in error messages
- No sensitive data in logs
- No sensitive data in client-side code
- Proper access control on all resources

### Data Integrity

- Database constraints enforce data integrity
- Transactions ensure atomic operations
- Validation ensures data quality

## Related Documentation

- [Security Overview](./overview.md) - Overall security strategy
- [Authentication](./authentication.md) - Authentication and authorization
- [Input Validation](./input-validation.md) - Data validation
- [File Upload Security](./file-uploads.md) - Secure file handling
