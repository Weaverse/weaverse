# Changelog


## [2025.07.22] - 2025-07-22

### 🎨 Weaverse Studio

#### 🎉 New Features
- **Brand New Dashboard**: Complete redesign with modern UI for better user experience
  - Beautiful animated welcome banner
  - Real-time changelog to stay updated
  - Improved project management with quick actions
  - Enhanced navigation and project switching
  - New billing and usage visualization
- **AI Assistant (Beta)**: Free AI-powered coding assistant to help build Hydrogen stores faster
  - Context-aware chat interface with real-time code generation
  - Multi-mode support: general queries, code generation, and documentation search
- **Account Management**: New settings page to manage API keys and personal access tokens
- **Figma Integration**: Import designs directly from Figma with OAuth authentication

#### ✨ Improvements
- Significantly faster dashboard loading with optimized data fetching
- Dark mode support across all new components
- Better error messages and form validation

#### 🐛 Bug Fixes
- Fixed AI chat interface stability issues
- Improved authentication and project access validation

---

### 🔧 Weaverse SDKs

#### 🎉 New Features
- **Biome v2.1.2**: New linting rules for code quality, performance, and sorted Tailwind classes
- **Ultracite**: Added for improved code formatting

#### ✨ Improvements
- Enhanced GitHub workflows with Claude AI integration
- Strict TypeScript with null checks enabled
- Better build performance

---

### 🚀 Weaverse Pilot Theme

#### 🎉 New Features
- **Quick Shop Modal**: Browse and select product variants without leaving collection pages
- **Product Bundles Support**: Full Shopify bundles integration with badges and special cart handling
- **Newsletter Popup**: Smart email capture with customizable timing and Klaviyo integration
- **Enhanced Product Display**: New zoom functionality, dynamic badges, and improved variant selector

#### ✨ Improvements
- Switched to Cabin Variable font for better readability
- Enhanced cart experience with bundle support
- Added CLAUDE.md coding guidelines
- Implemented sorted Tailwind classes with Biome
- Optimized image loading and pagination

#### 🐛 Bug Fixes
- Fixed quick shop variant selection
- Corrected logo visibility with transparent headers
- Fixed pagination links and cart form submissions
- Improved media zoom responsiveness

#### 🔧 Technical Updates
- React Player downgraded to 2.16.0 for stability
- Vite 6.3.5 for Shopify CLI compatibility
- Added EditorConfig and enhanced Biome configuration

## [2025.07] - 2025-07-03

### 🎨 Weaverse Studio
*For users customizing Hydrogen themes in the Weaverse visual editor*

#### 🎉 New Features
- **Better Documentation Experience**: Added a new feedback system so you can easily tell us what's helpful or confusing in our docs
- **Faster Blog Loading**: Blog pages now load much faster with smarter pagination that handles large amounts of content efficiently
- **Improved Content Management**: Enhanced blog integration makes it easier to manage and display your content

#### ✨ Improvements
- **Smoother Color Picker**: The color selection tool now works more smoothly and calculates colors more accurately
- **Unified Blog Experience**: Streamlined how blog posts are displayed across different parts of your site
- **More Content Per Page**: Blog listings now show 9 posts instead of 6, giving visitors more content to explore
- **Better Code Organization**: New tools automatically organize your code for better readability and consistency
- **Cleaner Project Structure**: Automatic cleanup tools keep your project files organized

#### 🐛 Bug Fixes
- **Fixed Database Issues**: Resolved problems with data storage and project configuration
- **Better Communication**: Improved integration between studio interface and theme files

---

### 🔧 Weaverse SDKs
*For developers building Hydrogen themes with Weaverse components*

#### 🎉 New Features
- **Modern Code Quality Tools**: Updated to Biome v2.0.0 for better code formatting and linting
- **Enhanced Schema Validation**: Improved component schema validation with better error reporting
- **Function-Based Conditions**: New powerful conditional logic system for component settings

#### ✨ Improvements
- **Updated Documentation**: All guides now use clearer, more consistent terminology (replaced 'inspector' with 'settings')
- **Better Form Validation**: Enhanced validation system prevents configuration errors
- **Improved Reliability**: Better automated testing and deployment processes mean fewer bugs
- **Enhanced Developer Tools**: Updated to latest versions of essential development tools

#### 🔧 Behind the Scenes
- **Smarter Configuration**: New function-based settings that are more flexible and powerful than the old text-based ones
- **Better Type Safety**: Improved TypeScript definitions and runtime validation

#### 🐛 Bug Fixes
- **Better Form Validation**: Fixed issues where some form settings weren't being saved properly (Zod v3 union type parsing)
- **Improved Error Handling**: Better handling of complex form configurations
- **Fixed Communication Issues**: Resolved problems where some features weren't working properly between different parts of the system

#### 🔒 Security
- **Enhanced Deployment Security**: Improved security configurations for safer website deployment

---

### 🚀 Weaverse Pilot Theme
*The official Hydrogen starter theme with Weaverse integration*

#### ✨ Improvements
- **Modern Styling System**: Updated to the latest CSS framework versions for faster loading and better performance
- **Better Code Quality**: Enhanced code formatting tools ensure your project stays clean and professional
- **Improved Build Tools**: Updated build configuration for better development experience
- **Enhanced Development Workflow**: Better tooling integration for smoother development

#### 🐛 Bug Fixes
- **Fixed Configuration Issues**: Resolved problems that could cause issues during development
- **Better Runtime Stability**: Fixed issues that could cause crashes when using certain features
- **Improved Build Process**: Fixed configuration issues that could cause problems during development

## [5.3.4] - 2025-06-12

### Fixed
- **Better Tests**: Migrated old test files to use proper Vitest instead of console.log statements 🧪
- **Schema Updates**: Updated to use the latest `@weaverse/schema` v0.7.3 for better validation

### Changed
- **All Packages**: Updated core, hydrogen, react, and shopify packages to work together smoothly

## [5.3.3] - 2025-06-11

### Fixed
- **Schema Validation**: Fixed range input configs validation bug where min, max, step, and unit properties were being stripped during safeParse operations
- **Union Type Handling**: Improved Zod v3 union type parsing to maintain context-aware validation for different input types
- **Config Preservation**: Ensured all input type configurations are properly preserved during schema validation

### Changed
- **Schema Package**: Upgraded `@weaverse/schema` to 0.7.2 with enhanced validation logic
- **Dependencies**: Updated all dependent packages to maintain consistency across the SDK

## [5.3.2] - 2025-06-10

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