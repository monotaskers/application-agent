# AGENTS.md

This file provides comprehensive guidance for AI Code Editors when working with this application.

## Core Development Philosophy

### KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.

### YAGNI (You Aren't Gonna Need It)

Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

### DRY (Don't Repeat Yourself)

TODO - Add description of DRY philosophy.

### Design Principles

- **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
- **Vertical Slice Architecture**: Organize by features, not layers
- **Component-First**: Build with reusable, composable components with single responsibility
- **Fail Fast**: Validate inputs early, throw errors immediately

## 🤖 AI Assistant Guidelines

### Context Awareness

- **Database Schema:** Always verify schema against `docs/database/remote-schema-reference.md` - the remote Supabase database is the single source of truth
- When implementing features, always check existing patterns first
- Prefer composition over inheritance in all designs
- Use existing utilities before creating new ones
- Check for similar functionality in other domains/features
- Review `docs/CONTEXT.md` for critical context before making schema-related changes

### Common Pitfalls to Avoid

- Creating duplicate functionality
- Overwriting existing tests
- Modifying core frameworks without explicit instruction
- Adding dependencies without checking existing alternatives
- Using deprecated or legacy documentation
- **Assuming schema structure** - Always verify against remote database or `docs/database/remote-schema-reference.md`
- **Maintaining backward compatibility** - The project does NOT maintain backward compatibility

### Workflow Patterns

- Preferably create tests BEFORE implementation (TDD)
- Use "think hard" for architecture decisions
- Break complex tasks into smaller, testable units
- Validate understanding before implementation

### Package Manager Requirements

**CRITICAL**: Always use `pnpm` instead of `npm` or `yarn` for package management:

```bash
# ❌ NEVER use npm
npm install package-name
npm run dev

# ❌ NEVER use yarn
yarn add package-name
yarn dev

# ✅ ALWAYS use pnpm
pnpm install package-name
pnpm run dev
pnpm add package-name
pnpm remove package-name
```

**Enforcement Rules:**

- **MUST use `pnpm`** for ALL package operations
- **MUST use `pnpm install`** instead of `npm install`
- **MUST use `pnpm run <script>`** instead of `npm run <script>`
- **MUST use `pnpm add`** instead of `npm install <package>`
- **MUST use `pnpm remove`** instead of `npm uninstall <package>`
- If `pnpm-lock.yaml` exists, NEVER use `npm` or create `package-lock.json`

### Search Command Requirements

**CRITICAL**: Always use `rg` (ripgrep) instead of traditional `grep` and `find` commands:

```bash
# ❌ Don't use grep
grep -r "pattern" .

# ✅ Use rg instead
rg "pattern"

# ❌ Don't use find with name
find . -name "*.tsx"

# ✅ Use rg with file filtering
rg --files | rg "\.tsx$"
# or
rg --files -g "*.tsx"
```

**Enforcement Rules:**

These rules apply to all code generation, documentation, and command examples:

- **Never use `grep`** - Always use `rg` (ripgrep) instead

  - ❌ `grep -r "pattern" .`
  - ✅ `rg "pattern"`
  - Reason: Better performance, built-in file filtering, and more features

- **Never use `find -name`** - Use `rg` file filtering instead
  - ❌ `find . -name "*.tsx"`
  - ✅ `rg --files | rg "\.tsx$"` or `rg --files -g "*.tsx"`
  - Reason: Faster, more consistent with codebase tooling, and better integration

**Note**: These rules are enforced for AI agents and should be followed by all developers for consistency. The `rg` tool provides superior performance and features compared to traditional `grep` and `find` commands.

## 🧱 Code Structure & Modularity

### File and Component Limits

- **Never create a file longer than 500 lines of code.** If approaching this limit, refactor by splitting into modules or helper files.
- **Components should be under 200 lines** for better maintainability.
- **Functions should be short and focused sub 50 lines** and have a single responsibility.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.

## 🚀 Next.js 15 & React 19 Key Features

### Next.js 15 Core Features

- **Turbopack**: Fast bundler for development (stable)
- **App Router**: File-system based router with layouts and nested routing
- **Server Components**: React Server Components for performance
- **Server Actions**: Type-safe server functions
- **Parallel Routes**: Concurrent rendering of multiple pages
- **Intercepting Routes**: Modal-like experiences

### React 19 Features

- **React Compiler**: Eliminates need for `useMemo`, `useCallback`, and `React.memo`
- **Actions**: Handle async operations with built-in pending states
- **use() API**: Simplified data fetching and context consumption
- **Document Metadata**: Native support for SEO tags
- **Enhanced Suspense**: Better loading states and error boundaries

