# AGENTS.md - Weaverse SDKs Development Guide

## Build/Test Commands
- `npm run build` - Build all packages
- `npm run dev` - Start development with hot reload 
- `npm run typecheck` - TypeScript type checking
- `npm run biome` - Check linting/formatting errors
- `npm run biome:fix` - Fix linting/formatting errors
- `npm run test` - Run all tests (uses Vitest for schema package)
- `turbo test --filter=@weaverse/schema` - Run single package tests
- `vitest --watch` - Run tests in watch mode (in schema package)

## Code Style (Biome + Ultracite)
- **Variables**: camelCase for variables/functions, PascalCase for components, ALL_CAPS for constants
- **Strings**: Double quotes, template literals for interpolation  
- **Indentation**: 2 spaces, trailing commas
- **Functions**: Arrow functions for callbacks, async/await for async code
- **Destructuring**: Use for objects/arrays where appropriate

## TypeScript Guidelines  
- Always define types for parameters/return values, avoid `any`
- Use interfaces for data structures, prefer immutable data (`const`, `readonly`)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe access
- Follow functional programming principles where possible

## Error Handling
- Use try/catch for async operations, implement React error boundaries
- Always log errors with contextual information