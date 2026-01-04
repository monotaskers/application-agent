---
title: "Input Validation"
last_updated: "2025-01-27"
version: "1.0"
status: "active"
related_files:
  - "src/lib/validation/"
  - "src/features/*/schemas/"
  - "src/lib/env.ts"
---

# Input Validation

## Overview

All external data entering the application is validated using Zod schemas. This includes API request bodies, query parameters, path parameters, form inputs, and environment variables. Validation happens at system boundaries to ensure data integrity and prevent security vulnerabilities.

## Validation Principles

### Fail Fast

- Validate inputs as early as possible (at API route entry point)
- Throw errors immediately on validation failure
- Don't process invalid data

### Validate Everything

- All external data must be validated
- No assumptions about data format or content
- Type safety enforced through TypeScript and Zod

### Defense in Depth

- Client-side validation for user experience
- Server-side validation for security (source of truth)
- Database constraints as final layer

## Validation Patterns

### Zod Schema Validation

All validation schemas are defined using Zod and located in `src/features/*/schemas/`.

#### Example: Company Schema

```typescript
import { z } from "zod";

export const CompanySchema = z.object({
  id: z.string().uuid("Company ID must be a valid UUID"),
  legal_name: z.string().min(1, "Legal name is required"),
  domain: z.string().nullable(),
  website: z.string().url("Website must be a valid URL").nullable().or(z.literal("")),
  // ... other fields
});
```

#### Example: User Creation Schema

```typescript
export const createUserSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    full_name: z.string().max(255).nullable().optional(),
    role: UserRoleSchema,
    company_id: z.string().uuid("Company ID must be a valid UUID").optional(),
    // ... other fields
  })
  .refine(
    (data) => {
      // Either company_id or company must be provided
      return data.company_id || data.company;
    },
    { message: "Company association is required", path: ["company_id"] },
  );
```

### Environment Variable Validation

Environment variables are validated at application startup using Zod.

**Location**: `src/lib/env.ts`

```typescript
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  // ... other environment variables
});

export const env = envSchema.parse(process.env);
```

**Benefits**:
- Application fails fast if required environment variables are missing
- Type safety for environment variables
- Clear error messages for misconfiguration

### API Route Validation

API routes validate request data using Zod schemas before processing.

#### Example: Validating Request Body

```typescript
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createCompanySchema = z.object({
  legal_name: z.string().min(1),
  domain: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createCompanySchema.parse(body);
    
    // Process validated data
    // ...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.errors,
        },
        { status: 400 }
      );
    }
    // Handle other errors
  }
}
```

#### Example: Validating Query Parameters

```typescript
const querySchema = z.object({
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("50"),
});

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl;
  
  const query = querySchema.parse({
    search: searchParams.get("search"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
  
  // Use validated query parameters
}
```

#### Example: Validating Path Parameters

```typescript
const paramsSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  
  // Validate path parameter
  const validatedParams = paramsSchema.parse({ id });
  
  // Use validated ID
}
```

### Form Validation

Forms use React Hook Form with Zod resolver for validation.

**Location**: `src/components/forms/`, `src/features/*/components/*-form.tsx`

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

function MyForm(): ReactElement {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    // Data is validated and typed
    // Send to API
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Validation Rules

### Required Fields

- Use `.min(1)` for required strings
- Use `.refine()` for complex required field logic
- Provide clear error messages

### Type Validation

- Use appropriate Zod types (`z.string()`, `z.number()`, `z.boolean()`, etc.)
- Use `.uuid()` for UUID validation
- Use `.email()` for email validation
- Use `.url()` for URL validation

### Format Validation

- Use `.regex()` for pattern matching
- Use `.email()` for email format
- Use `.url()` for URL format
- Use `.uuid()` for UUID format

### Length Constraints

- Use `.min()` and `.max()` for string length
- Use `.array().min()` and `.array().max()` for array length
- Provide clear error messages with limits

### Custom Validation

Use `.refine()` for complex validation logic:

```typescript
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
```

## Error Handling

### Validation Error Format

Validation errors follow a consistent format:

```typescript
{
  error: "VALIDATION_ERROR",
  message: "Invalid request data",
  details: [
    {
      path: ["email"],
      message: "Invalid email format",
    },
  ],
}
```

### Error Response Helper

```typescript
function createValidationErrorResponse(error: z.ZodError): NextResponse {
  return NextResponse.json(
    {
      error: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    },
    { status: 400 }
  );
}
```

## Security Considerations

### Preventing SQL Injection

- Supabase client uses parameterized queries automatically
- No raw SQL queries in application code
- All database queries go through Supabase client

### Preventing XSS

- React escapes content by default
- Validate URLs before rendering
- Use `dangerouslySetInnerHTML` only for trusted content (with caution)

### Preventing Command Injection

- Validate file paths and names
- Don't execute user input as commands
- Use safe file operations

### Preventing Path Traversal

- Validate file paths
- Sanitize file names
- Use secure file storage (Supabase Storage)

## Best Practices

1. **Validate at boundaries** - Validate all external data at system entry points
2. **Use TypeScript types** - Infer types from Zod schemas for type safety
3. **Provide clear errors** - Error messages should help users fix issues
4. **Fail fast** - Don't process invalid data
5. **Validate server-side** - Client-side validation is for UX, server-side is for security
6. **Keep schemas updated** - Update validation schemas when data models change
7. **Test validation** - Write tests for validation logic

## Related Documentation

- [Security Overview](./overview.md) - Overall security strategy
- [File Upload Security](./file-uploads.md) - File upload validation
- [Authentication](./authentication.md) - Authentication validation
- [Form Validation Pattern](../../patterns/form-validation.md) - Form validation patterns
