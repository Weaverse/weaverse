import { createSchema, type SchemaType } from '@weaverse/schema'
import type { HTMLAttributes, RefObject } from 'react'
import type { WeaverseNextComponent, WeaverseNextComponentProps } from './types'

/**
 * Default `main` root component.
 *
 * A Weaverse page tree is a flat `items` array with a single root item of type
 * `main` whose `children` are the page's top-level sections. Hydrogen ships its
 * own `main`; the Next adapter provides this minimal, framework-neutral
 * equivalent so consumers don't have to register one just to render a basic
 * page tree (omitting it would leave child sections unrendered).
 *
 * It renders `children` and forwards the Weaverse DOM attributes the shared
 * renderer injects (`data-wv-id`, `data-wv-type`, `ref`, `className`, ...rest)
 * onto the root element. `loaderData` is adapter-internal and stripped so it
 * never lands on the DOM node.
 */
function Main(
  props: WeaverseNextComponentProps & {
    ref?: RefObject<HTMLDivElement | null>
  }
) {
  let { children, loaderData, ...rest } = props
  // `rest` carries the Weaverse-injected DOM attributes (data-wv-*, ref,
  // className). They are all valid div attributes, so the cast is safe.
  return <div {...(rest as HTMLAttributes<HTMLDivElement>)}>{children}</div>
}
Main.displayName = 'main'

/** Schema for the default {@link Main} root component. Type is exactly `main`. */
export const mainSchema: SchemaType = createSchema({
  type: 'main',
  title: 'Main',
})

/**
 * Default `main` component module, registered ahead of user components by
 * {@link registerWeaverseNextComponents}. Kept package-internal — consumers
 * override it simply by registering their own component with `type: 'main'`.
 */
export const defaultMainComponent: WeaverseNextComponent = {
  default: Main,
  schema: mainSchema,
}
