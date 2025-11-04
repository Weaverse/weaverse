# @weaverse/core

## 5.7.0

### Minor Changes

- Initialize customerAccount in WeaverseClient constructor

## 5.6.0

### Minor Changes

- Bump v5.6.0

## 5.5.1

## 5.5.0

### Patch Changes

- 3720e74: bump beta version
- 469f291: update parse logic
- 9ee3be2: update data parser

## 5.5.0-beta.7

### Patch Changes

- update parse logic

## 5.5.0-beta.5

### Patch Changes

- update data parser

## 5.5.0-beta.4

### Patch Changes

- bump beta version

## 5.5.1-beta.0

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

## 5.5.0-beta.2

## 5.5.0-beta.1

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

## 5.4.2

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

## 0.0.0-beta-20250825103739

### Patch Changes

- feat: API cache proxy improvements and debug logging

  - Updated cache strategy with improved timing configuration
  - Added debug logging for API proxy usage tracking
  - Enhanced cache control with optimized stale-while-revalidate settings
  - Minor performance improvements in cache key generation

- 6642fc2: Beta release with build fixes and improved Biome configuration

## 5.4.1-beta.0

### Patch Changes

- Beta release with build fixes and improved Biome configuration

## 5.4.0

### Patch Changes

- Fix TypeScript build issues and improve Biome configuration

  - Fixed duplicate Window identifier issues across packages by using interface merging
  - Added missing PUBLIC_STORE_DOMAIN and PUBLIC_STOREFRONT_API_TOKEN to HydrogenEnv type
  - Fixed AppLoadContext and HydrogenEnv duplicate declarations using proper module augmentation
  - Updated Biome configuration to automatically remove unused variables and imports
  - Disabled noBarrelFile rule for SDK packages
  - All packages now build successfully with proper type definitions

## 5.3.4

### Patch Changes

- Preserve configs types while still keep the validation

## 5.3.3

### Patch Changes

- Upgrade schema builder package to fix validation errors

## 5.3.2

### Patch Changes

- Serialize condition functions before sending to client

## 5.3.1

### Patch Changes

- minor update schema

## 5.3.0

### Minor Changes

- update schema validation

## 5.2.5

## 5.2.4

### Patch Changes

- 43f3da3: update schema

## 5.2.3

## 5.2.2

## 5.2.1

## 5.2.0

### Minor Changes

- update type system with new schema validation util

## 5.1.0

### Minor Changes

- Migrate `inspector` field to new `settings` property.

## 5.0.0

### Major Changes

- 7164bdb: Migrate to React Router v7 from Remix

### Patch Changes

- Release Candidate
- RC.1

## 5.0.0-next.1

### Patch Changes

- Release Candidate

## 5.0.0-next.0

### Major Changes

- Migrate to React Router v7 from Remix

## 4.3.4

### Patch Changes

- bump version

## 4.3.3

## 4.3.1

### Patch Changes

- bump version

## 4.3.0

## 4.2.10

### Patch Changes

- 9ce8f2c: Hot fix for shopify package

## 4.2.9

### Patch Changes

- Fix shopify package

## 4.2.8

### Patch Changes

- Update weaverse client methods to use arrow functions for better binding

## 4.2.7

### Patch Changes

- Fix get section preview data

## 4.2.6

### Patch Changes

- Fix generate default theme settings, clean up

## 4.2.5

### Patch Changes

- Restructure, remove unused types and unneccessary exports

## 4.2.4

### Patch Changes

- Patch release with minor improvements and bug fixes

## 4.2.2

## 4.2.1

## 4.2.0

## 4.1.2

## 4.1.1

## 4.1.0

## 4.0.1

## 4.0.0

## 3.4.2

### Patch Changes

- Add swatch config types, fix weaverse cached data

## 3.4.1

## 3.4.0

### Minor Changes

- Update using latest Shopify Hydrogen API

## 3.3.1

### Patch Changes

- Update metaobject input return type

## 3.3.0

## 3.2.9

### Patch Changes

- Fix linting errors, update linter rules

## 3.2.8

### Patch Changes

- Add new `Video` input

## 3.2.7

### Patch Changes

- Minor update to theme settings instance

## 3.2.6

### Patch Changes

- Update Types

## 3.2.5

### Patch Changes

- Export more utils from `@weaverse/react` package

## 3.2.4

### Patch Changes

- Update deps

## 3.2.3

### Patch Changes

- Update eslint

## 3.2.2

### Patch Changes

- Update types, update deps

## 3.2.1

### Patch Changes

- chore: fix some typos

## 3.2.0

### Minor Changes

- Update dependencies

## 3.1.16

### Patch Changes

- Update hydrogen toolbar action types

## 3.1.15

### Patch Changes

- Update types, update hydrogen placeholder images

## 3.1.14

### Patch Changes

- Remomve pilot from submodule & workspace packages

## 3.1.13

### Patch Changes

- Update schema config & docs

## 3.1.12

### Patch Changes

- Update placeholders image & fix types

## 3.1.11

### Patch Changes

- Update types, add more placeholders

## 3.1.10

### Patch Changes

- update core

## 3.1.9

### Patch Changes

- Fix typos

## 3.1.8

### Patch Changes

- Support create item instance from Weaverse core

## 3.1.7

### Patch Changes

- Minor update to support Global Section feature

## 3.1.6

### Patch Changes

- Fix item visibility func

## 3.1.5

## 3.1.4

## 3.1.3

### Patch Changes

- Fix typo, update types

## 3.1.2

## 3.1.1

### Patch Changes

- 3a975da: Adding url input type

## 3.1.0

## 3.0.1

## 3.0.0

### Major Changes

- Update dependencies & fix minor bugs

## 2.10.2

### Patch Changes

- update core mechanism

## 2.10.1

### Patch Changes

- optimize rendering mechanism

## 2.10.1-next.0

### Patch Changes

- optimize rendering mechanism

## 2.10.0

### Minor Changes

- Optimize page rendering with useSyncExternalStore

## 2.9.0

### Minor Changes

- Refactor

## 2.8.12

## 2.8.11

### Patch Changes

- update default weaverseHost to studio.weaverse.io

## 2.8.10

### Patch Changes

- d42301a: Update support for metaobject definition.
