# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Check formatting
npm run type-check   # TypeScript type checking
```

## Architecture

This is **Docko**, a document automation frontend built with Next.js 15 and React 19 using the App Router.

### Core Flow
Users upload DOCX templates with `{{variable}}` placeholders → system detects variables → users fill values → download generated documents (DOCX/PDF).

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature (auth, billing, dashboard, landing, ui)
- `src/lib/` - Utilities, types, and API clients

### Key Patterns

**API Routes as Proxy Layer**: All API routes in `src/app/api/` proxy requests to the backend (`API_BASE_URL` env var). They handle Auth0 token injection server-side:
```typescript
const session = await auth0.getSession();
const accessToken = session?.tokenSet.accessToken;
// Forward to: ${process.env.API_BASE_URL}/...
```

**Client API**: `src/lib/management-api.ts` provides `managementApi` object for client-side calls to Next.js API routes (not backend directly).

**Auth0 Integration**:
- `@auth0/nextjs-auth0` v4 with server-side Auth0Client in `src/lib/auth0.ts`
- Middleware handles auth for all routes except static assets
- Use `AuthGuard` component for protected pages, `useUser()` hook for user state

**UI Components**: Built with `class-variance-authority` for variant-based styling. Located in `src/components/ui/` with barrel exports. Use the `cn()` utility from `src/lib/utils.ts` for class merging.

**Styling**: Tailwind CSS v4 with CSS custom properties defined in `src/app/globals.css`. Theme colors: `--primary`, `--background`, `--foreground`, etc.

### Path Alias
`@/*` maps to `./src/*`

### Environment Variables
Required: Auth0 config (`AUTH0_*`), `API_BASE_URL` for backend, `APP_BASE_URL` for frontend.
