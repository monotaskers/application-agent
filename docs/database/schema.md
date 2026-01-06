# Database Schema Documentation

## Overview

This database schema supports a multi-tenant application with user profiles and company/organization management. The schema extends Supabase Auth with additional profile data and implements soft deletes, automatic timestamp management, and Row Level Security (RLS) policies.

**Key Features:**
- User profiles extending Supabase Auth users
- Company/organization entities with user associations
- Soft delete pattern (using `deleted_at` timestamps)
- Automatic `updated_at` timestamp management via triggers
- Row Level Security (RLS) for data access control
- Comprehensive address and contact information support

## Database Functions

### `handle_updated_at()`

**Purpose:** Automatically updates the `updated_at` timestamp when a row is modified.

**Language:** PL/pgSQL

**Returns:** Trigger

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

**Usage:** This function is used by triggers on tables that need automatic timestamp management. It sets the `updated_at` column to the current timestamp before an UPDATE operation.

## Tables

### `companies`

**Purpose:** Company/organization entities that users can belong to.

**Description:** Stores company information with soft delete support. Companies are uniquely identified by name and can be associated with multiple user profiles.

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key (UUID) |
| `name` | `text` | NOT NULL | - | Company name (unique) |
| `created_at` | `timestamp with time zone` | NOT NULL | `now()` | Timestamp when company was created |
| `updated_at` | `timestamp with time zone` | NOT NULL | `now()` | Timestamp when company was last updated (automatically maintained) |
| `deleted_at` | `timestamp with time zone` | NULL | - | Soft delete timestamp (null = active, non-null = deleted) |

#### Constraints

**Primary Key:**
- `companies_pkey` on `id`

**Unique Constraints:**
- `companies_name_key` on `name` - Ensures company names are unique

#### Indexes

- `companies_deleted_at_idx` - B-tree index on `deleted_at` (partial index, WHERE `deleted_at IS NULL`)
  - **Purpose:** Optimizes queries for active (non-deleted) companies

#### Triggers

- `companies_updated_at` - BEFORE UPDATE trigger
  - **Function:** `handle_updated_at()`
  - **Purpose:** Automatically sets `updated_at` to current timestamp on update

#### Row Level Security (RLS)

RLS is enabled on this table.

**Policies:**

1. **"Users can view active companies"** (SELECT)
   - **Condition:** `deleted_at IS NULL`
   - **Purpose:** Users can only view companies that haven't been soft-deleted

#### Usage Patterns

- Companies are created when needed and can be associated with user profiles via `profiles.company_id`
- Soft delete pattern: Set `deleted_at` to a timestamp to mark as deleted, rather than physically removing the record
- Active companies are queried using `WHERE deleted_at IS NULL`

#### Relationships

- **One-to-Many:** `companies.id` ← `profiles.company_id` (foreign key with ON DELETE SET NULL)

---

### `profiles`

**Purpose:** User profiles extending Supabase Auth users with additional profile data.

**Description:** Extends the Supabase Auth `users` table with additional profile information including contact details, address information, dashboard preferences, and company association.

#### Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | NOT NULL | - | Primary key matching auth.users.id |
| `email` | `text` | NULL | - | User email (can differ from auth.users.email) |
| `full_name` | `text` | NULL | - | User full name (max 255 characters) |
| `bio` | `text` | NULL | - | User biography/description |
| `avatar_url` | `text` | NULL | - | URL to user avatar image |
| `phone` | `text` | NULL | - | User phone number (5-20 characters) |
| `dashboard_layout_preferences` | `jsonb` | NULL | - | JSON object storing dashboard layout preferences |
| `created_at` | `timestamp with time zone` | NOT NULL | `now()` | Timestamp when profile was created |
| `updated_at` | `timestamp with time zone` | NOT NULL | `now()` | Timestamp when profile was last updated (automatically maintained) |
| `deleted_at` | `timestamp with time zone` | NULL | - | Soft delete timestamp (null = active, non-null = deleted) |
| `company_id` | `uuid` | NULL | - | Foreign key referencing companies.id. Automatically assigned based on email domain. |
| `address_1` | `text` | NULL | - | Primary address line (street address, PO box, etc.) |
| `address_2` | `text` | NULL | - | Secondary address line (apartment, suite, unit, building, floor, etc.) |
| `city` | `text` | NULL | - | City or locality name |
| `state` | `text` | NULL | - | State, province, or region code |
| `postal_code` | `text` | NULL | - | Postal or ZIP code |
| `country` | `text` | NULL | `'US'` | Country code (defaults to US) |
| `title` | `text` | NULL | - | User job title or role |

