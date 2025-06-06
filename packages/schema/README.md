# @weaverse/schema

This package provides Zod-based schema definitions for Weaverse components, ensuring type safety and validation across the Weaverse ecosystem.

## Overview

The schema package defines the structure and validation rules for:
- Input types (text, image, video, etc.)
- Component schemas (title, type, settings, inspector groups)
- Configuration options for various input types
- Page types and component enablement rules

## Key Types

### Input Types

The package supports the following input types:
- `heading` - Section headings (label only, no data binding)
- `text`, `textarea`, `richtext` - Text inputs
- `url` - URL inputs
- `image`, `video` - Media inputs
- `switch` - Boolean toggles
- `range` - Numeric ranges with min/max/step
- `select`, `toggle-group` - Choice inputs
- `swatches` - Color/variant swatches
- `product`, `product-list`, `collection`, `collection-list`, `blog`, `metaobject` - Shopify resources
- `color`, `datepicker`, `map-autocomplete`, `position` - Specialized inputs

### Core Schemas

```typescript
// Basic input for data-bound fields
export type BasicInput = {
  type: InputType
  name: string
  label?: string
  placeholder?: string
  helpText?: string
  configs?: ConfigsProps
  shouldRevalidate?: boolean
  condition?: string
  defaultValue?: string | number | boolean | Record<string, unknown> | unknown
}

// Heading input for non-data-bound labels
export type HeadingInput = {
  type: 'heading'
  label: string
  [key: string]: any
}

// Inspector group containing inputs
export type InspectorGroup = {
  group: string
  inputs: (BasicInput | HeadingInput)[]
}

// Element schema for components
export type ElementSchema = {
  title: string
  type: string
  limit?: number
  inspector?: InspectorGroup[] // @deprecated Use settings instead
  settings?: InspectorGroup[]
  childTypes?: string[]
  enabledOn?: {
    pages?: ('*' | PageType)[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  presets?: {
    children?: Array<{ type: string; [key: string]: any }>
    [key: string]: any
  }
}
```

## Usage with @weaverse/hydrogen

The hydrogen package extends these base schemas with additional functionality:

```typescript
import type { BasicInput, HeadingInput, InspectorGroup } from '@weaverse/schema'

// Hydrogen extends the base types with runtime capabilities
export type HydrogenBasicInput = BasicInput & {
  // Additional hydrogen-specific properties
}

// Components use the schema types for type safety
export const myComponent: HydrogenComponent = {
  schema: {
    title: 'My Component',
    type: 'my-component',
    settings: [
      {
        group: 'Settings',
        inputs: [
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            defaultValue: 'Hello World'
          }
        ]
      }
    ]
  }
}
```

## Type Safety

All types are inferred from Zod schemas, ensuring:
- Runtime validation matches TypeScript types
- Single source of truth for type definitions
- Automatic type generation from schema changes
- Proper serialization support (no function types in schemas)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Type check
npm run typecheck
```

## Type Safety and Required Fields

### Important Note on TypeScript Configuration

The `title` and `type` fields are **required** at runtime (enforced by Zod validation), but may appear as optional in TypeScript when strict mode is disabled.

#### Runtime Validation

The schema always enforces required fields at runtime:

```typescript
// ✅ This works
const validSchema = createSchema({
  title: 'My Component',
  type: 'my-component',
})

// ❌ This throws a ZodError at runtime
const invalidSchema = createSchema({
  // Missing required fields
})
```

#### TypeScript Type Safety

For better TypeScript type safety, you have several options:

**Option 1: Use SchemaTypeStrict (Recommended)**

```typescript
import { createSchemaTypeSafe, type SchemaTypeStrict } from '@weaverse/schema'

const schema: SchemaTypeStrict = {
  title: 'My Component',    // Required (enforced by TypeScript)
  type: 'my-component',     // Required (enforced by TypeScript)
  settings: [
    // ... your settings
  ],
}

const validatedSchema = createSchemaTypeSafe(schema)
```

**Option 2: Enable TypeScript Strict Mode**

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Option 3: Use the Standard Types (with runtime validation)**

```typescript
import { createSchema, type SchemaType } from '@weaverse/schema'

// TypeScript may not enforce required fields, but runtime validation will
const schema = createSchema({
  title: 'My Component',
  type: 'my-component',
})
```

## API Reference

### Types

- `SchemaType` - Inferred type from ElementSchema (may show optional fields without strict mode)
- `SchemaTypeStrict` - Explicit type with enforced required fields
- `BasicInput` - Schema for basic input types
- `HeadingInput` - Schema for heading inputs
- `InspectorGroup` - Schema for inspector groups
- `PageType` - Enum of available page types
- `ComponentPresets` - Schema for component presets

### Functions

- `createSchema(schema: SchemaType)` - Validates and returns a schema
- `createSchemaTypeSafe(schema: SchemaTypeStrict)` - Type-safe schema creation with enforced required fields

### Schemas

- `ElementSchema` - Main Zod schema for component definitions
- `BasicInputSchema` - Schema for basic input types
- `HeadingInputSchema` - Schema for heading inputs
- `InspectorGroupSchema` - Schema for inspector groups

## Migration from Previous Versions

The schema package is now the source of truth for all component schema types. The hydrogen package re-exports these types for backward compatibility.

### Deprecated Fields

- `inspector` is deprecated in favor of `settings` (both have the same structure)

## Type System Architecture

This package follows the Weaverse type hierarchy:

```
core → react → schema|hydrogen
```

Where:
- `@weaverse/schema` is the source of truth for component schema types
- `@weaverse/hydrogen` imports and re-exports schema types
- All packages use Zod for runtime validation with TypeScript type inference

## Contributing

Please ensure all schemas include proper validation rules and TypeScript types. 