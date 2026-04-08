# Weaverse SDKs Architecture Overview

| | |
|---|---|
| **Project** | Weaverse Headless CMS SDKs |
| **Repository** | [github.com/Weaverse/weaverse](https://github.com/Weaverse/weaverse) |
| **Version** | 5.10.0 (core packages) |
| **License** | MIT |
| **Status** | Active |
| **Generated** | 2026-03-23 |
| **Description** | Architecture diagrams and technical reference for the Weaverse SDKs monorepo, covering the layered package structure, dependency graph, build pipeline, state management flow, and deployment targets. |

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Framework Integrations)                                        │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│  ┌──────────────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  @weaverse/hydrogen      │  │  @weaverse/next  │  │ @weaverse/remix  │          │
│  │  (Shopify + RRv7)        │  │  (Next.js)       │  │ (Remix)          │          │
│  │                          │  │  [Stub]          │  │ [Stub]           │          │
│  │  WeaverseClient          │  └──────────────────┘  └──────────────────┘          │
│  │  WeaverseHydrogenRoot    │                                                      │
│  │  Hydrogen-specific hooks  │                                                      │
│  └────────────┬─────────────┘                                                      │
│               │                                                                    │
└───────────────┼────────────────────────────────────────────────────────────────────┘
                │
┌───────────────┼─────────────────────────────────────────────────────────────────────┐
│               │  FRAMEWORK-SPECIFIC LAYER                                           │
├───────────────┼─────────────────────────────────────────────────────────────────────┤
│               │                                                                     │
│  ┌────────────▼────────────────┐                                                    │
│  │   @weaverse/react           │                                                    │
│  │   (React bindings & hooks)  │                                                    │
│  │                             │                                                    │
│  │  - WeaverseContext          │                                                    │
│  │  - useWeaverse()            │                                                    │
│  │  - useItemInstance()        │                                                    │
│  │  - useParentInstance()      │                                                    │
│  │  - useChildInstances()      │                                                    │
│  │  - WeaverseRenderer         │                                                    │
│  │                             │                                                    │
│  │  Deps:                      │                                                    │
│  │  └─ React >= 19             │                                                    │
│  │  └─ React Router >= 6       │                                                    │
│  │  └─ clsx (classname utils)  │                                                    │
│  └────────────┬────────────────┘                                                    │
│               │                                                                     │
└───────────────┼─────────────────────────────────────────────────────────────────────┘
                │
┌───────────────┼──────────────────────────────────────────────────────────────────────┐
│               │  CORE ABSTRACTION LAYER                                              │
├───────────────┼──────────────────────────────────────────────────────────────────────┤
│               │                                                                      │
│  ┌────────────▼─────────────────┐                                                    │
│  │   @weaverse/core             │                                                    │
│  │   (Framework-agnostic base)  │                                                    │
│  │                              │                                                    │
│  │  - Weaverse (singleton)      │                                                    │
│  │  - WeaverseItemStore         │                                                    │
│  │  - ElementRegistry           │                                                    │
│  │  - EventEmitter (pub/sub)    │                                                    │
│  │  - Types & utilities         │                                                    │
│  │                              │                                                    │
│  │  NO external dependencies    │                                                    │
│  └────────────┬─────────────────┘                                                    │
│               │                                                                      │
└───────────────┼──────────────────────────────────────────────────────────────────────┘
                │
┌───────────────┼───────────────────────────────────────────────────────────────────────┐
│               │  SUPPORTING PACKAGES (Independent)                                    │
├───────────────┼───────────────────────────────────────────────────────────────────────┤
│               │                                                                       │
│  ┌────────────▼──────────────┐  ┌──────────────────┐  ┌──────────────────┐            │
│  │  @weaverse/schema (ESM)   │  │  @weaverse/i18n  │  │  @weaverse/cli   │            │
│  │  v0.8.2 (independent)     │  │  v1.1.2          │  │  v5.5.2          │            │
│  │                           │  │                  │  │                  │            │
│  │  Zod-based schemas        │  │  i18n utilities  │  │  Scaffold tools  │            │
│  │  Type validation          │  │  i18next backend │  │  Project setup   │            │
│  │  Component definitions     │  │  Waterfall       │  │  Yargs CLI       │            │
│  │                           │  │  fallback        │  │                  │            │
│  └───────────────────────────┘  └──────────────────┘  └──────────────────┘            │
│                                                                                       │
│  ┌──────────────────────────────────────┐                                             │
│  │      @weaverse/biome (Config)         │                                             │
│  │      v5.7.3                          │                                             │
│  │                                      │                                             │
│  │      Shared Biome configuration       │                                             │
│  │      - 2-space indentation           │                                             │
│  │      - Single quotes                 │                                             │
│  │      - Prefers 'let' over 'const'    │                                             │
│  │                                      │                                             │
│  └──────────────────────────────────────┘                                             │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

## Dependency Resolution Flow

