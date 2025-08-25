import { z } from 'zod/v4'

// Re-export Zod for backward compatibility and convenience
export { z }

export const inputTypeSchema = z.union([
  z.literal('heading'),
  z.literal('text'),
  z.literal('richtext'),
  z.literal('textarea'),
  z.literal('url'),
  z.literal('image'),
  z.literal('video'),
  z.literal('switch'),
  z.literal('range'),
  z.literal('select'),
  z.literal('position'),
  z.literal('swatches'),
  z.literal('product'),
  z.literal('product-list'),
  z.literal('collection'),
  z.literal('collection-list'),
  z.literal('blog'),
  z.literal('metaobject'),
  z.literal('color'),
  z.literal('datepicker'),
  z.literal('map-autocomplete'),
  z.literal('toggle-group'),
])

export const SelectInputConfigsSchema = z.object({
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
})

export const ToggleGroupConfigsSchema = z.object({
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
})

export const RangeInputConfigsSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  unit: z.string().optional(),
})

export const ConfigsPropsSchema = z.union([
  SelectInputConfigsSchema,
  ToggleGroupConfigsSchema,
  RangeInputConfigsSchema,
])

export const BasicInputSchema = z
  .object({
    type: inputTypeSchema,
    name: z
      .string()
      .min(1, 'Name is required')
      .describe(
        'The name of the prop(camelCase) which will be used in the component'
      ),
    label: z.string().optional().describe('The label of the prop'),
    placeholder: z.string().optional(),
    helpText: z.string().optional(),
    configs: z.custom<ConfigsProps | undefined>().optional(),
    shouldRevalidate: z
      .boolean()
      .optional()
      .describe(
        'Whether to revalidate the prop when the value changes, use for product, product-list, collection, collection-list, blog, metaobject'
      ),
    condition: z
      .unknown()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          typeof val === 'string' ||
          typeof val === 'function',
        {
          message:
            'Condition must be a string (deprecated) or function: (data) => boolean',
        }
      )
      .describe(
        'Condition for conditional rendering. Use function-based conditions: (data) => boolean. String conditions are deprecated.'
      ),
    defaultValue: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.record(z.string(), z.unknown()),
        z.unknown(),
      ])
      .optional()
      .describe('The default value of the prop'),
  })
  .check((ctx) => {
    // Validate configs based on input type to prevent union parsing issues
    if (ctx.value.configs !== undefined) {
      let configsSchema: z.ZodSchema | null = null

      switch (ctx.value.type) {
        case 'select':
          configsSchema = SelectInputConfigsSchema
          break
        case 'toggle-group':
          configsSchema = ToggleGroupConfigsSchema
          break
        case 'range':
          configsSchema = RangeInputConfigsSchema
          break
        default:
          // For other input types, configs should be undefined or allow any structure
          return
      }

      if (configsSchema) {
        const result = configsSchema.safeParse(ctx.value.configs)
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.issues.push({
              code: z.ZodIssueCode.custom,
              path: ['configs', ...issue.path],
              message: issue.message,
              input: ctx.value,
            })
          })
        }
      }
    }
  })

export const HeadingInputSchema = z
  .object({
    type: z.literal('heading'),
    label: z.string(),
  })
  .passthrough() // Allow additional properties with [key: string]: any

export const InputSchema = z.union([BasicInputSchema, HeadingInputSchema])

export const InspectorGroupSchema = z.object({
  group: z
    .string()
    .min(1, 'Group name is required')
    .describe("The group of the prop, it's the title of the group"),
  inputs: z
    .array(InputSchema)
    .min(1, 'At least one input is required')
    .describe('The inputs of the group'),
})

export const PageTypeSchema = z.union([
  z.literal('*'),
  z.literal('INDEX'),
  z.literal('PRODUCT'),
  z.literal('ALL_PRODUCTS'),
  z.literal('COLLECTION'),
  z.literal('COLLECTION_LIST'),
  z.literal('PAGE'),
  z.literal('BLOG'),
  z.literal('ARTICLE'),
  z.literal('CUSTOM'),
])

