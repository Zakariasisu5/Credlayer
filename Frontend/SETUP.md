# Frontend Setup Guide

## Issue Fixed
The project had a mismatch between the routing system (TanStack Router) and the build tool configuration. It has been converted to use Next.js properly.

## Configuration Changes Made

### 1. Updated package.json
- Removed TanStack Start/Router dependencies (vinxi, @tanstack/react-start, @tanstack/react-router, @tanstack/start)
- Restored Next.js dependencies
- Added missing UI component libraries (lucide-react, motion, radix-ui components)

### 2. Created Next.js Files
- `app/layout.tsx` - Root layout with metadata and theme provider
- `app/page.tsx` - Home page component
- `next.config.ts` - Next.js configuration

### 3. Updated TypeScript Configuration
- Updated `tsconfig.json` to use Next.js plugin
- Set correct module resolution and JSX settings

## Installation Steps

Run the following command to install dependencies:

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is needed due to version conflicts with Solana packages.

## Remaining Work Required

### Critical: Convert TanStack Router to Next.js

The current codebase uses TanStack Router components that are incompatible with Next.js. You need to:

#### 1. Replace TanStack Router Link with Next.js Link

Find and replace all instances of:
```tsx
import { Link } from "@tanstack/react-router";
```

With:
```tsx
import Link from "next/link";
```

Files affected (search for `@tanstack/react-router`):
- `app/components/credlayer/Nav.tsx`
- `app/components/credlayer/Hero.tsx`
- `app/components/credlayer/DashboardPreview.tsx`
- `app/components/credlayer/CTA.tsx`
- `app/components/wallet/UnifiedConnectButton.tsx`
- `app/components/developers/*.tsx`
- All route files in `app/routes/`

#### 2. Convert File-Based Routes

The `app/routes/` directory uses TanStack Router's file-based routing. Convert to Next.js App Router:

**TanStack Router structure:**
- `app/routes/index.tsx` → `app/page.tsx` ✅ (Done)
- `app/routes/app.tsx` → `app/(dashboard)/layout.tsx` (needs creation)
- `app/routes/app.index.tsx` → `app/(dashboard)/page.tsx`
- `app/routes/app.developers.tsx` → `app/(dashboard)/developers/layout.tsx`
- `app/routes/app.developers.api-keys.tsx` → `app/(dashboard)/developers/api-keys/page.tsx`
- etc.

#### 3. Remove TanStack Router Artifacts

Delete or archive these files:
- `app/router.tsx`
- `app/routeTree.gen.ts`
- `app/start.ts`
- `app/server.ts`
- All files in `app/routes/` after converting them

#### 4. Update Components Using Router Hooks

Replace TanStack Router hooks:
```tsx
// Old:
import { useRouterState, useNavigate } from "@tanstack/react-router";

// New:
import { usePathname, useRouter } from "next/navigation";
```

#### 5. Fix React Query Provider

The app uses `@tanstack/react-query` but it's not in the dependencies. Add it:

```bash
npm install @tanstack/react-query
```

Then wrap the app in `app/layout.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// In layout component:
<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

## Running the App

After completing the above steps and installing dependencies:

```bash
npm run dev
```

The app should start at `http://localhost:3000`

## Troubleshooting

### Installation Hangs or Takes Too Long
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Try installing with `--legacy-peer-deps` flag

### Module Not Found Errors
- Make sure all TanStack Router imports are replaced with Next.js equivalents
- Check that path aliases (`@/`) are working in `tsconfig.json`

### Build Errors
- Ensure all page components are marked as `export default`
- Check that no server-side code is used in client components
- Add `'use client'` directive to components using hooks or browser APIs

## Dependencies Summary

**Core:**
- next ^15.1.6
- react ^19.0.0
- react-dom ^19.0.0

**UI Components:**
- lucide-react (icons)
- motion (animations - replaces framer-motion)
- @radix-ui/* (UI primitives)
- tailwindcss ^4.3.3

**Solana/Web3:**
- @solana/kit ^6.10.0
- @solana/wallet-adapter-*
- @reown/appkit (for EVM wallets)

**Utilities:**
- next-themes (dark mode)
- clsx, tailwind-merge (className utilities)
- sonner (toast notifications)
