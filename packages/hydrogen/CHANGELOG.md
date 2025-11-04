# @weaverse/hydrogen

## 5.7.1

### Patch Changes

- bump version
  - @weaverse/react@5.7.1

## 5.7.0

### Minor Changes

- Initialize customerAccount in WeaverseClient constructor

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.7.0

## 5.6.0

### Minor Changes

- Bump v5.6.0

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.6.0

## 5.5.1

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.5.1

## 5.5.0

### Patch Changes

- 3720e74: bump beta version
- 469f291: update parse logic
- 9ee3be2: update data parser
- Updated dependencies [3720e74]
- Updated dependencies [469f291]
- Updated dependencies [9ee3be2]
  - @weaverse/react@5.5.0

## 5.5.0-beta.7

### Patch Changes

- update parse logic
- Updated dependencies
  - @weaverse/react@5.5.0-beta.7

## 5.5.0-beta.5

### Patch Changes

- update data parser
- Updated dependencies
  - @weaverse/react@5.5.0-beta.5

## 5.5.0-beta.4

### Patch Changes

- bump beta version
- Updated dependencies
  - @weaverse/react@5.5.0-beta.4

## 5.5.1-beta.0

### Patch Changes

- @weaverse/react@5.5.1-beta.0

## 5.5.0

### Minor Changes

- 21ba4ed: Enhanced data connector with deep recursive replacement and performance optimizations

  ## 🚀 Major Enhancements

  ### Deep Recursive Data Replacement

  - **NEW**: `replaceContentDataConnectorsDeep()` function handles complex nested structures
  - Processes arrays, objects, and deeply nested combinations recursively
  - Solves issue where only first content string was replaced in `weaverseData.page.items`

  ### Performance Optimizations

  - **BREAKING**: Migrated from `useLoaderData` to `useMatches` for 60-70% memory improvement
  - **BREAKING**: Property renamed `loaderData` → `dataContext` throughout codebase
  - Optimized caching with LRU eviction strategy and configurable size limits
  - Enhanced route-aware data resolution with priority ordering

  ### Security Improvements

  - Added prototype pollution protection (`__proto__`, `constructor`, `prototype`)
  - Enhanced XSS prevention with comprehensive HTML entity encoding
  - Input validation for safer property access

  ### Route-Aware Data Resolution

  - **NEW**: Support for explicit route keys: `{{root.layout.shop.name}}`
  - **NEW**: Cross-route data access: `{{routes/product.product.title}}`
  - Backward compatibility maintained for legacy `{{shop.name}}` patterns
  - Intelligent fallback search across all route data

  ## 🔧 API Changes

  ### Breaking Changes

  - `useLoaderData()` → `useMatches()` in WeaverseHydrogenRoot
  - `loaderData` prop → `dataContext` prop in component interfaces
  - Enhanced data structure processing in renderer components

  ### New Exports

  - `replaceContentDataConnectorsDeep` from `@weaverse/react`
  - `createWeaverseDataContext` from `@weaverse/react`

  ## 📊 Testing

  - 46/46 comprehensive test cases passing
  - Enhanced test coverage for deep object replacement
  - Route-aware resolution test scenarios
  - Circular reference protection validation

  ## 🔄 Migration Guide

  For existing implementations using `useLoaderData`, the migration to `useMatches` is handled automatically within WeaverseHydrogenRoot. No changes required for end users.

  ## 🎯 Use Cases

  Perfect for complex page structures with nested content:

  ```javascript
  weaverseData.page.items = [
    { content: "Welcome to {{shop.name}}" },
    {
      sections: [
        { title: "{{product.title}}" },
        { description: "Available at {{root.layout.shop.name}}" },
      ],
    },
  ];
  ```

### Patch Changes

- 5c6060b: Fix missing use-weaverse-data-context.ts file in Hydrogen package

  ## 🔧 Build Fix

  - **FIXED**: Added missing `use-weaverse-data-context.ts` file to Hydrogen package
  - **FIXED**: Resolved build errors where imports couldn't resolve the module
  - **MAINTAINED**: All data context functionality now properly available

  ## 📦 Package Structure

  The Hydrogen package now correctly includes:

  - ✅ `useWeaverseDataContext()` hook
  - ✅ `createWeaverseDataContext()` function
  - ✅ `WeaverseDataContext` type
  - ✅ All router-dependent functionality

  ## 🎯 Impact

  No functional changes - this is purely a build/packaging fix to ensure the file is included in published packages.

