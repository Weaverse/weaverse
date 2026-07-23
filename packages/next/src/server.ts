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
  WeaverseNextConfigs,
  WeaverseNextCustomPageEntry,
  WeaverseNextFetchCustomPagesOptions,
  WeaverseNextFetchOptions,
  WeaverseNextProjectId,
  WeaverseNextServerClient,
  WeaverseNextServerClientConfig,
  WeaverseNextServerLoadPageInput,
  WeaverseNextThemeSettingsOptions,
  WeaverseNextThemeSettingsResponse,
} from './types'
