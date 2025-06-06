---
title: Weaverse v5 & React Router v7 Migration Guide
description: 'Comprehensive guide to Weaverse v5, including the migration from Remix to React Router v7, new features, and upgrade instructions.'
publishedAt: May 27, 2025
updatedAt: May 27, 2025
order: 1 # Make this a prominent guide
published: true
featured: true # Highlight this guide
---

# 🚀 Weaverse v5 is Here - Powered by React Router v7

We're excited to announce the release of **Weaverse v5**, marking a major milestone in our journey to provide the best developer experience for building Shopify Hydrogen storefronts. This guide provides all the information you need about this release, including how to upgrade your existing Weaverse Hydrogen project from Remix to React Router v7.

Weaverse v5 introduces a major architectural change, migrating from Remix to React Router v7 to align with [Shopify Hydrogen's May 2025 release](https://hydrogen.shopify.dev/update/may-2025).

## What's New in v5?

### React Router v7 Foundation
- **Modern Architecture**: Complete migration from Remix to React Router v7
- **Better Performance**: Improved tree-shaking, faster builds, and better runtime performance
- **Enhanced DX**: Faster hot reloading and clearer error messages
- **Future-Proof**: Aligned with Shopify Hydrogen's long-term roadmap

### Key Benefits

**🚀 Performance Improvements**
- Faster build times with better tree-shaking
- Optimized bundle sizes for production
- Improved development server startup times

**🛠️ Developer Experience**
- Enhanced hot module reloading
- Better TypeScript integration
- Clearer error messages and debugging
- Modern React patterns and best practices

**🔮 Future-Ready**
- Aligned with [Shopify Hydrogen May 2025 release](https://hydrogen.shopify.dev/update/may-2025)
- Compatible with the latest React ecosystem
- Foundation for upcoming Weaverse features

## Before You Begin Migration

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

## Option 1: Creating a New Project (Fresh Start)

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

## Option 2: Manual Migration (In-Place Upgrade)

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
    reactRouter(),
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
declare module 'react-router' {
  // TODO: remove this once we've migrated to `Route.LoaderArgs` for our loaders
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated to `Route.ActionArgs` for our actions
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }
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
    ".react-router/types/**/*"
  ],
  "compilerOptions": {
    "rootDirs": [".", "./.react-router/types"],
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

## What This Means for You (If Upgrading)

### If You're Just Getting Started with Weaverse
- **No action needed for new projects** - all new projects created with `npx @weaverse/cli@latest create` will use React Router v7.
- Enjoy better performance and developer experience out of the box.
- Access to the latest Weaverse features and improvements.

### If You Have an Existing Weaverse Project (v4 or older)
- **Plan your migration** - this is a major version with breaking changes.
- **Test thoroughly** - use this guide and test in a development environment first.
- **Take your time** - v4 will continue to receive critical bug fixes, but we recommend upgrading for the best experience and future features.

## Timeline & Backwards Compatibility

- **v5.0.0**: React Router v7 support released.
- **v4.x**: Continues to receive critical bug fixes for a limited time.
- **Migration Period**: We recommend migrating within 6 months for the best experience and continued support.
- **Support**: Full support and guidance available during the migration period.

## Getting Help

If you encounter issues during migration:

1. **Check the Console**: Look for specific error messages.
2. **Review Documentation**: Refer to [React Router v7 docs](https://reactrouter.com/7.0.0).
3. **Community Support**: Join our [Slack Community](https://wvse.cc/weaverse-slack).
4. **Official Support**: Contact support@weaverse.io.

## What's Next?

After successful migration:

1. **Update Documentation**: Update your project's README and internal docs.
2. **Train Your Team**: Familiarize your team with React Router v7 patterns.
3. **Optimize Performance**: Take advantage of new React Router v7 features.
4. **Plan Updates**: Schedule regular updates to stay current.

## Thank You

This release represents months of work to ensure Weaverse stays at the forefront of modern web development. We're grateful for our community's feedback and support throughout this journey.

Ready to upgrade? Follow the steps above or [create a new project](/docs/hydrogen/getting-started) to experience the power of Weaverse v5!

---

## Additional Resources

- [Shopify Hydrogen May 2025 Release](https://hydrogen.shopify.dev/update/may-2025)
- [React Router v7 Documentation](https://reactrouter.com/7.0.0)
- [Weaverse Documentation](/docs)
- [Full Weaverse Changelog](../../CHANGELOG.md#500---2025-05-27)
- *Questions about the migration? Join our [Slack community](https://wvse.cc/weaverse-slack) or reach out to our support team at support@weaverse.io*

## Migration to v5

Weaverse v5 introduces several important changes, including the migration to React Router v7 and updates to component schema properties. This guide will help you migrate from v4 to v5 smoothly.

### Breaking Changes

#### 1. React Router v7 Migration

Weaverse v5 has migrated from Remix to React Router v7, aligning with Shopify Hydrogen's latest architecture. This affects import statements and some routing patterns.

**Before (v4 with Remix):**
```tsx
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
```

**After (v5 with React Router v7):**
```tsx
import { useLoaderData } from 'react-router'
import type { Route } from './+types/page'
```

#### 2. Component Schema: Inspector → Settings

The `inspector` property in component schemas has been deprecated in favor of `settings`. While `inspector` is still supported for backward compatibility, new components should use `settings`.

**Before (v4):**
```tsx
export const schema: HydrogenComponentSchema = {
  type: 'my-component',
  title: 'My Component',
  inspector: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Welcome'
        }
      ]
    }
  ]
}
```

**After (v5):**
```tsx
import { createSchema } from '@weaverse/hydrogen';

export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Welcome'
        }
      ]
    }
  ]
});
```

**Migration Notes:**
- The system automatically handles both `inspector` and `settings` during the transition
- When both properties exist, `settings` takes priority
- Components using only `inspector` will show deprecation warnings but continue to work
- The structure of the inputs array remains exactly the same

#### 3. Theme Schema Migration

Theme schemas should also be updated to use `settings` instead of `inspector`:

**Before (v4):**
```tsx
export const themeSchema: HydrogenThemeSchema = {
  info: {
    name: 'My Theme',
    version: '1.0.0',
    author: 'Developer'
  },
  inspector: [
    {
      group: 'Colors',
      inputs: [
        {
          type: 'color',
          name: 'primaryColor',
          label: 'Primary Color',
          defaultValue: '#000000'
        }
      ]
    }
  ]
}
```

**After (v5):**
```tsx
export const themeSchema: HydrogenThemeSchema = {
  info: {
    name: 'My Theme',
    version: '1.0.0',
    author: 'Developer'
  },
  settings: [
    {
      group: 'Colors',
      inputs: [
        {
          type: 'color',
          name: 'primaryColor',
          label: 'Primary Color',
          defaultValue: '#000000'
        }
      ]
    }
  ]
}
```

### Migration Steps

#### Step 1: Update Dependencies

Update your Weaverse dependencies to v5:

```bash
npm install @weaverse/hydrogen@latest
```

#### Step 2: Migrate Component Schemas

1. **Rename `inspector` to `settings`** in all component schemas:
   ```bash
   # You can use find and replace in your editor
   # Find: inspector: [
   # Replace: settings: [
   ```

2. **Update TypeScript types** if you have any custom type definitions referencing the `inspector` property.

#### Step 3: Update Theme Schema

Update your theme schema file (`app/weaverse/schema.server.ts`) to use `settings` instead of `inspector`.

#### Step 4: Test Your Components

1. **Start your development server** and verify that all components render correctly
2. **Check the Weaverse Studio** to ensure all settings panels work as expected
3. **Look for deprecation warnings** in the console and address any remaining `inspector` usage

#### Step 5: React Router Migration (if needed)

If you're also migrating from Remix to React Router v7, follow these additional steps:

1. **Update import statements** throughout your codebase
2. **Update route configurations** to use React Router v7 patterns
3. **Update type definitions** to use React Router v7 types

## Backward Compatibility

Weaverse v5 maintains backward compatibility for the `inspector` property:

- Components with only `inspector` will continue to work but show deprecation warnings
- Components with both `inspector` and `settings` will use `settings` and ignore `inspector`
- The input structure and all input types remain unchanged

## Common Issues and Solutions

### Issue: Deprecation Warnings

**Problem:** Console shows warnings about `inspector` property usage.

**Solution:** Update your schemas to use `settings` instead of `inspector`.

### Issue: Settings Not Appearing

**Problem:** Component settings don't appear in Weaverse Studio after migration.

**Solution:** 
1. Ensure you've renamed `inspector` to `settings` correctly
2. Restart your development server
3. Clear browser cache and refresh Weaverse Studio

### Issue: Type Errors

**Problem:** TypeScript errors related to schema properties.

**Solution:** Update your TypeScript types to reference `settings` instead of `inspector`.

## Need Help?

If you encounter issues during migration:

1. Check the [Component Schema Guide](/docs/guides/component-schema) for detailed information
2. Review the [API Types documentation](/docs/api/types) for updated type definitions
3. Join our [Discord community](https://discord.gg/weaverse) for support
4. Open an issue on [GitHub](https://github.com/weaverse/weaverse) if you find bugs

## Benefits of v5

After migration, you'll benefit from:

- **Improved performance** with React Router v7
- **Better type safety** with updated schema properties
- **Enhanced developer experience** with clearer naming conventions
- **Future-proof architecture** aligned with the latest Shopify Hydrogen standards