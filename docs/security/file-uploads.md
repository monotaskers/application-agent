---
title: "File Upload Security"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/app/api/*/upload/route.ts"
  - "src/components/forms/form-file-upload.tsx"
  - "src/features/interviews/lib/interview-storage.ts"
  - "src/app/api/auth/avatar/route.ts"
---

# File Upload Security

## Overview

File uploads are secured through multiple layers of validation and access control. All uploaded files are validated for type, size, and content before being stored securely in Supabase Storage with proper access control.

## Security Measures

### File Type Validation

**MIME Type Validation**

Files are validated by MIME type to ensure only allowed file types are uploaded:

```typescript
// Avatar upload example
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

if (!ALLOWED_MIME_TYPES.includes(file.type)) {
  return Response.json(
    {
      error: "VALIDATION_ERROR",
      message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    },
    { status: 400 }
  );
}
```

**File Extension Validation**

Files are also validated by extension as a defense-in-depth measure:

```typescript
// Interview transcript example
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];

function isValidFileType(file: File): boolean {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return (
    ALLOWED_EXTENSIONS.includes(extension) &&
    ALLOWED_MIME_TYPES.includes(file.type)
  );
}
```

**Location**: `src/features/interviews/lib/interview-storage.ts`

### File Size Limits

File size limits are enforced to prevent abuse and ensure system performance:

```typescript
// Avatar upload - 2MB limit
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

if (file.size > MAX_FILE_SIZE) {
  return Response.json(
    {
      error: "VALIDATION_ERROR",
      message: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    },
    { status: 400 }
  );
}
```

**File Size Limits by Type**:

- **Avatars**: 2MB maximum
- **Interview Transcripts**: 50MB maximum
- **CSV Imports**: 10MB maximum (configurable)

### Content Validation

**Client-Side Validation**

Lightweight validation on client-side for better UX:

```typescript
// File uploader component
const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
  if (rejectedFiles.length > 0) {
    rejectedFiles.forEach(({ file }) => {
      toast.error(`File ${file.name} was rejected`);
    });
  }
  // Process accepted files
};
```

**Server-Side Validation**

Comprehensive validation on server-side for security:

```typescript
// Server-side validation
export async function POST(request: NextRequest): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  // Validate file presence
  if (!file) {
    return createErrorResponse("BAD_REQUEST", "No file provided", 400);
  }

  // Validate file type
  if (!isValidFileType(file)) {
    return createErrorResponse("BAD_REQUEST", "Invalid file type", 400);
  }

  // Validate file size
  if (!isValidFileSize(file)) {
    return createErrorResponse("BAD_REQUEST", "File too large", 400);
  }

  // Process file
}
```

## Storage Security

### Supabase Storage

Files are stored securely in Supabase Storage with proper access control:

**Location**: `src/app/api/auth/avatar/route.ts`, `src/features/interviews/lib/interview-storage.ts`

```typescript
// Upload file to Supabase Storage
const { error: uploadError } = await supabase.storage
  .from("avatars")
  .upload(filePath, buffer, {
    contentType: file.type,
    upsert: false, // Don't overwrite existing files
  });
```

### Access Control

**Bucket Policies**

- **Public Buckets**: For publicly accessible files (e.g., avatars)
- **Private Buckets**: For sensitive files (e.g., interview transcripts)
- **Bucket-Level Policies**: Control who can upload/download

**File-Level Access**

- **Signed URLs**: Generate temporary signed URLs for private files
- **Expiration**: Signed URLs expire after set time
- **Authentication**: File access requires authentication

```typescript
// Generate signed URL for private file
const { data } = await supabase.storage
  .from("interviews")
  .createSignedUrl(filePath, 3600); // 1 hour expiration
```

### File Naming

Files are renamed to prevent conflicts and path traversal:

```typescript
// Generate unique filename
const fileExtension = file.name.split(".").pop() || "jpg";
const timestamp = Date.now();
const fileName = `${user.id}-${timestamp}.${fileExtension}`;
const filePath = `${user.id}/${fileName}`;
```

**Benefits**:
- Prevents filename conflicts
- Prevents path traversal attacks
- Makes files traceable to users
- Includes timestamp for uniqueness

## Implementation Examples

### Avatar Upload

**Location**: `src/app/api/auth/avatar/route.ts`

```typescript
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const AVATARS_BUCKET = "avatars";

export async function POST(request: NextRequest): Promise<Response> {
  // 1. Authentication check
  const { user } = await supabase.auth.getUser();
  if (!user) {
    return Response.json(
      { error: "UNAUTHORIZED", message: "User not authenticated" },
      { status: 401 }
    );
  }

  // 2. Parse FormData
  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  // 3. Validate file presence
  if (!file) {
    return Response.json(
      { error: "VALIDATION_ERROR", message: "No file provided" },
      { status: 400 }
    );
  }

  // 4. Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return Response.json(
      {
        error: "VALIDATION_ERROR",
        message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 5. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return Response.json(
      {
        error: "VALIDATION_ERROR",
        message: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      },
      { status: 400 }
    );
  }

  // 6. Generate secure filename
  const fileExtension = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const fileName = `${user.id}-${timestamp}.${fileExtension}`;
  const filePath = `${user.id}/${fileName}`;

  // 7. Convert to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 8. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return Response.json(
      { error: "UPLOAD_ERROR", message: "Failed to upload file" },
      { status: 500 }
    );
  }

  // 9. Return file URL
  const { data: urlData } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(filePath);

  return Response.json({ url: urlData.publicUrl });
}
```

### Interview Transcript Upload

**Location**: `src/app/api/interviews/route.ts`, `src/features/interviews/lib/interview-storage.ts`

```typescript
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function isValidFileType(file: File): boolean {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return (
    ALLOWED_EXTENSIONS.includes(extension) &&
    ALLOWED_MIME_TYPES.includes(file.type)
  );
}

function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}
```

## Threat Mitigation

### File Type Attacks

**Threat**: Malicious files (executables, scripts) uploaded

**Mitigation**:
- Strict MIME type validation
- File extension validation
- Content scanning (recommended for production)

### File Size Attacks

**Threat**: Extremely large files causing DoS

**Mitigation**:
- File size limits enforced
- Request timeouts
- Storage quotas

### Path Traversal Attacks

**Threat**: Accessing files outside intended directories

**Mitigation**:
- Secure file naming (user ID prefix)
- Path validation
- Bucket-level access control

### Malicious Content

**Threat**: Files containing malicious content

**Mitigation**:
- File type validation
- Content scanning (recommended for production)
- Virus scanning (recommended for production)

## Best Practices

1. **Validate file type** - Check MIME type and extension
2. **Enforce size limits** - Prevent abuse and DoS
3. **Use secure storage** - Supabase Storage with access control
4. **Rename files** - Prevent conflicts and path traversal
5. **Authenticate uploads** - Require authentication for uploads
6. **Control access** - Use bucket policies and signed URLs
7. **Scan content** - Content scanning for production (recommended)
8. **Log uploads** - Log file uploads for audit trail

## Security Checklist

- [ ] File type validation (MIME type and extension)
- [ ] File size limits enforced
- [ ] Authentication required for uploads
- [ ] Secure file naming (no user-controlled paths)
- [ ] Files stored in secure storage (Supabase Storage)
- [ ] Access control on file buckets
- [ ] Signed URLs for private files
- [ ] Error handling doesn't expose file paths
- [ ] Content scanning (recommended for production)

## Related Documentation

- [Security Overview](./overview.md) - Overall security strategy
- [Input Validation](./input-validation.md) - File validation patterns
- [Data Protection](./data-protection.md) - Secure storage
- [Authentication](./authentication.md) - Upload authentication
