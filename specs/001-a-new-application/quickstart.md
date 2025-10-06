# Quickstart: Client and Project Management

**Feature**: Client and Project Management
**Purpose**: Manual validation checklist to verify the feature works end-to-end

## Prerequisites

1. Application running locally (`pnpm run dev`)
2. User authenticated via Clerk
3. User belongs to an organization/team in Clerk
4. Feature code deployed to development environment

## Validation Steps

### Part 1: Client Management

#### 1.1 Empty State - Clients

**Action**: Navigate to `/clients`

**Expected Result**:
- Page loads without errors
- Empty state message displayed: "No clients yet" (or similar)
- "Create Client" or "Add Client" button visible
- No client list shown (list is empty)

**Pass Criteria**: ✅ Empty state handled gracefully, no errors in console

---

#### 1.2 Create First Client

**Action**:
1. Click "Create Client" button
2. Fill in form:
   - Company Name: "Acme Corporation"
   - Contact Person: "John Doe"
   - Email: "john@acme.com"
   - Phone: "+1234567890"
   - Address (optional): "123 Main St, Springfield"
   - Notes (optional): "Important client for Q4"
3. Submit form

**Expected Result**:
- Form validates successfully
- Client created (success message shown)
- Redirect to clients list or client details page
- New client "Acme Corporation" appears in the list
- All fields display correctly

**Pass Criteria**: ✅ Client created and visible with all correct data

---

#### 1.3 Create Second Client (Duplicate Name Test)

**Action**:
1. Create another client with same company name:
   - Company Name: "Acme Corporation" (same as before)
   - Contact Person: "Jane Smith"
   - Email: "jane@acme.com"
   - Phone: "+0987654321"
2. Submit form

**Expected Result**:
- Creation succeeds (duplicate names allowed per business rules)
- Both "Acme Corporation" clients appear in list
- Distinguished by different contact person or ID

**Pass Criteria**: ✅ Duplicate company names allowed, both clients visible

---

#### 1.4 Form Validation - Invalid Data

**Action**:
1. Try to create client with invalid email:
   - Company Name: "Beta Industries"
   - Contact Person: "Alice Brown"
   - Email: "not-an-email" (invalid format)
   - Phone: "+1111111111"
2. Submit form

**Expected Result**:
- Form does NOT submit
- Validation error displayed for email field: "Invalid email format" (or similar)
- Other fields retain their values
- No client created

**Pass Criteria**: ✅ Validation prevents submission, clear error message shown

---

#### 1.5 Search/Filter Clients

**Action**:
1. In clients list, use search input
2. Search for "Acme"

**Expected Result**:
- Only clients with "Acme" in company name or contact person shown
- Both "Acme Corporation" clients visible
- "Beta Industries" (if created in previous attempts) hidden

**Pass Criteria**: ✅ Search filters clients correctly

---

#### 1.6 View Client Details

**Action**: Click on "Acme Corporation" (first one created)

**Expected Result**:
- Navigate to client details page (`/clients/[id]`)
- All client information displayed correctly
- "Projects" section shown (currently empty)
- Edit and Delete buttons visible

**Pass Criteria**: ✅ Client details page shows all data correctly

---

#### 1.7 Edit Client

**Action**:
1. On client details page, click "Edit" button
2. Update:
   - Contact Person: "John Doe Jr."
   - Notes: "VIP client - handle with priority"
3. Save changes

**Expected Result**:
- Changes saved successfully
- Updated data displayed immediately
- Success message shown

**Pass Criteria**: ✅ Client updated, changes reflected in UI

---

### Part 2: Project Management

#### 2.1 Empty State - Projects

**Action**: Navigate to `/projects`

**Expected Result**:
- Page loads without errors
- Empty state message displayed: "No projects yet" (or similar)
- "Create Project" or "Add Project" button visible

**Pass Criteria**: ✅ Empty state handled gracefully

---

#### 2.2 Create Project with Client

**Action**:
1. Click "Create Project" button
2. Fill in form:
   - Project Name: "Website Redesign"
   - Description: "Complete overhaul of company website"
   - Client: Select "Acme Corporation" (first one)
   - Status: Leave as default ("Planning")
   - Start Date: Select today's date
   - End Date: Select date 2 months from now
   - Budget (optional): 50000
   - Notes (optional): "Phase 1 focus on mobile"
3. Submit form

**Expected Result**:
- Project created successfully
- Appears in projects list
- Status badge shows "Planning"
- Client name "Acme Corporation" displayed
- All fields correct

**Pass Criteria**: ✅ Project created and linked to client

---

#### 2.3 Create Project without Client

**Action**:
1. Create another project:
   - Project Name: "Internal Tool Development"
   - Description: "Build internal dashboard"
   - Client: Leave empty (null)
   - Start Date: Today
   - (Leave other fields as default/optional)
2. Submit form

**Expected Result**:
- Project created successfully (client optional per business rules)
- Appears in projects list
- Client field shows "No Client" or similar indicator

**Pass Criteria**: ✅ Project without client created successfully

---

#### 2.4 View Project Details

**Action**: Click on "Website Redesign" project

**Expected Result**:
- Navigate to project details page (`/projects/[id]`)
- All project information displayed
- Client information shown:
  - Company Name: "Acme Corporation"
  - Contact Person: "John Doe Jr."
  - Clickable link to client details