### TypeScript Integration (MANDATORY)

- **MUST use `ReactElement` instead of `JSX.Element`** for return types
- **MUST import types from 'react'** explicitly
- **NEVER use `JSX.Element` namespace** - use React types directly

```typescript
// ✅ CORRECT: Modern React 19 typing
import { ReactElement } from 'react';

function MyComponent(): ReactElement {
  return <div>Content</div>;
}

// ❌ FORBIDDEN: Legacy JSX namespace
function MyComponent(): JSX.Element {  // Cannot find namespace 'JSX'
  return <div>Content</div>;
}
```

## 🏗️ Project Structure (Vertical Slice Architecture)

```
src/
├── app/                   # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared UI components
│   ├── ui/                # Base components (shadcn/ui)
│   └── common/            # Application-specific shared components
├── features/              # Feature-based modules (RECOMMENDED)
│   └── [feature]/
│       ├── __tests__/     # Co-located tests
│       ├── components/    # Feature components
│       ├── hooks/         # Feature-specific hooks
│       ├── api/           # API integration
│       ├── schemas/       # Zod validation schemas
│       ├── types/         # TypeScript types
│       └── index.ts       # Public API
├── lib/                   # Core utilities and configurations
│   ├── utils.ts           # Utility functions
│   ├── env.ts             # Environment validation
│   └── constants.ts       # Application constants
├── hooks/                 # Shared custom hooks
├── middleware.ts          # Middleware
├── styles/                # Styling files
└── types/                 # Shared TypeScript types
```

## 🎯 TypeScript Configuration (STRICT REQUIREMENTS)

### MUST Follow These Compiler Options

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### MANDATORY Type Requirements

- **NEVER use `any` type** - use `unknown` if type is truly unknown
- **MUST have explicit return types** for all functions and components
- **MUST use proper generic constraints** for reusable components
- **MUST use type inference from Zod schemas** using `z.infer<typeof schema>`
- **NEVER use `@ts-ignore`** or `@ts-expect-error` - fix the type issue properly

## 📦 Package Management & Dependencies

### Essential Next.js 15 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^4",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Recommended Additional Dependencies

```bash
# UI and Styling
pnpm add @radix-ui/react-* class-variance-authority clsx tailwind-merge

# Form Handling and Validation
pnpm add react-hook-form @hookform/resolvers zod

# State Management (when needed)
pnpm add @tanstack/react-query zustand

# Development Tools
pnpm add -D @testing-library/react @testing-library/jest-dom vitest jsdom
```

## 🛡️ Data Validation with Zod (MANDATORY FOR ALL EXTERNAL DATA)

### MUST Follow These Validation Rules

- **MUST validate ALL external data**: API responses, form inputs, URL params, environment variables
- **MUST use branded types**: For all IDs and domain-specific values
- **MUST fail fast**: Validate at system boundaries, throw errors immediately
- **MUST use type inference**: Always derive TypeScript types from Zod schemas

### Schema Example (MANDATORY PATTERNS)

```typescript
import { z } from "zod";

// MUST use branded types for ALL IDs
const UserIdSchema = z.string().uuid().brand<"UserId">();
type UserId = z.infer<typeof UserIdSchema>;

// Environment validation (REQUIRED)
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

// API response validation
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    error: z.string().optional(),
    timestamp: z.string().datetime(),
  });
```

### Form Validation with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
});

type FormData = z.infer<typeof formSchema>;

function UserForm(): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    // Handle validated data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## 🧪 Testing Strategy (MANDATORY REQUIREMENTS)

### MUST Meet These Testing Standards

- **MINIMUM 80% code coverage** - NO EXCEPTIONS
- **MUST co-locate tests** with components in `__tests__` folders
- **MUST use React Testing Library** for all component tests
- **MUST test user behavior** not implementation details
- **MUST mock external dependencies** appropriately

### Test Configuration (Vitest + React Testing Library)

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

### Test Example (WITH MANDATORY DOCUMENTATION)

```typescript
/**
 * @fileoverview Tests for UserProfile component
 * @module components/__tests__/UserProfile.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

/**
 * Test suite for UserProfile component.
 *
 * Tests user interactions, state management, and error handling.
 * Mocks external dependencies to ensure isolated unit tests.
 */
describe('UserProfile', () => {
  /**
   * Tests that user name updates correctly on form submission.
   */
  it('should update user name on form submission', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<UserProfile onUpdate={onUpdate} />);

    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'John Doe');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe' })
    );
  });
});
```