#### Constraints

**Primary Key:**
- `profiles_pkey` on `id`

**Foreign Keys:**
- `profiles_company_id_fkey` - `company_id` → `companies.id` (ON DELETE SET NULL)
  - **Behavior:** If a company is deleted, the profile's `company_id` is set to NULL
- `profiles_id_fkey` - `id` → `auth.users.id` (ON DELETE CASCADE)
  - **Behavior:** If the auth user is deleted, the profile is automatically deleted

**Check Constraints:**
- `profiles_email_format` - Validates email format using regex: `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$`
  - **Note:** Only validates if email is not NULL
- `profiles_full_name_length` - Ensures full_name length ≤ 255 characters (if not NULL)
- `profiles_phone_length` - Ensures phone length is between 5 and 20 characters (if not NULL)

#### Indexes

- `profiles_company_id_idx` - B-tree index on `company_id` (partial index, WHERE `company_id IS NOT NULL`)
  - **Purpose:** Optimizes queries filtering profiles by company
- `profiles_created_at_idx` - B-tree index on `created_at` (DESC)
  - **Purpose:** Optimizes queries ordering profiles by creation date (newest first)
- `profiles_deleted_at_idx` - B-tree index on `deleted_at` (partial index, WHERE `deleted_at IS NULL`)
  - **Purpose:** Optimizes queries for active (non-deleted) profiles
- `profiles_email_idx` - B-tree index on `email` (partial index, WHERE `email IS NOT NULL`)
  - **Purpose:** Optimizes email-based lookups

#### Triggers

- `profiles_updated_at` - BEFORE UPDATE trigger
  - **Function:** `handle_updated_at()`
  - **Purpose:** Automatically sets `updated_at` to current timestamp on update

#### Row Level Security (RLS)

RLS is enabled on this table.

**Policies:**

1. **"Users can insert own profile"** (INSERT)
   - **Condition:** `auth.uid() = id`
   - **Purpose:** Users can only create their own profile

2. **"Users can update own profile"** (UPDATE)
   - **Condition:** `auth.uid() = id AND deleted_at IS NULL`
   - **Purpose:** Users can only update their own active (non-deleted) profile

3. **"Users can view own profile"** (SELECT)
   - **Condition:** `auth.uid() = id AND deleted_at IS NULL`
   - **Purpose:** Users can only view their own active (non-deleted) profile

#### Usage Patterns

- Profiles are created when a user signs up and must match an existing `auth.users.id`
- Company association is automatically assigned based on email domain (e.g., `@ocupop.com` emails are assigned to the default "Ocupop" company)
- Soft delete pattern: Set `deleted_at` to a timestamp to mark as deleted
- Active profiles are queried using `WHERE deleted_at IS NULL`
- Dashboard layout preferences are stored as JSONB for flexible customization

#### Relationships

- **Many-to-One:** `profiles.company_id` → `companies.id` (foreign key with ON DELETE SET NULL)
- **One-to-One:** `profiles.id` → `auth.users.id` (foreign key with ON DELETE CASCADE)

---

## Relationships Diagram

```
┌─────────────────┐
│  auth.users     │
│  (Supabase)     │
└────────┬────────┘
         │
         │ ON DELETE CASCADE
         │
         ▼
┌─────────────────┐         ┌─────────────────┐
│    profiles     │         │    companies   │
│                 │         │                 │
│  id (PK, FK)    │         │  id (PK)        │
│  company_id (FK)├────────►│  name (UNIQUE) │
│  email          │         │  created_at     │
│  full_name      │         │  updated_at     │
│  bio            │         │  deleted_at     │
│  avatar_url     │         └─────────────────┘
│  phone          │
│  address_*     │
│  title         │
│  dashboard_*   │
│  created_at    │
│  updated_at    │
│  deleted_at    │
└─────────────────┘
```

**Relationship Details:**
- Each profile belongs to exactly one auth user (1:1 relationship via `profiles.id = auth.users.id`)
- Each profile can optionally belong to one company (many-to-one via `profiles.company_id`)
- When a company is deleted, associated profiles have their `company_id` set to NULL (ON DELETE SET NULL)
- When an auth user is deleted, their profile is automatically deleted (ON DELETE CASCADE)