export const ComponentPresetsSchema = z
  .object({
    type: z.string().describe('The type of the component'),
    children: z
      .array(z.lazy((): z.ZodType<any> => ComponentPresetsSchema))
      .optional()
      .describe('Nested child component presets'),
  })
  .catchall(z.any())
  .describe('Component preset configuration')

export const ElementSchema = z
  .object({
    title: z
      .string()
      .min(2)
      .describe(
        'The title of the child element or the section element, should be short and concise, not include parent element title and any special characters'
      ),
    type: z
      .string()
      .min(1, 'Type is required')
      .describe(`The type of the child element or the section based on title in lowercase with space replaced by -, i.e. 'Product Detail' -> 'product-detail' 
    if it's a child element not common child type, it should includes "parentType--" prefix , i.e. an image element is in "hero-banner" parent type, the type of image element is "hero-banner--image"`),
    limit: z
      .number()
      .optional()
      .describe(
        "The limit of the element, it's the maximum number of the element, if not set, it's 1"
      ),
    inspector: z
      .array(InspectorGroupSchema)
      .optional()
      .describe('DEPRECATED: Use settings instead. Inspector settings groups'),
    settings: z
      .array(InspectorGroupSchema)
      .optional()
      .describe(
        'The props of the child element, the prop make the element can be customized'
      ),
    childTypes: z
      .array(z.string())
      .optional()
      .describe(
        'Array of child types, that is allowed to be used in the element'
      ),
    enabledOn: z
      .object({
        pages: z.array(PageTypeSchema).optional(),
        groups: z
          .array(
            z.union([
              z.literal('*'),
              z.literal('header'),
              z.literal('footer'),
              z.literal('body'),
            ])
          )
          .optional(),
      })
      .optional()
      .describe('Where this element can be enabled'),
    presets: z
      .object({
        children: z
          .array(ComponentPresetsSchema)
          .optional()
          .describe('Array of child component presets'),
      })
      .catchall(z.any())
      .optional()
      .describe(
        "The presets of the element, it's the initial state of the element, include the children and it's default props"
      ),
  })
  .describe('The schema of the element')

export const SchemaList = z.record(z.string(), ElementSchema)

// section schema
export const titleSchema = z
  .string()
  .min(3, 'Title must be at least 3 characters')
  .max(50, 'Title must be less than 50 characters')
export const typeSchema = z
  .string()
  .min(3, 'Type must be at least 3 characters')
  .max(50, 'Type must be less than 50 characters')
  .regex(
    /^[a-z0-9-]+$/,
    'Type must contain only lowercase letters, numbers, and hyphens'
  )
  .refine(
    (val) => !(val.startsWith('-') || val.endsWith('-')),
    'Type cannot start or end with a hyphen'
  )

// Type exports - inferred from Zod schemas
export type SchemaType = z.infer<typeof ElementSchema>
export type InputType = z.infer<typeof inputTypeSchema>
export type BasicInput = z.infer<typeof BasicInputSchema>
export type HeadingInput = z.infer<typeof HeadingInputSchema>
export type Input = z.infer<typeof InputSchema>
export type InspectorGroup = z.infer<typeof InspectorGroupSchema>
export type PageType = z.infer<typeof PageTypeSchema>
export type SelectInputConfigs = z.infer<typeof SelectInputConfigsSchema>
export type ToggleGroupConfigs = z.infer<typeof ToggleGroupConfigsSchema>
export type RangeInputConfigs = z.infer<typeof RangeInputConfigsSchema>
export type ConfigsProps = z.infer<typeof ConfigsPropsSchema>
export type ComponentPresets = z.infer<typeof ComponentPresetsSchema>

/**
 * Enhanced validation result types for better error reporting
 */
