# @weaverse/react — React Bindings

React bindings for Weaverse visual page builder. Depends on `@weaverse/core`.

## Structure

```
src/
├── index.ts           # Re-exports core + context + hooks + renderer
├── context.ts         # WeaverseContext, WeaverseItemContext
├── hooks.ts           # useWeaverse, useItemInstance, useParentInstance, useChildInstances
├── renderer.tsx       # WeaverseRoot, useSafeExternalStore
├── types/index.ts     # WeaverseElementProps, WeaverseRootPropsType
└── utils/data-connector.ts  # Template variable replacement (543L)
```

## Where to Look

| Task | Location |
|------|----------|
| Render Weaverse content | `renderer.tsx` → `WeaverseRoot` |
| Access Weaverse instance | `hooks.ts` → `useWeaverse()` |
| Get current item | `hooks.ts` → `useItemInstance()` |
| Get parent/children | `hooks.ts` → `useParentInstance()`, `useChildInstances()` |
| Template replacement | `utils/data-connector.ts` |
| Context providers | `context.ts` |

## Public API

### Context
- `WeaverseContext` — Provides Weaverse singleton instance
- `WeaverseItemContext` — Provides `{id, parentId}` for tree position

### Hooks
```typescript
useWeaverse<T>()           // Get Weaverse instance from context
useItemInstance(id?)       // Get WeaverseItemStore by ID (current if no ID)
useParentInstance()        // Get parent item instance
useChildInstances(id?)     // Get all child item instances
```

### Renderer
```typescript
<WeaverseRoot context={weaverseInstance} />
```

### Data Connector
```typescript
replaceContentDataConnectors(str, context)      // Single string
replaceContentDataConnectorsDeep(obj, context)  // Recursive (objects/arrays)
```

## Data-Connector System

Template variable replacement from route context.

**Syntax:** `{{path.to.property}}` with dot notation and array indexing.

```typescript
// Component data:
{ title: "Welcome to {{root.shop.name}}" }

// Context:
{ root: { shop: { name: "My Store" } } }

// Result:
{ title: "Welcome to My Store" }
```

**Route-keyed context:**
```typescript
{
  root: { ... },
  "routes/product": { product: {...} },
  "routes/($locale).blogs.$blogHandle": { ... }
}
```

**Performance:**
- Early exit: `hasPlaceholders()` returns original reference if no `{{}}`
- LRU caches: template (100), route parsing (100), fallback (50)
- Same-reference fast path when no replacements

**Security:**
- XSS sanitization (HTML entities)
- Prototype pollution prevention
- Circular reference detection

## Architecture Pattern

Hybrid React pattern: **static instance registry + event emission** (not pure React state).

```
WeaverseRoot
  └── WeaverseItemContext.Provider
        └── ItemInstance (recursive)
              └── ItemComponent
                    └── Registered Component
```

- `Weaverse.itemInstances` is a static Map
- Components subscribe via `useSafeExternalStore` (SSR-safe)
- Updates via `instance.triggerUpdate()` → EventEmitter

## Conventions (Package-Specific)

- **Memoization**: All components wrapped with `memo()`
- **Immutability**: `replaceContentDataConnectorsDeep` creates deep copies
- **SSR-safe**: `useSafeExternalStore` handles server/client differences

## Anti-Patterns

- **Don't** mutate data returned from hooks
- **Don't** call hooks conditionally
- **Don't** use `as any` for component props
- **Don't** skip `memo()` on components receiving Weaverse data
