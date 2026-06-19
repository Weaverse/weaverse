'use client'

import { Weaverse, WeaverseRoot } from '@weaverse/react'
import { memo, useContext, useMemo } from 'react'
import { WeaverseNextContext } from './provider'
import type {
  WeaverseNextClient,
  WeaverseNextLoaderData,
  WeaverseNextPageData,
} from './types'

const EMPTY_DATA_CONTEXT: Record<string, unknown> = {}

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
export const WeaverseNextRenderer = memo(function WeaverseNextRendererComponent(
  props: WeaverseNextRendererProps
) {
  let context = useContext(WeaverseNextContext)
  let client = props.client ?? context?.client
  let data = props.data ?? client?.data ?? null
  let dataContext =
    props.dataContext ?? client?.dataContext ?? EMPTY_DATA_CONTEXT

  let page = useMemo(() => getRenderablePage(data), [data])

  let weaverse = useMemo(() => {
    if (!page) {
      return null
    }

    let instance = new Weaverse({
      projectId: client?.projectId || page.id || 'weaverse-next',
      data: page,
    })
    instance.dataContext = dataContext
    instance.isDesignMode = client?.requestContext?.isDesignMode ?? false
    return instance
  }, [
    client?.projectId,
    client?.requestContext?.isDesignMode,
    page,
    dataContext,
  ])

  if (!weaverse) {
    return null
  }

  return <WeaverseRoot context={weaverse} />
})
