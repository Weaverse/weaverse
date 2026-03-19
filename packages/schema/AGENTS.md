# @weaverse/schema — Zod-Based Schema Definitions

Zod v4-based type system for Weaverse component definitions. Independently versioned (v0.8.2).

## Input Types (21)

| Category | Types |
|----------|-------|
| Text | `text`, `textarea`, `richtext`, `url` |
| Media | `image`, `video` |
| Choice | `select`, `toggle-group`, `switch` |
| Numeric | `range` |
| Specialized | `heading`, `position`, `color`, `datepicker`, `map-autocomplete` |
| Shopify | `product`, `product-list`, `collection`, `collection-list`, `blog`, `metaobject` |

## Where to Look

| Task | Location (line in index.ts) |
|------|----------------------------|
| Input types union | `inputTypeSchema` (L6-28) |
| Component schema | `ElementSchema` (L30-258) |
| Input schema | `BasicInputSchema` (L30-64) |
| Heading (label-only) | `HeadingInputSchema` |
| Settings group | `InspectorGroupSchema` |
| Page types | `PageTypeSchema` |
| Type exports | L279-347 |
| Validation functions | L352-465 |
| Builder API | L467-738 |
| Registry | L760-843 |
| DevTools | L848-932 |

## Validation Functions

| Function | Throws? | Returns |
|----------|---------|---------|
| `validateSchema(schema)` | No | `{success, data?, issues[]}` |
| `createSchema(schema)` | No | Schema (logs warnings) |
| `createSchemaTypeSafe(schema)` | No | Schema (strict TS) |
| `parseSchema(schema)` | Yes | Parsed schema or Error |
| `isValidSchema(schema)` | No | Boolean (type guard) |

## Builder API

```typescript
import { schemaBuilder, inputHelpers, groupHelpers } from '@weaverse/schema'

// Fluent builder
let schema = schemaBuilder()
  .title('Hero')
  .type('hero')
  .limit(5)
  .addSetting(groupHelpers.content([
    inputHelpers.text('heading', 'Heading'),
    inputHelpers.image('background', 'Background Image'),
    inputHelpers.select('layout', 'Layout', [
      { label: 'Full Width', value: 'full' },
      { label: 'Contained', value: 'contained' },
    ]),
  ]))
  .childTypes(['hero-slide'])
  .enabledOn({ pages: ['PRODUCT'], groups: ['body'] })
  .build()

// Quick input helpers
inputHelpers.text(name, label?, options?)
inputHelpers.textarea(name, label?, options?)
inputHelpers.switch(name, label?, defaultValue?, options?)
inputHelpers.range(name, label?, {min, max, step, unit}?, options?)
inputHelpers.select(name, label, [{label, value}], options?)
inputHelpers.image(name, label?, options?)
inputHelpers.heading(label, options?)

// Group helpers
groupHelpers.content(inputs[])   // 'Content'
groupHelpers.style(inputs[])     // 'Style'
groupHelpers.layout(inputs[])    // 'Layout'
groupHelpers.general(inputs[])   // 'General'
groupHelpers.custom(name, inputs[])
```

## Registry

```typescript
import { schemaRegistry } from '@weaverse/schema'

schemaRegistry.register('hero', heroSchema, migrations?)
schemaRegistry.get('hero')
schemaRegistry.list()
schemaRegistry.validateAll()  // {valid[], invalid[]}
schemaRegistry.migrate('hero', oldSchema, '2.0.0')
```

## DevTools

```typescript
import { devTools } from '@weaverse/schema'

devTools.prettyPrint(schema)           // Formatted JSON
devTools.analyzeSchema(schema)         // {inputCount, groupCount, ...}
devTools.generateTypeInterface(schema) // TypeScript interface string
```

## Conventions (Package-Specific)

- **ESM-only** (no CJS output)
- **Zod v4**: Import via `import { z } from 'zod/v4'`
- **Strict TypeScript**: This package has `strict: true` (unlike rest of monorepo)
- **Backward compat**: `inspector` field deprecated but still accepted

## Anti-Patterns

- **Don't** use `inspector` → use `settings`
- **Don't** import from `zod` → use `zod/v4` for v4 features
- **Don't** mutate schema objects after creation
- **Don't** skip validation in production — use `validateSchema()` or `isValidSchema()`
