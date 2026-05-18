# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **See [AGENTS.md](./AGENTS.md) for the authoritative development guide.**

This file exists for backward compatibility. All documentation has been consolidated into AGENTS.md.

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Build all packages | `pnpm run build` |
| Run all tests | `pnpm run test` |
| Run single test file | `pnpm exec vp test --run path/to/file.test.ts` |
| Typecheck all packages | `pnpm run typecheck` |
| Lint/format check | `pnpm run biome` |
| Lint/format fix | `pnpm run biome:fix` |

For comprehensive documentation including:
- Architecture overview
- Code conventions
- Testing guidelines
- CI/CD process
- Common pitfalls

**➡ See [AGENTS.md](./AGENTS.md)**
