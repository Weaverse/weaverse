/**
 * Authoring contracts, builders, and development-time validation for Weaverse
 * component schemas.
 *
 * @packageDocumentation
 */

import type {
  BasicInput,
  HeadingInput,
  InspectorGroup,
  RangeInputConfigs,
  SchemaType,
  SchemaValidationIssue,
  SelectInputOption,
} from './validation.js'

// `process` is statically replaced by the consuming bundler (Vite/Hydrogen)
// at build time; this ambient declaration only satisfies the type checker in a
// browser-targeted package with no @types/node.
declare const process: { env: { NODE_ENV?: string } }

export type {
  OpenGraphType,
  PageSEOData,
  TwitterCardType,
} from './page-seo.js'

/** Schema type with required title and type fields in non-strict projects. */
export type SchemaTypeStrict = SchemaType & {
  /** Short component title displayed in Studio. */
  title: string
  /** Stable kebab-case component identifier. */
  type: string
}

function reportSchemaIssues(issues: readonly SchemaValidationIssue[]): void {
  console.warn('⚠️ Schema validation issues found:')
  for (const issue of issues) {
    const pathStr = issue.path?.length ? ` at ${issue.path.join('.')}` : ''
    console.warn(`  - ${issue.message}${pathStr}`)
    if (issue.expected !== undefined) {
      console.warn(`    Expected: ${JSON.stringify(issue.expected)}`)
    }
    if (issue.received !== undefined) {
      console.warn(`    Received: ${JSON.stringify(issue.received)}`)
    }
  }
  console.warn(
    'Using original schema with potential issues. Consider fixing these validation errors.'
  )
}

/**
 * Create a section schema.
 *
 * Validation runs in development only: the validation runtime (zod) is imported
 * lazily inside a `process.env.NODE_ENV !== 'production'` guard, which the
 * consuming bundler statically evaluates and eliminates in production builds —
 * both the browser bundle and the Oxygen/SSR worker. Production storefronts
 * therefore ship section schemas with zero validation overhead and no zod.
 */
export function createSchema(schema: SchemaType): SchemaType {
  if (process.env.NODE_ENV !== 'production') {
    void import('./validation')
      .then(({ validateSchema }) => {
        const result = validateSchema(schema)
        if (!result.success) {
          reportSchemaIssues(result.issues)
        }
      })
      .catch(() => {})
  }
  return schema
}

/**
 * Type-safe variant of {@link createSchema} that enforces required fields even
 * when the consumer's TypeScript `strict` mode is disabled. Validation is
 * dev-only, exactly as in {@link createSchema}.
 */
export function createSchemaTypeSafe(schema: SchemaTypeStrict): SchemaType {
  if (process.env.NODE_ENV !== 'production') {
    void import('./validation')
      .then(({ validateSchema }) => {
        const result = validateSchema(schema)
        if (!result.success) {
          reportSchemaIssues(result.issues)
        }
      })
      .catch(() => {})
  }
  return schema as SchemaType
}

/**
 * Schema composition utilities
 */
export class SchemaBuilder {
  private readonly schema: Partial<SchemaType>

  /** Creates a builder initialized with an optional partial schema. */
  constructor(initial?: Partial<SchemaType>) {
    this.schema = { ...initial }
  }

  /** Sets the merchant-facing component title. */
  title(title: string): SchemaBuilder {
    this.schema.title = title
    return this
  }

  /** Sets the stable component type identifier. */
  type(type: string): SchemaBuilder {
    this.schema.type = type
    return this
  }

  /** Sets the maximum number of allowed sibling instances. */
  limit(limit: number): SchemaBuilder {
    this.schema.limit = limit
    return this
  }

  /** Replaces all Studio setting groups. */
  settings(settings: InspectorGroup[]): SchemaBuilder {
    this.schema.settings = settings
    return this
  }

  /** Appends one Studio setting group. */
  addSetting(group: InspectorGroup): SchemaBuilder {
    if (!this.schema.settings) {
      this.schema.settings = []
    }
    this.schema.settings.push(group)
    return this
  }

  /** Replaces the allowed direct child component types. */
  childTypes(childTypes: string[]): SchemaBuilder {
    this.schema.childTypes = childTypes
    return this
  }

  /** Appends one allowed direct child component type. */
  addChildType(childType: string): SchemaBuilder {
    if (!this.schema.childTypes) {
      this.schema.childTypes = []
    }
    this.schema.childTypes.push(childType)
    return this
  }

  /**
   * Sets legacy page and placement restrictions.
   * @deprecated Use `enabled` instead.
   */
  enabledOn(enabledOn: SchemaType['enabledOn']): SchemaBuilder {
    this.schema.enabledOn = enabledOn
    return this
  }

  /** Sets static or context-aware component availability. */
  enabled(enabled: SchemaType['enabled']): SchemaBuilder {
    this.schema.enabled = enabled
    return this
  }

  /** Sets initial component data and optional child presets. */
  presets(presets: SchemaType['presets']): SchemaBuilder {
    this.schema.presets = presets
    return this
  }

  /**
   * Build and validate the schema
   */
  build(): SchemaType {
    if (!(this.schema.title && this.schema.type)) {
      throw new Error('Schema must have both title and type')
    }
    return createSchema(this.schema as SchemaType)
  }

  /**
   * Build without validation
   */
  buildUnsafe(): SchemaType {
    return this.schema as SchemaType
  }
}

