'use client'

import { Weaverse, WeaverseRoot } from '@weaverse/react'
import { memo, useContext } from 'react'
import { ensureNextItemConstructor } from './item'
import { WeaverseNextContext } from './provider'
import type {
  WeaverseNextClient,
  WeaverseNextComponent,
  WeaverseNextLoaderData,
  WeaverseNextPageData,
} from './types'

/**
 * Component lists already pushed into the element registry. Registration is
 * idempotent, but walking the full list allocates on every render — theme
 * component arrays are module-level constants, so register each identity once.
 */
const registeredComponentLists = new WeakSet<WeaverseNextComponent[]>()

function registerComponents(components: WeaverseNextComponent[]) {
  if (registeredComponentLists.has(components)) {
    return
  }
  for (let component of components) {
    if (component?.schema?.type) {
      Weaverse.registerElement({
        type: component.schema.type,
        Component: component.default,
        schema: component.schema,
        loader: component.loader,
      })
    }
  }
  registeredComponentLists.add(components)
}

function getRenderablePage(
  data: WeaverseNextLoaderData | null | undefined
): (WeaverseNextPageData & { rootId: string }) | null {
  let page = data?.page
  if (!page) {
    return null
  }
  let rootId =
    page.rootId ??
    page.items.find((item) => item.type === 'main')?.id ??
    page.items[0]?.id ??
    page.id
  return { ...page, rootId }
}

export interface WeaverseNextRendererProps {
  /** Client to render from. Defaults to the provider's client. */
  client?: WeaverseNextClient
  /** Component registry override. Defaults to `client.components`. */
  components?: WeaverseNextComponent[]
  /** Page payload to render. Defaults to `client.data`. */
  data?: WeaverseNextLoaderData | null
  /** Data-connector context for `{{...}}` template replacement. */
  dataContext?: Record<string, unknown>
}

/**
 * Render a serialized Weaverse page tree through `@weaverse/react` primitives.
 *
 * Reads the client/page data from {@link WeaverseNextContext} when no props are
 * passed, or accepts an explicit `client` + `data` for standalone use. Builds a
 * framework-neutral `Weaverse` core instance (no React Router hooks) and hands
 * it to the shared `WeaverseRoot`.
 */
export const WeaverseNextRenderer = memo(function WeaverseNextRenderer(
  props: WeaverseNextRendererProps
) {
  let context = useContext(WeaverseNextContext)
  let client = props.client ?? context?.client
  let data = props.data ?? client?.data ?? null
  let components = props.components ?? client?.components ?? []
  let dataContext = props.dataContext ?? client?.dataContext ?? {}

  // Mirror Hydrogen: register components before constructing items so the item
  // store can read each element's schema during creation.
  ensureNextItemConstructor()
  registerComponents(components)

  let page = getRenderablePage(data)
  if (!page) {
    return null
  }

  let weaverse = new Weaverse({
    projectId: client?.projectId || page.id || 'weaverse-next',
    data: page,
  })
  weaverse.dataContext = dataContext
  weaverse.isDesignMode = client?.requestContext?.isDesignMode ?? false

  return <WeaverseRoot context={weaverse} />
})
