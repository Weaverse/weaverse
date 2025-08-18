# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Weaverse SDKs monorepo** - a collection of SDKs for integrating modern React/JamStack frameworks (Shopify Hydrogen, React Router, Next.js) with the Weaverse Headless CMS. The project uses pnpm for package management, Turbo for build orchestration, and Biome for code quality.

## Essential Commands

### Development
```bash
npm run dev          # Start development for all packages (with turbo)
npm run dev:pkg      # Development with LOCAL_DEV=true and remote changelog
npm run build        # Build all packages in /packages/*
npm run build:graph  # Build with dependency graph visualization
npm run test         # Run tests across all packages
```

### Single Package Commands
```bash
# Run commands for specific packages using turbo filters
turbo dev --filter=@weaverse/core          # Develop single package
turbo build --filter=@weaverse/react       # Build single package
turbo test --filter=@weaverse/hydrogen     # Test single package
```

### Code Quality (Always run before committing)
```bash
npm run biome        # Check for linting/formatting errors
npm run biome:fix    # Fix linting/formatting errors
npm run format       # Format code with Biome
npm run format:check # Check formatting without changes
npm run typecheck    # Run TypeScript type checking (parallel)
npm run ci           # Run Biome CI checks on changed files
```

### Maintenance
```bash
npm run clean            # Clean all build artifacts and dependencies
npm run upgrade-packages # Upgrade package dependencies
npm run update-deps      # Update dependencies
npm run changeset        # Create a changeset for release
```

### Package Management (Note: Uses npm scripts but pnpm for installation)
```bash
pnpm install             # Install dependencies (enforced via packageManager)
pnpm changeset version   # Version packages based on changesets
pnpm changeset publish   # Publish to npm registry
```

## Architecture Overview

### Monorepo Structure
- **`/packages/core`** - Foundation package with framework-agnostic code
- **`/packages/react`** - React components and utilities for CMS integration
- **`/packages/hydrogen`** - Shopify Hydrogen integration (now powered by React Router v7)
- **`/packages/shopify`** - Shopify-specific utilities
- **`/packages/schema`** - Schema definitions for Weaverse components
- **`/packages/cli`** - CLI tools for Weaverse development
- **`/packages/biome`** - Shared Biome configuration
- **`/templates/pilot`** - Example Hydrogen theme with Weaverse integration

### Key Architectural Patterns

1. **Package Dependencies**:
   - `@weaverse/react` depends on `@weaverse/core`
   - `@weaverse/hydrogen` depends on `@weaverse/react` and `@weaverse/schema`
   - All packages use TypeScript and are built with tsup (except CLI which uses JavaScript)

2. **Build System**:
   - Turbo orchestrates builds with dependency graph awareness
   - Each package has its own `tsup` configuration
   - Build outputs to `dist/` with ESM and CJS formats

3. **Development Workflow**:
   - Use `turbo dev` for watch mode across packages
   - Local development uses `LOCAL_DEV=true` environment variable
   - Changesets manage version bumping and releases

4. **Code Quality**:
   - Biome handles both linting and formatting
   - Configuration extends from `ultracite` and custom rules
   - Pre-commit hooks via Lefthook ensure code quality
   - Excludes templates and build artifacts from linting

5. **Type System Architecture**:
   - Hierarchical dependencies: core → react → hydrogen/schema
   - Schema package serves as source of truth for component types
   - Zod schemas provide runtime validation with TypeScript inference
   - See `/packages/TYPE_SYSTEM_ARCHITECTURE.md` for detailed information

### Package Development

When working on SDK packages:

1. **Core Package** (`/packages/core`):
   - Framework-agnostic logic
   - Uses `@stitches/core` for styling
   - Entry point: `src/index.ts`

2. **React Package** (`/packages/react`):
   - React bindings and components
   - Depends on React 18+
   - Uses `clsx` for class name management

3. **Hydrogen Package** (`/packages/hydrogen`):
   - Shopify Hydrogen specific integrations
   - Requires React Router v7
   - Includes error boundary support

### Release Process

The project uses Changesets for releases:

1. Create changeset: `npm run changeset`
2. Version packages: `pnpm changeset version`
3. Publish to npm: `pnpm changeset publish`
4. Commit and push to main branch
5. Create GitHub release

### Testing Strategy

- Tests run via `turbo run test`
- Individual packages may have their own test suites
- The Pilot template includes E2E tests with Playwright

### Environment Requirements