- Status badge displayed correctly

**Pass Criteria**: ✅ Project details show correctly with linked client info

---

#### 2.5 Update Project Status

**Action**:
1. On project details page, change status to "Active"
2. Save changes

**Expected Result**:
- Status updated immediately
- Status badge changes to show "Active"
- Updated timestamp refreshed

**Pass Criteria**: ✅ Status updated and reflected in UI

---

#### 2.6 Filter Projects by Status

**Action**:
1. Navigate to `/projects`
2. Filter by status "Active"

**Expected Result**:
- Only "Website Redesign" (status: Active) shown
- "Internal Tool Development" (status: Planning) hidden

**Pass Criteria**: ✅ Status filter works correctly

---

#### 2.7 Filter Projects by Client

**Action**:
1. Clear status filter
2. Filter by client "Acme Corporation"

**Expected Result**:
- Only "Website Redesign" shown
- "Internal Tool Development" (no client) hidden

**Pass Criteria**: ✅ Client filter works correctly

---

### Part 3: Client-Project Relationship

#### 3.1 View Projects from Client Details

**Action**:
1. Navigate to client details for "Acme Corporation" (`/clients/[id]`)
2. Look at "Projects" section

**Expected Result**:
- "Website Redesign" project listed under this client
- Project name is clickable link to project details

**Pass Criteria**: ✅ Client shows associated projects

---

#### 3.2 Soft-Delete Client with Projects

**Action**:
1. Still on "Acme Corporation" client details
2. Click "Delete" button
3. Confirm deletion (if confirmation dialog shown)

**Expected Result**:
- Client soft-deleted (success message)
- Redirect to clients list
- "Acme Corporation" NO LONGER appears in clients list
- (Client is hidden, not permanently deleted)

**Pass Criteria**: ✅ Client soft-deleted and hidden from list

---

#### 3.3 View Project with Soft-Deleted Client

**Action**:
1. Navigate to `/projects`
2. Click on "Website Redesign" project

**Expected Result**:
- Project still accessible
- Client information still displayed:
  - Company Name: "Acme Corporation"
  - Contact Person: "John Doe Jr."
  - NO clickable link (read-only)
  - Indicator shown: "(Deleted)" or similar
- Project data intact

**Pass Criteria**: ✅ Project preserves soft-deleted client name (read-only)

---

#### 3.4 Assign Client to Project

**Action**:
1. On "Internal Tool Development" project details
2. Edit project to assign client:
   - Client: Select second "Acme Corporation" (or create new client if needed)
3. Save changes

**Expected Result**:
- Client assigned successfully
- Client name now displayed on project
- Clickable link to client details

**Pass Criteria**: ✅ Client assignment works

---

#### 3.5 Remove Client from Project

**Action**:
1. Still on "Internal Tool Development" project
2. Edit project to remove client:
   - Client: Select "No Client" or clear selection
3. Save changes

**Expected Result**:
- Client removed from project
- Client field shows "No Client" again
- Project remains in system

**Pass Criteria**: ✅ Client removal works, project unaffected

---

### Part 4: Data Validation & Edge Cases

#### 4.1 Date Validation

**Action**:
1. Try to create/edit project with end date before start date:
   - Start Date: 2025-12-01
   - End Date: 2025-11-01 (earlier)
2. Submit

**Expected Result**:
- Validation error: "End date must be after start date" (or similar)
- Form does NOT submit
- Error message clear and specific

**Pass Criteria**: ✅ Date validation prevents invalid ranges

---

#### 4.2 Loading States

**Action**:
1. Create a new client or project
2. Observe UI during form submission

**Expected Result**:
- Loading indicator shown (spinner, disabled button, etc.)
- Form disabled during submission
- Clear visual feedback that action is in progress

**Pass Criteria**: ✅ Loading states provide feedback

---

#### 4.3 Error States

**Action**:
1. Simulate error (e.g., disconnect network, or try invalid operation)
2. Observe error handling

**Expected Result**:
- Error message displayed clearly
- User not left in broken state
- Option to retry or go back

**Pass Criteria**: ✅ Errors handled gracefully with clear messaging

---

## Summary Checklist

### Client Management
- [x] Empty state displayed correctly
- [x] Create client with valid data
- [x] Form validation prevents invalid data
- [x] Search/filter clients works
- [x] View client details
- [x] Edit client information
- [x] Soft-delete client

### Project Management
- [x] Empty state displayed correctly
- [x] Create project with client
- [x] Create project without client
- [x] View project details with client info
- [x] Update project status
- [x] Filter by status
- [x] Filter by client

### Relationships
- [x] Client shows associated projects
- [x] Soft-deleted client preserved in projects (read-only)
- [x] Assign client to project
- [x] Remove client from project

### Validation & UX
- [x] Email validation works
- [x] Date range validation works
- [x] Loading states shown
- [x] Error states handled

---

## Completion Criteria

✅ **All sections pass**: Feature is ready for production

⚠️ **Some failures**: Document issues, fix bugs, re-run failed sections

❌ **Major failures**: Feature not ready, requires significant rework

---

## Notes

- Take screenshots of key screens for documentation
- Note any unexpected behavior or UX issues
- Test with multiple organizations if possible (verify data isolation)
- Verify browser console has no errors during testing
