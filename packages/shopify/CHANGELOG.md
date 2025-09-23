# @weaverse/shopify

## 5.5.0

### Patch Changes

- Updated dependencies [21ba4ed]
- Updated dependencies [2468404]
  - @weaverse/react@5.5.0

## 5.5.0-beta.2

### Patch Changes

- @weaverse/react@5.5.0-beta.2

## 5.5.0-beta.1

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.5.0-beta.1

## 5.5.0-beta.0

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.5.0-beta.0

## 5.4.2

### Patch Changes

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
  - @weaverse/react@5.3.1

## 5.3.0

### Minor Changes

- update schema validation

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.3.0

## 5.2.5

### Patch Changes

- @weaverse/react@5.2.5

## 5.2.4

### Patch Changes

- 43f3da3: update schema
- Updated dependencies [43f3da3]
  - @weaverse/react@5.2.4

## 5.2.3

### Patch Changes

- @weaverse/react@5.2.3

## 5.2.2

### Patch Changes

- @weaverse/react@5.2.2

## 5.2.1

### Patch Changes

- @weaverse/react@5.2.1

## 5.2.0

### Patch Changes

- @weaverse/react@5.2.0

## 5.1.0

### Minor Changes

- Migrate `inspector` field to new `settings` property.

### Patch Changes

- Updated dependencies
  - @weaverse/react@5.1.0

## 5.0.0

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

### Patch Changes

- @weaverse/react@5.0.0-next.0

## 4.3.4

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/react@4.3.4

## 4.3.3

### Patch Changes

- @weaverse/react@4.3.3

## 4.3.1

### Patch Changes

- bump version
- Updated dependencies
  - @weaverse/react@4.3.1

## 4.3.0

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

- @weaverse/react@4.2.2

## 4.2.1

### Patch Changes

- @weaverse/react@4.2.1

## 4.2.0

### Patch Changes

- @weaverse/react@4.2.0

## 4.1.2

### Patch Changes

- @weaverse/react@4.1.2

## 4.1.1

### Patch Changes

- @weaverse/react@4.1.1

## 4.1.0

### Minor Changes

- Update dependencies

### Patch Changes

- Updated dependencies
  - @weaverse/react@4.1.0

## 4.0.1

### Patch Changes

- @weaverse/react@4.0.1

## 4.0.0

### Patch Changes

- @weaverse/react@4.0.0

## 3.4.2

### Patch Changes

- Add swatch config types, fix weaverse cached data
- Updated dependencies
  - @weaverse/react@3.4.2

## 3.4.1

### Patch Changes

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

- Updated dependencies
  - @weaverse/react@3.1.7

## 3.1.6

### Patch Changes

- Updated dependencies
  - @weaverse/react@3.1.6

## 3.1.5

### Patch Changes

- @weaverse/react@3.1.5

## 3.1.4

### Patch Changes

- @weaverse/react@3.1.4

## 3.1.3

### Patch Changes

- Fix typo, update types
- Updated dependencies
  - @weaverse/react@3.1.3

## 3.1.2

### Patch Changes

- @weaverse/react@3.1.2

## 3.1.1

### Patch Changes

- 3a975da: Adding url input type
- Updated dependencies [3a975da]
  - @weaverse/react@3.1.1

## 3.1.0

### Patch Changes

- @weaverse/react@3.1.0

## 3.0.1

### Patch Changes

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

- @weaverse/react@2.8.12

## 2.8.11

### Patch Changes

- update default weaverseHost to studio.weaverse.io
- Updated dependencies
  - @weaverse/react@2.8.11

## 2.8.10

### Patch Changes

- Updated dependencies [d42301a]
  - @weaverse/react@2.8.10
