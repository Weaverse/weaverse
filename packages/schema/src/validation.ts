// @weaverse/schema — schema definitions and validation (zod runtime).
//
// This module is loaded only while authoring (dev/Studio): `createSchema` in
// `./index` imports it lazily behind a `process.env.NODE_ENV !== 'production'`
// guard. Keeping every zod-dependent symbol here lets production storefront
// bundles tree-shake the validation runtime out entirely.
import { z } from 'zod/v4'

// Re-export Zod for backward compatibility and convenience
export { z }

/** Runtime validator for supported Studio input control types. */
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

/** Runtime validator for select input configuration. */
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

/** Runtime validator for toggle-group input configuration. */
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

/** Runtime validator for numeric range input configuration. */
export const RangeInputConfigsSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  unit: z.string().optional(),
})

/** Runtime validator for input-specific configuration. */
export const ConfigsPropsSchema = z.union([
  SelectInputConfigsSchema,
  ToggleGroupConfigsSchema,
  RangeInputConfigsSchema,
])

/** Runtime validator for configurable Studio inputs. */
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

/** Runtime validator for organizational setting headings. */
export const HeadingInputSchema = z
  .object({
    type: z.literal('heading'),
    label: z.string(),
  })
  .passthrough() // Allow additional properties with [key: string]: any

/** Runtime validator for settings and organizational headings. */
export const InputSchema = z.union([BasicInputSchema, HeadingInputSchema])

/** Runtime validator for a labeled group of component settings. */
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

/** Runtime validator for storefront page types. */
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

/** A static value or a synchronous callback deriving it from context. */
export type Resolvable<T, Context> = T | ((context: Context) => T)

/** Placement groups understood by component availability rules. */
export type ComponentGroup = 'body' | 'header' | 'footer'

/** Context passed to function-based component availability rules. */
export interface ComponentAvailabilityContext {
  /** Placement group currently being evaluated. */
  group: ComponentGroup
  /** Active storefront page information. */
  page: {
    /** Weaverse page identifier. */
    id: string
    /** Weaverse page type. */
    type: PageType
    /** Route handle, without a leading slash. */
    handle: string
    /** Active storefront locale. */
    locale: string
  }
}

/** Runtime validator for nested component presets. */
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

/** Runtime validator for public component schemas. */
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
    enabled: z
      .custom<Resolvable<boolean, ComponentAvailabilityContext>>(
        (value) => typeof value === 'boolean' || typeof value === 'function',
        'Enabled must be a boolean or synchronous function'
      )
      .optional()
      .describe('Whether this element is available in the current context'),
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

/** Runtime validator for a component-type-to-schema registry. */
export const SchemaList = z.record(z.string(), ElementSchema)

// section schema
/** Runtime validator for standalone schema titles. */
export const titleSchema = z
  .string()
  .min(3, 'Title must be at least 3 characters')
  .max(50, 'Title must be less than 50 characters')
/** Runtime validator for standalone schema type identifiers. */
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

// Public authoring contracts. Runtime alignment is verified in
// test/type-alignment.test.ts against each schema's z.output type.

/** Input controls supported by Weaverse Studio. */
export type InputType =
  | 'heading'
  | 'text'
  | 'richtext'
  | 'textarea'
  | 'url'
  | 'image'
  | 'video'
  | 'switch'
  | 'range'
  | 'select'
  | 'position'
  | 'product'
  | 'product-list'
  | 'collection'
  | 'collection-list'
  | 'blog'
  | 'metaobject'
  | 'color'
  | 'datepicker'
  | 'map-autocomplete'
  | 'toggle-group'

/** Configuration for a select input. */
export interface SelectInputConfigs {
  /** Choices shown in the select menu. */
  options?: Array<{
    /** Merchant-facing option label. */
    label: string
    /** Value stored in component data. */
    value: string
  }>
}

/** Configuration for a toggle-group input. */
export interface ToggleGroupConfigs {
  /** Choices shown in the toggle group. */
  options?: Array<{
    /** Merchant-facing option label. */
    label: string
    /** Value stored in component data. */
    value: string
    /** Optional icon name displayed with the option. */
    icon?: string
  }>
}

/** Configuration for a numeric range input. */
export interface RangeInputConfigs {
  /** Maximum selectable value. */
  max?: number
  /** Minimum selectable value. */
  min?: number
  /** Increment between selectable values. */
  step?: number
  /** Unit displayed next to the value. */
  unit?: string
}

