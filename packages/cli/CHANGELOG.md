# @weaverse/cli

## 5.5.1

### Patch Changes

- patch version

## 5.5.0

### Minor Changes

- bump version

## 5.4.2

### Patch Changes

- bump new version

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

## 4.0.1

### Patch Changes

- 34d5e47: Fix PR review feedback - documentation and changeset compliance

  Minor fixes to address PR review comments:
  - Update CLAUDE.md version table with correct CLI version (3.0.0)
  - Document CLI as JavaScript-only exception in TypeScript guidelines
  - Add changeset to satisfy changeset-bot requirements

  Note: The major CLI modernization was already released as version 3.0.0.

## 4.0.0

### Major Changes

- fbd7d4b: Address PR review feedback for CLI modernization

  This changeset acknowledges the CLI modernization changes that were already released as version 3.0.0. The changes include:
  - Interactive CLI experience with prompts for missing options
  - Modular architecture replacing monolithic index.js
  - Enhanced user experience with validation and confirmations
  - Full backward compatibility maintained

  Note: Version 3.0.0 was already published to npm with these changes.

## 3.0.0

### Major Changes

- ## Interactive CLI Experience and Modular Architecture

  Complete overhaul of `@weaverse/cli` to provide a modern, user-friendly experience with interactive prompts and modular architecture.

  ### Major Changes
  - **Interactive CLI Experience**: Complete overhaul with interactive prompts for missing options
    - Users no longer get errors when required options are missing - CLI prompts interactively instead
    - Smart template selection with descriptions and demo URLs
    - Validation and transformation of user inputs in real-time
    - Confirmation prompts for overwriting existing directories

  - **Modular Architecture**: Refactored from single 274-line file to clean, maintainable modules
    - `/src/commands/` - Command implementations
    - `/src/prompts/` - Interactive prompt definitions
    - `/src/utils/` - Utility functions (validation, download, install, environment)
    - `/src/constants/` - Template configurations and constants

  - **Enhanced User Experience**:
    - Comprehensive input validation with helpful error messages
    - Smart defaults (auto-generated project names, kebab-case conversion)
    - Directory existence checking with overwrite confirmation
    - Optional development server start after project creation
    - Better progress indicators and colored output

  - **Better Error Handling**: Contextual help messages and graceful error recovery

  ### New Dependencies
  - `inquirer@^9.2.15` - Interactive command line prompts
  - `validate-npm-package-name@^5.0.1` - Project name validation

  ### Migration Guide

  No migration needed! The CLI maintains full backward compatibility - all existing usage patterns continue to work exactly as before.

## 2.0.0

### Major Changes

- **Interactive CLI Experience**: Complete overhaul with interactive prompts for missing options
  - Users no longer get errors when required options are missing - CLI prompts interactively instead
  - Smart template selection with descriptions and demo URLs
  - Validation and transformation of user inputs in real-time
  - Confirmation prompts for overwriting existing directories

- **Modular Architecture**: Refactored from single 274-line file to clean, maintainable modules
  - `/src/commands/` - Command implementations
  - `/src/prompts/` - Interactive prompt definitions
  - `/src/utils/` - Utility functions (validation, download, install, environment)
  - `/src/constants/` - Template configurations and constants

- **Enhanced User Experience**:
  - Comprehensive input validation with helpful error messages
  - Smart defaults (auto-generated project names, kebab-case conversion)
  - Directory existence checking with overwrite confirmation
  - Optional development server start after project creation
  - Better progress indicators and colored output

- **Better Error Handling**: Contextual help messages and graceful error recovery

### New Dependencies

- `inquirer@^9.2.15` - Interactive command line prompts
- `validate-npm-package-name@^5.0.1` - Project name validation

## 1.4.0

### Minor Changes

- Add Aspen template and enhance template display
  - Add new Aspen template for home furniture and interior design stores
  - Update Pilot and Naturelle template descriptions
  - Add demo URLs for all templates
  - Improve help display with capitalized names and formatted template information

## 1.3.0

### Minor Changes

- Update using latest Shopify Hydrogen API

## 1.2.0

### Minor Changes

- Add support for more themes

## 1.1.3

### Patch Changes

- update core mechanism

## 1.1.1

### Patch Changes

- Refactor