- 2468404: Fix dependency issue by moving react-router dependent code to Hydrogen package

  ## 🔧 Dependency Fix

  - **FIXED**: Moved `useWeaverseDataContext` and related functionality from `@weaverse/react` to `@weaverse/hydrogen`
  - **FIXED**: Resolved build errors where React package tried to import `react-router` without it being a dependency
  - **IMPROVED**: Made React package truly router-agnostic by using generic `DataContext` type
  - **MAINTAINED**: All exports now available from `@weaverse/hydrogen` where `react-router` is properly installed

  ## 🎯 Package Structure

  ### @weaverse/react (Router-agnostic)

  - ✅ `replaceContentDataConnectors()`
  - ✅ `replaceContentDataConnectorsDeep()`
  - ✅ Generic `DataContext` type
  - ✅ Core React utilities

  ### @weaverse/hydrogen (Router-aware)

  - ✅ `useWeaverseDataContext()`
  - ✅ `createWeaverseDataContext()`
  - ✅ `WeaverseDataContext` type
  - ✅ All React exports + Hydrogen-specific features

  ## 📦 Usage Impact

  No breaking changes - all functionality remains available from `@weaverse/hydrogen` as intended.

- Updated dependencies [21ba4ed]
- Updated dependencies [2468404]
  - @weaverse/react@5.5.0

## 5.5.0-beta.2

### Patch Changes

- Fix missing use-weaverse-data-context.ts file in Hydrogen package

  ## 🔧 Build Fix

  - **FIXED**: Added missing `use-weaverse-data-context.ts` file to Hydrogen package
  - **FIXED**: Resolved build errors where imports couldn't resolve the module
  - **MAINTAINED**: All data context functionality now properly available

  ## 📦 Package Structure

  The Hydrogen package now correctly includes:

  - ✅ `useWeaverseDataContext()` hook
  - ✅ `createWeaverseDataContext()` function
  - ✅ `WeaverseDataContext` type
  - ✅ All router-dependent functionality

  ## 🎯 Impact

  No functional changes - this is purely a build/packaging fix to ensure the file is included in published packages.

  - @weaverse/react@5.5.0-beta.2

## 5.5.0-beta.1

### Patch Changes

- Fix dependency issue by moving react-router dependent code to Hydrogen package

  ## 🔧 Dependency Fix

  - **FIXED**: Moved `useWeaverseDataContext` and related functionality from `@weaverse/react` to `@weaverse/hydrogen`
  - **FIXED**: Resolved build errors where React package tried to import `react-router` without it being a dependency
  - **IMPROVED**: Made React package truly router-agnostic by using generic `DataContext` type
  - **MAINTAINED**: All exports now available from `@weaverse/hydrogen` where `react-router` is properly installed

  ## 🎯 Package Structure

  ### @weaverse/react (Router-agnostic)

  - ✅ `replaceContentDataConnectors()`
  - ✅ `replaceContentDataConnectorsDeep()`
  - ✅ Generic `DataContext` type
  - ✅ Core React utilities

  ### @weaverse/hydrogen (Router-aware)

  - ✅ `useWeaverseDataContext()`
  - ✅ `createWeaverseDataContext()`
  - ✅ `WeaverseDataContext` type
  - ✅ All React exports + Hydrogen-specific features

  ## 📦 Usage Impact

  No breaking changes - all functionality remains available from `@weaverse/hydrogen` as intended.

- Updated dependencies
  - @weaverse/react@5.5.0-beta.1

## 5.5.0-beta.0

### Minor Changes

