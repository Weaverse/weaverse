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

## Enhanced API Features

### Structured Validation Results

The enhanced validation system provides detailed error information:

```typescript
import { validateSchema, parseSchema, isValidSchema } from '@weaverse/schema'

// Get detailed validation results
const result = validateSchema(mySchema)
if (!result.success) {
  result.issues.forEach(issue => {
    console.log(`Error: ${issue.message}`)
    if (issue.path) {
      console.log(`At: ${issue.path.join('.')}`)
    }
    if (issue.expected) {
      console.log(`Expected: ${JSON.stringify(issue.expected)}`)
    }
  })
}

// Parse with throwing on errors
try {
  const validSchema = parseSchema(unknownData)
} catch (error) {
  console.error('Schema validation failed:', error.message)
}

// Simple validation check
if (isValidSchema(data)) {
  // TypeScript knows data is SchemaType
  console.log(data.title)
}
```

### Schema Builder Pattern

Create schemas fluently with the builder pattern:

```typescript
import { schemaBuilder, inputHelpers, groupHelpers } from '@weaverse/schema'

const schema = schemaBuilder()
  .title('Product Card')
  .type('product-card')
  .limit(10)
  .addSetting(
    groupHelpers.content([
      inputHelpers.text('title', 'Product Title'),
      inputHelpers.textarea('description', 'Product Description'),
      inputHelpers.image('image', 'Product Image')
    ])
  )
  .addSetting(
    groupHelpers.style([
      inputHelpers.select('layout', 'Layout', [
        { label: 'Card', value: 'card' },
        { label: 'List', value: 'list' }
      ]),
      inputHelpers.switch('showPrice', 'Show Price', true)
    ])
  )
  .enabledOn({
    pages: ['PRODUCT', 'COLLECTION'],
    groups: ['body']
  })
  .build()
```

### Input Helpers

Create common inputs easily:

```typescript
import { inputHelpers } from '@weaverse/schema'

// Text inputs
const titleInput = inputHelpers.text('title', 'Title', {
  placeholder: 'Enter title...',
  helpText: 'This will be displayed as the main heading'
})

// Range inputs with configuration
const paddingInput = inputHelpers.range('padding', 'Padding', {
  min: 0,
  max: 100,
  step: 5,
  unit: 'px'
})

// Select inputs with options
const alignmentInput = inputHelpers.select('alignment', 'Text Alignment', [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
])

// Switch with default value
const visibleInput = inputHelpers.switch('visible', 'Visible', true)

// Heading separators
const sectionHeading = inputHelpers.heading('Advanced Settings')
```

### Group Helpers

Create common setting groups:

```typescript
import { groupHelpers, inputHelpers } from '@weaverse/schema'

const contentGroup = groupHelpers.content([
  inputHelpers.text('title'),
  inputHelpers.textarea('description'),
  inputHelpers.image('backgroundImage')
])

const layoutGroup = groupHelpers.layout([
  inputHelpers.range('columns', 'Columns', { min: 1, max: 4 }),
  inputHelpers.select('spacing', 'Spacing', [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' }
  ])
])

const styleGroup = groupHelpers.style([
  inputHelpers.heading('Colors'),
  inputHelpers.text('backgroundColor', 'Background Color'),
  inputHelpers.text('textColor', 'Text Color')
])
```

### Schema Composition

Merge and extend existing schemas:

```typescript
import { mergeSchemas, createSchema } from '@weaverse/schema'

const baseCardSchema = createSchema({
  title: 'Base Card',
  type: 'base-card',
  settings: [
    groupHelpers.content([
      inputHelpers.text('title'),
      inputHelpers.textarea('description')
    ])
  ]
})

const productCardSchema = mergeSchemas(baseCardSchema, {
  title: 'Product Card',
  type: 'product-card',
  settings: [
    groupHelpers.content([
      inputHelpers.image('productImage'),
      inputHelpers.switch('showPrice', 'Show Price', true)
    ])
  ]
})
```

### Schema Registry

Manage multiple schemas centrally:

```typescript
import { schemaRegistry } from '@weaverse/schema'

// Register schemas
schemaRegistry.register('hero-banner', heroSchema)
schemaRegistry.register('product-card', productCardSchema)
schemaRegistry.register('testimonial', testimonialSchema)

// Retrieve schemas
const heroSchema = schemaRegistry.get('hero-banner')

// List all schemas
const allSchemas = schemaRegistry.list()

// Validate all registered schemas
const validation = schemaRegistry.validateAll()
console.log(`Valid schemas: ${validation.valid.length}`)
console.log(`Invalid schemas: ${validation.invalid.length}`)
```

### Development Tools

Debug and analyze schemas:

```typescript
import { devTools } from '@weaverse/schema'

// Analyze schema structure
const analysis = devTools.analyzeSchema(mySchema)
console.log(`Schema "${analysis.stats.title}" has ${analysis.stats.inputCount} inputs`)

// Pretty print for debugging
console.log(devTools.prettyPrint(mySchema))

// Generate TypeScript interface
const tsInterface = devTools.generateTypeInterface(mySchema)
console.log(tsInterface)
// Output:
// interface ProductCardProps {
//   title: string
//   description: string
//   showPrice?: boolean
//   layout: 'card' | 'list'
// }
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