## 🎨 Component Guidelines (STRICT REQUIREMENTS)

### ReUI Usage Requirements

- **Default to ReUI**: All new UI must import components from the shared `@reui/*` packages using `pnpm add @reui/<component>`.
- **Gap handling**: If no ReUI equivalent exists, reuse an existing shadcn/ui implementation before creating a custom component; document the missing ReUI part in the relevant spec or issue.
- **Customization boundaries**: Extend ReUI components only through their documented props, slots, or wrapper patterns—do not fork component internals unless the design system team signs off.
- **Legacy touchpoints**: When updating areas that still rely on legacy components, clearly flag opportunities to migrate to ReUI (TODO comment or PR note) but do not perform the replacement unless the task explicitly requests it.
- **Documentation + tests**: Every ReUI usage requires full JSDoc, accessibility verification, and co-located tests that explain any overrides or variant logic.

### MANDATORY Component Documentation

````typescript
/**
 * Button component with multiple variants and sizes.
 *
 * Provides a reusable button with consistent styling and behavior
 * across the application. Supports keyboard navigation and screen readers.
 *
 * @component
 * @example
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="medium"
 *   onClick={handleSubmit}
 * >
 *   Submit Form
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Visual style variant of the button */
  variant: 'primary' | 'secondary';

  /** Size of the button @default 'medium' */
  size?: 'small' | 'medium' | 'large';

  /** Click handler for the button */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /** Content to be rendered inside the button */
  children: React.ReactNode;

  /** Whether the button is disabled @default false */
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size = 'medium', onClick, children, disabled = false }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
````

### Shadcn/UI Component Pattern (RECOMMENDED)

```typescript
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## 🔄 State Management (STRICT HIERARCHY)

### MUST Follow This State Hierarchy

1. **Local State**: `useState` ONLY for component-specific state
2. **Context**: For cross-component state within a single feature
3. **URL State**: MUST use search params for shareable state
4. **Server State**: MUST use TanStack Query for ALL API data
5. **Global State**: Zustand ONLY when truly needed app-wide

### DRY Patterns for Data Fetching (MANDATORY)

**CRITICAL**: Always use shared utilities and hooks to eliminate code duplication. Never reimplement entity fetching logic.

#### 1. Entity Lists - useEntityList Hook

**Location**: `src/hooks/use-entity-list.ts`

For fetching paginated entity lists with infinite scroll:

```typescript
// ✅ CORRECT: Use shared hook
import { useEntityList } from "@/hooks/use-entity-list";

export function useUsers(filters: UserFilters = {}) {
  return useEntityList<...>({
    filters,
    endpoint: "/api/admin/users",
    buildParams: (filters, pageParam) => { /* ... */ },
    responseSchema: UsersListResponseSchema,
    queryKey: ["users"],
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination.has_next) {
        return undefined;
      }
      return allPages.length * DEFAULT_PAGE_SIZE;
    },
    initialPageParam: 0,
  });
}
```

**Documentation**: `docs/patterns/entity-list-pattern.md`

#### 2. Single Entity Queries - useEntityQuery Hook

**Location**: `src/hooks/use-entity-query.ts`

For fetching single entities by ID:

```typescript
// ✅ CORRECT: Use shared hook
import { useEntityQuery } from "@/hooks/use-entity-query";

export function useUser(userId: string | null | undefined) {
  return useEntityQuery<User>({
    id: userId,
    endpoint: (id) => `/api/admin/users/${id}`,
    responseSchema: UserDetailResponseSchema,
    queryKey: (id) => ["user", id],
    entityName: "user",
  });
}
```

**Documentation**: `docs/patterns/entity-query-pattern.md`

#### 3. Server-Side Fetching - fetchEntityServer Utility

**Location**: `src/lib/fetch-entity-server.ts`

For server-side fetching in Server Components and API routes:

```typescript
// ✅ CORRECT: Use shared utility
import { fetchEntityServer } from "@/lib/fetch-entity-server";

export async function fetchUserServer(id: string): Promise<User | null> {
  return fetchEntityServer(id, {
    table: "profiles",
    schema: UserSchema,
    additionalFilters: (query) => query.is("deleted_at", null),
    entityName: "user",
  });
}
```

**Documentation**: `docs/patterns/server-side-fetching-pattern.md`

#### 4. Column Layouts - useColumnLayout Hook

**Location**: `src/hooks/use-column-layout.ts`

For managing column order, width, and visibility in data grids:

```typescript
// ✅ CORRECT: Use shared hook
import { useColumnLayout } from "@/hooks/use-column-layout";