- Node.js >= 22
- pnpm 10.12.1 (enforced via packageManager field)
- Git for version control integration

### Version Compatibility

| Package | Version | React | Node.js | Key Dependencies |
|---------|---------|-------|---------|-----------------|
| @weaverse/core | 5.3.4 | - | >=18 | @stitches/core@1.2.8 |
| @weaverse/react | 5.3.4 | >=18 | >=18 | @weaverse/core@5.3.4 |
| @weaverse/hydrogen | 5.3.4 | >=18 | >=20 | @shopify/hydrogen@>=2025.5, react-router@7 |
| @weaverse/schema | 0.7.3 | - | >=18 | - |
| @weaverse/shopify | * | - | >=18 | @weaverse/core |
| @weaverse/cli | 3.0.0 | - | >=18 | inquirer@^9.2.15, validate-npm-package-name@^5.0.1 |

**Note**: All @weaverse packages should be kept at the same major version for compatibility.

## Code Conventions

### TypeScript Guidelines
- **Type Safety**: Strict mode enabled, avoid `any` type
- **Function Signatures**: Always define types for parameters and return values
- **Data Structures**: Use interfaces for data structures and type definitions
- **Immutability**: Prefer immutable data (`const`, `readonly`)
- **Safe Access**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Code Style (Enforced by Biome)
- **Variables**: Use camelCase for variables and functions, PascalCase for components
- **Constants**: Use ALL_CAPS for true constants, prefer `let` over `const` for variables
- **Strings**: Double quotes, template literals for interpolation
- **Indentation**: 2 spaces, trailing commas
- **Functions**: Arrow functions for callbacks, async/await for asynchronous code
- **Destructuring**: Use for objects and arrays where appropriate

### Package Structure
- **Imports**: Use relative imports within packages
- **Exports**: Provide both ESM and CJS builds via tsup
- **Documentation**: JSDoc comments for public APIs
- **Entry Points**: Each package has `src/index.ts` as main entry

## Working with Templates

The `/templates/pilot` directory contains a complete Shopify Hydrogen storefront implementation:

### Pilot Template Development
```bash
cd templates/pilot
npm install              # Install template dependencies
npm run dev              # Start Hydrogen development server
npm run build            # Build for production
npm run typecheck        # TypeScript checking
npm test                 # Run Playwright E2E tests
```

### Template Integration Testing
1. Test SDK changes against the Pilot template before releasing
2. Ensure backward compatibility with existing implementations
3. Update template when new SDK features are added
4. The template has its own CLAUDE.md with Hydrogen-specific guidance
5. Use the template as a reference for component schema patterns

## Common Pitfalls to Avoid

1. **Circular Dependencies**: Be careful with package dependencies
2. **Build Order**: Turbo handles this, but be aware of the dependency graph  
3. **Version Synchronization**: Keep package versions aligned when releasing
4. **Breaking Changes**: Follow semver and document in changesets
5. **Local Development**: Use `npm run dev:pkg` for proper local development setup
6. **Package Manager Mixing**: Always use pnpm for installs (enforced), npm for scripts
7. **Type Definitions**: Schema-related types belong in `@weaverse/schema`, not individual packages
8. **Template Dependencies**: Don't include templates in package builds (excluded via Biome config)

## Troubleshooting

### Build Issues

**Problem**: Build fails with module resolution errors
```bash
Error: Cannot find module '@weaverse/core'
```
**Solution**: Ensure all packages are built in the correct order
```bash
pnpm run clean
pnpm install
pnpm run build
```

**Problem**: TypeScript errors in development
**Solution**: Run typecheck to identify issues
```bash
pnpm run typecheck
```

### Development Environment

**Problem**: Changes in packages not reflected in development
**Solution**: Ensure you're using the correct dev command
```bash
# For local development with hot reload
npm run dev:pkg

# Force rebuild all packages if needed
npm run clean && npm run build
```

**Problem**: Biome formatting conflicts
**Solution**: Run the auto-fix command
```bash
pnpm run biome:fix
```

### Release Process

**Problem**: Changeset publish fails
**Solution**: Ensure you have npm publish permissions and are logged in
```bash
npm login
pnpm changeset publish
```

### Common Errors

- **ENOENT errors**: Usually indicate missing dependencies - run `pnpm install`
- **Permission errors**: May need to clear npm cache: `npm cache clean --force`
- **Version mismatch**: Check `package.json` for correct peer dependency versions