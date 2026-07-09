// Server entrypoint for `@weaverse/next/server`.
//
// Exposes the server-side Weaverse client that performs the real Weaverse
// public API fetch (page + theme settings) from Next.js App Router routes and
// server components — the equivalent of Hydrogen's
// `context.weaverse.loadPage(...)` pattern. Kept on a dedicated subpath so the
// root `@weaverse/next` entry stays free of server-only fetch assumptions.

export {
  formatWeaverseNextSeoMetadata,
  getWeaverseNextSeoMetadata,
  type WeaverseNextSeoMetadata,
} from './seo'
export { getWeaverseNextConfigs } from './server/configs'
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
