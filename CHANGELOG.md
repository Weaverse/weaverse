# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [5.3.3] - 2025-01-26

### Fixed
- **Schema Validation**: Fixed range input configs validation bug where min, max, step, and unit properties were being stripped during safeParse operations
- **Union Type Handling**: Improved Zod v3 union type parsing to maintain context-aware validation for different input types
- **Config Preservation**: Ensured all input type configurations are properly preserved during schema validation

### Changed
- **Schema Package**: Upgraded `@weaverse/schema` to 0.7.2 with enhanced validation logic
- **Dependencies**: Updated all dependent packages to maintain consistency across the SDK

## [5.3.2] - 2025-01-26

### Fixed
- **Function Serialization**: Fixed issue with condition functions not being properly serialized before sending to client
- **Client-Side Validation**: Improved client-side condition function handling to prevent runtime errors

### Changed
- **Function Handling**: Enhanced function serialization mechanism for better client-server communication

## [5.1.0] - 2025-06-04

### Added
- Support for the new `settings` property in component and theme schemas.
- **Pilot Theme TailwindCSS v4 Migration**: The Pilot Weaverse Hydrogen Theme now uses TailwindCSS v4, bringing improved performance, better CSS-in-JS integration, and enhanced developer experience.

### Changed
- Deprecated the old `inspector` property. Schemas should now use `settings`.
- **TailwindCSS Configuration**: Updated Pilot theme build system and styling architecture to leverage TailwindCSS v4's new features including automatic CSS-in-JS support and improved build performance.

### Migration
- Refer to the updated documentation for guidance on migrating existing
  components from `inspector` to `settings`.
- **TailwindCSS v4 Migration**: For existing Pilot theme users, we recommend creating a new project with `npx @weaverse/cli@latest create` to get the latest TailwindCSS v4 setup, or cloning the updated Pilot template. TailwindCSS v4 introduces significant architectural changes that are best adopted in a fresh project setup. Refer to the [TailwindCSS v4 migration guide](https://tailwindcss.com/docs/upgrade-guide) for detailed information about the new features and improvements.

## [5.0.0] - 2025-05-27

### 🚀 MAJOR RELEASE: React Router v7 Migration

This major release migrates Weaverse Hydrogen from Remix to React Router v7, aligning with [Shopify Hydrogen's May 2025 release](https://hydrogen.shopify.dev/update/may-2025).

### Added
- **React Router v7 Foundation**: Complete migration to React Router v7 as the core architecture
- **Enhanced Type Safety**: Improved TypeScript definitions and better type inference
- **Comprehensive Migration Guide**: Step-by-step documentation for upgrading existing projects
- **Updated CLI Templates**: Weaverse CLI generates React Router v7 compatible themes by default
- **Performance Optimizations**: Better tree-shaking and build-time optimizations
- **Modern Development Experience**: Enhanced hot module replacement and error reporting

### Changed
- **BREAKING**: Migrated from Remix to React Router v7 architecture
- **BREAKING**: Updated data loading patterns from Remix loaders to React Router v7 loaders
- **BREAKING**: Replaced `@shopify/remix-oxygen` dependencies with React Router equivalents
- **BREAKING**: Updated component APIs and imports to match React Router v7 conventions
- **BREAKING**: Changed TypeScript module declarations from `@shopify/remix-oxygen` to `react-router`
- **Dependencies Updated**:
  - `@shopify/hydrogen`: >=2025.5.0
  - `react-router`: ^7.0.0
  - Removed `@shopify/remix-oxygen` dependency
- **Build Performance**: Faster build times with improved bundling and tree-shaking
- **Development Experience**: Enhanced hot reloading and clearer error messages

### Deprecated
- **Remix Integration**: `@weaverse/remix` package is deprecated in favor of React Router v7

### Removed
- **Remix Dependencies**: Removed all Remix-specific dependencies and code paths
- **Legacy Loaders**: Removed Remix-style loader patterns

### Migration Guide
- **Existing Projects**: Follow the [migration guide](/docs/hydrogen/migration-to-v5.md) to upgrade to v5
- **New Projects**: Use `npx @weaverse/cli@latest create` for React Router v7 projects
- **Theme Compatibility**: All starter themes updated for React Router v7

### Documentation
- **Migration Guide**: Complete guide at `/docs/hydrogen/migration-to-v5.md`
- **Getting Started**: Updated setup instructions for React Router v7
- **API Documentation**: Refreshed API references and examples
- **Community Resources**: Updated support channels and resources

## [3.2.9] - 2024-12-19

### Added
- Initial changelog setup for Weaverse SDKs monorepo

### Changed
- Improved documentation structure and organization

---

## Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

## Guidelines for Contributors

This changelog is automatically maintained using [Changesets](https://github.com/changesets/changesets).

### Adding a changeset

When you make changes that should be included in the changelog:

1. Run `pnpm changeset` to create a new changeset
2. Select the packages that have been changed
3. Select the type of change (patch, minor, major)
4. Write a clear description of your changes
5. Commit the generated changeset file with your changes

### Release process

When ready to release:

1. Run `pnpm changeset version` to consume changesets and update package versions
2. Review the generated changelog entries
3. Commit the version changes
4. Create a release tag and publish packages

For more information, see our [Contributing Guidelines](./CONTRIBUTING.md). 