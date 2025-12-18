# @weaverse/react

## 5.8.5

### Patch Changes

- @weaverse/core@5.8.5

## 5.8.4

### Patch Changes

- @weaverse/core@5.8.4

## 5.8.3

### Patch Changes

- update getRootId
  - @weaverse/core@5.8.3

## 5.8.2

### Patch Changes

- chore: refactor
- Updated dependencies
  - @weaverse/core@5.8.2

## 5.8.1

### Patch Changes

- @weaverse/core@5.8.1

## 5.8.0

### Patch Changes

- @weaverse/core@5.8.0

## 5.7.1

### Patch Changes

- @weaverse/core@5.7.1

## 5.7.0

### Minor Changes

- Initialize customerAccount in WeaverseClient constructor

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.7.0

## 5.6.0

### Minor Changes

- Bump v5.6.0

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.6.0

## 5.5.1

### Patch Changes

- Fix performance issue of Data Connector feature
  - @weaverse/core@5.5.1

## 5.5.0

### Patch Changes

- 3720e74: bump beta version
- 469f291: update parse logic
- 9ee3be2: update data parser
- Updated dependencies [3720e74]
- Updated dependencies [469f291]
- Updated dependencies [9ee3be2]
  - @weaverse/core@5.5.0

## 5.5.0-beta.7

### Patch Changes

- update parse logic
- Updated dependencies
  - @weaverse/core@5.5.0-beta.7

## 5.5.0-beta.6

### Minor Changes

- Enhanced route pattern support for complex Remix routes with special characters
- Added intelligent route key detection supporting patterns like `routes/($locale)._index.weaverseData.page.name`
- Implemented LRU caching for route parsing with context-aware cache keys
- Fixed data immutability issues in template replacement
- Added comprehensive test coverage for complex route patterns (75 total tests)
- Improved performance with optimized caching strategies

### Features

- **Complex Route Support**: Full support for Remix route patterns including `/ ( ) $ .` characters
- **Smart Route Detection**: Automatically detects the longest matching route key for specificity
- **Performance Caching**: Context-aware LRU caching for route parsing and template resolution
- **Data Integrity**: Guaranteed immutability through deep cloning and proper data handling
- **Backward Compatibility**: All existing template patterns continue to work unchanged

## 5.5.0-beta.5

### Patch Changes

- update data parser
- Updated dependencies
  - @weaverse/core@5.5.0-beta.5

## 5.5.0-beta.4

### Patch Changes

- bump beta version
- Updated dependencies
  - @weaverse/core@5.5.0-beta.4

## 5.5.1-beta.0

### Patch Changes

- @weaverse/core@5.5.1-beta.0

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
  - @weaverse/core@5.5.0

## 5.5.0-beta.2

### Patch Changes

- @weaverse/core@5.5.0-beta.2

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
  - @weaverse/core@5.5.0-beta.1

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
  - @weaverse/core@5.5.0-beta.0

## 5.4.2

### Patch Changes

- @weaverse/core@5.4.2

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
  - @weaverse/core@5.4.1

## 0.0.0-beta-20250825103739

### Patch Changes

- feat: API cache proxy improvements and debug logging
  - Updated cache strategy with improved timing configuration
  - Added debug logging for API proxy usage tracking
  - Enhanced cache control with optimized stale-while-revalidate settings
  - Minor performance improvements in cache key generation

- Updated dependencies
- Updated dependencies [6642fc2]
  - @weaverse/core@0.0.0-beta-20250825103739

## 5.4.1-beta.0

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.4.1-beta.0

## 5.4.0

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.4.0

## 5.3.4

### Patch Changes

- Preserve configs types while still keep the validation
- Updated dependencies
  - @weaverse/core@5.3.4

## 5.3.3

### Patch Changes

- Upgrade schema builder package to fix validation errors
- Updated dependencies
  - @weaverse/core@5.3.3

## 5.3.2

### Patch Changes

- Serialize condition functions before sending to client
- Updated dependencies
  - @weaverse/core@5.3.2

## 5.3.1

### Patch Changes

- minor update schema
- Updated dependencies
  - @weaverse/core@5.3.1

## 5.3.0

### Minor Changes

