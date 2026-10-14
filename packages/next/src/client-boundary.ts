/**
 * Everything in the root entry that must run as client code.
 *
 * These exports render components, call hooks, or reach `@weaverse/react`,
 * which creates React contexts at module scope. The build emits this module as
 * its own file under a `'use client'` banner, so a Server Component that
 * imports `@weaverse/next` gets client references for them instead of
 * evaluating `createContext` on the server. The root entry re-exports them by
 * name next to its server-safe exports.
 */

export {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'
export { createWeaverseNextClient } from './client'
export {
  useThemeSettings,
  useWeaverseCommerce,
  useWeaversePageData,
  useWeaverseRootData,
} from './hooks'
export { WeaverseNextProvider } from './provider'
export { WeaverseNextRenderer } from './renderer'
export { WeaverseNextRootProvider } from './root-provider'
export {
  bindWeaverseNextStudioRuntime,
  createWeaverseNextRuntime,
  WeaverseNextRuntime,
} from './runtime'
export { WeaverseNextStudioBridge } from './studio-bridge'
export {
  loadWeaverseNextStudioScript,
  WeaverseNextStudioConnect,
} from './studio-connect'
export {
  createTranslate,
  getNestedKey,
  interpolate,
  ThemeTextProvider,
  TranslationProvider,
  useThemeText,
  useTranslation,
} from './translation-context'
export {
  useWeaverseNextStudioInternals,
  WeaverseNextStudio,
} from './use-weaverse-next-studio'
