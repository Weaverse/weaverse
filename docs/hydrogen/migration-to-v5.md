---
title: Migrating to Weaverse v5 (React Router v7)
description: 'Complete guide for upgrading your Weaverse Hydrogen project from Remix to React Router v7'
publishedAt: May 27, 2025
updatedAt: May 27, 2025
order: 10
published: true
---

# Migrating to Weaverse v5 (React Router v7)

Weaverse v5 introduces a major architectural change, migrating from Remix to React Router v7 to align with [Shopify Hydrogen's May 2025 release](https://hydrogen.shopify.dev/update/may-2025). This guide will help you upgrade your existing Weaverse Hydrogen project.

## Overview

The migration to React Router v7 brings several benefits:
- **Better Performance**: Improved tree-shaking and bundle optimization
- **Enhanced Developer Experience**: Faster hot reloading and better error messages
- **Future-Proof**: Aligned with Shopify Hydrogen's long-term roadmap
- **Modern Architecture**: Latest React Router patterns and conventions

## Before You Begin

⚠️ **Important**: This is a major version upgrade with breaking changes. Please:

1. **Backup your project** and commit all changes
2. **Test thoroughly** in a development environment
3. **Review dependencies** that might be affected
4. **Plan for downtime** if upgrading production

## Migration Options

You have two primary migration paths:

### Option 1: Start with a New Weaverse Theme (Recommended)

The easiest approach is to create a new project with the latest Weaverse CLI and migrate your customizations:

```bash
# Create a new React Router v7 project
npx @weaverse/cli@latest create --template=pilot --project-id="your-project-id" --project-name=my-hydrogen-storefront

# Copy your custom components and configurations
# from your old project to the new one
```

**Advantages:**
- Clean React Router v7 setup
- Latest best practices
- No migration complexity
- All new optimizations

**When to choose this option:**
- You have a relatively simple project
- Your customizations are primarily in components/sections
- You want the cleanest possible upgrade

### Option 2: Upgrade Existing Project

Follow the manual migration steps to upgrade your current project in place.

**Advantages:**
- Preserve existing project structure
- Gradual migration possible
- Maintain current deployment setup

**When to choose this option:**
- You have extensive customizations
- Complex deployment configurations
- Want to maintain project history

## Option 1: Creating a New Project

### Step 1: Create New Project

```bash
# Create a new Weaverse project with React Router v7
npx @weaverse/cli@latest create my-upgraded-project --theme pilot

# Navigate to the new project
cd my-upgraded-project
```

### Step 2: Migrate Your Customizations

1. **Copy Custom Sections**: Move your custom sections from `app/sections/` in your old project to the new one
2. **Update Components**: Copy custom components and update any Remix-specific imports
3. **Environment Variables**: Copy your `.env` file and update any changed variable names
4. **Styling**: Migrate your custom styles and Tailwind configurations
5. **Weaverse Configuration**: Copy your `weaverse/` directory configurations

### Step 3: Update Weaverse Settings

In your Weaverse dashboard:
1. Update the project preview URL to point to your new development server
2. Test all sections and components in the visual editor
3. Verify theme settings are working correctly

### Step 4: Deploy and Test

1. Deploy your new project to your preferred hosting platform
2. Update your Weaverse project's production URL
3. Test thoroughly before switching traffic

## Option 2: Manual Migration

### Prerequisites

Before starting the manual migration, ensure you have:

1. **Shopify Hydrogen 2025.4.0** with all Remix Future Flags enabled
2. **Node.js 20+** installed
3. **All changes committed** to version control

### Step 1: Enable Remix Future Flags

If you haven't already, enable all Remix future flags in your `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    // ... other plugins
    reactRouter({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
    }),
  ],
});
```

Test your application thoroughly with these flags enabled before proceeding.

### Step 2: Run React Router Migration Codemod

```bash
npx codemod remix/2/react-router/upgrade
```

This codemod will automatically update:
- Import statements from Remix to React Router
- Component usage patterns
- Basic file structure changes

### Step 3: Create React Router Configuration

Create a `react-router.config.ts` file in your project root:

```typescript
// react-router.config.ts
import type {Config} from '@react-router/dev/config';

