# @weaverse/cli

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
