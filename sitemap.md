# Docko - Website Sitemap

## Overview

A streamlined document automation platform focusing on the core workflow: Upload DOCX → Detect Variables → Fill Variables → Merge & Export. Built for users aged 40-60 who prefer familiar tools like Microsoft Word.

## Sitemap Structure

### 1. Authentication Pages

```
/auth
├── /login                          # Sign in page
├── /signup                         # Create account
├── /forgot-password               # Password recovery
└── /reset-password/[token]        # Reset password with token
```

### 2. Main Application (Authenticated Users)

#### 2.1 Dashboard

```
/dashboard                          # Main dashboard
└── Features:
    ├── Quick Start button (Upload new template)
    ├── Recent documents (last 5)
    ├── Usage statistics (this month)
    └── Getting started tips (dismissible)
```

#### 2.2 Core Document Generation Flow

```
/generate                           # Document generation workflow (multi-step)
├── Step 1: /generate/upload       # Upload DOCX template
│   └── Features:
│       ├── Drag & drop zone
│       ├── Browse button
│       └── File validation (.docx only)
│
├── Step 2: /generate/variables    # Review detected variables
│   └── Features:
│       ├── List of simple variables (e.g., {{client_name}})
│       ├── List of section variables (e.g., {{section_tables}})
│       ├── Variable count summary
│       └── Continue or Re-upload option
│
├── Step 3: /generate/fill         # Fill variable values
│   └── Features:
│       ├── Form inputs for simple variables
│       ├── Dynamic section builder for complex variables
│       ├── Add/remove rows for table sections
│       ├── Save as draft (optional)
│       └── Preview populated values
│
└── Step 4: /generate/export       # Preview and export
    └── Features:
        ├── Document preview (read-only)
        ├── Export format selection (DOCX/PDF)
        ├── Auto-formatting checkbox (optional)
        ├── Download button
        └── Start new document button
```

#### 2.3 Document History

```
/documents                          # List of generated documents
├── /documents                      # Document list view
│   └── Features:
│       ├── Search by name
│       ├── Filter by date
│       ├── Sort options
│       └── Pagination
│
└── /documents/[id]                # Individual document details
    └── Features:
        ├── Document info (created date, template used)
        ├── Re-download options (DOCX/PDF)
        ├── View filled variables
        └── Generate similar document
```

### 3. User Settings

```
/settings
├── /settings/profile              # User profile
│   └── Features:
│       ├── Name
│       ├── Email
│       └── Password change
│
└── /settings/billing              # Subscription & usage
    └── Features:
        ├── Current plan (Free/Pro/Enterprise)
        ├── Usage statistics
        ├── Upgrade/downgrade options
        └── Payment method (Pro+)
```

### 4. Help & Support

```
/help
├── /help                          # Help center home
├── /help/getting-started         # Quick start guide
│   ├── Creating your first document
│   ├── Understanding variables
│   └── Video walkthrough
│
├── /help/tutorials               # Step-by-step tutorials
│   ├── /help/tutorials/simple-variables
│   ├── /help/tutorials/section-variables
│   └── /help/tutorials/export-options
│
├── /help/faq                     # Frequently asked questions
└── /help/contact                 # Contact support form
```

### 5. Legal Pages

```
/legal
├── /privacy                      # Privacy policy
├── /terms                        # Terms of service
└── /security                     # Security practices
```

## User Flows

### Primary Flow: First-Time Document Generation

1. **Login** → `/login`
2. **Dashboard** → `/dashboard` (Click "Upload New Template")
3. **Upload** → `/generate/upload` (Upload DOCX file)
4. **Review Variables** → `/generate/variables` (System detects all {{variables}})
5. **Fill Values** → `/generate/fill` (Enter data for each variable)
6. **Export** → `/generate/export` (Preview and download as DOCX/PDF)

### Secondary Flow: Repeat Document Generation

1. **Dashboard** → `/dashboard`
2. **Documents** → `/documents` (Find previous document)
3. **Document Detail** → `/documents/[id]` (Click "Generate Similar")
4. **Fill Values** → `/generate/fill` (Pre-populated template)
5. **Export** → `/generate/export`

## Navigation Structure

### Top Navigation (Authenticated)

- Logo (→ Dashboard)
- Generate New (→ `/generate/upload`)
- Documents (→ `/documents`)
- Help (→ `/help`)
- User Menu (dropdown)
  - Profile (→ `/settings/profile`)
  - Billing (→ `/settings/billing`)
  - Sign Out

### Mobile Navigation

- Bottom tab bar with:
  - Dashboard
  - Generate
  - Documents
  - Help
  - Settings

## Future Features (Post-MVP)

### Phase 2

- **Batch Processing**: `/generate/batch` - Upload Excel/CSV for bulk generation
- **Template Library**: `/templates` - Save and reuse templates
- **Team Collaboration**: `/settings/team` - Share templates within organization

### Phase 3

- **API Access**: `/developers` - REST API for automation
- **Integrations**: `/integrations` - Zapier, Google Drive, Dropbox
- **Advanced Formatting**: Custom formatting rules and templates

## Technical Notes

### Protected Routes

All routes except `/auth/*` and `/legal/*` require authentication.

### State Management

The `/generate/*` flow should maintain state across steps:

- Uploaded file
- Detected variables
- Filled values
- Export preferences

### API Endpoints Used

- `POST /api/v1/documents/detect-variables` - Step 2
- `POST /api/v1/documents/merge-variables` - Step 4
- `POST /api/v1/documents/format` - Step 4 (if auto-formatting enabled)

### Design Principles

- Clean, minimalist interface (Linear-inspired)
- Large, readable fonts (16px base)
- Clear CTAs and simple forms
- No animations or fancy effects
- High contrast for readability
- Mobile-first responsive design
