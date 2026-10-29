/**
 * Next.js App Router adapter of the Weaverse SDK: the client factory, root and
 * page providers, renderer and Studio connection. Re-exports the core and the
 * React bindings, so a Next.js storefront imports client and shared code from
 * this entry and server-only code from `@weaverse/hydrogen/next/server`.
 *
 * @packageDocumentation
 */

// Hooks and stores come from the Next adapter itself so they share its React
// contexts; these named exports take precedence over the star re-exports.
export {
  buildWeaverseNextRequestInfo,
  createWeaverseNextClient,
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
export * from './index'
export * from './react'
