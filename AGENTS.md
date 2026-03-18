# AGENTS.md - Weaverse SDKs Development Guide

## Project Overview

Monorepo of SDKs for integrating React/JamStack frameworks (Shopify Hydrogen, React Router, Next.js) with the Weaverse Headless CMS. Provides visual page building, theme customization, and content management through a drag-and-drop editor.

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `bun install` |
| Build all packages | `bun run build` |
| Dev with hot reload | `bun run dev` |
| Run all tests | `bun run test` |
| Run single test file | `bun test path/to/file.test.ts` |
| Typecheck all packages | `bun run typecheck` |
| Lint/format check | `bun run biome` |
| Lint/format fix | `bun run biome:fix` |
| Format only | `bun run format` |

### Single Package Commands

```sh
turbo dev --filter=@weaverse/core
turbo build --filter=@weaverse/react
turbo test --filter=@weaverse/hydrogen
```

## Monorepo Architecture

### Package Manager & Tooling

- **Package manager**: bun 1.3.3 (use `bun install`, NOT npm install)
- **Script runner**: npm (`bun run <script>` delegates to npm scripts)
- **Build orchestrator**: Turbo (`turbo.json` defines task pipeline)
- **Linting/Formatting**: Biome 2.4.4 (configured in `packages/biome/biome.json`)
- **Testing**: Bun's native test runner
- **Pre-commit hooks**: Lefthook runs `biome check --write` on staged files
- **CI**: GitHub Actions — `biome ci .` + `bun run typecheck`
- **Releases**: Git tag + `bun publish` workflow via `.claude/skills/releasing-weaverse-sdks/` skill (core, react, hydrogen stay in sync)

### Package Dependency Graph

```
@weaverse/hydrogen → @weaverse/react → @weaverse/core
                   → @weaverse/schema
@weaverse/react    → @weaverse/core
@weaverse/core     ← foundation, no internal deps
@weaverse/schema (v0.8.2)   ← independent versioning (Zod-based)
@weaverse/cli               ← CLI tools (JavaScript)
@weaverse/i18n              ← internationalization
@weaverse/next              ← Next.js integration
@weaverse/remix             ← Remix integration
```

### Key Directories

```
packages/
  core/          Framework-agnostic foundation (event system, types, utilities)
  react/         React bindings (hooks, context, components)
  hydrogen/      Shopify Hydrogen integration (WeaverseClient, components, hooks)
  schema/        Zod-based schema definitions for component settings
  cli/           CLI tools
  biome/         Shared Biome configuration
  i18n/          Internationalization utilities
  next/          Next.js integration
  remix/         Remix integration
templates/
  pilot/         Example Hydrogen storefront theme
archived/
  shopify/       Archived, do not modify
```

### Build Configuration (tsup)

All packages use tsup with consistent config:
- **Entry**: `src/index.ts`
- **Formats**: ESM + CJS (schema is ESM-only)
- **Output**: `dist/` directory
- **DTS**: Generated type declarations
- **Sourcemaps**: Enabled
- **Clean**: Builds clear output directory first

## Code Style

### Enforced by Biome

| Rule | Setting |
|------|---------|
| Indentation | 2 spaces |
| Quotes | Single quotes (`'`) |
| Semicolons | As needed (not mandatory) |
| Trailing commas | ES5 style |
| `const` vs `let` | Prefer `let` (useConst is OFF) — use `const` only for true constants (`ALL_CAPS`) |
| `any` type | Warned — avoid, use proper types |
| Unused imports | Warned — remove them |
| Unused variables | Warned — remove them |
| `forEach` | Warned — prefer `for...of` loops |
| `console.*` | Warned — use proper logging |
| Optional chaining | Required (`?.` instead of `&&` chains) |
| Namespace imports | Warned — use named imports, not `import * as` |

### Naming Conventions

- `camelCase` — variables, functions, methods
- `PascalCase` — React components, interfaces, type aliases, classes
- `ALL_CAPS` — true constants
- `_prefix` — private class members

### TypeScript

- Target: `esnext`, JSX: `react-jsx`, Module resolution: `node`
- `strict: false` but `strictNullChecks: true`
- Use `type` keyword for type-only imports: `import type { Foo } from 'bar'`
- Prefer interfaces over type aliases for object shapes
- No `any` — use `unknown` with type guards if needed

### React

- Functional components with hooks only (no class components)
- Never call hooks conditionally
- CSS Modules for styling
- Error Boundaries for error handling
- Use `React.memo`, `useMemo`, `useCallback` for performance-critical paths

### General Patterns

- Arrow functions for callbacks
- `async/await` — no `.then()` chains
- Destructuring for objects and arrays
- Template literals for string interpolation
- Optional chaining (`?.`) and nullish coalescing (`??`) — always

## Testing

### Framework

Bun's native test runner. Tests exist for `hydrogen`, `react`, `schema`, and `i18n` packages.

### Test File Location

```
packages/hydrogen/__tests__/**/*.test.ts
packages/react/test/**/*.test.ts
packages/schema/test/**/*.test.ts
packages/i18n/__tests__/**/*.test.ts
```

### Core Testing Directive

Write tests exclusively to verify complex logic, secure critical paths, and prevent regressions. Discard tests written solely for line-coverage metrics.

#### 1. Target Selection (The 80/20 Rule)

- **Ignore Boilerplate:** Never test language standards, generated code, simple getters/setters, or pure pass-through methods.
- **Target Complexity:** Test only functions containing conditional logic (`if`, `switch`), state changes, or data transformations.
- **Isolate Boundaries:** Mock all external I/O, databases, and network calls. Test internal business logic natively.

#### 2. Structural Integrity (AAA & Naming)

