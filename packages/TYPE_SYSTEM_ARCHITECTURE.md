# Weaverse Type System Architecture

## Overview

The Weaverse packages follow a hierarchical type system with clear dependencies to maximize type reuse and maintain a single source of truth.

## Package Dependency Order

```
1. @weaverse/core      (Base types and functionality)
      ↓
2. @weaverse/react     (React-specific extensions, re-exports core)
      ↓                      ↓
3. @weaverse/schema    |    @weaverse/hydrogen
   (Schema definitions)     (Hydrogen framework integration)
```

## Type Distribution

### @weaverse/core
- Core types: `ElementData`, `WeaverseElement`, `WeaverseCoreParams`
- CSS types: `ElementCSS`, `WeaverseCSSProperties` (maps to React.CSSProperties)
- Media types: `WeaverseImage`, `WeaverseVideo`
- Input configuration types (base)

### @weaverse/react
- Re-exports all core types
- Adds React-specific types:
  - `WeaverseElementProps`
  - `WeaverseRootPropsType`
  - `ItemComponentProps`

### @weaverse/schema (Source of Truth)
- Schema definitions using Zod:
  - `InputType` - All input type literals
  - `BasicInput` - Data-bound input fields
  - `HeadingInput` - Non-data-bound headings
  - `InspectorGroup` - Groups of inputs
  - `ElementSchema` - Component schema structure
  - `PageType` - Page type literals
  - Configuration types for inputs (Select, Range, ToggleGroup)

### @weaverse/hydrogen
- Imports types from both `@weaverse/react` and `@weaverse/schema`
- Re-exports schema types for backward compatibility
- Adds Hydrogen-specific types:
  - `HydrogenComponentSchema` (extends `ElementSchema`)
  - `HydrogenComponentProps` (extends `WeaverseElement`)
  - Loader types: `ComponentLoaderArgs`, `RouteLoaderArgs`
  - Project types: `HydrogenProjectType`, `WeaverseProjectConfigs`
  - Theme types: `HydrogenThemeSchema`, `HydrogenThemeSettings`

## Type Reuse Strategy

1. **Schema as Source of Truth**: All component schema-related types are defined in `@weaverse/schema` using Zod, ensuring runtime validation matches TypeScript types.

2. **Type Inference**: Types are inferred from Zod schemas using `z.infer<>`, ensuring consistency between validation and types.

3. **Extension Pattern**: Higher-level packages extend base types rather than redefining them:
   ```typescript
   // In @weaverse/hydrogen
   export interface HydrogenComponentSchema extends SchemaElementSchema {
     // Additional Hydrogen-specific fields
   }
   ```

4. **Re-exports**: Packages re-export types from their dependencies to maintain backward compatibility and provide convenient imports.

## Benefits

1. **Single Source of Truth**: Schema definitions in one place
2. **Type Safety**: Runtime validation matches compile-time types
3. **Reduced Duplication**: Types defined once and reused
4. **Clear Dependencies**: Each package has well-defined dependencies
5. **Backward Compatibility**: Re-exports maintain existing import paths

## Migration Notes

When updating types:
1. Schema-related types should be updated in `@weaverse/schema`
2. Core functionality types should be in `@weaverse/core`
3. React-specific types stay in `@weaverse/react`
4. Hydrogen extends rather than redefines schema types

## Future Considerations

- Consider moving `HydrogenComponentPresets` to schema if it becomes a common pattern
- Theme schema structure could be generalized in schema package if other frameworks need similar functionality
- Input validation rules could be centralized in schema package 