export function useUsersColumnLayout() {
  return useColumnLayout(DEFAULT_COLUMN_IDS, {
    storagePrefix: "users",
  });
}
```

**Documentation**: `docs/patterns/column-layout-pattern.md`

### Server State Pattern (TanStack Query)

**IMPORTANT**: For detail pages, prefer SSR pattern (see Performance Guidelines section). Use TanStack Query for:

- Mutations (create, update, delete)
- Client-side refetching after mutations
- Real-time updates
- List pages with filtering/pagination (using `useEntityList`)
- Single entity queries (using `useEntityQuery`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Use for mutations and client-side data that changes frequently
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new ApiError("Failed to update user", response.status);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// For initial data fetching on detail pages, use SSR instead:
// - Server Component fetches data server-side
// - Pass data as props to client components
// - Use hooks only for mutations and client-side updates

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserData) => {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new ApiError("Failed to update user", response.status);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
```

## 🔐 Security Requirements (MANDATORY)

### Input Validation (MUST IMPLEMENT ALL)

- **MUST sanitize ALL user inputs** with Zod before processing
- **MUST validate file uploads**: type, size, and content
- **MUST prevent XSS** with proper escaping
- **MUST implement CSRF protection** for forms
- **NEVER use dangerouslySetInnerHTML** without sanitization

### Environment Variables (MUST VALIDATE)

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## 🚀 Performance Guidelines

### Server-Side Rendering (SSR) Pattern (MANDATORY FOR DETAIL PAGES)

**CRITICAL**: All detail pages (users) MUST use the SSR pattern for optimal performance.

#### Architecture Pattern

Detail pages follow a hybrid Server/Client Component architecture:

1. **Server Component** (`page.tsx`) - Fetches data server-side, handles auth/permissions
2. **Client Component** (`*-client.tsx`) - Handles interactivity (dialogs, forms, mutations)
3. **Shared Utility** (`fetch-*-server.ts`) - Reusable server-side data fetching used by both API routes and server components

#### Implementation Requirements

**MUST follow this pattern for all detail pages:**

```typescript
// 1. Create shared fetching utility: src/features/[feature]/lib/fetch-[entity]-server.ts
export async function fetchEntityServer(id: string): Promise<Entity | null> {
  // Validate ID with Zod
  // Fetch from Supabase/database
  // Validate with schema
  // Return Entity or null
}

// 2. Server Component: src/app/[route]/[id]/page.tsx
export const revalidate = 60; // Optional: revalidation strategy

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactElement> {
  const { id } = await params;

  // Auth check
  const { user } = await requirePermission(PERMISSIONS.entity.view);

  // Fetch data
  const entity = await fetchEntityServer(id);
  if (!entity) {
    notFound();
  }

  // Check action permissions
  const canEdit = await hasPermission(user, PERMISSIONS.entity.edit);
  const canDelete = await hasPermission(user, PERMISSIONS.entity.delete);

  // Render with client component
  return (
    <EntityDetailClient
      entity={entity}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}

// 3. Client Component: src/app/[route]/[id]/[entity]-detail-client.tsx
"use client";

export function EntityDetailClient({
  entity,
  canEdit,
  canDelete,
}: EntityDetailClientProps): ReactElement {
  // Interactive elements only
  // Use existing hooks for mutations
  // Receive data as props (no client-side fetching)
}
```

#### When to Use SSR vs Client Components

**Use Server Components When:**

- ✅ Data needs to be available on initial page load
- ✅ SEO is important (data in HTML)
- ✅ Permission checks should happen server-side
- ✅ Detail pages (companies, users)
- ✅ List pages with initial data

**Use Client Components When:**

- ✅ User interactions (clicks, form inputs, dialogs)
- ✅ Real-time updates (WebSockets, polling)
- ✅ Browser APIs (localStorage, geolocation)
- ✅ Complex state management
- ✅ Third-party libraries requiring client-side execution

#### Error Handling

**MUST create error boundaries for all SSR routes:**

```typescript
// src/app/[route]/[id]/error.tsx
"use client";
export default function EntityDetailError({ error, reset }) {
  // Log to Sentry
  // Display error UI with retry option
}

// src/app/[route]/[id]/not-found.tsx
export default function EntityNotFound() {
  // Display 404 UI
}
```

