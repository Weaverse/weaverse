// biome-ignore-all lint/style/useNamingConvention: manifest JSON uses a stable public field name
/**
 * Build-time component manifest generation for Weaverse themes.
 *
 * @packageDocumentation
 */

import { z } from 'zod/v4'

export type {
  ComponentGroup,
  InputType,
  PageType,
} from './validation.js'

import {
  type BasicInput,
  type ComponentGroup,
  type HeadingInput,
  type Input,
  type InputType,
  inputTypeSchema,
  type PageType,
  PageTypeSchema,
  parseSchema,
  type SchemaType,
} from './validation.js'

const HEX_RADIX = 16
const HEX_BYTE_LENGTH = 2

/** Registered component module data consumed by the manifest generator. */
export interface ComponentManifestSource {
  /** Optional representative component data examples. */
  examples?: unknown[]
  /** Optional loader whose presence is recorded without executing it. */
  loader?: unknown
  /** Component schema, validated before generation. */
  schema: unknown
}

/** JSON primitive accepted by component manifests. */
export type ComponentManifestJsonPrimitive = boolean | null | number | string

/** JSON object accepted by component manifests. */
export interface ComponentManifestJsonObject {
  /** Canonically ordered JSON property. */
  [key: string]: ComponentManifestJsonValue
}

/** JSON value accepted by component manifests. */
export type ComponentManifestJsonValue =
  | ComponentManifestJsonObject
  | ComponentManifestJsonPrimitive
  | ComponentManifestJsonValue[]

/** Source identity binding a manifest to one theme runtime build. */
export interface ComponentManifestProvenance {
  /** Theme or package name. */
  name: string
  /** Exact source or deployment revision. */
  revision: string
  /** Optional human-readable theme version. */
  version?: string
}

/** Manifest generator options. */
export interface GenerateComponentManifestOptions {
  /** Identity of the theme runtime represented by the manifest. */
  source: ComponentManifestProvenance
}

/** Marker for a rule that must be evaluated by the theme runtime. */
export interface ComponentManifestDynamicRule {
  /** Indicates that the rule must be evaluated by the theme runtime. */
  dynamic: true
}

/** Serializable setting condition metadata. */
export type ComponentManifestCondition = string | ComponentManifestDynamicRule

/** Serializable component availability metadata. */
export interface ComponentManifestAvailability {
  /** Static availability or an exact-runtime validation marker. */
  enabled?: boolean | ComponentManifestDynamicRule
  /** Legacy placement groups where the component may be inserted. */
  groups?: Array<'*' | ComponentGroup>
  /** Legacy page types where the component may be inserted. */
  pages?: PageType[]
}

/** Serializable configurable input in a component manifest. */
export interface ComponentManifestBasicInput {
  /** Condition controlling whether Studio displays the input. */
  condition?: ComponentManifestCondition
  /** Control-specific options and constraints. */
  configs?: ComponentManifestJsonValue
  /** Initial value, omitted for sensitive or server-only inputs. */
  defaultValue?: ComponentManifestJsonValue
  /** Supporting guidance shown below the control. */
  helpText?: string
  /** Merchant-facing field label. */
  label?: string
  /** Component prop name receiving the configured value. */
  name: string
  /** Placeholder shown by text-like controls. */
  placeholder?: string
  /** Whether this sensitive or server-only setting is omitted from agent-facing data. */
  sensitive?: boolean
  /** Whether changing this value reruns the component loader. */
  shouldRevalidate?: boolean
  /** Studio control used to edit the property. */
  type: InputType
}

/** Serializable organizational heading in a component manifest. */
export interface ComponentManifestHeadingInput {
  /** Text displayed above the following settings. */
  label: string
  /** Heading discriminator. */
  type: 'heading'
}

/** Serializable setting or organizational heading. */
export type ComponentManifestInput =
  | ComponentManifestBasicInput
  | ComponentManifestHeadingInput

/** Serializable group of component settings. */
export interface ComponentManifestSettingGroup {
  /** Group title displayed in Studio. */
  group: string
  /** Inputs in author-defined display order. */
  inputs: ComponentManifestInput[]
}

