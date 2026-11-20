/**
 * Framework-agnostic runtime, element state, and shared types for Weaverse SDKs.
 *
 * @packageDocumentation
 */

export * from './core'
export type { IconName } from './icon-name'
// Type-only today; `export *` keeps any future runtime export public.
// oxlint-disable-next-line typescript/consistent-type-exports
export * from './types'
export * from './utils'
export type { AnyFunction } from './utils/event-emitter'
