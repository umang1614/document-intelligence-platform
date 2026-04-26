# Testing Guide - Document Intelligence Platform

## Complete Flow Implementation

### 1. Login Flow ✅

- **Route**: `/` redirects to `/login`
- **Login page** accepts email and password
- Stores JWT token, role, designation, and email in localStorage
- Redirects to `/dashboard` on success

### 2. Dashboard Based on Role ✅

#### For ADMIN & EDITOR:

- Shows **two tabs**:
  - **Upload Document**: Full form with PDF upload
  - **View Document**: Input field to enter document ID
- Can create documents with metadata and PDF files
- Success message shows: "Document created successfully! Document ID: {id}"

#### For VIEWER (other roles):

- Shows **only** the "View Document" section
- Input field to enter document ID
- No upload capability

### 3. Document Upload Features ✅

- **PDF File Upload**: Required field (accepts only PDF)
- **Title**: Text input (required)
- **Description**: Textarea (required)
- **Visibility Type**: Dropdown (PRIVATE / DESIGNATION_BASED)
- **Designations**: Checkbox list (TM, LEAD, SE, JE) - shown only for DESIGNATION_BASED
- Success alert with document ID on successful upload
- Form resets after successful submission

### 4. View Document by ID ✅

- Available to **all roles** on dashboard
- Input document ID and click "View Document"
- Navigates to `/documents/{id}`
- Shows document details: title, description, owner, visibility, created date

### 5. Access Control ✅

- Backend validates:
  - Owner can always access their documents
  - For DESIGNATION_BASED: checks user's designation
  - Returns 403 if access denied
- Frontend shows appropriate error messages:
  - 403: "Access denied. You don't have permission to view this document."
  - 404: "Document not found."

## Testing Steps

### Step 1: Test Login

1. Navigate to `http://localhost:5173/` (should redirect to `/login`)
2. Login with different user roles:
   - **Admin/Editor**: Should see upload and view tabs
   - **Viewer**: Should see only view document section

### Step 2: Test Document Upload (Admin/Editor only)

1. On dashboard, click "Upload Document" tab
2. Fill in:
   - Select a PDF file
   - Enter title
   - Enter description
   - Select visibility type
   - If DESIGNATION_BASED, select designations
3. Click "Create Document"
4. Should see success message with document ID
5. Note the document ID for testing

### Step 3: Test Document View (All Roles)

1. Click "View Document" tab (or section for viewers)
2. Enter the document ID from Step 2
3. Click "View Document"
4. Should navigate to document view page
5. Should see document details

### Step 4: Test Access Control

1. Login as different users
2. Try accessing documents with different visibility settings:
   - PRIVATE: Only owner can view
   - DESIGNATION_BASED: Only users with allowed designations can view
3. Should see "Access denied" message when not authorized

## API Endpoints Used

- `POST /auth/login` - User login
- `POST /documents` - Create document (ADMIN/EDITOR only)
- `GET /documents/{id}` - View document (with access control)

## Important Notes

⚠️ **Backend Note**: The current backend implementation saves document metadata but doesn't actually store the PDF file. The file upload is handled on the frontend but you'll need to update the backend to:

1. Accept multipart/form-data
2. Store the PDF file (filesystem or cloud storage)
3. Return file URL in the response

## Database Schema

- **User**: id, email, password, role, designation
- **Document**: id, title, description, visibilityType, owner_id, createdAt
- **DocumentAllowedDesignation**: document_id, designation

## LocalStorage Keys

- `token`: JWT authentication token
- `email`: User email
- `role`: User role (ADMIN, EDITOR, VIEWER)
- `designation`: User designation (TM, LEAD, SE, JE)
