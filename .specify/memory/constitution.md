<!--
Sync Impact Report:
- Version change: Initial version → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections:
  * Core Principles (7 principles)
  * Code Quality Standards
  * Development Workflow
  * Governance
- Removed sections: N/A (initial creation)
- Templates requiring updates:
  ✅ plan-template.md - Constitution Check section already present
  ✅ spec-template.md - Aligns with user scenario requirements
  ✅ tasks-template.md - Task categorization matches principles
- Follow-up TODOs: None
-->

# Weaverse SDKs Constitution

## Core Principles

### I. Monorepo Package Independence

Each package in `/packages/*` MUST be independently buildable, testable, and publishable. Packages MUST declare explicit dependencies through package.json and follow the hierarchical dependency order: `core → react → [hydrogen|schema|shopify]`. Circular dependencies are strictly forbidden.

**Rationale**: Independent packages enable selective installation, faster builds via Turbo's task orchestration, and clearer architectural boundaries. The hierarchical structure ensures type safety flows from core to framework-specific implementations.

### II. Type System as Source of Truth

All schema-related types MUST be defined in `@weaverse/schema` using Zod schemas. TypeScript types MUST be inferred from Zod schemas via `z.infer<>`, never duplicated manually. Higher-level packages (react, hydrogen) MUST extend base types through interfaces, not redefine them.

**Rationale**: Single source of truth eliminates type drift between runtime validation and compile-time types. Zod schemas provide both validation and type generation, ensuring consistency across the SDK ecosystem. See `/packages/TYPE_SYSTEM_ARCHITECTURE.md` for detailed implementation.

### III. Code Quality Gates (NON-NEGOTIABLE)

All code changes MUST pass Biome checks (`npm run biome`) and TypeScript type checking (`npm run typecheck`) before commit. Lefthook pre-commit hooks automatically enforce `biome check --write` on staged files. Fixed files are auto-staged. Breaking these gates blocks all commits.

**Rationale**: Automated quality enforcement prevents technical debt accumulation. Biome provides both linting and formatting in a single fast tool. Pre-commit automation ensures consistency without manual intervention.

### IV. Versioning Synchronization

All `@weaverse/*` packages (excluding `@weaverse/schema`) MUST maintain synchronized major.minor versions. Schema package follows independent semantic versioning due to its foundational role. Changesets MUST be created for all user-facing changes before PR merge.

**Rationale**: Synchronized versioning simplifies dependency management for SDK consumers and prevents version mismatch issues. Schema independence allows breaking changes without forcing updates across all packages. Changesets provide automated changelog generation and proper semver enforcement.

### V. Build System Integrity

Builds MUST proceed in dependency order: setup (icons/assets) → package builds (via Turbo) → template builds. Each package MUST use tsup for consistent ESM+CJS dual output. Build outputs (`dist/`, `build/`, `.turbo/`) MUST be git-ignored and excluded from linting.

**Rationale**: Dependency-aware builds via Turbo eliminate race conditions and enable parallel execution where safe. Dual ESM+CJS output ensures compatibility with all module systems. Excluding build artifacts from version control prevents bloat and merge conflicts.

### VI. Testing Strategy

Tests are OPTIONAL unless explicitly specified in feature requirements. When included, tests MUST use the framework appropriate to the package (Vitest for packages, Playwright for templates). Integration tests MUST focus on contract validation between packages and public API surfaces.

**Rationale**: Testing overhead must be justified by value. Not all SDK changes require tests (documentation, type exports, internal refactors). When tests are warranted, they should validate contracts and integration points, not implementation details.

### VII. Framework Agnosticism in Core

The `@weaverse/core` package MUST remain framework-agnostic with zero React dependencies. React-specific code MUST reside in `@weaverse/react` or higher. Framework-specific integrations (Hydrogen, Next.js, Remix) MUST be separate packages depending on `@weaverse/react`.

**Rationale**: Framework independence enables future integrations (Vue, Svelte, etc.) without core changes. Clear separation prevents bundle size bloat for consumers who only need specific framework support.

## Code Quality Standards

### Biome Configuration

- **Extends**: `ultracite` and `@weaverse/biome` shared config
- **Ignored Paths**: templates/, dist/, build/, .turbo/, package-lock.json
- **Key Rules**: `noConsole` OFF (logging permitted), prefer `let` over `const` for variables
- **Enforcement**: Pre-commit hooks via Lefthook, CI checks on changed files only

### TypeScript Discipline

- **Strict Mode**: Enabled across all packages
- **Path Aliases**: Use relative imports within packages, avoid cross-package path aliases
- **Type Safety**: Avoid `any` type; use `unknown` with type guards when external shape uncertain
- **Inference**: Leverage Zod `z.infer<>` for schema-derived types
- **Documentation**: JSDoc comments required for all exported public APIs

### Package Structure Conventions

Each package MUST follow this structure:
```
packages/[name]/
├── src/
│   └── index.ts          # Main entry point
├── package.json          # Explicit dependencies, tsup build config
├── tsup.config.ts        # ESM+CJS dual output configuration
└── README.md             # Package-specific documentation
```

## Development Workflow

### Branch Strategy

- **Main Branch**: `main` (protected, requires PR + review)
- **Feature Branches**: `[issue-number]-feature-name` or descriptive names
- **Release Process**: Changesets → version → publish → git tag

### Pull Request Requirements

1. **Pre-Flight**: Run `npm run biome:fix && npm run typecheck` before opening PR
2. **Changeset**: Create changeset via `npm run changeset` if user-facing changes
3. **Description**: Link to issue, describe changes, note breaking changes if any
4. **Review**: At least one maintainer approval required
5. **CI**: All checks must pass (lint, typecheck, build)

### Commit Conventions

Follow conventional commits format: `type(scope): description`

- **Types**: feat, fix, docs, refactor, test, chore, perf
- **Scope**: Package name (core, react, hydrogen, schema, etc.) or "root" for monorepo changes
- **Examples**:
  - `feat(hydrogen): add loader types for React Router v7`
  - `fix(core): resolve CSS property type inference`
  - `docs(schema): update Zod schema examples`

### Release Process

1. Merge feature PRs with changesets to main
2. Automated PR created with version bumps and changelog updates
3. Review and merge version PR
4. Run `pnpm changeset publish` to publish to npm
5. Create GitHub release with changelog excerpt
6. Announce on community channels (Slack, X, LinkedIn)

## Governance

### Amendment Process

Constitution amendments require:
1. Proposal in GitHub Discussion with rationale and impact analysis
2. Minimum 7-day comment period for community feedback
3. Maintainer consensus (majority vote if consensus not reached)
4. Documentation update including version bump and sync impact report
5. Migration plan for changes affecting existing workflows

### Compliance Review

All PRs MUST be verified for constitution compliance during code review. Violations MUST be justified with rationale added to the "Complexity Tracking" section if approved as necessary exception. Repeated violations without justification will block merge.

### Version Semantics

- **MAJOR**: Breaking changes to governance rules, principle removals, architectural shifts
- **MINOR**: New principles added, section expansions, new mandatory requirements
- **PATCH**: Clarifications, typo fixes, formatting improvements, non-semantic refinements

### Guidance File Reference

Runtime development guidance is provided in `CLAUDE.md` at repository root. Constitution defines governance and non-negotiable rules; CLAUDE.md provides practical "how-to" guidance for day-to-day development. In conflicts, constitution supersedes CLAUDE.md.

**Version**: 1.0.0 | **Ratified**: 2025-10-10 | **Last Amended**: 2025-10-10
