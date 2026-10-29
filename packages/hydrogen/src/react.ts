/**
 * React bindings of the Weaverse SDK that work in any React framework.
 *
 * Themes import from their framework's entry, such as
 * `@weaverse/hydrogen/react-router`, which re-exports these bindings.
 *
 * @packageDocumentation
 */

export {
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'
export type { WeaverseComponent, WeaverseComponentProps } from './types'
