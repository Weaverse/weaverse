# AGENTS.md - Weaverse SDKs Development Guide

## Build & Test (Use Bun)
- **Install**: `bun install`
- **Build**: `bun run build` (all packages)
- **Dev**: `bun run dev` (hot reload)
- **Lint/Format**: `bun run biome` (check) or `bun run biome:fix` (fix)
- **Test All**: `bun run test` (Turbo + Vitest)
- **Test Single**: `bun x vitest run path/to/file.test.ts`
- **Typecheck**: `bun run typecheck`

## Code Style (Biome + TypeScript)
- **Naming**: `camelCase` (vars/funcs), `PascalCase` (components/interfaces), `ALL_CAPS` (constants), `_private` (class members).
- **React**: Functional components + hooks. No conditional hooks. CSS Modules.
- **Syntax**: 2 spaces, double quotes, arrow funcs (callbacks), async/await, destructuring.
- **Types**: No `any`. Use interfaces. Functional principles. Immutable data (`const`, `readonly`).
- **Safety**: Optional chaining `?.`, nullish coalescing `??`.

## Error Handling
- `try/catch` for async. React Error Boundaries.
- Log errors with context.
