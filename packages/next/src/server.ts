/**
 * Server-only Weaverse APIs for Next.js App Router server components and route
 * handlers.
 *
 * When migrating from Hydrogen's `context.weaverse`, create a request-scoped
 * client with {@link createWeaverseNextServerClient}, then call `loadPage()` or
 * `loadThemeSettings()`. Keep rendering providers and components imported from
 * the root `@weaverse/next` entrypoint.
 *
 * @packageDocumentation
 */

export {
  formatWeaverseNextSeoMetadata,
  getWeaverseNextSeoMetadata,
  type NextOpenGraph,
  type NextTwitter,
  type WeaverseNextSeoMetadata,
} from './seo'
export {
  getWeaverseNextConfigs,
  type ResolveConfigsOptions,
} from './server/configs'
export {
  normalizeNextPageUrl,
  resolveRequestUrl,
} from './server/normalize-page-url'
export {
  createWeaverseNextRevalidateHandler,
  type WeaverseNextRevalidateHandlerConfig,
  type WeaverseNextRevalidateRequestBody,
} from './server/revalidate-handler'
export { createWeaverseNextServerClient } from './server/server-client'
export type {
  WeaverseNextBaseConfigs,
  WeaverseNextCacheConfig,
  WeaverseNextClient,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextComponentLoaderArgs,
  WeaverseNextComponentProps,
  WeaverseNextConfigs,
  WeaverseNextCustomPageEntry,
  WeaverseNextFetchCustomPagesOptions,
  WeaverseNextFetchOptions,
  WeaverseNextI18n,
  WeaverseNextLoaderData,
  WeaverseNextLoadPageInput,
  WeaverseNextPageAssignment,
  WeaverseNextPageData,
  WeaverseNextProjectId,
  WeaverseNextRequestContext,
  WeaverseNextServerClient,
  WeaverseNextServerClientConfig,
  WeaverseNextServerLoadPageInput,
  WeaverseNextStorefront,
  WeaverseNextThemeSchema,
  WeaverseNextThemeSchemaGroup,
  WeaverseNextThemeSchemaInput,
  WeaverseNextThemeSettingsOptions,
  WeaverseNextThemeSettingsResponse,
} from './types'
