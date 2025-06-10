import { z } from 'zod'

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
      }),
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
      }),
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

export const BasicInputSchema = z.object({
  type: inputTypeSchema,
  name: z
    .string()
    .min(1, 'Name is required')
    .describe(
      'The name of the prop(camelCase) which will be used in the component',
    ),
  label: z.string().optional().describe('The label of the prop'),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  configs: ConfigsPropsSchema.optional(),
  shouldRevalidate: z
    .boolean()
    .optional()
    .describe(
      'Whether to revalidate the prop when the value changes, use for product, product-list, collection, collection-list, blog, metaobject',
    ),
  condition: z
    .union([
      z
        .string()
        .describe(
          'DEPRECATED: String-based conditions are deprecated. Use function-based conditions instead.',
        ),
      z
        .function()
        .args(z.any())
        .returns(z.boolean())
        .describe(
          'Function-based condition that receives component data and returns boolean',
        ),
    ])
    .optional()
    .describe(
      'Condition for conditional rendering. Use function-based conditions: (data) => boolean',
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
        'The title of the child element or the section element, should be short and concise, not include parent element title and any special characters',
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
        "The limit of the element, it's the maximum number of the element, if not set, it's 1",
      ),
    inspector: z
      .array(InspectorGroupSchema)
      .optional()
      .describe('DEPRECATED: Use settings instead. Inspector settings groups'),
    settings: z
      .array(InspectorGroupSchema)
      .optional()
      .describe(
        'The props of the child element, the prop make the element can be customized',
      ),
    childTypes: z
      .array(z.string())
      .optional()
      .describe(
        'Array of child types, that is allowed to be used in the element',
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
            ]),
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
        "The presets of the element, it's the initial state of the element, include the children and it's default props",
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
    'Type must contain only lowercase letters, numbers, and hyphens',
  )
  .refine(
    (val) => !val.startsWith('-') && !val.endsWith('-'),
    'Type cannot start or end with a hyphen',
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

export function createSchema(schema: SchemaType) {
  // Use safeParse for both dev and production - only warn about validation issues
  const result = ElementSchema.safeParse(schema)
  if (!result.success) {
    console.warn('⚠️ Schema validation issues found:', result.error.message)
    console.warn(
      'Using original schema with potential issues. Consider fixing these validation errors:',
    )
    console.warn(JSON.stringify(result.error.issues, null, 2))
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
  // Use safeParse for both dev and production - only warn about validation issues
  const result = ElementSchema.safeParse(schema)
  if (!result.success) {
    console.warn('⚠️ Schema validation issues found:', result.error.message)
    console.warn(
      'Using original schema with potential issues. Consider fixing these validation errors:',
    )
    console.warn(JSON.stringify(result.error.issues, null, 2))
    return schema as SchemaType
  }
  return result.data
}