/** Minimal generated contract for one registered component. */
export interface ComponentManifestEntry {
  /** Static and dynamic component availability metadata. */
  availability?: ComponentManifestAvailability
  /** Component types allowed as direct children, in author-defined order. */
  childTypes?: string[]
  /** Optional representative component data examples. */
  examples?: ComponentManifestJsonValue[]
  /** Whether the registered component exports a loader. */
  hasLoader: boolean
  /** Maximum number of instances allowed under the same parent. */
  limit?: number
  /** Canonical initial component data and child presets. */
  presets?: ComponentManifestJsonObject
  /** Component settings in author-defined display order. */
  settings?: ComponentManifestSettingGroup[]
  /** Short component title displayed in Studio. */
  title: string
  /** Stable component type identifier. */
  type: string
}

/** Versioned machine-readable component manifest. */
export interface ComponentManifest {
  /** Components sorted by stable type. */
  components: ComponentManifestEntry[]
  /** Theme runtime represented by this manifest. */
  source: ComponentManifestProvenance
  /** Component manifest contract version. */
  version: 1
}

let componentManifestJsonValueSchema = z.json()
let componentManifestDynamicRuleSchema = z.strictObject({
  dynamic: z.literal(true),
})
let componentManifestConditionSchema = z.union([
  z.string(),
  componentManifestDynamicRuleSchema,
])
let componentManifestBasicInputSchema = z.strictObject({
  type: inputTypeSchema,
  name: z.string(),
  label: z.string().optional(),
  helpText: z.string().optional(),
  placeholder: z.string().optional(),
  configs: componentManifestJsonValueSchema.optional(),
  defaultValue: componentManifestJsonValueSchema.optional(),
  condition: componentManifestConditionSchema.optional(),
  sensitive: z.boolean().optional(),
  shouldRevalidate: z.boolean().optional(),
})
let componentManifestHeadingInputSchema = z.strictObject({
  type: z.literal('heading'),
  label: z.string(),
})
let componentManifestSettingGroupSchema = z.strictObject({
  group: z.string(),
  inputs: z.array(
    z.union([
      componentManifestBasicInputSchema,
      componentManifestHeadingInputSchema,
    ])
  ),
})
let componentManifestAvailabilitySchema = z.strictObject({
  enabled: z
    .union([z.boolean(), componentManifestDynamicRuleSchema])
    .optional(),
  pages: z.array(PageTypeSchema).optional(),
  groups: z
    .array(
      z.union([
        z.literal('*'),
        z.literal('body'),
        z.literal('header'),
        z.literal('footer'),
      ])
    )
    .optional(),
})
let componentManifestEntrySchema = z.strictObject({
  type: z.string(),
  title: z.string(),
  hasLoader: z.boolean(),
  childTypes: z.array(z.string()).optional(),
  limit: z.number().optional(),
  availability: componentManifestAvailabilitySchema.optional(),
  settings: z.array(componentManifestSettingGroupSchema).optional(),
  presets: z.record(z.string(), componentManifestJsonValueSchema).optional(),
  examples: z.array(componentManifestJsonValueSchema).optional(),
})
let componentManifestProvenanceSchema = z.strictObject({
  name: z.string().min(1),
  revision: z.string().min(1),
  version: z.string().min(1).optional(),
})

/** Runtime validator for version-one component manifests. */
export const ComponentManifestSchema = z.strictObject({
  version: z.literal(1),
  source: componentManifestProvenanceSchema,
  components: z.array(componentManifestEntrySchema),
})

/** Public JSON Schema document for a component manifest. */
export interface ComponentManifestJsonSchema {
  /** Stable identifier for the versioned JSON Schema. */
  readonly $id: string
  /** Standard JSON Schema keyword. */
  readonly [keyword: string]: unknown
}

/** JSON Schema for version-one component manifests. */
export const componentManifestJsonSchema: ComponentManifestJsonSchema = {
  ...z.toJSONSchema(ComponentManifestSchema),
  $id: 'https://weaverse.io/schemas/component-manifest/v1.json',
}

/** Generated manifest together with its canonical bytes and digest. */
export interface ComponentManifestArtifact {
  /** SHA-256 digest of {@link ComponentManifestArtifact.json}. */
  hash: `sha256:${string}`
  /** Canonical JSON with one trailing newline. */
  json: string
  /** Typed manifest object. */
  manifest: ComponentManifest
}

function compareUtf16CodeUnits(left: string, right: string): number {
  if (left < right) {
    return -1
  }
  if (left > right) {
    return 1
  }
  return 0
}

function optional<T>(key: string, value: T | undefined) {
  return value === undefined ? {} : { [key]: value }
}