#### Shared Utilities Pattern

**MUST extract data fetching logic to shared utilities:**

- **Location**: `src/features/[feature]/lib/fetch-[entity]-server.ts`
- **Purpose**: Reusable by both API routes and server components
- **Benefits**: Single source of truth, DRY principle, consistent validation

**Example**: See `src/features/users/lib/fetch-user-server.ts` for reference implementation.

#### Migration Checklist

When converting a detail page from client-side to SSR:

- [ ] Create shared fetching utility (`fetch-[entity]-server.ts`)
- [ ] Update API route to use shared utility (if applicable)
- [ ] Convert page to async Server Component
- [ ] Move interactive elements to client component
- [ ] Add `requirePermission()` for route-level auth
- [ ] Add `hasPermission()` for action-level permissions
- [ ] Use `notFound()` for 404 handling
- [ ] Create `error.tsx` error boundary
- [ ] Create `not-found.tsx` for 404 page
- [ ] Add revalidation strategy (`export const revalidate`)
- [ ] Test all scenarios (exists, not found, permissions, actions)

#### Documentation

**Complete SSR pattern documentation**: See [`docs/patterns/server-side-rendering.md`](docs/patterns/server-side-rendering.md)

**Reference implementations:**

- Users: `src/app/admin/users/[userId]/page.tsx`

### Next.js 15 Optimizations

- **Use Server Components** by default for data fetching (see SSR Pattern above)
- **Client Components** only when necessary (interactivity)
- **Dynamic imports** for large client components
- **Image optimization** with next/image
- **Font optimization** with next/font

### Bundle Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack configuration
    },
  },
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }
    return config;
  },
};

module.exports = nextConfig;
```

## 💅 Code Style & Quality

### ESLint Configuration (MANDATORY)

```javascript
// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
        },
      ],
    },
  },
];

export default eslintConfig;
```

## 📋 Development Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "validate": "pnpm run type-check && pnpm run lint && pnpm run test:coverage"
  }
}
```

**IMPORTANT**: Always use `pnpm run <command>` instead of `npm run <command>`

## 🎨 Design System & Figma Integration

This project has a comprehensive design system built on ReUI, Tailwind CSS v4, shadcn/ui (legacy support), and Next.js 15.

**Complete Design System Documentation**: `.cursor/rules/design_system_rules.mdc`

### Quick Reference

**For Figma Integration using Model Context Protocol (MCP)**:

1. **Start with the ReUI kit** - Match the Figma component ID to the corresponding `@reui/*` package before considering other sources
2. **Use Figma MCP Server assets directly** - DO NOT create placeholders or import new icon packages
3. **Map Figma tokens to CSS variables** - Defined in `src/app/globals.css` (OKLCH color space)
4. **Follow existing component patterns** - See `src/components/ui/` for legacy examples
5. **Use Tailwind utilities** - Compose styles, avoid custom CSS
6. **Test in light & dark modes** - Theme switching via `next-themes`

**Key Locations**:

- ReUI usage notes & mappings: `docs/design/reui.md` (create/update when new kits land)
- Design tokens: `src/app/globals.css` (colors, spacing, radius)
- Theme variants: `src/app/theme.css` (blue, green, amber, mono)
- Component library: `src/components/ui/` (legacy shadcn/ui components)
- Icons: `src/components/icons.tsx` (@remixicon/react)
- Font configuration: `src/lib/font.ts` (Geist, Inter, etc.)

**Component Pattern**:

```typescript
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const componentVariants = cva("base-classes", {
  variants: { /* variant definitions */ },
  defaultVariants: { /* defaults */ }
});

function Component({ className, variant, ...props }) {
  return (
    <div
      data-slot='component-name'
      className={cn(componentVariants({ variant, className }))}
      {...props}
    />
  );
}
```

**Refer to `.cursor/rules/design_system_rules.mdc` for**:

- Complete token reference and mapping guide
- Figma → Code integration workflow
- Component creation templates
- Asset management strategies
- Responsive design patterns
- Icon system usage

## 🎨 Design Agent System

This project includes a specialized design agent system for handling design-specific efforts through Cursor commands.

### Available Design Agents

Six specialized design agents are available via Cursor commands:

