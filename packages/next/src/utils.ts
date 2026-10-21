import type { SchemaType } from '@weaverse/schema'
import type { WeaverseNextThemeSchema } from './types'

/**
 * Generate default component data from a schema's `settings` inputs.
 *
 * Mirrors Hydrogen's `generateDataFromSchema` (settings → `{ [name]:
 * defaultValue }`) but is kept local so `@weaverse/next` doesn't depend on
 * `@weaverse/hydrogen`. Falls back to the deprecated `inspector` array when a
 * schema predates `settings`.
 *
 * @category Utilities
 */
export function generateDataFromSchema(
  schema: SchemaType | WeaverseNextThemeSchema | undefined
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

/**
 * Whether the code runs in a browser window.
 *
 * Defined here rather than re-exported from `@weaverse/react`, which sits
 * behind the `'use client'` boundary: there a Server Component would receive a
 * client reference, a truthy object, instead of `false`.
 *
 * @category Utilities
 */
export let isBrowser = typeof window !== 'undefined'

/**
 * Whether the code runs in a browser window embedded in an iframe.
 *
 * @category Utilities
 */
export let isIframe = isBrowser && window.top !== window.self
