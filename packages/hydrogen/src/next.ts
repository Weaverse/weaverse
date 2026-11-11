/**
 * Next.js App Router adapter of the Weaverse SDK: the client factory, root and
 * page providers, renderer and Studio connection. Re-exports the core and the
 * React bindings, so a Next.js storefront imports client and shared code from
 * this entry and server-only code from `@weaverse/hydrogen/next/server`.
 *
 * @packageDocumentation
 */

// Server Components import this entry (root layouts, section schemas), so no
// runtime value here may load `@weaverse/react`, whose module scope calls
// `createContext`. Hooks and stores come from the Next adapter itself, which
// keeps React behind its own 'use client' boundary and shares its contexts;
// the rest comes from `@weaverse/schema` and React-free local modules, and the
// core and React entries contribute types only. `useStudioSelection` waits for
// the `@weaverse/next` release that exports it. `package:check` guards this.
export {
  buildWeaverseNextRequestInfo,
  createWeaverseNextClient,
  isBrowser,
  isIframe,
  TranslationProvider,
  TranslationStore,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useThemeSettings,
  useTranslation,
  useWeaverse,
  type WeaverseNextComponent,
  type WeaverseNextI18n,
  type WeaverseNextLoaderData,
  WeaverseNextProvider,
  WeaverseNextRenderer,
  type WeaverseNextRequestContext,
  WeaverseNextRootProvider,
  WeaverseNextStudioConnect,
  type WeaverseNextThemeSchema,
  type WeaverseNextThemeSchemaGroup,
} from '@weaverse/next'
export type { StudioSelection } from '@weaverse/react'
export {
  type BasicInput,
  createSchema,
  IMAGES_PLACEHOLDERS,
  type InspectorGroup,
  type PageType,
  type SchemaType,
} from '@weaverse/schema'
export type * from './index'
export type { WeaverseComponentProps } from './types'
export { WeaverseError, WeaverseLoadError } from './types'
export { generateDataFromSchema } from './utils'
export { getNestedKey } from './utils/nested-key'