export default {
  appDirectory: 'app',
  buildDirectory: 'dist',
  ssr: true,
} satisfies Config;
```

### Step 4: Update Vite Configuration

Clean up your `vite.config.ts`:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
-   reactRouter({
-     presets: [hydrogen.v3preset()],
-     future: {
-       v3_fetcherPersist: true,
-       v3_relativeSplatPath: true,
-       v3_throwAbortReason: true,
-       v3_lazyRouteDiscovery: true,
-       v3_routeConfig: true,
-       v3_singleFetch: true,
-     },
-   }),
+   reactRouter(),
    tsconfigPaths(),
  ],
  // ... rest of config
});
```

### Step 5: Update Dependencies

```bash
npm install --force \
  @weaverse/hydrogen@5.0.0 \
  @shopify/hydrogen@2025.5.0 \
  @shopify/remix-oxygen@3.0.0 \
  @shopify/cli@3.80.4
```

### Step 6: Update TypeScript Configuration

Update `env.d.ts`:

```typescript
// env.d.ts
- declare module '@shopify/remix-oxygen' {
+ declare module 'react-router' {
+   // TODO: remove this once we've migrated to `Route.LoaderArgs` for our loaders
+   interface LoaderFunctionArgs {
+     context: AppLoadContext;
+   }
+
+   // TODO: remove this once we've migrated to `Route.ActionArgs` for our actions
+   interface ActionFunctionArgs {
+     context: AppLoadContext;
+   }
    // ... rest of your types
  }
```

Update `tsconfig.json`:

```json
{
  "include": [
    "./**/*.d.ts",
    "./**/*.ts",
    "./**/*.tsx",
+   ".react-router/types/**/*"
  ],
  "compilerOptions": {
+   "rootDirs": [".", "./.react-router/types"],
    // ... rest of options
  }
}
```

### Step 7: Update Git Ignore

Add React Router generated files to `.gitignore`:

```gitignore
# React Router
.react-router/
```

### Step 8: Update Weaverse Components

Update any custom components that use Remix-specific APIs:

```typescript
// Before (Remix)
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

// After (React Router v7)
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
```

### Step 9: Test and Verify

Run the following commands to verify your migration:

```bash
# Generate types and run type checking
npm run codegen
npm run typecheck

# Start development server
npm run dev
```

## Common Migration Issues

### Import Errors

**Problem**: Import errors for Remix packages
**Solution**: Update imports to use React Router equivalents:

```typescript
// Before
import { ... } from '@remix-run/react';
import { ... } from '@shopify/remix-oxygen';

// After
import { ... } from 'react-router';
import { ... } from '@shopify/hydrogen';
```

### Type Errors

**Problem**: TypeScript errors with loader/action types
**Solution**: Update type imports and usage:

```typescript
// Before
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

// After  
import type { LoaderFunctionArgs } from 'react-router';
```

### Build Errors

**Problem**: Build fails with React Router configuration
**Solution**: Ensure `react-router.config.ts` is properly configured and `.react-router/` is in `.gitignore`

## Testing Your Migration

### Checklist

- [ ] Development server starts without errors
- [ ] All pages load correctly
- [ ] Weaverse visual editor functions properly
- [ ] Custom components render correctly
- [ ] Forms and interactions work as expected
- [ ] Build process completes successfully
- [ ] Production deployment works

### Weaverse-Specific Testing

1. **Visual Editor**: Test all sections in the Weaverse studio
2. **Theme Settings**: Verify global theme settings work
3. **Component Data**: Ensure component loaders work correctly
4. **Preview Mode**: Test preview functionality
5. **Section Management**: Test adding/removing/reordering sections

## Getting Help

If you encounter issues during migration:

1. **Check the Console**: Look for specific error messages
2. **Review Documentation**: Refer to [React Router v7 docs](https://reactrouter.com/7.0.0)
3. **Community Support**: Join our [Discord community](https://discord.gg/weaverse)
4. **Official Support**: Contact support@weaverse.io

## What's Next?

After successful migration:

1. **Update Documentation**: Update your project's README and docs
2. **Train Your Team**: Familiarize your team with React Router v7 patterns
3. **Optimize Performance**: Take advantage of new React Router v7 features
4. **Plan Updates**: Schedule regular updates to stay current

---

## Additional Resources

- [Shopify Hydrogen May 2025 Release](https://hydrogen.shopify.dev/update/may-2025)
- [React Router v7 Documentation](https://reactrouter.com/7.0.0)
- [Weaverse Documentation](/docs)
- [Migration Support Forum](https://community.weaverse.io) 