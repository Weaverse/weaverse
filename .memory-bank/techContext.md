# Technical Context

## Core Technologies
- Node.js 22.x (minimum 18.x)
- PNPM 8.x or higher
- React 18.3.1
- TypeScript 5.8.2
- Shopify Hydrogen

## Development Tools
- Cursor IDE (recommended)
- GitHub Copilot
- MCP Servers:
  - Weaverse MCP
  - Shopify MCP
  - Figma MCP

## Environment Configuration
### Required Variables
- SESSION_SECRET
- PUBLIC_STORE_DOMAIN
- PUBLIC_STOREFRONT_API_TOKEN
- PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID
- PUBLIC_CUSTOMER_ACCOUNT_API_URL
- SHOP_ID
- WEAVERSE_PROJECT_ID

### Optional Variables
- WEAVERSE_API_KEY
- WEAVERSE_HOST
- PUBLIC_STOREFRONT_ID
- PRIVATE_STOREFRONT_API_TOKEN
- PUBLIC_STOREFRONT_API_VERSION

### Third-Party Integrations
- PUBLIC_GOOGLE_GTM_ID
- JUDGEME_PRIVATE_API_TOKEN
- KLAVIYO_PRIVATE_API_TOKEN
- PUBLIC_SHOPIFY_INBOX_SHOP_ID

### Custom Metafields
- METAOBJECT_COLORS_TYPE
- CUSTOM_COLLECTION_BANNER_METAFIELD

## API Integration
- Storefront API requires all permissions enabled
- Customer Account API integration
- Weaverse API integration
- Third-party service integrations

## Documentation
- Updated environment variables guide (April 11, 2025)
- Comprehensive component documentation
- API reference guides
- Development best practices

## Package Management
- PNPM as primary package manager
- Support for npm and Yarn as alternatives

## Browser Support
- Chrome-based browsers (Chrome, Arc, Edge)
- Chrome DevTools for debugging

## Shopify Integration
- Basic plan or higher required
- Shopify Partner account recommended
- GraphQL API integration

## Core Dependencies
- Node.js >= 22
- PNPM 10.6.5
- TypeScript 5.8.2
- React 18.3.1
- React DOM 18.3.1

## Development Tools
- Turbo 2.4.4 (monorepo management)
- Biome 1.9.4 (linting and formatting)
- Changesets 2.28.1 (version management)
- Lefthook 1.11.4 (git hooks)
- TSUP 8.4.0 (TypeScript bundling)

## Build System
- PNPM workspace configuration
- Turbo pipeline configuration
- TypeScript configuration
- Biome configuration

## CI/CD Pipeline
- GitHub Actions workflows
- Automated testing
- Type checking
- Linting and formatting
- Version management

## Framework Integration
- React components and hooks
- Framework-specific adapters
- Type-safe interfaces
- Shared utilities and helpers 