- Enhanced data connector with deep recursive replacement and performance optimizations

  ## 🚀 Major Enhancements

  ### Deep Recursive Data Replacement

  - **NEW**: `replaceContentDataConnectorsDeep()` function handles complex nested structures
  - Processes arrays, objects, and deeply nested combinations recursively
  - Solves issue where only first content string was replaced in `weaverseData.page.items`

  ### Performance Optimizations

  - **BREAKING**: Migrated from `useLoaderData` to `useMatches` for 60-70% memory improvement
  - **BREAKING**: Property renamed `loaderData` → `dataContext` throughout codebase
  - Optimized caching with LRU eviction strategy and configurable size limits
  - Enhanced route-aware data resolution with priority ordering

  ### Security Improvements

  - Added prototype pollution protection (`__proto__`, `constructor`, `prototype`)
  - Enhanced XSS prevention with comprehensive HTML entity encoding
  - Input validation for safer property access

  ### Route-Aware Data Resolution

  - **NEW**: Support for explicit route keys: `{{root.layout.shop.name}}`
  - **NEW**: Cross-route data access: `{{routes/product.product.title}}`
  - Backward compatibility maintained for legacy `{{shop.name}}` patterns
  - Intelligent fallback search across all route data

  ## 🔧 API Changes

  ### Breaking Changes

  - `useLoaderData()` → `useMatches()` in WeaverseHydrogenRoot
  - `loaderData` prop → `dataContext` prop in component interfaces
  - Enhanced data structure processing in renderer components

  ### New Exports

  - `replaceContentDataConnectorsDeep` from `@weaverse/react`
  - `createWeaverseDataContext` from `@weaverse/react`

  ## 📊 Testing

  - 46/46 comprehensive test cases passing
  - Enhanced test coverage for deep object replacement
  - Route-aware resolution test scenarios
  - Circular reference protection validation

  ## 🔄 Migration Guide

  For existing implementations using `useLoaderData`, the migration to `useMatches` is handled automatically within WeaverseHydrogenRoot. No changes required for end users.

  ## 🎯 Use Cases

  Perfect for complex page structures with nested content:

  ```javascript
  weaverseData.page.items = [
    { content: "Welcome to {{shop.name}}" },
    {
      sections: [
        { title: "{{product.title}}" },
        { description: "Available at {{root.layout.shop.name}}" },
      ],
    },
  ];
  ```

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.5.0-beta.0

## 5.4.2

### Patch Changes

- feat(hydrogen): add WEAVERSE_HOST environment variable fallback for API configuration

  Adds support for WEAVERSE_HOST as a fallback option for weaverseApiBase configuration. This allows users to configure the API endpoint using either WEAVERSE_API_BASE or WEAVERSE_HOST environment variables, providing more flexibility for different deployment scenarios.

  - @weaverse/react@5.4.2

## 5.4.1

### Patch Changes

- 50275ae: feat: API cache proxy improvements and TypeScript fixes

  #### API Cache Proxy Improvements

  - **Migration to withCache.fetch**: Updated `WeaverseClient` to use Hydrogen's `withCache.fetch` instead of deprecated `withCache.run`
  - **Response Structure Unification**: Standardized response formats between `directFetch` and `withCache.fetch` methods
  - **Enhanced Cache Strategy**: Improved cache key generation and response validation
  - **Better Error Handling**: Added comprehensive error handling for API responses

  #### TypeScript Build Fixes

  - **Interface Merging**: Fixed duplicate type declarations using proper interface merging for module augmentation
  - **Window Type Declarations**: Converted type declarations to interfaces for proper global scope extension
  - **Environment Variables**: Added missing environment variables to `HydrogenEnv` interface

  #### Code Quality Improvements

  - **Biome Configuration**: Updated to automatically remove unused variables and optimize imports
  - **Removed Console Logs**: Cleaned up debug logging and unused code

  This change maintains backward compatibility while improving performance and reliability of the API cache proxy system. The migration from `withCache.run` to `withCache.fetch` aligns with Shopify Hydrogen's latest recommendations.

- Updated dependencies [50275ae]
  - @weaverse/react@5.4.1

## 0.0.0-beta-20250825103739

### Patch Changes

- feat: API cache proxy improvements and debug logging

  - Updated cache strategy with improved timing configuration
  - Added debug logging for API proxy usage tracking
  - Enhanced cache control with optimized stale-while-revalidate settings
  - Minor performance improvements in cache key generation