## Indexes Summary

### Companies Table

| Index Name | Columns | Type | Partial Condition | Purpose |
|------------|---------|------|-------------------|---------|
| `companies_deleted_at_idx` | `deleted_at` | B-tree | `deleted_at IS NULL` | Optimize queries for active companies |

### Profiles Table

| Index Name | Columns | Type | Partial Condition | Purpose |
|------------|---------|------|-------------------|---------|
| `profiles_company_id_idx` | `company_id` | B-tree | `company_id IS NOT NULL` | Optimize company-based profile queries |
| `profiles_created_at_idx` | `created_at` | B-tree (DESC) | - | Optimize ordering by creation date |
| `profiles_deleted_at_idx` | `deleted_at` | B-tree | `deleted_at IS NULL` | Optimize queries for active profiles |
| `profiles_email_idx` | `email` | B-tree | `email IS NOT NULL` | Optimize email-based lookups |

**Index Strategy:**
- Partial indexes are used extensively to optimize queries on non-null values and active (non-deleted) records
- The `created_at` index uses DESC ordering to optimize "newest first" queries
- All indexes use B-tree structure for efficient range and equality queries

## Triggers Summary

| Trigger Name | Table | Event | Function | Purpose |
|--------------|-------|-------|----------|---------|
| `companies_updated_at` | `companies` | BEFORE UPDATE | `handle_updated_at()` | Automatically update `updated_at` timestamp |
| `profiles_updated_at` | `profiles` | BEFORE UPDATE | `handle_updated_at()` | Automatically update `updated_at` timestamp |

**Trigger Behavior:**
- Both triggers fire before UPDATE operations
- They automatically set the `updated_at` column to the current timestamp
- This ensures timestamp consistency without requiring application-level logic

## Row Level Security (RLS) Summary

### Companies Table

| Policy Name | Operation | Condition | Description |
|-------------|-----------|-----------|-------------|
| "Users can view active companies" | SELECT | `deleted_at IS NULL` | Users can only view non-deleted companies |

### Profiles Table

| Policy Name | Operation | Condition | Description |
|-------------|-----------|-----------|-------------|
| "Users can insert own profile" | INSERT | `auth.uid() = id` | Users can only create their own profile |
| "Users can update own profile" | UPDATE | `auth.uid() = id AND deleted_at IS NULL` | Users can only update their own active profile |
| "Users can view own profile" | SELECT | `auth.uid() = id AND deleted_at IS NULL` | Users can only view their own active profile |

**RLS Strategy:**
- All tables have RLS enabled
- Policies ensure users can only access their own data
- Soft-deleted records are excluded from SELECT operations
- Company viewing is restricted to active (non-deleted) companies

## Notes

### Soft Delete Pattern

Both `companies` and `profiles` tables implement soft deletes using the `deleted_at` timestamp column:
- **Active records:** `deleted_at IS NULL`
- **Deleted records:** `deleted_at IS NOT NULL` (contains deletion timestamp)
- **Queries:** Always filter with `WHERE deleted_at IS NULL` to get active records
- **Indexes:** Partial indexes on `deleted_at IS NULL` optimize active record queries

### Automatic Timestamp Management

Both tables use triggers to automatically maintain `updated_at` timestamps:
- **Created:** `created_at` is set via DEFAULT `now()`
- **Updated:** `updated_at` is automatically set by `handle_updated_at()` trigger on UPDATE
- **No manual updates needed:** Application code doesn't need to manage these timestamps

### Company Assignment

User profiles are automatically associated with companies based on email domain:
- Users with `@ocupop.com` email addresses are assigned to the default "Ocupop" company
- This assignment logic is handled at the application level, not in the database

### Address Fields

The `profiles` table includes comprehensive address fields:
- `address_1` and `address_2` for street address
- `city`, `state`, `postal_code`, `country` for location
- `country` defaults to `'US'` if not specified

### Dashboard Preferences

The `dashboard_layout_preferences` column uses JSONB for flexible storage:
- Allows storing arbitrary dashboard configuration
- Can be queried and updated using PostgreSQL JSONB operators
- No schema validation at the database level (handled by application)

---

_Last updated: Generated from schema.sql_