/** Input-specific configuration accepted by Studio controls. */
export type ConfigsProps =
  | SelectInputConfigs
  | ToggleGroupConfigs
  | RangeInputConfigs

/** A configurable component property shown in Weaverse Studio. */
export interface BasicInput {
  /**
   * Controls whether Studio displays this input for the current component data.
   * String conditions remain supported but are deprecated; prefer a function.
   */
  // biome-ignore lint/complexity/noBannedTypes: preserves the existing public contract inferred by Zod
  condition?: string | Function
  /** Control-specific options and constraints. */
  configs?: ConfigsProps
  /** Initial value assigned when the component is created. */
  defaultValue?: unknown
  /** Supporting guidance shown below the control. */
  helpText?: string
  /** Merchant-facing field label. */
  label?: string
  /** Component prop name receiving the configured value. */
  name: string
  /** Placeholder shown by text-like controls. */
  placeholder?: string
  /** Whether changing this value reruns the component loader. */
  shouldRevalidate?: boolean
  /** Studio control used to edit the property. */
  type: InputType
}

/** A non-editable heading used to organize Studio settings. */
export interface HeadingInput {
  /** Text displayed above the following settings. */
  label: string
  /** Heading discriminator. */
  type: 'heading'
  /** Additional Studio metadata retained for backward compatibility. */
  [key: string]: unknown
}

/** A setting input or organizational heading. */
export type Input = BasicInput | HeadingInput

/** A labeled group of component settings. */
export interface InspectorGroup {
  /** Group title displayed in Studio. */
  group: string
  /** Settings rendered inside the group. */
  inputs: Input[]
}

/** Storefront page types available to component placement rules. */
export type PageType =
  | '*'
  | 'INDEX'
  | 'PRODUCT'
  | 'ALL_PRODUCTS'
  | 'COLLECTION'
  | 'COLLECTION_LIST'
  | 'PAGE'
  | 'BLOG'
  | 'ARTICLE'
  | 'CUSTOM'

/** Initial data and nested children created by a component preset. */
export interface ComponentPresets {
  /** Nested child component presets retained in their legacy permissive shape. */
  // biome-ignore lint/suspicious/noExplicitAny: preserves the existing recursive Zod contract
  children?: any[]
  /** Registered component type to create. */
  type: string
  /** Additional component setting defaults. */
  // biome-ignore lint/suspicious/noExplicitAny: presets intentionally accept arbitrary component data
  [key: string]: any
}

/** Public component schema authoring contract. */
export interface SchemaType {
  /** Component types allowed as direct children. */
  childTypes?: string[]
  /** Whether the component can be inserted in the current page context. */
  enabled?: Resolvable<boolean, ComponentAvailabilityContext>
  /**
   * Legacy page and placement availability restrictions.
   * @deprecated Use `enabled` for both static and context-aware availability.
   * Existing schemas remain supported, and both rules must pass when both
   * properties are present.
   */
  enabledOn?: {
    /** Page types where the component can be inserted. */
    pages?: PageType[]
    /** Placement groups where the component can be inserted. */
    groups?: Array<'*' | ComponentGroup>
  }
  /**
   * Legacy setting groups shown in Studio.
   * @deprecated Use `settings` instead.
   */
  inspector?: InspectorGroup[]
  /** Maximum number of instances allowed under the same parent. */
  limit?: number
  /** Initial component data and optional child presets. */
  presets?: {
    /** Child components created with the parent. */
    children?: ComponentPresets[]
    /** Additional component setting defaults. */
    // biome-ignore lint/suspicious/noExplicitAny: presets intentionally accept arbitrary component data
    [key: string]: any
  }
  /** Setting groups shown in the Studio inspector. */
  settings?: InspectorGroup[]
  /** Short component title displayed in Studio. */
  title: string
  /** Stable kebab-case component identifier. */
  type: string
}

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

/** Successful schema validation result. */
export type SchemaValidationSuccess<T> = {
  /** Indicates that validation succeeded. */
  readonly success: true
  /** Validated and normalized value. */
  readonly data: T
  /** Successful results never contain issues. */
  readonly issues?: undefined
}

/** Failed schema validation result. */
export type SchemaValidationFailure = {
  /** Indicates that validation failed. */
  readonly success: false
  /** Validation issues found in the input. */
  readonly issues: readonly SchemaValidationIssue[]
  /** Failed results never contain validated data. */
  readonly data?: undefined
}