/**
 * Create a new schema builder
 */
export function schemaBuilder(initial?: Partial<SchemaType>): SchemaBuilder {
  return new SchemaBuilder(initial)
}

/**
 * Merge multiple schemas (for composition)
 */
export function mergeSchemas(
  base: SchemaType,
  ...overrides: Partial<SchemaType>[]
): SchemaType {
  let result = { ...base }

  for (const override of overrides) {
    result = {
      ...result,
      ...override,
      // Merge arrays instead of replacing them
      settings: override.settings
        ? [...(result.settings || []), ...override.settings]
        : result.settings,
      childTypes: override.childTypes
        ? [...(result.childTypes || []), ...override.childTypes]
        : result.childTypes,
      enabledOn: override.enabledOn
        ? {
            pages: override.enabledOn.pages || result.enabledOn?.pages,
            groups: override.enabledOn.groups || result.enabledOn?.groups,
          }
        : result.enabledOn,
    }
  }

  return createSchema(result)
}

/**
 * Create common input configurations
 */
export const inputHelpers = {
  /**
   * Create a text input
   */
  text: (
    name: string,
    label?: string,
    options?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'text',
    name,
    label: label || name,
    ...options,
  }),

  /**
   * Create a textarea input
   */
  textarea: (
    name: string,
    label?: string,
    options?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'textarea',
    name,
    label: label || name,
    ...options,
  }),

  /**
   * Create a switch input
   */
  switch: (
    name: string,
    label?: string,
    defaultValue?: boolean,
    options?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'switch',
    name,
    label: label || name,
    defaultValue,
    ...options,
  }),

  /**
   * Create a range input
   */
  range: (
    name: string,
    label?: string,
    configs?: RangeInputConfigs,
    options?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'range',
    name,
    label: label || name,
    configs,
    ...options,
  }),

  /**
   * Create a select input
   */
  select: (
    name: string,
    label: string,
    options: SelectInputOption[],
    inputOptions?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'select',
    name,
    label,
    configs: { options },
    ...inputOptions,
  }),

  /**
   * Create an image input
   */
  image: (
    name: string,
    label?: string,
    options?: Partial<BasicInput>
  ): BasicInput => ({
    type: 'image',
    name,
    label: label || name,
    ...options,
  }),

  /**
   * Create a heading input
   */
  heading: (
    label: string,
    options?: Omit<HeadingInput, 'type' | 'label'>
  ): HeadingInput => ({
    type: 'heading',
    label,
    ...options,
  }),
}

/**
 * Create common inspector groups
 */
export const groupHelpers = {
  /**
   * Create a general settings group
   */
  general: (inputs: (BasicInput | HeadingInput)[]): InspectorGroup => ({
    group: 'General',
    inputs,
  }),

  /**
   * Create a layout settings group
   */
  layout: (inputs: (BasicInput | HeadingInput)[]): InspectorGroup => ({
    group: 'Layout',
    inputs,
  }),

  /**
   * Create a style settings group
   */
  style: (inputs: (BasicInput | HeadingInput)[]): InspectorGroup => ({
    group: 'Style',
    inputs,
  }),

  /**
   * Create a content settings group
   */
  content: (inputs: (BasicInput | HeadingInput)[]): InspectorGroup => ({
    group: 'Content',
    inputs,
  }),

  /**
   * Create a custom group
   */
  custom: (
    groupName: string,
    inputs: (BasicInput | HeadingInput)[]
  ): InspectorGroup => ({
    group: groupName,
    inputs,
  }),
}

export type {
  BasicInput,
  ComponentAvailabilityContext,
  ComponentGroup,
  ComponentPresets,
  ComponentRegistryAnalysis,
  ComponentRegistryDetail,
  ComponentRegistrySummary,
  ComponentsValidationResult,
  ComponentValidationOptions,
  ConfigsProps,
  HeadingInput,
  Input,
  InputType,
  InspectorGroup,
  InvalidComponentResult,
  PageType,
  RangeInputConfigs,
  Resolvable,
  SchemaAnalysisResult,
  SchemaAnalysisStats,
  SchemaDevTools,
  SchemaMigration,
  SchemaType,
  SchemaValidationFailure,
  SchemaValidationIssue,
  SchemaValidationResult,
  SchemaValidationSuccess,
  SelectInputConfigs,
  SelectInputOption,
  SimpleValidationResult,
  ToggleGroupConfigs,
  VersionedSchema,
} from './validation.js'
// Re-export the schema definitions and validation runtime. These are
// tree-shakeable: storefront bundles that only call `createSchema` never
// reference them, so `./validation` (and zod) is dropped from production builds.
export {
  analyzeComponentRegistry,
  BasicInputSchema,
  ComponentPresetsSchema,
  ConfigsPropsSchema,
  createValidatedComponentArray,
  devTools,
  ElementSchema,
  HeadingInputSchema,
  InputSchema,
  InspectorGroupSchema,
  inputTypeSchema,
  isValidSchema,
  PageTypeSchema,
  parseSchema,
  RangeInputConfigsSchema,
  SchemaList,
  SchemaRegistry,
  SelectInputConfigsSchema,
  schemaRegistry,
  ToggleGroupConfigsSchema,
  titleSchema,
  typeSchema,
  validateComponentSimple,
  validateComponentsSimple,
  validateSchema,
  z,
} from './validation.js'
