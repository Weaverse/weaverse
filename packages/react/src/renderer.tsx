import type { Weaverse } from '@weaverse/core'
import clsx from 'clsx'
import React, { memo, useEffect, useRef } from 'react'
import { useItemInstance, useWeaverse } from '~/hooks'
import { WeaverseContextProvider, WeaverseItemContext } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'
import { replaceContentDataConnectorsDeep } from './utils/data-connector'

const REACT_VERSION_THRESHOLD = 18
const reactVersion = Number(React.version?.split('.')[0]) || 0

// Create a safe version of useSyncExternalStore that works in both client and server environments
export const useSafeExternalStore = (
  subscribe: any,
  getSnapshot: any,
  getServerSnapshot: any = getSnapshot
) => {
  // In server environment or during SSR, just return the snapshot directly
  if (typeof window === 'undefined') {
    return getServerSnapshot()
  }

  // In client environment, use React.useSyncExternalStore if available (React 18+)
  if (React.useSyncExternalStore) {
    // biome-ignore lint/correctness/useHookAtTopLevel: <$>
    return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  }

  // Fallback for older React versions - just return the current snapshot
  return getSnapshot()
}

/**
 * Determines the root element ID for the Weaverse component tree.
 * Falls back through multiple strategies to ensure a valid root is always found:
 * 1. Use explicit rootId from context.data if available
 * 2. Find the first element with type 'main' in items array
 * 3. Use projectId as final fallback
 */
const getRootId = (context: Weaverse): string => {
  // Strategy 1: Explicit rootId
  if (context.data.rootId) {
    return context.data.rootId
  }

  // Strategy 2: Find main element
  let mainItem = context.data?.items?.find((item) => item.type === 'main')
  if (mainItem?.id) {
    return mainItem.id
  }

  // Strategy 3: Fallback to projectId
  return context.projectId
}
export const WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  const data = useSafeExternalStore(
    context.subscribe,
    context.getSnapShot,
    context.getSnapShot
  )
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    context.contentRootElement = rootRef.current
  }, [context])

  const eventHandlers = context?.studioBridge?.eventHandlers || {}
  const themeClass = context.stitchesInstance.theme.className

  if (context.projectId) {
    return (
      <div
        className={`weaverse-content-root ${themeClass}`}
        {...eventHandlers}
        data-weaverse-project-id={context.projectId}
        data-weaverse-template-id={data.id}
        ref={rootRef}
      >
        <WeaverseContextProvider value={context}>
          <ItemInstance id={getRootId(context)} parentId={''} />
        </WeaverseContextProvider>
      </div>
    )
  }
  return null
})
WeaverseRoot.displayName = 'WeaverseRoot'
const ItemComponent = memo(({ instance }: ItemComponentProps) => {
  const context = useWeaverse()
  const { stitchesInstance, elementRegistry, platformType } = context
  const data = useSafeExternalStore(
    instance.subscribe,
    instance.getSnapShot,
    instance.getSnapShot
  )
  const {
    id,
    type,
    childIds = [],
    children = [],

    createdAt,
    updatedAt,
    deletedAt,
    css,
    __hidden,
    // Need to get rid of this `data` property
    data: _,
    ...rest
  } = data

  // Replace data connectors in all component data (handles strings, objects, and arrays recursively)
  // IMMUTABLE: Process the entire rest object to avoid mutating original content
  const processedRest = replaceContentDataConnectorsDeep(
    rest,
    context.dataContext
  )

  useEffect(() => {
    if (!instance.ref.current) {
      // Fallback `ref` if the element isn't created by `React.forwardRef`
      Object.assign(instance.ref, {
        current: document.querySelector(`[data-wv-id="${id}"]`),
      })
    }
  }, [instance, id])

  if (__hidden) {
    return null
  }

  const Element = elementRegistry.get(type)

  if (Element?.Component) {
    const Component = Element.Component
    Component.displayName = type
    if (
      Component.$$typeof === Symbol.for('react.forward_ref') ||
      reactVersion > REACT_VERSION_THRESHOLD
    ) {
      processedRest.ref = instance.ref
    }
    const childItems = children?.length
      ? children
      : childIds?.length
        ? childIds.map((cid: string) => ({ id: cid }))
        : []

    const renderChildren = childItems.map(
      (item: { id: string }, index: number) => (
        <ItemInstance id={item.id} key={`${item.id}-${index}`} parentId={id} />
      )
    )

    return (
      <Component
        {...processedRest}
        children={renderChildren.length ? renderChildren : undefined}
        className={clsx(
          platformType !== 'shopify-hydrogen' &&
            generateItemClassName(instance, stitchesInstance),
          processedRest.data?.className
        )}
        data-wv-id={id}
        data-wv-type={type}
        key={id}
      />
    )
  }
  instance._store.deleted = true
  return null
})
ItemComponent.displayName = 'WeaverseComponent'

const ItemInstance = memo(
  ({ id, parentId }: { id: string; parentId: string }) => {
    const instance = useItemInstance(id)
    if (!instance) {
      return <div style={{ display: 'none' }}>Item instance {id} not found</div>
    }
    return (
      <WeaverseItemContext.Provider value={{ parentId, id }}>
        <ItemComponent instance={instance} key={id} />
      </WeaverseItemContext.Provider>
    )
  }
)
ItemInstance.displayName = 'WeaverseInstanceProvider'