```
Application Event
       │
       ▼
┌──────────────────────┐
│  @weaverse/hydrogen  │  (Shopify Hydrogen integration)
└──────────┬───────────┘
           │
           ├─→ WeaverseClient (fetches data from Weaverse CMS)
           ├─→ Registers components via ElementRegistry
           ├─→ Renders via WeaverseRenderer
           │
           ▼
┌──────────────────────┐
│  @weaverse/react     │  (React context & hooks)
└──────────┬───────────┘
           │
           ├─→ useWeaverse() returns singleton instance
           ├─→ useItemInstance() for component data
           ├─→ useParentInstance() for parent access
           ├─→ useChildInstances() for children access
           │
           ▼
┌──────────────────────┐
│  @weaverse/core      │  (Core state management)
└──────────┬───────────┘
           │
           ├─→ Weaverse (singleton pattern)
           │   └─→ itemInstances (Map)
           │   └─→ elementRegistry (Map)
           │   └─→ EventEmitter
           │
           ├─→ WeaverseItemStore (extends EventEmitter)
           │   ├─→ Manages item data
           │   ├─→ Emits 'update' event on changes
           │   ├─→ Emits 'mounted' on DOM attachment
           │   └─→ Notifies parent/children
           │
           └─→ EventEmitter (pub/sub)
               ├─→ on('update', callback)
               ├─→ off(eventName, callback)
               └─→ emit(eventName, data)
```

## Build & Deployment Pipeline

```
MONOREPO ORCHESTRATION (Turbo v2.8.14)

Task Dependencies (turbo.json):
- build:     dependsOn=["^build"]  → builds dependencies first
- dev:       dependsOn=["^build"]  → dev watches with build cache
- test:      dependsOn=["^build"]  → tests after build
- typecheck: inputs=["packages/**/*.ts"]  → checks all TS files

Command Flow:
$ bun run build (orchestrated by Turbo)
     │
     ├─→ @weaverse/core (no deps, builds first)
     ├─→ @weaverse/schema (no deps)
     ├─→ @weaverse/biome (no deps)
     ├─→ @weaverse/i18n (no deps)
     │
     ├─→ @weaverse/react (depends on core)
     ├─→ @weaverse/cli (no deps)
     │
     └─→ @weaverse/hydrogen (depends on react + schema)
     └─→ @weaverse/next, @weaverse/remix (no deps)

Each Package Build (tsup):
src/index.ts → [dist/index.js (CJS), dist/index.mjs (ESM)]
            → dist/index.d.ts (TypeScript declarations)
            → dist/index.*.map (source maps)
```

## Code Quality Checks (Pre-commit & CI)

```
1. Pre-commit Hook (Lefthook):
   - biome check --write (auto-fix staged files)
   - Auto-stage fixed files

2. GitHub Actions CI:
   - biome ci . (strict, no auto-fix)
   - bun run typecheck (TypeScript validation)

3. Quality Rules (Biome 2.4.4):
   ✓ Single quotes only
   ✓ 2-space indentation
   ✓ No namespace imports (import * as)
   ✓ Prefer let over const (useConst OFF)
   ✓ Optional chaining (?.) required
   ✓ No unused imports/variables
   ✓ No console.* in production code
```

## Release Process

```
Trigger: "release [packages] as [major|minor|patch]"

Steps:
1. Verify version bumps
2. Bump package.json versions
3. bun run build (rebuild with new versions)
4. bun publish (publish to npm registry)
5. Create git tag (v5.10.0, etc.)
6. Create GitHub Release
7. Sync development branch

Version Groups:
- FIXED: core, react, hydrogen (sync versions: 5.10.0)
- FREE:  schema (0.8.2), cli (5.5.2), biome (5.7.3), i18n (1.1.2)
```

## State Management Flow

```
┌────────────────────────────────────┐
│    Component Data Changes          │
│    (e.g., user updates color)      │
└─────────────┬──────────────────────┘
              │
              ▼
        ┌─────────────────┐
        │ WeaverseClient  │  (Hydrogen)
        │ triggers update │
        └────────┬────────┘
                 │
                 ▼
    ┌──────────────────────────────┐
    │  WeaverseItemStore           │  (Singleton instance)
    │  ._store = new data          │
    │  .triggerUpdate()            │
    └────────┬─────────────────────┘
             │
             ├─→ emit('update')
             │
             ▼
    ┌──────────────────────────────┐
    │  React re-render             │
    │  via useWeaverse() hooks     │
    └────────┬─────────────────────┘
             │
             ├─→ Child component data updates
             ├─→ useItemInstance() reflects change
             ├─→ useChildInstances() notified
             │
             ▼
    ┌──────────────────────────────┐
    │  DOM updates                 │
    │  (through React's rendering) │
    └──────────────────────────────┘
```

## Deployment Targets

| Platform | Status | Notes |
|----------|--------|-------|
| Shopify Hydrogen (React Router v7) | **Primary** | Full support via `@weaverse/hydrogen` |
| Next.js | Future/Stub | SSR/Static Generation |
| Remix | Future/Stub | Server-side rendering |
| Generic React Router v7 | Supported | Via `@weaverse/react` directly |

All packages deployed via npm under the `@weaverse` scope.