- **Strict AAA:** Physically separate Arrange, Act, and Assert phases with blank lines. Never entangle setup with execution.
- **Concrete Naming:** Use `should_[ExpectedBehavior]_when_[StateUnderTest]`.
- **High Signal-to-Noise:** Enforce one logical assertion per test. Remove all visual and logical clutter.

#### 3. Execution & Validation (F.I.R.S.T. & TDD)

- **Fast & Independent:** Tests must execute in milliseconds, share zero state, and run deterministically in any environment.
- **Agentic TDD:** Output the failing test first. Verify it fails. Only then, generate the implementation code.
- **Prove Necessity:** A test is invalid until proven to fail. If mutating the source code does not break the test, delete the test.

### Test Structure (AAA Pattern)

Always structure tests with clear **Arrange → Act → Assert** sections:

```typescript
import { describe, it, expect } from 'bun:test'

describe('WeaverseClient', () => {
  it('should_resolve_projectId_from_URL_query_param', () => {
    // Arrange
    let request = new Request('https://example.com?projectId=url-project')
    let context = createMockContext({ request })

    // Act
    let client = new WeaverseClient(context)
    let result = client.getProjectId()

    // Assert
    expect(result).toBe('url-project')
  })
})
```

### FIRST Principles

Tests must be:
- **F**ast — No network calls, minimal I/O, mock external dependencies
- **I**ndependent — Each test runs in isolation, no shared mutable state
- **R**epeatable — Same input → same output, every time
- **S**elf-validating — Assert outcomes explicitly, no manual inspection
- **T**imely — Write tests alongside or before implementation

### Test Patterns

```typescript
import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test'
import { spyOn } from 'bun:test'

// Mock factories for consistent test setup
function createMockContext(overrides = {}) {
  return {
    storefront: { i18n: { language: 'EN', country: 'US' } },
    env: { WEAVERSE_PROJECT_ID: 'default-project' },
    cache: { put: mock.fn(), match: mock.fn() },
    ...overrides,
  }
}

// Suppress console noise in expected error tests
beforeEach(() => {
  spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  mock.restore()
})

// Error regex constants at top for reusability
const INVALID_PROJECT_ID_ERROR = /Invalid projectId/
const TIMEOUT_ERROR = /Request timeout/
```

Note: Use `let` for variable declarations in tests (consistent with biome config).

### Running Tests

```sh
# All tests
bun run test

# Single package
turbo test --filter=@weaverse/hydrogen

# Single file
bun test packages/hydrogen/__tests__/weaverse-client.test.ts

# Watch mode
bun test --watch packages/hydrogen/__tests__/weaverse-client.test.ts

# Coverage
bun test --coverage
```

## Component Schema Pattern

When creating Weaverse components for Hydrogen, use `createSchema` with `settings` array:

```typescript
import { createSchema, type HydrogenComponentProps } from '@weaverse/hydrogen'

// Component definition
export let MyComponent = forwardRef<HTMLDivElement, HydrogenComponentProps>((props, ref) => {
  let { children, ...rest } = props
  return <div ref={ref} {...rest}>{children}</div>
})

// Schema — use `settings`, NOT `inspector`
export let schema = createSchema({
  type: 'my-component',
  title: 'My Component',
  settings: [
    {
      type: 'text',
      name: 'heading',
      label: 'Heading',
      defaultValue: 'Hello World',
    },
  ],
})

export default MyComponent
```

**Important**: Always use `settings` in schema definitions, never `inspector` (deprecated).

## Import Patterns

```typescript
// Named imports from packages
import { WeaverseClient, fetchWeaverseData } from '@weaverse/hydrogen'

// Type-only imports
import type { HydrogenComponentProps, WeaverseLoaderData } from '@weaverse/hydrogen'

// Relative imports within a package
import { someUtil } from './utils'

// NO namespace imports (warned by biome)
// ❌ import * as Utils from './utils'
// ✅ import { specificUtil } from './utils'
```

## Error Handling

- `try/catch` for all async operations
- React Error Boundaries for component-level errors
- Log errors with context (what operation failed, relevant data)
- Never swallow errors silently

```typescript
try {
  let data = await fetchWeaverseData(args)
} catch (error) {
  console.error('[WeaverseClient] Failed to fetch data:', { error, args })
  throw error
}
```

## CI/CD & Release Process

### Pre-commit (Lefthook)

Runs automatically on `git commit`:
1. `biome check --write` on staged files
2. Auto-stages any fixed files
3. Commit proceeds if checks pass

### CI Pipeline (GitHub Actions)

1. `biome ci .` — lint/format check (strict, no auto-fix)
2. `bun run typecheck` — TypeScript type checking

### Releasing

Uses a Claude Code skill (`.claude/skills/releasing-weaverse-sdks/SKILL.md`) for releases:
1. Tell Claude which packages to release and the bump type (e.g., "release the fixed group as minor")
2. The skill runs: verify → bump → build → publish to npm → tag → GitHub Release → sync dev
3. Core, React, and Hydrogen versions stay in sync (fixed group)
4. Schema, CLI, Biome, and i18n are versioned independently
5. See the skill file for the full 13-step ritual

## Common Pitfalls

- **Don't use `npm install`** — use `bun install` for dependency management
- **Don't use `const` by default** — this project prefers `let` (biome useConst is OFF)
- **Don't use double quotes** — biome enforces single quotes
- **Don't use `inspector` in schemas** — use `settings` (inspector is deprecated)
- **Don't use namespace imports** — use named imports (`import { x }` not `import * as`)
- **Don't modify `archived/` or `templates/`** — these are excluded from linting
- **Don't add semicolons everywhere** — biome uses "as needed" mode
- **Don't use `.then()` chains** — use `async/await`
