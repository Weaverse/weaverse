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