function toJsonValue(
  value: unknown,
  path: string,
  ancestors = new WeakSet<object>()
): ComponentManifestJsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value !== 'object') {
    throw new TypeError(`Non-JSON value at ${path}`)
  }
  if (ancestors.has(value)) {
    throw new TypeError(`Cyclic value at ${path}`)
  }

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        toJsonValue(item, `${path}[${index}]`, ancestors)
      )
    }
    if (
      Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null
    ) {
      throw new TypeError(`Non-JSON value at ${path}`)
    }

    let result: ComponentManifestJsonObject = {}
    for (let key of Object.keys(value).sort()) {
      Object.defineProperty(result, key, {
        value: toJsonValue(
          (value as Record<string, unknown>)[key],
          `${path}.${key}`,
          ancestors
        ),
        enumerable: true,
        configurable: true,
        writable: true,
      })
    }
    return result
  } finally {
    ancestors.delete(value)
  }
}

function getSchemaSettingGroups(schema: SchemaType) {
  return [...(schema.settings ?? []), ...(schema.inspector ?? [])]
}

function getSensitiveSettingNames(schema: SchemaType): Set<string> {
  let names = new Set<string>()
  for (let { inputs } of getSchemaSettingGroups(schema)) {
    for (let input of inputs) {
      if (input.type !== 'heading' && input.sensitive) {
        names.add(input.name)
      }
    }
  }
  return names
}

interface OmitSensitiveSettingsOptions {
  ancestors?: WeakSet<object>
  names: Set<string>
  path: string
  resolvePresetChildren?: boolean
  schemasByType: Map<string, SchemaType>
}

function omitSensitiveSettings(
  value: unknown,
  {
    ancestors = new WeakSet<object>(),
    names,
    path,
    resolvePresetChildren = false,
    schemasByType,
  }: OmitSensitiveSettingsOptions
): unknown {
  if (!value || typeof value !== 'object') {
    return value
  }
  if (ancestors.has(value)) {
    return value
  }

  ancestors.add(value)
  try {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        omitSensitiveSettings(item, {
          ancestors,
          names,
          path: `${path}[${index}]`,
          resolvePresetChildren: false,
          schemasByType,
        })
      )
    }

    let valueType = 'type' in value ? value.type : undefined
    let registeredSchema =
      typeof valueType === 'string' ? schemasByType.get(valueType) : undefined
    let scopedNames = new Set(names)
    if (registeredSchema) {
      for (let name of getSensitiveSettingNames(registeredSchema)) {
        scopedNames.add(name)
      }
    }
    let result: Record<string, unknown> = {}
    for (let [key, item] of Object.entries(value)) {
      if (scopedNames.has(key)) {
        continue
      }

      let redactedItem: unknown
      if (resolvePresetChildren && key === 'children' && Array.isArray(item)) {
        redactedItem = item.map((child, index) => {
          let childType =
            child && typeof child === 'object' && 'type' in child
              ? child.type
              : undefined
          if (typeof childType !== 'string') {
            throw new TypeError(
              `Invalid preset child at ${path}.children[${index}]`
            )
          }
          let childSchema = schemasByType.get(childType)
          if (!childSchema) {
            throw new TypeError(
              `Unknown preset child type at ${path}.children[${index}]: ${childType}`
            )
          }
          return omitSensitiveSettings(child, {
            ancestors,
            names: getSensitiveSettingNames(childSchema),
            path: `${path}.children[${index}]`,
            resolvePresetChildren,
            schemasByType,
          })
        })
      } else {
        redactedItem = omitSensitiveSettings(item, {
          ancestors,
          names: scopedNames,
          path: `${path}.${key}`,
          resolvePresetChildren: false,
          schemasByType,
        })
      }
      Object.defineProperty(result, key, {
        value: redactedItem,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    }
    return result
  } finally {
    ancestors.delete(value)
  }
}

function toManifestInput(
  input: Input,
  path: string,
  sensitiveNames: Set<string>
): ComponentManifestInput {
  if (input.type === 'heading') {
    let headingInput = input as HeadingInput
    return { type: headingInput.type, label: headingInput.label }
  }

  let basicInput = input as BasicInput
  let sensitive = basicInput.sensitive || sensitiveNames.has(basicInput.name)
  return {
    type: basicInput.type,
    name: basicInput.name,
    ...optional('label', basicInput.label),
    ...optional('helpText', basicInput.helpText),
    ...optional('placeholder', basicInput.placeholder),
    ...optional(
      'configs',
      basicInput.configs === undefined
        ? undefined
        : toJsonValue(basicInput.configs, `${path}.configs`)
    ),
    ...(sensitive
      ? {}
      : optional(
          'defaultValue',
          basicInput.defaultValue === undefined
            ? undefined
            : toJsonValue(basicInput.defaultValue, `${path}.defaultValue`)
        )),
    ...optional(
      'condition',
      typeof basicInput.condition === 'function'
        ? { dynamic: true }
        : basicInput.condition
    ),
    ...(sensitive ? { sensitive: true } : {}),
    ...optional('shouldRevalidate', basicInput.shouldRevalidate),
  }
}

