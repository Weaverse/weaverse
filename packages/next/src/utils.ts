import type { SchemaType } from '@weaverse/schema'

/**
 * Generate default component data from a schema's `settings` inputs.
 *
 * Mirrors Hydrogen's `generateDataFromSchema` (settings → `{ [name]:
 * defaultValue }`) but is kept local so `@weaverse/next` doesn't depend on
 * `@weaverse/hydrogen`. Falls back to the deprecated `inspector` array when a
 * schema predates `settings`.
 */
export function generateDataFromSchema(
  schema: SchemaType | undefined
): Record<string, unknown> {
  let data: Record<string, unknown> = {}
  if (!schema) {
    return data
  }

  let groups =
    (schema.settings as {
      inputs?: { name?: string; defaultValue?: unknown }[]
    }[]) ??
    (schema as { inspector?: typeof groups }).inspector ??
    []

  for (let group of groups) {
    for (let input of group?.inputs ?? []) {
      let { name, defaultValue } = input
      if (name && defaultValue !== null && defaultValue !== undefined) {
        data[name] = defaultValue
      }
    }
  }

  return data
}
