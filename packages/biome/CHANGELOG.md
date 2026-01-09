# @weaverse/biome

## 5.7.1

### Patch Changes

- patch version

## 5.7.0

### Minor Changes

- bump version

## 5.6.3

### Patch Changes

- bump new version

## 5.6.2

### Patch Changes

- bump biome config

## 5.6.1

### Patch Changes

- bump

## 5.6.0

### Minor Changes

- update biome to latest version

## 5.5.0

### Minor Changes

- update biome to v2.2.5

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

## 1.6.2-beta.0

### Patch Changes

- Beta release with build fixes and improved Biome configuration

## 1.6.1

### Patch Changes

- Fix TypeScript build issues and improve Biome configuration
  - Fixed duplicate Window identifier issues across packages by using interface merging
  - Added missing PUBLIC_STORE_DOMAIN and PUBLIC_STOREFRONT_API_TOKEN to HydrogenEnv type
  - Fixed AppLoadContext and HydrogenEnv duplicate declarations using proper module augmentation
  - Updated Biome configuration to automatically remove unused variables and imports
  - Disabled noBarrelFile rule for SDK packages
  - All packages now build successfully with proper type definitions

## 1.6.0

### Minor Changes

- Minor version release for @weaverse/biome package

## 1.5.1

### Patch Changes

- Consolidated biome rules from pilot and builder projects into the shared package configuration.
  - Added new rules from builder project (style, suspicious, nursery, correctness, a11y, complexity, performance)
  - Added comprehensive file exclusion patterns from both pilot and builder projects
  - Maintained original package rule priorities while allowing project-specific overrides
  - Projects now only need to specify their specific overrides, reducing duplication

## 1.3.0

### Minor Changes

- update biome to v2

## 1.2.4

### Patch Changes

- fix wrong imports

## 1.2.3

### Patch Changes

- update biome config

## 1.2.2

### Patch Changes

- update biome rules

## 1.2.1

### Patch Changes

- update biome rule

## 1.2.0

### Minor Changes

- update biome to v2

## 1.1.1

### Patch Changes

- Release Candidate
- RC.1
- 7164bdb: Migrate to React Router v7 from Remix

## 1.1.1-next.1

### Patch Changes

- Release Candidate

## 1.1.1-next.0

### Patch Changes

- Migrate to React Router v7 from Remix

## 1.1.0

### Minor Changes

- Update using latest Shopify Hydrogen API