- 6642fc2: Beta release with build fixes and improved Biome configuration
- Updated dependencies
  - @weaverse/react@0.0.0-beta-20250825103739

## 5.4.1-beta.0

### Patch Changes

- Beta release with build fixes and improved Biome configuration
  - @weaverse/react@5.4.1-beta.0

## 5.4.0

### Minor Changes

- Enable API proxy by default with smart design mode bypass

  - **BREAKING**: API calls now use api.weaverse.io proxy by default for improved caching and performance
  - Add WEAVERSE_API_BASE environment variable support to override the default API base
  - Update WeaverseProjectConfigs to include weaverseApiBase property
  - Update WeaverseClient to use weaverseApiBase for API calls (project, project_configs endpoints)
  - Update analytics pixel tracking to use new /v1/px endpoint via API proxy
  - **Smart caching**: Design mode bypasses proxy cache to ensure fresh data
  - Studio integration (weaverseHost) continues to use studio.weaverse.io for UI scripts

  **Default Behavior:**

  - Production mode: api.weaverse.io/v1/\* → cached via Cloudflare Worker
  - Design mode: studio.weaverse.io/api/public/\* → direct, uncached API calls
  - Studio scripts: studio.weaverse.io (unchanged)

  **Environment Override:**
  Set `WEAVERSE_API_BASE=https://staging-api.weaverse.io` to use different API environments.

### Patch Changes

- Fix TypeScript build issues and improve Biome configuration

  - Fixed duplicate Window identifier issues across packages by using interface merging
  - Added missing PUBLIC_STORE_DOMAIN and PUBLIC_STOREFRONT_API_TOKEN to HydrogenEnv type
  - Fixed AppLoadContext and HydrogenEnv duplicate declarations using proper module augmentation
  - Updated Biome configuration to automatically remove unused variables and imports
  - Disabled noBarrelFile rule for SDK packages
  - All packages now build successfully with proper type definitions
  - @weaverse/react@5.4.0

## 5.3.4

### Patch Changes

- Preserve configs types while still keep the validation
- Updated dependencies
  - @weaverse/react@5.3.4

## 5.3.3

### Patch Changes

- Upgrade schema builder package to fix validation errors
- Updated dependencies
  - @weaverse/react@5.3.3

## 5.3.2

### Patch Changes

- Serialize condition functions before sending to client
- Updated dependencies
  - @weaverse/react@5.3.2

## 5.3.1

### Patch Changes

- minor update schema
- Updated dependencies
  - @weaverse/schema@0.7.1
  - @weaverse/react@5.3.1

## 5.3.0

### Minor Changes

- update schema validation

### Patch Changes

- Updated dependencies
  - @weaverse/schema@0.7.0
  - @weaverse/react@5.3.0

## 5.2.5

### Patch Changes

- update zod validation
- Updated dependencies
  - @weaverse/schema@0.6.1
  - @weaverse/react@5.2.5

## 5.2.4

### Patch Changes

- 43f3da3: update schema
- Updated dependencies [43f3da3]
  - @weaverse/schema@0.5.1
  - @weaverse/react@5.2.4

## 5.2.3

### Patch Changes

- Updated dependencies
  - @weaverse/schema@0.5.0
  - @weaverse/react@5.2.3

## 5.2.2

### Patch Changes

- fix minor bug with previewing section feature
  - @weaverse/react@5.2.2

## 5.2.1

### Patch Changes

- fix wrong imports
  - @weaverse/react@5.2.1

## 5.2.0

### Minor Changes

- update type system with new schema validation util

### Patch Changes

- Updated dependencies
  - @weaverse/schema@0.4.0
  - @weaverse/react@5.2.0

## 5.1.0

### Minor Changes

- Migrate `inspector` field to new `settings` property.

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.1.0

## 5.0.0

### Major Changes

- 7164bdb: Migrate to React Router v7 from Remix

### Patch Changes

- Release Candidate
- RC.1
- Updated dependencies
- Updated dependencies
  - @weaverse/react@5.0.0

