/**
 * Framework-independent core of the Weaverse SDK for Hydrogen storefronts:
 * component and theme schemas, data helpers, translations and shared types.
 *
 * Themes import from their framework's entry, such as
 * `@weaverse/hydrogen/react-router`, which re-exports this core.
 *
 * @packageDocumentation
 */

export { isBrowser, isIframe } from '@weaverse/react'
export {
  type BasicInput,
  createSchema,
  IMAGES_PLACEHOLDERS,
  type InspectorGroup,
  type PageType,
  type SchemaType,
} from '@weaverse/schema'
export type { TranslateFunction } from './hooks/translation-context'
export {
  type WeaverseBlog,
  type WeaverseCollection,
  type WeaverseComponentLoaderArgs,
  type WeaverseComponentSchema,
  WeaverseError,
  type WeaverseI18n,
  type WeaverseImage,
  WeaverseLoadError,
  type WeaverseLoaderData,
  type WeaverseLoadFailureKind,
  type WeaverseMetaObject,
  type WeaverseProduct,
  type WeaverseThemeSchema,
  type WeaverseThemeSettingsResponse,
  type WeaverseVideo,
} from './types'
export { generateDataFromSchema } from './utils'
export { getNestedKey } from './utils/nested-key'
export { TranslationStore } from './utils/translation-store'
