# CredLayer Component Structure

This document outlines the refactored component structure for better code organization and maintainability.

## Directory Structure

```
app/components/
├── credlayer-app.tsx          # Main router component
├── shared/                     # Shared/reusable components
│   ├── common-components.tsx   # Empty, StyledCard, Stat components
│   └── visuals.tsx            # NetworkVisual, SecurityLogoVisual
├── layout/                     # Layout components
│   └── app-shell.tsx          # Shell, AppSidebar, navigation
├── workspace/                  # Workspace pages (/app/*)
│   ├── index.tsx              # Exports all workspace pages
│   ├── overview.tsx           # /app
│   ├── dashboard.tsx          # /app/dashboard
│   ├── profile.tsx            # /app/profile
│   ├── analysis.tsx           # /app/analysis
│   ├── agents.tsx             # /app/agents
│   ├── credentials.tsx        # /app/credentials
│   ├── activity.tsx           # /app/activity
│   └── settings.tsx           # /app/settings
├── developers/                 # Developer portal pages (/developers/*)
│   ├── index.tsx              # Exports all developer pages
│   ├── developer-dashboard.tsx # /developers/dashboard
│   ├── api-keys.tsx           # /developers/api-keys
│   ├── documentation.tsx      # /developers/docs
│   └── sdk.tsx                # /developers/sdk
└── pages/                      # Other public pages
    ├── protocol.tsx           # /protocol
    ├── explorer.tsx           # /explorer
    └── dashboard-preview.tsx  # /dashboard-preview
```

## Component Categories

### 1. Main Router (`credlayer-app.tsx`)
- Central routing logic
- Imports all page components
- Maps pathnames to components
- Clean and maintainable

### 2. Shared Components (`shared/`)
- **common-components.tsx**: Reusable UI components
  - `Empty`: Empty state component
  - `StyledCard`: Styled card wrapper
  - `Stat`: Statistics card component
  
- **visuals.tsx**: Visual/graphic components
  - `NetworkVisual`: Network topology visualization
  - `SecurityLogoVisual`: Security shield visualization

### 3. Layout Components (`layout/`)
- **app-shell.tsx**: Application shell and navigation
  - `Shell`: Main layout wrapper
  - `AppSidebar`: Desktop sidebar navigation
  - Mobile menu implementation
  - Navigation constants (`appNav`, `developerNav`)

### 4. Workspace Pages (`workspace/`)
User-facing application pages accessible under `/app/*`:
- Overview: Main workspace dashboard
- Dashboard: Reputation and identity dashboard
- Profile: User profile management
- Analysis: Signal analysis
- Agents: Trusted workflow agents
- Credentials: Verifiable credentials
- Activity: Protocol activity log
- Settings: Workspace preferences

### 5. Developer Portal (`developers/`)
Developer-facing pages accessible under `/developers/*`:
- Developer Dashboard: API usage overview
- API Keys: API key management
- Documentation: API documentation with sections
- SDK: SDK installation and guides

### 6. Public Pages (`pages/`)
Other public-facing pages:
- Protocol: Protocol information
- Explorer: Public credential explorer
- Dashboard Preview: Preview of dashboard features

## Benefits of This Structure

1. **Separation of Concerns**: Each page is in its own file
2. **Easy Navigation**: Clear directory structure
3. **Maintainability**: Changes to one page don't affect others
4. **Reusability**: Shared components can be used across pages
5. **Scalability**: Easy to add new pages or features
6. **Import Organization**: Index files for clean imports
7. **Type Safety**: Each component maintains its own types
8. **Testing**: Each page can be tested independently

## Usage Examples

### Adding a New Workspace Page

1. Create file: `workspace/new-page.tsx`
```tsx
"use client";

import { Shell } from "../layout/app-shell";
import { Stat, Empty } from "../shared/common-components";

export function NewPage() {
  return (
    <Shell title="New Page" eyebrow="App workspace">
      {/* Your content */}
    </Shell>
  );
}
```

2. Export in `workspace/index.tsx`:
```tsx
export { NewPage } from "./new-page";
```

3. Add route in `credlayer-app.tsx`:
```tsx
import { NewPage } from "./workspace/new-page";
// ...
if (pathname === "/app/new-page") return <NewPage />;
```

### Using Shared Components

```tsx
import { StyledCard, Stat, Empty } from "../shared/common-components";
import { NetworkVisual } from "../shared/visuals";
import { Shell } from "../layout/app-shell";
```

## Migration Notes

All functionality from the original monolithic `credlayer-app.tsx` has been preserved and reorganized into this modular structure. No features were removed, only reorganized for better maintainability.