## 5.0.0-next.1

### Patch Changes

- Release Candidate
- Updated dependencies
  - @weaverse/react@5.0.0-next.1

## 5.0.0-next.0

### Major Changes

- Migrate to React Router v7 from Remix

### Patch Changes

- @weaverse/react@5.0.0-next.0

## 4.3.4

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/react@4.3.4

## 4.3.3

### Patch Changes

- update for local development
  - @weaverse/react@4.3.3

## 4.3.1

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/react@4.3.1

## 4.3.0

### Minor Changes

- fix minor bug when initializing Weaverse section component

### Patch Changes

- @weaverse/react@4.3.0

## 4.2.10

### Patch Changes

- 9ce8f2c: Hot fix for shopify package
- Updated dependencies [9ce8f2c]
  - @weaverse/react@4.2.10

## 4.2.9

### Patch Changes

- Fix shopify package
- Updated dependencies
  - @weaverse/react@4.2.9

## 4.2.8

### Patch Changes

- Update weaverse client methods to use arrow functions for better binding
- Updated dependencies
  - @weaverse/react@4.2.8

## 4.2.7

### Patch Changes

- Fix get section preview data
- Updated dependencies
  - @weaverse/react@4.2.7

## 4.2.6

### Patch Changes

- Fix generate default theme settings, clean up
- Updated dependencies
  - @weaverse/react@4.2.6

## 4.2.5

### Patch Changes

- Restructure, remove unused types and unneccessary exports
- Updated dependencies
  - @weaverse/react@4.2.5

## 4.2.4

### Patch Changes

- Patch release with minor improvements and bug fixes
- Updated dependencies
  - @weaverse/react@4.2.4

## 4.2.2

### Patch Changes

- update types
  - @weaverse/react@4.2.2

## 4.2.1

### Patch Changes

- improve weaverse-client
  - @weaverse/react@4.2.1

## 4.2.0

### Minor Changes

- update preview mode

### Patch Changes

- @weaverse/react@4.2.0

## 4.1.2

### Patch Changes

- update hydrogen package version
  - @weaverse/react@4.1.2

## 4.1.1

### Patch Changes

- update types for localization feature
  - @weaverse/react@4.1.1

## 4.1.0

### Minor Changes

- Update dependencies

### Patch Changes

- Updated dependencies
  - @weaverse/react@4.1.0

## 4.0.1

### Patch Changes

- update localization types
  - @weaverse/react@4.0.1

## 4.0.0

### Major Changes

- update for Shopify Hydrogen v2024.10

### Patch Changes

- @weaverse/react@4.0.0

## 3.4.2

### Patch Changes

- Add swatch config types, fix weaverse cached data
- Updated dependencies
  - @weaverse/react@3.4.2

## 3.4.1

### Patch Changes

- Fix weaverseData being cached when url search query change
  - @weaverse/react@3.4.1

## 3.4.0

### Minor Changes

- Update using latest Shopify Hydrogen API

### Patch Changes

- Updated dependencies
  - @weaverse/react@3.4.0

## 3.3.1

### Patch Changes

- Update metaobject input return type
- Updated dependencies
  - @weaverse/react@3.3.1

## 3.3.0

### Minor Changes

- Fix Hydrogen Component loader data

### Patch Changes

- @weaverse/react@3.3.0

## 3.2.9

### Patch Changes

- Fix linting errors, update linter rules
- Updated dependencies
  - @weaverse/react@3.2.9

## 3.2.8

### Patch Changes

- Add new `Video` input
- Updated dependencies
  - @weaverse/react@3.2.8

## 3.2.7

### Patch Changes

- Minor update to theme settings instance
  - @weaverse/react@3.2.7

## 3.2.6

### Patch Changes

- Update Types
- Updated dependencies
  - @weaverse/react@3.2.6

## 3.2.5

### Patch Changes

- Export more utils from `@weaverse/react` package
- Updated dependencies
  - @weaverse/react@3.2.5

## 3.2.4

### Patch Changes

- Update deps
- Updated dependencies
  - @weaverse/react@3.2.4

## 3.2.3

