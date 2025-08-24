# Docko Frontend Development Todo

## Project Overview

**Product**: Docko - Document automation platform using familiar DOCX templates
**Target Audience**: Business professionals aged 40-60
**Core Flow**: Upload DOCX → Detect Variables → Fill Variables → Merge & Export
**Design**: Clean, minimalist, Linear-inspired (no fancy animations or glowing effects)

---

## 🎯 Phase 1: Foundation Setup

### 1.1 Project Architecture & Tooling

- [ ] Initialize Next.js 14 with App Router and TypeScript
- [ ] Configure ESLint and Prettier with consistent rules
- [ ] Setup Tailwind CSS with custom configuration
- [ ] Install and configure core dependencies:
  - [ ] `@auth0/nextjs-auth0` for authentication
  - [ ] `zustand` for client state management
  - [ ] `@tanstack/react-query` for server state
  - [ ] `@headlessui/react` for accessible components
  - [ ] `lucide-react` for consistent icons
  - [ ] `react-hook-form` + `zod` for forms validation
  - [ ] `axios` for API requests
- [ ] Create `.env.local` template with Auth0 variables

### 1.2 Project Structure Setup

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
│   ├── ui/                # Base components (Button, Input, etc.)
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── documents/         # Document management
│   ├── generation/        # Document generation flow
│   └── settings/          # User settings
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Auth0 configuration
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── styles/               # Global styles
└── hooks/                # Custom React hooks
```

- [ ] Create folder structure with barrel exports
- [ ] Setup absolute imports with `@/` alias

### 1.3 Design System Foundation

- [ ] Create color palette (neutral, primary, success, error, warning)
- [ ] Define typography scale (optimized for 40-60 age group)
- [ ] Create spacing and sizing scales
- [ ] Setup custom Tailwind configuration
- [ ] Create base UI components:
  - [ ] `Button` with variants (primary, secondary, ghost)
  - [ ] `Input` with validation states
  - [ ] `Card` for content containers
  - [ ] `Badge` for status indicators
  - [ ] `LoadingSpinner` component
  - [ ] `Modal` for dialogs

---

## 🔐 Phase 2: Authentication (Auth0 Integration)

### 2.1 Auth0 Configuration

- [ ] Setup Auth0 application and tenant
- [ ] Configure callback URLs and allowed origins
- [ ] Setup Auth0 Provider in Next.js app
- [ ] Create type-safe user profile interface
- [ ] Implement protected route middleware

### 2.2 Authentication Pages (`/auth/*`)

- [ ] **`/auth/login`**: Login page
  - [ ] Auth0 login button with proper branding
  - [ ] Redirect handling for protected routes
  - [ ] Error state handling
  - [ ] Mobile-responsive design

- [ ] **`/auth/signup`**: Registration page
  - [ ] Auth0 signup flow
  - [ ] Terms acceptance checkbox
  - [ ] Welcome email trigger
  - [ ] Success state with next steps

- [ ] **`/auth/callback`**: Auth0 callback handler
  - [ ] Token processing and validation
  - [ ] User profile creation/update
  - [ ] Redirect to intended destination

### 2.3 Authentication Components

- [ ] `AuthGuard` component for protected routes
- [ ] `UserMenu` dropdown component
- [ ] `LoginButton` and `LogoutButton` components
- [ ] User profile avatar component

---

## 📄 Phase 3: Core Document Generation Workflow

### 3.1 Multi-Step Generation Flow (`/generate/*`)

#### 3.1.1 Step 1: Upload (`/generate/upload`)

- [ ] **File Upload Component**:
  - [ ] Drag & drop zone with visual feedback
  - [ ] File browse button
  - [ ] File validation (.docx only, max size check)
  - [ ] Upload progress indicator
  - [ ] Error handling for invalid files

- [ ] **Upload Page Layout**:
  - [ ] Progress indicator (Step 1 of 4)
  - [ ] Clear instructions for DOCX upload
  - [ ] File requirements display
  - [ ] Continue button (disabled until file uploaded)

#### 3.1.2 Step 2: Variables Review (`/generate/variables`)

- [ ] **Variables Detection Display**:
  - [ ] API integration with `/api/v1/documents/detect-variables`
  - [ ] Simple variables list with examples
  - [ ] Section variables with structure preview
  - [ ] Total count summary
  - [ ] Loading state during detection

- [ ] **Variables Page Layout**:
  - [ ] Progress indicator (Step 2 of 4)
  - [ ] Variables categorization (Simple vs Complex)
  - [ ] Re-upload option if variables look wrong
  - [ ] Continue to fill variables button

#### 3.1.3 Step 3: Fill Variables (`/generate/fill`)

- [ ] **Dynamic Form Generation**:
  - [ ] Simple variable inputs (text, email, date, number)
  - [ ] Section variable builders with add/remove rows
  - [ ] Form validation with clear error messages
  - [ ] Save as draft functionality (localStorage)
  - [ ] Auto-save every 30 seconds

- [ ] **Complex Section Builder**:
  - [ ] Table row management (add/delete rows)
  - [ ] Dynamic column handling
  - [ ] Section title editor
  - [ ] Preview of section structure
  - [ ] Copy/paste functionality for similar sections

- [ ] **Fill Variables Page Layout**:
  - [ ] Progress indicator (Step 3 of 4)
  - [ ] Collapsible sections for organization
  - [ ] Form progress indicator
  - [ ] Save draft and continue buttons

#### 3.1.4 Step 4: Export (`/generate/export`)

- [ ] **Document Preview**:
  - [ ] Read-only document preview (iframe or custom renderer)
  - [ ] Variable replacement highlighting
  - [ ] Error detection for unfilled variables

- [ ] **Export Options**:
  - [ ] Format selection (DOCX/PDF)
  - [ ] Auto-formatting checkbox integration
  - [ ] Download button with progress
  - [ ] Generated document naming convention

- [ ] **Export Page Layout**:
  - [ ] Progress indicator (Step 4 of 4)
  - [ ] Preview and export options side-by-side
  - [ ] Success state with download link
  - [ ] Start new document button

### 3.2 Generation State Management

- [ ] Zustand store for generation workflow state
- [ ] Persist form data across steps
- [ ] Handle browser refresh gracefully
- [ ] Clear state on completion

---

## 🏠 Phase 4: Main Application Pages

### 4.1 Dashboard (`/dashboard`)

- [ ] **Dashboard Components**:
  - [ ] Quick start card with upload button
  - [ ] Recent documents list (last 5)
  - [ ] Usage statistics for current month
  - [ ] Getting started tips (dismissible)

- [ ] **Dashboard Layout**:
  - [ ] Clean grid layout
  - [ ] Mobile-responsive cards
  - [ ] Empty states for new users
  - [ ] Quick action buttons

### 4.2 Documents Management (`/documents/*`)

#### 4.2.1 Documents List (`/documents`)

- [ ] **Documents Table/Grid**:
  - [ ] Document name, creation date, template used
  - [ ] Search functionality
  - [ ] Date range filters
  - [ ] Sort options (date, name, status)
  - [ ] Pagination for large lists
  - [ ] Empty state for no documents

- [ ] **Document Actions**:
  - [ ] Download (DOCX/PDF)
  - [ ] Delete document
  - [ ] Generate similar document
  - [ ] View details

#### 4.2.2 Document Details (`/documents/[id]`)

- [ ] **Document Information**:
  - [ ] Creation timestamp
  - [ ] Template used
  - [ ] Export format history
  - [ ] Variable values used

- [ ] **Document Actions**:
  - [ ] Re-download options
  - [ ] Generate similar with pre-filled data
  - [ ] Delete document

### 4.3 User Settings (`/settings/*`)

#### 4.3.1 Profile Settings (`/settings/profile`)

- [ ] **Profile Management**:
  - [ ] User information display/edit
  - [ ] Profile picture from Auth0
  - [ ] Password change (Auth0 redirect)
  - [ ] Email verification status

#### 4.3.2 Billing Settings (`/settings/billing`)

- [ ] **Subscription Management**:
  - [ ] Current plan display (Free/Pro/Enterprise)
  - [ ] Usage statistics with limits
  - [ ] Upgrade/downgrade options
  - [ ] Payment method management (future)

---

## 📚 Phase 5: Help & Support System (`/help/*`)

### 5.1 Help Center (`/help`)

- [ ] **Help Home Page**:
  - [ ] Search functionality
  - [ ] Popular articles
  - [ ] Quick start guides
  - [ ] Contact support CTA

### 5.2 Getting Started (`/help/getting-started`)

- [ ] **Step-by-step Guide**:
  - [ ] Creating first document walkthrough
  - [ ] Understanding variables explanation
  - [ ] Video tutorial embed (future)
  - [ ] Interactive demo (future)

### 5.3 Tutorials (`/help/tutorials/*`)

- [ ] **Simple Variables Tutorial**:
  - [ ] What are simple variables
  - [ ] Best practices for naming
  - [ ] Common use cases

- [ ] **Section Variables Tutorial**:
  - [ ] Understanding complex sections
  - [ ] Table structure examples
  - [ ] Dynamic content management

### 5.4 FAQ (`/help/faq`)

- [ ] **FAQ Page**:
  - [ ] Searchable/filterable questions
  - [ ] Categories (Getting Started, Variables, Export, etc.)
  - [ ] Expandable Q&A sections

### 5.5 Contact Support (`/help/contact`)

- [ ] **Support Form**:
  - [ ] Category selection
  - [ ] Detailed message input
  - [ ] File attachment option
  - [ ] User information pre-fill

---

## 🎨 Phase 6: UI/UX Polish & Responsive Design

### 6.1 Design System Completion

- [ ] **Typography**:
  - [ ] Large, readable fonts (16px base minimum)
  - [ ] High contrast ratios for accessibility
  - [ ] Consistent font weights and spacing

- [ ] **Color Palette**:
  - [ ] Professional, trustworthy colors
  - [ ] Sufficient contrast ratios
  - [ ] Clear semantic colors (error, success, warning)

- [ ] **Components Polish**:
  - [ ] Consistent spacing and sizing
  - [ ] Hover states and interactions
  - [ ] Focus indicators for keyboard navigation
  - [ ] Loading states for all async operations

### 6.2 Responsive Design

- [ ] **Desktop Layout** (1024px+):
  - [ ] Top navigation with user menu
  - [ ] Sidebar for secondary navigation
  - [ ] Multi-column layouts where appropriate

- [ ] **Tablet Layout** (768px - 1023px):
  - [ ] Collapsible sidebar
  - [ ] Optimized form layouts
  - [ ] Touch-friendly button sizes

- [ ] **Mobile Layout** (< 768px):
  - [ ] Bottom tab navigation (Dashboard, Generate, Documents, Help, Settings)
  - [ ] Single-column layouts
  - [ ] Large touch targets (44px minimum)
  - [ ] Simplified navigation

### 6.3 Error Handling & Loading States

- [ ] **Global Error Handling**:
  - [ ] API error interceptors
  - [ ] User-friendly error messages
  - [ ] Network connectivity handling
  - [ ] Error boundary components

- [ ] **Loading States**:
  - [ ] Skeleton loaders for content
  - [ ] Progress indicators for uploads
  - [ ] Button loading states
  - [ ] Page-level loading indicators

---

## 🔌 Phase 7: API Integration

### 7.1 API Client Setup

- [ ] **Type-safe API Client**:
  - [ ] Axios instance with interceptors
  - [ ] Request/response type definitions
  - [ ] Error handling middleware
  - [ ] Auth token management

### 7.2 Backend API Integration

- [ ] **Document Endpoints**:
  - [ ] `POST /api/v1/documents/detect-variables`
  - [ ] `POST /api/v1/documents/merge-variables`
  - [ ] `POST /api/v1/documents/format`
  - [ ] `GET /health` for health checks

- [ ] **React Query Setup**:
  - [ ] Query client configuration
  - [ ] Custom hooks for API calls
  - [ ] Caching strategies
  - [ ] Background refetching

---

## 🚀 Phase 8: Performance & Optimization

### 8.1 Code Splitting

- [ ] Route-based code splitting
- [ ] Component lazy loading
- [ ] Bundle analysis and optimization

### 8.2 Performance Monitoring

- [ ] Core Web Vitals monitoring
- [ ] Bundle size monitoring
- [ ] Runtime performance tracking

### 8.3 SEO & Metadata

- [ ] Page titles and meta descriptions
- [ ] Open Graph tags
- [ ] Structured data for help content

---

## 📋 Definition of Done Criteria

For each feature to be considered complete:

- [ ] Component is fully responsive (mobile, tablet, desktop)
- [ ] All loading and error states are handled
- [ ] TypeScript types are properly defined
- [ ] Follows design system consistency
- [ ] Keyboard navigation works properly
- [ ] Screen reader friendly (basic accessibility)
- [ ] Integration with backend APIs works correctly
- [ ] Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)

---

## 🎯 Success Metrics

### User Experience

- [ ] First document generation completed in under 5 minutes
- [ ] Error rate below 5% for document processing
- [ ] Mobile usage accounts for 30%+ of traffic

### Technical

- [ ] Page load times under 2 seconds
- [ ] 95%+ uptime
- [ ] Bundle size under 500KB (gzipped)

---

## 📝 Notes & Decisions

### Technical Decisions

- **Why Auth0**: Reduces auth complexity, provides enterprise features, handles security best practices
- **Why Zustand**: Lightweight state management, TypeScript-first, minimal boilerplate
- **Why Tailwind**: Rapid development, consistent design system, optimized for performance
- **Why App Router**: Modern Next.js pattern, better performance, easier data fetching

### Design Decisions

- **Linear-inspired**: Clean, professional appearance appeals to target demographic
- **Large text**: Improves readability for 40-60 age group
- **Minimal animations**: Reduces cognitive load, faster perceived performance
- **Bottom navigation on mobile**: Familiar pattern, thumb-friendly

### Future Considerations

- **Batch Processing**: Excel/CSV upload for bulk document generation
- **Template Library**: Save and reuse templates across users/organizations
- **Team Features**: Collaboration and sharing within organizations
- **API Access**: REST API for developers and integrations

### File Storage Technical Debt

**Current Implementation (MVP)**:
- ✅ Base64 encoding for file storage in sessionStorage
- ✅ File size validation (warn users about >8MB files) 
- ✅ Graceful error handling for storage quota exceeded
- ✅ Works reliably for most DOCX templates under 5MB

**Future Enhancement (Post-MVP)**:
- 🔄 Server-side temporary file storage with session tokens
- 🔄 IndexedDB for larger file storage capability
- 🔄 File cleanup after successful export
- 🔄 Support for larger template files (>10MB)
- 🔄 Multi-step upload with progress indication

**Technical Debt Notes**:
- Base64 adds ~33% size overhead to original file size
- sessionStorage limited to 5-10MB per domain
- Large files may cause UI freezing during encode/decode operations
- Consider hybrid approach: small files in sessionStorage, large files on server
