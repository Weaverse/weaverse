# Weaverse SDKs Project Brief

## Project Overview
Weaverse SDKs is a monorepo containing a collection of SDKs for integrating Weaverse Headless CMS with modern React/JamStack frameworks. The project is developed by The Weaverse Team and aims to simplify CMS integration for various frameworks.

## Key Components
- Core SDK (@weaverse/core): Foundation package with core logic
- React SDK (@weaverse/react): React components and utilities
- Hydrogen SDK (@weaverse/hydrogen): Shopify Hydrogen integration
- Remix SDK (@weaverse/remix): Remix framework integration (in development)
- Next.js SDK (@weaverse/next): Next.js integration (in development)
- CLI Tools (@weaverse/cli): Command line utilities
- Shopify Integration (@weaverse/shopify): Shopify-specific tools

## Technical Stack
- TypeScript
- React 18
- Turbo for monorepo management
- Biome for linting and formatting
- PNPM for package management
- Node.js >= 22

## Development Workflow
- Uses Changesets for version management
- Lefthook for git hooks
- GitHub Actions for CI/CD
- Biome for code quality checks

## Project Status
Current version: 3.2.9
Active development with community contributions 