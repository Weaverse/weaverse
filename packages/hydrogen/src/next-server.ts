/**
 * Server-only part of the Next.js adapter: the server client that loads pages
 * and theme settings, and the revalidation route handler.
 *
 * @packageDocumentation
 */

export {
  createWeaverseNextRevalidateHandler,
  createWeaverseNextServerClient,
  type WeaverseNextServerClient,
  type WeaverseNextThemeSettingsResponse,
} from '@weaverse/next/server'