- update schema validation

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.3.0

## 5.2.5

### Patch Changes

- @weaverse/core@5.2.5

## 5.2.4

### Patch Changes

- 43f3da3: update schema
- Updated dependencies [43f3da3]
  - @weaverse/core@5.2.4

## 5.2.3

### Patch Changes

- @weaverse/core@5.2.3

## 5.2.2

### Patch Changes

- @weaverse/core@5.2.2

## 5.2.1

### Patch Changes

- @weaverse/core@5.2.1

## 5.2.0

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.2.0

## 5.1.0

### Minor Changes

- Migrate `inspector` field to new `settings` property.

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.1.0

## 5.0.0

### Patch Changes

- Release Candidate
- RC.1
- Updated dependencies
- Updated dependencies
- Updated dependencies [7164bdb]
  - @weaverse/core@5.0.0

## 5.0.0-next.1

### Patch Changes

- Release Candidate
- Updated dependencies
  - @weaverse/core@5.0.0-next.1

## 5.0.0-next.0

### Patch Changes

- Updated dependencies
  - @weaverse/core@5.0.0-next.0

## 4.3.4

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/core@4.3.4

## 4.3.3

### Patch Changes

- @weaverse/core@4.3.3

## 4.3.1

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/core@4.3.1

## 4.3.0

### Patch Changes

- @weaverse/core@4.3.0

## 4.2.10

### Patch Changes

- 9ce8f2c: Hot fix for shopify package
- Updated dependencies [9ce8f2c]
  - @weaverse/core@4.2.10

## 4.2.9

### Patch Changes

- Fix shopify package
- Updated dependencies
  - @weaverse/core@4.2.9

## 4.2.8

### Patch Changes

- Update weaverse client methods to use arrow functions for better binding
- Updated dependencies
  - @weaverse/core@4.2.8

## 4.2.7

### Patch Changes

- Fix get section preview data
- Updated dependencies
  - @weaverse/core@4.2.7

## 4.2.6

### Patch Changes

- Fix generate default theme settings, clean up
- Updated dependencies
  - @weaverse/core@4.2.6

## 4.2.5

### Patch Changes

- Restructure, remove unused types and unneccessary exports
- Updated dependencies
  - @weaverse/core@4.2.5

## 4.2.4

### Patch Changes

- Patch release with minor improvements and bug fixes
- Updated dependencies
  - @weaverse/core@4.2.4

## 4.2.2

### Patch Changes

- @weaverse/core@4.2.2

## 4.2.1

### Patch Changes

- @weaverse/core@4.2.1

## 4.2.0

### Patch Changes

- @weaverse/core@4.2.0

## 4.1.2

### Patch Changes

- @weaverse/core@4.1.2

## 4.1.1

### Patch Changes

- @weaverse/core@4.1.1

## 4.1.0

### Minor Changes

- Update dependencies

### Patch Changes

- @weaverse/core@4.1.0

## 4.0.1

### Patch Changes

- @weaverse/core@4.0.1

## 4.0.0

### Patch Changes

- @weaverse/core@4.0.0

## 3.4.2

### Patch Changes

- Add swatch config types, fix weaverse cached data
- Updated dependencies
  - @weaverse/core@3.4.2

## 3.4.1

### Patch Changes

- @weaverse/core@3.4.1

## 3.4.0

### Minor Changes

- Update using latest Shopify Hydrogen API

### Patch Changes

- Updated dependencies
  - @weaverse/core@3.4.0

## 3.3.1

### Patch Changes

- Update metaobject input return type
- Updated dependencies
  - @weaverse/core@3.3.1

## 3.3.0

### Patch Changes

- @weaverse/core@3.3.0

## 3.2.9

### Patch Changes

- Fix linting errors, update linter rules
- Updated dependencies
  - @weaverse/core@3.2.9

## 3.2.8

### Patch Changes

- Add new `Video` input
- Updated dependencies
  - @weaverse/core@3.2.8

## 3.2.7

### Patch Changes

- Updated dependencies
  - @weaverse/core@3.2.7

## 3.2.6

### Patch Changes

- Update Types
- Updated dependencies
  - @weaverse/core@3.2.6

## 3.2.5

