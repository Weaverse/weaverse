/**
 * React bindings of the Weaverse SDK that work in any React framework.
 *
 * Themes import from their framework's entry, such as
 * `@weaverse/hydrogen/react-router`, which re-exports these bindings.
 *
 * @packageDocumentation
 */

export {
  type StudioSelection,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useStudioSelection,
  useWeaverse,
} from '@weaverse/react'
export type { WeaverseComponentProps } from './types'
