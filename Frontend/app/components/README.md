# Components Architecture

This directory contains the refactored component structure following senior developer best practices.

## Structure

```
components/
├── ui/                    # Reusable UI components
│   ├── badge.tsx         # Badge component with tone variants
│   ├── button.tsx        # Button component with href/onClick support
│   ├── card.tsx          # Card wrapper component
│   └── index.ts          # Barrel export
│
├── layout/               # Layout components
│   ├── brand.tsx         # Brand/logo component
│   ├── header.tsx        # Main navigation header
│   └── index.ts          # Barrel export
│
├── landing/              # Landing page components
│   ├── hero-section.tsx  # Hero section with CTA
│   ├── service-card.tsx  # Individual service card
│   ├── services-section.tsx # Services grid section
│   ├── landing-page.tsx  # Main landing page composition
│   └── index.ts          # Barrel export
│
└── credlayer-app.tsx     # Main app router (uses refactored components)
```

## Benefits of This Structure

### 1. **Separation of Concerns**
- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Clear dependencies between components

### 2. **Type Safety**
- Proper TypeScript interfaces for all props
- Type-safe component composition
- Better IDE autocomplete and error checking

### 3. **Reusability**
- UI components (`Button`, `Badge`, `Card`) can be used anywhere
- Layout components (`Header`, `Brand`) are shared across pages
- Landing components are modular and composable

### 4. **Maintainability**
- Each file is focused and manageable in size
- Changes to one component don't affect others
- Easier to test individual components

### 5. **Code Organization**
- Barrel exports (`index.ts`) provide clean imports
- Logical grouping by feature/purpose
- Consistent naming conventions

## Usage Examples

### UI Components

```tsx
import { Button, Badge, Card } from "@/components/ui";

<Badge tone="green">Active</Badge>
<Button href="/app" variant="primary">Get Started</Button>
<Card>Content here</Card>
```

### Layout Components

```tsx
import { Header, Brand } from "@/components/layout";

<Header />
<Brand />
```

### Landing Page

```tsx
import { LandingPage } from "@/components/landing";

// Or import individual sections
import { HeroSection, ServicesSection } from "@/components/landing";
```

## Component Props

### Badge
- `children`: ReactNode - Content to display
- `tone?`: "default" | "green" | "amber" - Visual style

### Button
- `children`: ReactNode - Button content
- `href?`: string - Link destination (renders as Link)
- `variant?`: "primary" | "outline" | "ghost" - Visual style
- `onClick?`: Function - Click handler (renders as button)

### Card
- `children`: ReactNode - Card content
- `className?`: string - Additional CSS classes

### ServiceCard
- `icon`: LucideIcon - Icon component
- `title`: string - Service title
- `description`: string - Service description
- `href?`: string - Optional link
- `isUppercase?`: boolean - Title case transform

## Future Improvements

1. **Add Storybook** - Visual component documentation
2. **Unit Tests** - Component behavior tests
3. **A11y Testing** - Accessibility compliance
4. **Performance Optimization** - Code splitting, lazy loading
5. **Design Tokens** - Centralized theme configuration
