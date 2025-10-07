# Quickstart: Postgres Database Migration with Neon

**Feature**: 002-i-would-like | **Date**: 2025-10-06
**Purpose**: End-to-end validation of database migration from localStorage to Neon Postgres

## Prerequisites

- [ ] Neon account created (https://neon.tech)
- [ ] Neon database created with connection string
- [ ] `pnpm install` completed
- [ ] `.env.local` file created with `DATABASE_URL`
- [ ] Database migrations run (`pnpm drizzle-kit migrate`)

## Environment Setup

1. **Create `.env.local` file** (if not exists):
```bash
# Copy example environment file
cp .env.example .env.local

# Add DATABASE_URL (obtain from Neon dashboard)
echo "DATABASE_URL=postgres://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require" >> .env.local
```

2. **Install dependencies**:
```bash
# Install Drizzle ORM and Neon driver
pnpm install
```

3. **Run database migrations**:
```bash
# Generate initial migration
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate

# Verify schema in Drizzle Studio (optional)
pnpm drizzle-kit studio
```

## Validation Steps

### Step 1: Verify Database Connection

**Test**: Database health check endpoint responds successfully

```bash
# Start development server
pnpm run dev

# In another terminal, check health endpoint
curl http://localhost:3000/api/db-health

# Expected response:
# {"status":"ok","database":"connected","timestamp":"2025-10-06T..."}
```

**Success Criteria**:
- ✅ Health endpoint returns 200 OK
- ✅ Response includes `"status":"ok"` and `"database":"connected"`
- ✅ No connection errors in console

### Step 2: Create a Client

**Test**: Create a new client via UI or API

```bash
# Option A: Use UI
# 1. Open http://localhost:3000/clients
# 2. Click "Create Client" button
# 3. Fill form:
#    - Company Name: "Acme Corp"
#    - Contact Person: "John Doe"
#    - Email: "john@acme.com"
#    - Phone: "+1234567890"
#    - Address: "123 Main St, Anytown, USA"
# 4. Click "Save"

# Option B: Use API directly
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corp",
    "contactPerson": "John Doe",
    "email": "john@acme.com",
    "phone": "+1234567890",
    "address": "123 Main St, Anytown, USA"
  }'
```

**Success Criteria**:
- ✅ Client created successfully
- ✅ Client appears in clients list
- ✅ Client ID is a valid UUID
- ✅ createdAt and updatedAt timestamps populated
- ✅ version field equals 1
- ✅ deletedAt is null

### Step 3: Verify Multi-Tenant Isolation

**Test**: Clients from different organizations are isolated

```bash
# This test requires two test accounts/organizations
# Setup:
# 1. Sign in as User A (Org A)
# 2. Create Client X
# 3. Note Client X ID
# 4. Sign out
# 5. Sign in as User B (Org B)
# 6. Attempt to access Client X by ID

# Expected behavior:
# - User B cannot see Client X in list
# - Direct API call to Client X returns 404 or 403
```

**Success Criteria**:
- ✅ User B cannot access User A's clients
- ✅ API enforces organization isolation
- ✅ Database queries include `organizationId` filter

### Step 4: Create a Project

**Test**: Create a project associated with a client

```bash
# Via UI:
# 1. Navigate to Projects page
# 2. Click "Create Project"
# 3. Fill form:
#    - Name: "Website Redesign"
#    - Client: Select "Acme Corp"
#    - Status: "Planning"
#    - Start Date: 2025-01-01
#    - Budget: $50,000
# 4. Click "Save"
```

**Success Criteria**:
- ✅ Project created successfully
- ✅ Project linked to correct client
- ✅ Project appears in projects list
- ✅ Project appears in client's project list
- ✅ Status defaults to "Planning"
- ✅ version field equals 1

### Step 5: Test Optimistic Locking

**Test**: Concurrent edit detection works correctly

```bash
# This test requires two browser windows/users

# Window 1 (User A):
# 1. Open Client "Acme Corp" for editing
# 2. Note current version (should be 1)
# 3. Change company name to "Acme Corporation"
# 4. WAIT - do not save yet

# Window 2 (User B):
# 1. Open same Client "Acme Corp" for editing
# 2. Note current version (should be 1)
# 3. Change phone to "+0987654321"
# 4. Click Save (should succeed, version becomes 2)

# Window 1 (User A):
# 5. Now click Save
# 6. EXPECTED: Error message "Conflict: Client was modified by another user"
# 7. User A must refresh to see User B's changes
# 8. Retry edit with new version (2)
```

**Success Criteria**:
- ✅ Second save attempt (User A) is rejected
- ✅ Error message clearly indicates conflict
- ✅ User prompted to refresh and retry
- ✅ After refresh, User A sees User B's changes
- ✅ Retry succeeds with correct version number

### Step 6: Test Client Soft Delete

**Test**: Soft delete preserves data but hides from default views

```bash
# Via UI:
# 1. Navigate to Clients page
# 2. Find "Acme Corp" client
# 3. Click "Delete" (or trash icon)
# 4. Confirm deletion
# 5. Client should disappear from list
# 6. Navigate to client's projects
# 7. Projects should still exist, but client field shows "(Deleted Client)"
```

**Success Criteria**:
- ✅ Client removed from default client list
- ✅ Client still exists in database (deletedAt timestamp set)
- ✅ Client's projects remain accessible
- ✅ Project's clientId becomes null (ON DELETE SET NULL behavior)
- ✅ Soft-deleted client can be restored (if restore feature implemented)

### Step 7: Test Connection Failure Handling

**Test**: Application handles database disconnection gracefully

```bash
# Simulate connection failure:
# 1. Edit .env.local - change DATABASE_URL to invalid URL
# 2. Restart dev server
# 3. Try to load clients page

# Expected behavior:
# - Error boundary displays connection error
# - Clear message: "Database connection failed. Please check your connection."
# - No application crash
# - Error logged to console
```

**Success Criteria**:
- ✅ Application does not crash
- ✅ Error boundary catches database errors
- ✅ User-friendly error message displayed
- ✅ Error details logged for debugging

### Step 8: Test Project Status Transitions

**Test**: Status lifecycle validation works correctly

```bash
# Create a project in "Planning" status
# Valid transitions:
# 1. Planning → Active (should succeed)
# 2. Active → OnHold (should succeed)
# 3. OnHold → Active (should succeed)
# 4. Active → Completed (should succeed)
# 5. Completed → Planning (should FAIL - invalid transition)

# Via UI:
# 1. Create project "Test Project" with status "Planning"
# 2. Edit project, change status to "Active" - SAVE (✅ succeeds)
# 3. Edit project, change status to "OnHold" - SAVE (✅ succeeds)
# 4. Edit project, change status to "Active" - SAVE (✅ succeeds)
# 5. Edit project, change status to "Completed" - SAVE (✅ succeeds)
# 6. Edit project, change status to "Planning" - SAVE (❌ fails with validation error)
```

**Success Criteria**:
- ✅ Valid transitions succeed
- ✅ Invalid transitions rejected with clear error message
- ✅ Terminal states (Completed, Cancelled) cannot transition back

### Step 9: Test Data Persistence Across Sessions

**Test**: Data persists after closing browser

```bash
# 1. Create a client "Test Company"
# 2. Create a project "Test Project" linked to client
# 3. Note client ID and project ID
# 4. Close browser completely
# 5. Open browser, navigate to application
# 6. Sign in again
# 7. Navigate to Clients page
# 8. Find "Test Company" client
# 9. Navigate to client's projects
# 10. Verify "Test Project" still exists
```

**Success Criteria**:
- ✅ Client data persists across sessions
- ✅ Project data persists across sessions
- ✅ Client-project relationship preserved
- ✅ No data loss on browser close

### Step 10: Run Automated Test Suite

**Test**: All tests pass with database backend

```bash
# Run full test suite
pnpm run test:coverage

# Expected output:
# ✅ All contract tests pass
# ✅ All database layer tests pass
# ✅ All Server Action tests pass
# ✅ All integration tests pass
# ✅ Code coverage ≥ 80%
```

**Success Criteria**:
- ✅ 0 failing tests
- ✅ Coverage meets 80% threshold
- ✅ No type errors (`pnpm run type-check`)
- ✅ No lint errors (`pnpm run lint`)

## Cleanup Verification

### Step 11: Verify localStorage Removal

**Test**: localStorage is no longer used

```bash
# Search codebase for localStorage usage
rg "localStorage" src/

# Expected: No results in production code
# (May appear in comments or old code removed)
```

**Success Criteria**:
- ✅ `src/features/clients-projects/actions/storage.ts` deleted
- ✅ No `localStorage.getItem` calls in client/project features
- ✅ No `localStorage.setItem` calls in client/project features

### Step 12: Verify Mock API Removal

**Test**: Mock Products API removed

```bash
# Check if mock-api.ts exists
ls src/constants/mock-api.ts

# Expected: File not found
```

**Success Criteria**:
- ✅ `src/constants/mock-api.ts` deleted
- ✅ No imports of `fakeProducts` in codebase
- ✅ No references to mock Products API

## Performance Validation

### Step 13: Query Performance

**Test**: Database queries complete within acceptable time

```bash
# Test large dataset performance:
# 1. Use Drizzle Studio to insert 1000 test clients
# 2. Use Drizzle Studio to insert 5000 test projects
# 3. Load clients page - measure time
# 4. Load projects page - measure time
# 5. Filter projects by client - measure time
# 6. Search clients by name - measure time

# Performance targets (MVP scale):
# - List queries: < 1 second
# - Filtered queries: < 1.5 seconds
# - Single record lookup: < 500ms
```

**Success Criteria**:
- ✅ List queries complete in < 1s
- ✅ Filtered queries complete in < 1.5s
- ✅ Single lookups complete in < 500ms
- ✅ No N+1 query issues
- ✅ Indexes utilized (check EXPLAIN ANALYZE)

## Rollback Plan

If critical issues are discovered:

1. **Revert database changes**:
```bash
# Rollback last migration
pnpm drizzle-kit drop

# Or reset database entirely (warning: data loss)
# Drop all tables and re-run migrations from scratch
```

2. **Restore localStorage version**:
```bash
# Checkout previous commit before database migration
git checkout <commit-hash-before-migration>

# Redeploy
pnpm run build
```

3. **Verify old code works**:
```bash
# Run tests on reverted code
pnpm run test

# Start dev server
pnpm run dev
```

## Success Summary

Complete quickstart when ALL criteria met:

- [x] Database connection established
- [x] Clients can be created, read, updated, soft-deleted
- [x] Projects can be created, read, updated, hard-deleted
- [x] Optimistic locking prevents concurrent edit conflicts
- [x] Multi-tenant isolation enforced
- [x] Status transition validation works
- [x] Data persists across sessions
- [x] Test suite passes with 80%+ coverage
- [x] localStorage code removed
- [x] Mock API code removed
- [x] Performance targets met

**Estimated Time**: 45-60 minutes

---
**Quickstart Status**: Ready for Execution | **Prerequisites**: Database setup complete