export type SchemaValidationIssue = {
  /** The error message */
  readonly message: string
  /** The path where the error occurred */
  readonly path?: ReadonlyArray<string | number>
  /** The validation rule that failed */
  readonly code?: string
  /** Expected value or format */
  readonly expected?: unknown
  /** Actual received value */
  readonly received?: unknown
}

export type SchemaValidationSuccess<T> = {
  readonly success: true
  readonly data: T
  readonly issues?: undefined
}

export type SchemaValidationFailure = {
  readonly success: false
  readonly issues: readonly SchemaValidationIssue[]
  readonly data?: undefined
}

export type SchemaValidationResult<T> =
  | SchemaValidationSuccess<T>
  | SchemaValidationFailure

/**
 * Type-safe schema type with enforced required fields.
 * Use this when you need strict TypeScript checking for required fields.
 *
 * Note: The inferred SchemaType may show 'title' and 'type' as optional
 * in TypeScript when strict mode is disabled, but they are required at runtime.
 * This type explicitly enforces them as required.
 */
export type SchemaTypeStrict = {
  title: string
  type: string
  limit?: number
  inspector?: InspectorGroup[]
  settings?: InspectorGroup[]
  childTypes?: string[]
  enabledOn?: {
    pages?: PageType[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  presets?: {
    children?: ComponentPresets[]
    [key: string]: any
  }
}

/**
 * Enhanced schema validation with detailed error reporting
 */
export function validateSchema(
  schema: unknown
): SchemaValidationResult<SchemaType> {
  const result = ElementSchema.safeParse(schema)

  if (!result.success) {
    const issues: SchemaValidationIssue[] = result.error.issues.map(
      (issue) => ({
        message: issue.message,
        path: issue.path.map((p) => String(p)),
        code: issue.code,
        expected: 'expected' in issue ? issue.expected : undefined,
        received: 'received' in issue ? issue.received : undefined,
      })
    )

    return {
      success: false,
      issues,
    }
  }

  return {
    success: true,
    data: result.data,
  }
}

export function createSchema(schema: SchemaType) {
  // Use the enhanced validation function
  const result = validateSchema(schema)

  if (!result.success) {
    console.warn('⚠️ Schema validation issues found:')
    result.issues.forEach((issue) => {
      const pathStr = issue.path?.length ? ` at ${issue.path.join('.')}` : ''
      console.warn(`  - ${issue.message}${pathStr}`)
      if (issue.expected !== undefined) {
        console.warn(`    Expected: ${JSON.stringify(issue.expected)}`)
      }
      if (issue.received !== undefined) {
        console.warn(`    Received: ${JSON.stringify(issue.received)}`)
      }
    })
    console.warn(
      'Using original schema with potential issues. Consider fixing these validation errors.'
    )
    return schema as SchemaType
  }
  return result.data
}

// Type-safe helper that enforces required fields even without strict mode
export function createSchemaTypeSafe(schema: {
  title: string
  type: string
  limit?: number
  inspector?: InspectorGroup[]
  settings?: InspectorGroup[]
  childTypes?: string[]
  enabledOn?: {
    pages?: PageType[]
    groups?: ('*' | 'header' | 'footer' | 'body')[]
  }
  presets?: {
    children?: ComponentPresets[]
    [key: string]: any
  }
}): SchemaType {
  // Use the enhanced validation function
  const result = validateSchema(schema)

  if (!result.success) {
    console.warn('⚠️ Schema validation issues found:')
    result.issues.forEach((issue) => {
      const pathStr = issue.path?.length ? ` at ${issue.path.join('.')}` : ''
      console.warn(`  - ${issue.message}${pathStr}`)
    })
    console.warn(
      'Using original schema with potential issues. Consider fixing these validation errors.'
    )
    return schema as SchemaType
  }
  return result.data
}

/**
 * Parse and validate a schema, throwing on validation errors
 * Useful when you want to fail fast on invalid schemas
 */
export function parseSchema(schema: unknown): SchemaType {
  const result = validateSchema(schema)

  if (!result.success) {
    const errorMessage = result.issues
      .map((issue) => {
        const pathStr = issue.path?.length ? ` at ${issue.path.join('.')}` : ''
        return `${issue.message}${pathStr}`
      })
      .join('\n')

    throw new Error(`Schema validation failed:\n${errorMessage}`)
  }

  return result.data
}

/**
 * Check if a value is a valid schema without throwing
 */
export function isValidSchema(schema: unknown): schema is SchemaType {
  const result = validateSchema(schema)
  return result.success
}

/**
 * Schema composition utilities
 */
export class SchemaBuilder {
  private readonly schema: Partial<SchemaType>

  constructor(initial?: Partial<SchemaType>) {
    this.schema = { ...initial }
  }

  title(title: string): SchemaBuilder {
    this.schema.title = title
    return this
  }

  type(type: string): SchemaBuilder {
    this.schema.type = type
    return this
  }

  limit(limit: number): SchemaBuilder {
    this.schema.limit = limit
    return this
  }

  settings(settings: InspectorGroup[]): SchemaBuilder {
    this.schema.settings = settings
    return this
  }

  addSetting(group: InspectorGroup): SchemaBuilder {
    if (!this.schema.settings) {
      this.schema.settings = []
    }
    this.schema.settings.push(group)
    return this
  }

  childTypes(childTypes: string[]): SchemaBuilder {
    this.schema.childTypes = childTypes
    return this
  }

  addChildType(childType: string): SchemaBuilder {
    if (!this.schema.childTypes) {
      this.schema.childTypes = []
    }
    this.schema.childTypes.push(childType)
    return this
  }

  enabledOn(enabledOn: SchemaType['enabledOn']): SchemaBuilder {
    this.schema.enabledOn = enabledOn
    return this
  }

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
    options: Array<{ label: string; value: string }>,
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

/**
 * Schema versioning and migration support
 */
export interface VersionedSchema extends SchemaType {
  /** Schema version for future migrations */
  readonly version?: string
  /** Migration metadata */
  readonly migrations?: {
    from: string
    to: string
    migrate: (oldSchema: any) => SchemaType
  }[]
}

export type SchemaMigration = {
  from: string
  to: string
  migrate: (oldSchema: any) => SchemaType
}

export class SchemaRegistry {
  private readonly schemas = new Map<string, SchemaType>()
  private readonly migrations = new Map<string, SchemaMigration[]>()

  /**
   * Register a schema with optional migrations
   */
  register(
    name: string,
    schema: SchemaType,
    migrations?: SchemaMigration[]
  ): void {
    this.schemas.set(name, schema)
    if (migrations) {
      this.migrations.set(name, migrations)
    }
  }

  /**
   * Get a schema by name
   */
  get(name: string): SchemaType | undefined {
    return this.schemas.get(name)
  }

  /**
   * Get all registered schema names
   */
  list(): string[] {
    return Array.from(this.schemas.keys())
  }

  /**
   * Validate that all registered schemas are valid
   */
  validateAll(): {
    valid: string[]
    invalid: Array<{ name: string; issues: readonly SchemaValidationIssue[] }>
  } {
    const valid: string[] = []
    const invalid: Array<{
      name: string
      issues: readonly SchemaValidationIssue[]
    }> = []

    for (const [name, schema] of this.schemas) {
      const result = validateSchema(schema)
      if (result.success) {
        valid.push(name)
      } else {
        invalid.push({ name, issues: result.issues })
      }
    }

    return { valid, invalid }
  }

  /**
   * Migrate a schema from one version to another
   */
  migrate(name: string, oldSchema: any, targetVersion: string): SchemaType {
    const migrations = this.migrations.get(name)
    if (!migrations) {
      throw new Error(`No migrations found for schema: ${name}`)
    }

    let current = oldSchema
    const currentVersion = current.version || '1.0.0'

    for (const migration of migrations) {
      if (migration.from === currentVersion && migration.to === targetVersion) {
        current = migration.migrate(current)
        break
      }
    }

    return createSchema(current)
  }
}

/**
 * Global schema registry instance
 */
export const schemaRegistry = new SchemaRegistry()

/**
 * Schema development utilities
 */
export const devTools = {
  /**
   * Pretty print a schema for debugging
   */
  prettyPrint: (schema: SchemaType): string => {
    return JSON.stringify(schema, null, 2)
  },

  /**
   * Validate and report schema statistics
   */
  analyzeSchema: (schema: SchemaType) => {
    const result = validateSchema(schema)
    const inputCount =
      schema.settings?.reduce((acc, group) => acc + group.inputs.length, 0) || 0
    const groupCount = schema.settings?.length || 0

    return {
      valid: result.success,
      issues: result.success ? [] : result.issues,
      stats: {
        title: schema.title,
        type: schema.type,
        inputCount,
        groupCount,
        hasChildTypes: (schema.childTypes?.length || 0) > 0,
        hasPresets: Boolean(schema.presets),
        hasLimits: Boolean(schema.limit),
      },
    }
  },

  /**
   * Generate TypeScript interface from schema
   */
  generateTypeInterface: (schema: SchemaType): string => {
    let interfaceStr = `interface ${schema.title.replace(/\s+/g, '')}Props {\n`

    schema.settings?.forEach((group) => {
      group.inputs.forEach((input) => {
        if (input.type !== 'heading') {
          const basicInput = input as BasicInput
          let typeStr = 'unknown'

          switch (basicInput.type) {
            case 'text':
            case 'textarea':
            case 'richtext':
            case 'url':
              typeStr = 'string'
              break
            case 'switch':
              typeStr = 'boolean'
              break
            case 'range':
              typeStr = 'number'
              break
            case 'image':
            case 'video':
              typeStr = 'string'
              break
            case 'select':
            case 'toggle-group': {
              const options = (basicInput.configs as any)?.options
              if (options) {
                typeStr = options
                  .map((opt: any) => `'${opt.value}'`)
                  .join(' | ')
              } else {
                typeStr = 'string'
              }
              break
            }
            default:
              typeStr = 'unknown'
          }

          const optional = basicInput.defaultValue !== undefined ? '?' : ''
          interfaceStr += `  ${basicInput.name}${optional}: ${typeStr}\n`
        }
      })
    })

    interfaceStr += '}'
    return interfaceStr
  },
}

/**
 * Simple Component Registration Utilities
 * =====================================
 *
 * Lightweight utilities for component validation and registration
 * with minimal dependencies and clean error reporting.
 */

export type SimpleValidationResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  details?: string[]
}

export type ComponentValidationOptions = {
  validate?: boolean
  skipMissing?: boolean
  logErrors?: boolean
}

/**
 * Validates a single component using the existing ElementSchema
 */
export function validateComponentSimple(
  component: any,
  componentName?: string
): SimpleValidationResult {
  try {
    if (!component) {
      return {
        success: false,
        error: `Component ${componentName || 'unknown'} is null or undefined`,
      }
    }

    if (!component.schema) {
      return {
        success: false,
        error: `Component ${componentName || 'unknown'} is missing schema property`,
      }
    }

    // Use the existing ElementSchema validation
    const schemaResult = ElementSchema.safeParse(component.schema)

    if (!schemaResult.success) {
      const errorDetails = schemaResult.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? ` at ${issue.path.join('.')}` : ''
        return `${issue.message}${path}`
      })

      return {
        success: false,
        error: `Schema validation failed for component ${componentName || component.schema?.type || 'unknown'}`,
        details: errorDetails,
      }
    }

    return {
      success: true,
      data: {
        component,
        schema: schemaResult.data,
        type: schemaResult.data.type,
        title: schemaResult.data.title,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: `Validation error for component ${componentName || 'unknown'}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Validates multiple components in bulk
 */
export function validateComponentsSimple(
  components: Record<string, any>,
  options: ComponentValidationOptions = {}
): {
  success: boolean
  valid: string[]
  invalid: Array<{ name: string; error: string; details?: string[] }>
  total: number
} {
  const { skipMissing = false, logErrors = false } = options
  const valid: string[] = []
  const invalid: Array<{ name: string; error: string; details?: string[] }> = []

  for (const [name, component] of Object.entries(components)) {
    if (!component && skipMissing) {
      continue
    }

    const result = validateComponentSimple(component, name)

    if (result.success) {
      valid.push(name)
    } else {
      invalid.push({
        name,
        error: result.error || 'Unknown validation error',
        details: result.details,
      })

      if (logErrors) {
        console.warn(`❌ Component validation failed: ${name}`)
        console.warn(`   Error: ${result.error}`)
        if (result.details?.length) {
          result.details.forEach((detail) => console.warn(`   - ${detail}`))
        }
      }
    }
  }

  return {
    success: invalid.length === 0,
    valid,
    invalid,
    total: Object.keys(components).length,
  }
}

/**
 * Creates a validated component array with optional validation
 */
export function createValidatedComponentArray<T extends Record<string, any>>(
  components: T,
  options: ComponentValidationOptions = {}
): T[keyof T][] {
  const { validate = true, logErrors = true } = options

  if (!validate) {
    return Object.values(components)
  }

  const validation = validateComponentsSimple(components, { logErrors })

  if (!validation.success && logErrors) {
    console.warn('⚠️ Component validation issues found:')
    console.warn(`   Valid: ${validation.valid.length}/${validation.total}`)
    if (validation.invalid.length > 0) {
      console.warn('   Invalid components:')
      validation.invalid.forEach(({ name, error }) => {
        console.warn(`   - ${name}: ${error}`)
      })
    }
  }

  // Return all components, even if some are invalid (let the app handle gracefully)
  return Object.values(components)
}

/**
 * Development helper to analyze component registry
 */
export function analyzeComponentRegistry(components: Record<string, any>): {
  summary: {
    total: number
    valid: number
    invalid: number
    types: string[]
    duplicateTypes: string[]
  }
  details: Array<{
    name: string
    type?: string
    title?: string
    valid: boolean
    error?: string
    settingsCount?: number
    hasPresets?: boolean
  }>
} {
  const validation = validateComponentsSimple(components)
  const types = new Set<string>()
  const duplicateTypes = new Set<string>()
  const details: Array<{
    name: string
    type?: string
    title?: string
    valid: boolean
    error?: string
    settingsCount?: number
    hasPresets?: boolean
  }> = []

  for (const [name, component] of Object.entries(components)) {
    const result = validateComponentSimple(component, name)

    let componentType: string | undefined
    let settingsCount: number | undefined
    let hasPresets: boolean | undefined

    if (result.success && result.data) {
      componentType = result.data.type
      if (componentType && types.has(componentType)) {
        duplicateTypes.add(componentType)
      } else if (componentType) {
        types.add(componentType)
      }

      settingsCount = result.data.schema.settings?.reduce(
        (acc: number, group: any) => acc + (group.inputs?.length || 0),
        0
      )
      hasPresets = Boolean(result.data.schema.presets)
    }

    details.push({
      name,
      type: componentType,
      title: result.data?.title,
      valid: result.success,
      error: result.error,
      settingsCount,
      hasPresets,
    })
  }

  return {
    summary: {
      total: validation.total,
      valid: validation.valid.length,
      invalid: validation.invalid.length,
      types: Array.from(types),
      duplicateTypes: Array.from(duplicateTypes),
    },
    details,
  }
}
