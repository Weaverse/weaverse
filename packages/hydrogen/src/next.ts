/**
 * Next.js App Router adapter of the Weaverse SDK: the client factory, root and
 * page providers, renderer and Studio connection. Re-exports the core and the
 * React bindings, so a Next.js storefront imports client and shared code from
 * this entry and server-only code from `@weaverse/hydrogen/next/server`.
 *
 * @packageDocumentation
 */

export {
  type BasicInput,
  createSchema,
  IMAGES_PLACEHOLDERS,
  type InspectorGroup,
  type PageType,
  type SchemaType,
} from '@weaverse/schema'
export type * from './index'
// Server Components import this entry (root layouts, section schemas), so no
// runtime value here may load `@weaverse/react`, whose module scope calls
// `createContext`. Hooks and stores come from the Next adapter in `./next`, whose
// client code is built as its own 'use client' file (`vite.config.ts`);
// the rest comes from `@weaverse/schema` and React-free local modules, and the
// core and React entries contribute types only. `package:check` guards this.
export {
  buildWeaverseNextRequestInfo,
  createWeaverseNextClient,
  isBrowser,
  isIframe,
  type StudioSelection,
  TranslationProvider,
  TranslationStore,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useStudioSelection,
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
} from './next/index'
export type { WeaverseComponentProps } from './types'
export { WeaverseError, WeaverseLoadError } from './types'
export { generateDataFromSchema } from './utils'
export { getNestedKey } from './utils/nested-key'