1. **Brand Guardian** (`/design.brand-guardian`) - Validates brand compliance
2. **Creative Director** (`/design.creative-director`) - Provides strategic design direction
3. **Art Director** (`/design.art-director`) - Defines visual execution details
4. **UI Analyzer** (`/design.ui-analyzer`) - Runs automated UI validation tests
5. **Accessibility Champion** (`/design.accessibility`) - Validates WCAG compliance
6. **Brand Auditor** (`/design.brand-auditor`) - Extracts brand guidelines from existing materials

### Unified Workflow

Use `/design.workflow` to execute the complete design workflow:

1. Creative Director → Strategic approach
2. Art Director → Visual execution
3. Brand Guardian → Compliance check
4. UI Analyzer → Automated testing
5. Accessibility Champion → WCAG validation

### Quick Reference

- **Agent Files**: `.cursor/agents/design/` (01-06 numbered agents)
- **Commands**: `.cursor/commands/design.*.md`
- **Design Reviews**: `docs/design/reviews/` (dated review documents)
- **Quick Guide**: `docs/design/AGENTS.md`
- **Design Principles**: `docs/design/design-principles.md`

### Usage Example

```bash
# Get creative direction for a feature
/design.creative-director user dashboard feature

# Validate brand compliance
/design.brand-guardian Button component

# Run complete design workflow
/design.workflow new checkout flow
```

**Key Integration Points**:

- Agents reference `docs/design/design-principles.md`, `brand.md`, and `project.md`
- All reviews saved to `docs/design/reviews/` with dated naming convention
- Agents work together in a hierarchical workflow
- See `docs/design/AGENTS.md` for detailed usage guide

## ⚠️ CRITICAL GUIDELINES (MUST FOLLOW ALL)

1. **ENFORCE strict TypeScript** - ZERO compromises on type safety
2. **VALIDATE everything with Zod** - ALL external data must be validated
3. **MINIMUM 80% test coverage** - NO EXCEPTIONS
4. **MUST co-locate related files** - Tests MUST be in `__tests__` folders
5. **MAXIMUM 500 lines per file** - Split if larger
6. **MAXIMUM 200 lines per component** - Refactor if larger
7. **MUST handle ALL states** - Loading, error, empty, and success
8. **MUST use semantic commits** - feat:, fix:, docs:, refactor:, test:
9. **NEVER add co-author statements** - No "Co-Authored-By:" or "Generated with Claude Code" in commit messages
10. **MUST write complete JSDoc** - ALL exports must be documented
11. **NEVER use `any` type** - Use proper typing or `unknown`
12. **MUST pass ALL automated checks** - Before ANY merge

## 📋 Pre-commit Checklist (MUST COMPLETE ALL)

- [ ] TypeScript compiles with ZERO errors (`pnpm run type-check`)
- [ ] Tests written and passing with 80%+ coverage (`pnpm run test:coverage`)
- [ ] ESLint passes with ZERO warnings (`pnpm run lint`)
- [ ] Prettier formatting applied (`pnpm run format`)
- [ ] All components have complete JSDoc documentation
- [ ] Zod schemas validate ALL external data
- [ ] ALL states handled (loading, error, empty, success)
- [ ] Error boundaries implemented for features
- [ ] Accessibility requirements met (ARIA labels, keyboard nav)
- [ ] No console.log statements in production code
- [ ] Environment variables validated with Zod
- [ ] Component files under 200 lines
- [ ] No prop drilling beyond 2 levels
- [ ] Server/Client components used appropriately

### FORBIDDEN Practices

- **NEVER use `any` type** (except library declaration merging with comments)
- **NEVER skip tests** for new functionality
- **NEVER ignore TypeScript errors** with `@ts-ignore`
- **NEVER trust external data** without Zod validation
- **NEVER use `JSX.Element`** - use `ReactElement` instead
- **NEVER store sensitive data** in localStorage or client state
- **NEVER use dangerouslySetInnerHTML** without sanitization
- **NEVER exceed file/component size limits**
- **NEVER prop drill** beyond 2 levels - use context or state management
- **NEVER commit** without passing all quality checks
- **NEVER add new shadcn/ui or custom components when a ReUI equivalent exists—flag the gap and request the proper component instead**
- **NEVER refactor legacy components to ReUI unless the task explicitly requests that migration; only flag the opportunity**
- **NEVER reimplement entity fetching logic** - Always use `useEntityList`, `useEntityQuery`, or `fetchEntityServer`
- **NEVER reimplement column layout logic** - Always use `useColumnLayout` hook

---

_This guide is optimized for Next.js 15 with React 19. Keep it updated as frameworks evolve._
_Focus on type safety, performance, and maintainability in all development decisions._
_Last updated: August 2025_