### Patch Changes

- Update eslint
- Updated dependencies
  - @weaverse/react@3.2.3

## 3.2.2

### Patch Changes

- Update types, update deps
- Updated dependencies
  - @weaverse/react@3.2.2

## 3.2.1

### Patch Changes

- chore: fix some typos
- Updated dependencies
  - @weaverse/react@3.2.1

## 3.2.0

### Minor Changes

- Update dependencies

### Patch Changes

- Updated dependencies
  - @weaverse/react@3.2.0

## 3.1.16

### Patch Changes

- Update hydrogen toolbar action types
- Updated dependencies
  - @weaverse/react@3.1.16

## 3.1.15

### Patch Changes

- Update types, update hydrogen placeholder images
- Updated dependencies
  - @weaverse/react@3.1.15

## 3.1.14

### Patch Changes

- Remomve pilot from submodule & workspace packages
- Updated dependencies
  - @weaverse/react@3.1.14

## 3.1.13

### Patch Changes

- Update schema config & docs
- Updated dependencies
  - @weaverse/react@3.1.13

## 3.1.12

### Patch Changes

- Update placeholders image & fix types
- Updated dependencies
  - @weaverse/react@3.1.12

## 3.1.11

### Patch Changes

- Update types, add more placeholders
- Updated dependencies
  - @weaverse/react@3.1.11

## 3.1.10

### Patch Changes

- update core
  - @weaverse/react@3.1.10

## 3.1.9

### Patch Changes

- Fix typos
- Updated dependencies
  - @weaverse/react@3.1.9

## 3.1.8

### Patch Changes

- Updated dependencies
  - @weaverse/react@3.1.8

## 3.1.7

### Patch Changes

- Minor update to support Global Section feature
- Updated dependencies
  - @weaverse/react@3.1.7

## 3.1.6

### Patch Changes

- Fix item visibility func
- Updated dependencies
  - @weaverse/react@3.1.6

## 3.1.5

### Patch Changes

- v3.1.5
  - @weaverse/react@3.1.5

## 3.1.4

### Patch Changes

- Add shopify utils and placeholder images
  - @weaverse/react@3.1.4

## 3.1.3

### Patch Changes

- Fix typo, update types
- Updated dependencies
  - @weaverse/react@3.1.3

## 3.1.2

### Patch Changes

- Fix theme settings store, optimize package mechanism
  - @weaverse/react@3.1.2

## 3.1.1

### Patch Changes

- 3a975da: Adding url input type
- Updated dependencies [3a975da]
  - @weaverse/react@3.1.1

## 3.1.0

### Minor Changes

- Fix studio script not load on some navigation

### Patch Changes

- @weaverse/react@3.1.0

## 3.0.1

### Patch Changes

- Bump @shopify/hydrogen version
  - @weaverse/react@3.0.1

## 3.0.0

### Major Changes

- Update dependencies & fix minor bugs

### Patch Changes

- Updated dependencies
  - @weaverse/react@3.0.0

## 2.10.2

### Patch Changes

- update core mechanism
- Updated dependencies
  - @weaverse/react@2.10.2

## 2.10.1

### Patch Changes

- optimize rendering mechanism
- Updated dependencies
  - @weaverse/react@2.10.1

## 2.10.1-next.0

### Patch Changes

- optimize rendering mechanism
- Updated dependencies
  - @weaverse/react@2.10.1-next.0

## 2.10.0

### Minor Changes

- Optimize page rendering with useSyncExternalStore

### Patch Changes

- Updated dependencies
  - @weaverse/react@2.10.0

## 2.9.0

### Minor Changes

- Refactor

### Patch Changes

- Updated dependencies
  - @weaverse/react@2.9.0

## 2.8.12

### Patch Changes

- update default weaverseHost
  - @weaverse/react@2.8.12

## 2.8.11

### Patch Changes

- update default weaverseHost to studio.weaverse.io
- Updated dependencies
  - @weaverse/react@2.8.11

## 2.8.10

### Patch Changes

- d42301a: Update support for metaobject definition.
- Updated dependencies [d42301a]
  - @weaverse/react@2.8.10