### Patch Changes

- Export more utils from `@weaverse/react` package
- Updated dependencies
  - @weaverse/core@3.2.5

## 3.2.4

### Patch Changes

- Update deps
- Updated dependencies
  - @weaverse/core@3.2.4

## 3.2.3

### Patch Changes

- Update eslint
- Updated dependencies
  - @weaverse/core@3.2.3

## 3.2.2

### Patch Changes

- Update types, update deps
- Updated dependencies
  - @weaverse/core@3.2.2

## 3.2.1

### Patch Changes

- chore: fix some typos
- Updated dependencies
  - @weaverse/core@3.2.1

## 3.2.0

### Minor Changes

- Update dependencies

### Patch Changes

- Updated dependencies
  - @weaverse/core@3.2.0

## 3.1.16

### Patch Changes

- Update hydrogen toolbar action types
- Updated dependencies
  - @weaverse/core@3.1.16

## 3.1.15

### Patch Changes

- Update types, update hydrogen placeholder images
- Updated dependencies
  - @weaverse/core@3.1.15

## 3.1.14

### Patch Changes

- Remomve pilot from submodule & workspace packages
- Updated dependencies
  - @weaverse/core@3.1.14

## 3.1.13

### Patch Changes

- Update schema config & docs
- Updated dependencies
  - @weaverse/core@3.1.13

## 3.1.12

### Patch Changes

- Update placeholders image & fix types
- Updated dependencies
  - @weaverse/core@3.1.12

## 3.1.11

### Patch Changes

- Update types, add more placeholders
- Updated dependencies
  - @weaverse/core@3.1.11

## 3.1.10

### Patch Changes

- Updated dependencies
  - @weaverse/core@3.1.10

## 3.1.9

### Patch Changes

- Fix typos
- Updated dependencies
  - @weaverse/core@3.1.9

## 3.1.8

### Patch Changes

- Support create item instance from Weaverse core
- Updated dependencies
  - @weaverse/core@3.1.8

## 3.1.7

### Patch Changes

- Minor update to support Global Section feature
- Updated dependencies
  - @weaverse/core@3.1.7

## 3.1.6

### Patch Changes

- Fix item visibility func
- Updated dependencies
  - @weaverse/core@3.1.6

## 3.1.5

### Patch Changes

- @weaverse/core@3.1.5

## 3.1.4

### Patch Changes

- @weaverse/core@3.1.4

## 3.1.3

### Patch Changes

- Fix typo, update types
- Updated dependencies
  - @weaverse/core@3.1.3

## 3.1.2

### Patch Changes

- @weaverse/core@3.1.2

## 3.1.1

### Patch Changes

- 3a975da: Adding url input type
- Updated dependencies [3a975da]
  - @weaverse/core@3.1.1

## 3.1.0

### Patch Changes

- @weaverse/core@3.1.0

## 3.0.1

### Patch Changes

- @weaverse/core@3.0.1

## 3.0.0

### Major Changes

- Update dependencies & fix minor bugs

### Patch Changes

- Updated dependencies
  - @weaverse/core@3.0.0

## 2.10.2

### Patch Changes

- update core mechanism
- Updated dependencies
  - @weaverse/core@2.10.2

## 2.10.1

### Patch Changes

- optimize rendering mechanism
- Updated dependencies
  - @weaverse/core@2.10.1

## 2.10.1-next.0

### Patch Changes

- optimize rendering mechanism
- Updated dependencies
  - @weaverse/core@2.10.1-next.0

## 2.10.0

### Minor Changes

- Optimize page rendering with useSyncExternalStore

### Patch Changes

- Updated dependencies
  - @weaverse/core@2.10.0

## 2.9.0

### Minor Changes

- Refactor

### Patch Changes

- Updated dependencies
  - @weaverse/core@2.9.0

## 2.8.12

### Patch Changes

- @weaverse/core@2.8.12

## 2.8.11

### Patch Changes

- update default weaverseHost to studio.weaverse.io
- Updated dependencies
  - @weaverse/core@2.8.11

## 2.8.10

### Patch Changes

- d42301a: Update support for metaobject definition.
- Updated dependencies [d42301a]
  - @weaverse/core@2.8.10