/** Discriminated result returned by schema validation helpers. */
export type SchemaValidationResult<T> =
  | SchemaValidationSuccess<T>
  | SchemaValidationFailure

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
 * Schema versioning and migration support
 */
export interface VersionedSchema extends SchemaType {
  /** Migration metadata */
  readonly migrations?: {
    /** Source schema version. */
    from: string
    /** Target schema version. */
    to: string
    /** Transforms data from the source version to the target version. */
    migrate: (oldSchema: any) => SchemaType
  }[]
  /** Schema version for future migrations */
  readonly version?: string
}

/** Migration between two schema versions. */
export interface SchemaMigration {
  /** Source schema version. */
  from: string
  /** Transforms data from the source version to the target version. */
  migrate: (oldSchema: any) => SchemaType
  /** Target schema version. */
  to: string
}

/** In-memory registry for schemas and their migrations. */
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
    /** Names of schemas that passed validation. */
    valid: string[]
    /** Registered schemas that failed validation and their issues. */
    invalid: Array<{
      /** Registered schema name. */
      name: string
      /** Validation issues found in the schema. */
      issues: readonly SchemaValidationIssue[]
    }>
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

    // createSchema is an identity function (validation is a dev-only
    // side-effect); return the migrated schema directly to keep this
    // module free of any dependency on ./index.
    return current as SchemaType
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
  prettyPrint: (schema: SchemaType): string => JSON.stringify(schema, null, 2),

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

          const optional = basicInput.defaultValue === undefined ? '' : '?'
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

/** Result returned by lightweight component validation. */
export interface SimpleValidationResult<T = any> {
  /** Validated component metadata when successful. */
  data?: T
  /** Individual validation issue messages. */
  details?: string[]
  /** Human-readable failure summary. */
  error?: string
  /** Whether validation succeeded. */
  success: boolean
}

/** One component that failed bulk validation. */
export interface InvalidComponentResult {
  /** Individual validation issue messages. */
  details?: string[]
  /** Human-readable failure summary. */
  error: string
  /** Registry key of the invalid component. */
  name: string
}

/** Result returned by bulk component validation. */
export interface ComponentsValidationResult {
  /** Components that failed validation. */
  invalid: InvalidComponentResult[]
  /** Whether every evaluated component passed validation. */
  success: boolean
  /** Total number of entries supplied to validation. */
  total: number
  /** Registry keys of valid components. */
  valid: string[]
}

/** Options controlling bulk component validation. */
export interface ComponentValidationOptions {
  /** Whether validation failures should be logged. */
  logErrors?: boolean
  /** Whether null or undefined component entries should be ignored. */
  skipMissing?: boolean
  /** Whether component schemas should be validated. */
  validate?: boolean
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
): ComponentsValidationResult {
  const { skipMissing = false, logErrors = false } = options
  const valid: string[] = []
  const invalid: InvalidComponentResult[] = []

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

/** Aggregate statistics for a component registry. */
export interface ComponentRegistrySummary {
  /** Component types registered more than once. */
  duplicateTypes: string[]
  /** Number of invalid components. */
  invalid: number
  /** Number of supplied components. */
  total: number
  /** Unique registered component types. */
  types: string[]
  /** Number of valid components. */
  valid: number
}

/** Validation and schema details for one registered component. */
export interface ComponentRegistryDetail {
  /** Human-readable validation failure. */
  error?: string
  /** Whether the component defines presets. */
  hasPresets?: boolean
  /** Registry key of the component. */
  name: string
  /** Number of Studio setting groups. */
  settingsCount?: number
  /** Merchant-facing component title. */
  title?: string
  /** Registered component type. */
  type?: string
  /** Whether the component passed validation. */
  valid: boolean
}

/** Result returned by component registry analysis. */
export interface ComponentRegistryAnalysis {
  /** Per-component validation and schema details. */
  details: ComponentRegistryDetail[]
  /** Aggregate registry statistics. */
  summary: ComponentRegistrySummary
}

/** Development helper that analyzes a component registry. */
export function analyzeComponentRegistry(
  components: Record<string, any>
): ComponentRegistryAnalysis {
  const validation = validateComponentsSimple(components)
  const types = new Set<string>()
  const duplicateTypes = new Set<string>()
  const details: ComponentRegistryDetail[] = []

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