/**
 * Generates a deterministic component manifest without executing component code.
 *
 * @param components - Registered component modules to describe.
 * @param options - Theme runtime provenance.
 * @returns The typed manifest, canonical JSON, and SHA-256 digest.
 */
export async function generateComponentManifest(
  components: ComponentManifestSource[],
  options: GenerateComponentManifestOptions
): Promise<ComponentManifestArtifact> {
  let validatedComponents = components.map((component, index) => {
    try {
      return { ...component, schema: parseSchema(component.schema) }
    } catch (error) {
      throw new Error(`Invalid component schema at components[${index}]`, {
        cause: error,
      })
    }
  })
  let componentTypes = new Set<string>()
  for (let { schema } of validatedComponents) {
    if (componentTypes.has(schema.type)) {
      throw new Error(`Duplicate component type: ${schema.type}`)
    }
    componentTypes.add(schema.type)
  }

  let schemasByType = new Map(
    validatedComponents.map(({ schema }) => [schema.type, schema])
  )
  let manifest: ComponentManifest = {
    version: 1,
    source: {
      name: options.source.name,
      revision: options.source.revision,
      ...optional('version', options.source.version),
    },
    components: validatedComponents
      .sort((left, right) =>
        compareUtf16CodeUnits(left.schema.type, right.schema.type)
      )
      .map(({ examples, loader, schema }, componentIndex) => {
        let settingGroups = getSchemaSettingGroups(schema)
        let sensitiveSettings = getSensitiveSettingNames(schema)
        return {
          type: schema.type,
          title: schema.title,
          hasLoader: typeof loader === 'function',
          ...optional(
            'childTypes',
            schema.childTypes && [...schema.childTypes]
          ),
          ...optional('limit', schema.limit),
          ...optional(
            'availability',
            schema.enabled !== undefined || schema.enabledOn
              ? {
                  ...optional(
                    'enabled',
                    typeof schema.enabled === 'function'
                      ? { dynamic: true }
                      : schema.enabled
                  ),
                  ...optional('pages', schema.enabledOn?.pages),
                  ...optional('groups', schema.enabledOn?.groups),
                }
              : undefined
          ),
          ...optional(
            'settings',
            schema.settings !== undefined || schema.inspector !== undefined
              ? settingGroups.map(({ group, inputs }, groupIndex) => ({
                  group,
                  inputs: inputs.map((input, inputIndex) =>
                    toManifestInput(
                      input,
                      `components[${componentIndex}].settings[${groupIndex}].inputs[${inputIndex}]`,
                      sensitiveSettings
                    )
                  ),
                }))
              : undefined
          ),
          ...optional(
            'presets',
            schema.presets === undefined
              ? undefined
              : (toJsonValue(
                  omitSensitiveSettings(schema.presets, {
                    names: sensitiveSettings,
                    path: `components[${componentIndex}].presets`,
                    resolvePresetChildren: true,
                    schemasByType,
                  }),
                  `components[${componentIndex}].presets`
                ) as ComponentManifestJsonObject)
          ),
          ...optional(
            'examples',
            examples?.map((example, exampleIndex) =>
              toJsonValue(
                omitSensitiveSettings(example, {
                  names: sensitiveSettings,
                  path: `components[${componentIndex}].examples[${exampleIndex}]`,
                  schemasByType,
                }),
                `components[${componentIndex}].examples[${exampleIndex}]`
              )
            )
          ),
        }
      }),
  }
  let validation = ComponentManifestSchema.safeParse(manifest)
  if (!validation.success) {
    throw new Error('Invalid component manifest', { cause: validation.error })
  }
  let json = `${JSON.stringify(manifest, null, 2)}\n`
  let digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(json)
  )
  let hex = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(HEX_RADIX).padStart(HEX_BYTE_LENGTH, '0')
  ).join('')

  return {
    manifest,
    json,
    hash: `sha256:${hex}`,
  }
}
