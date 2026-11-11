/**
 * Server-only part of the Next.js adapter: the server client that loads pages
 * and theme settings, and the revalidation route handler.
 *
 * @packageDocumentation
 */

// Types the exports above reference, public now that the adapter lives here.
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
  WeaverseNextRevalidateHandler,
  WeaverseNextRevalidateHandlerConfig,
  WeaverseNextServerClientConfig,
  WeaverseNextServerLoadPageInput,
  WeaverseNextStorefront,
  WeaverseNextThemeSchema,
  WeaverseNextThemeSchemaGroup,
  WeaverseNextThemeSchemaInput,
  WeaverseNextThemeSettingsOptions,
} from './next/server'
export {
  createWeaverseNextRevalidateHandler,
  createWeaverseNextServerClient,
  type WeaverseNextServerClient,
  type WeaverseNextThemeSettingsResponse,
} from './next/server'
