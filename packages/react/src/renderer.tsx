import clsx from 'clsx'
import * as React from 'react'
import { memo, useEffect, useRef } from 'react'
import { useItemInstance, useWeaverse } from '~/hooks'
import { WeaverseContextProvider, WeaverseItemContext } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'
import { replaceContentDataConnectorsDeep } from './utils/data-connector'

let reactVersion = Number(React.version?.split('.')[0]) || 0

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

export let WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  let data = useSafeExternalStore(
    context.subscribe,
    context.getSnapShot,
    context.getSnapShot
  )
  let rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    context.contentRootElement = rootRef.current
  }, [context])

  let eventHandlers = context?.studioBridge?.eventHandlers || {}
  let themeClass = context.stitchesInstance.theme.className

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
          <ItemInstance
            id={context.data.rootId || context.projectId}
            parentId={''}
          />
        </WeaverseContextProvider>
      </div>
    )
  }
  return null
})
WeaverseRoot.displayName = 'WeaverseRoot'
const ItemComponent = memo(({ instance }: ItemComponentProps) => {
  let context = useWeaverse()
  let { stitchesInstance, elementRegistry, platformType } = context
  let data = useSafeExternalStore(
    instance.subscribe,
    instance.getSnapShot,
    instance.getSnapShot
  )
  let {
    id,
    type,
    childIds = [],
    children = [],
    parentId,
    createdAt,
    updatedAt,
    deletedAt,
    css,
    __hidden,
    // Need to get rid of this `data` property
    data: _,
    content,
    ...rest
  } = data
  // Replace data connectors in content (handles strings, objects, and arrays recursively)
  if (content !== undefined && content !== null) {
    content = replaceContentDataConnectorsDeep(content, context.dataContext)
    rest.content = content
  }

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

  let Element = elementRegistry.get(type)

  if (Element?.Component) {
    let Component = Element.Component
    Component.displayName = type
    if (
      Component.$$typeof === Symbol.for('react.forward_ref') ||
      reactVersion > 18
    ) {
      rest.ref = instance.ref
    }
    let renderChildren = (
      children?.length
        ? children
        : childIds?.length
          ? childIds.map((cid: string) => ({ id: cid }))
          : []
    ).map((item: { id: string }, index: number) => (
      <ItemInstance id={item.id} key={`${item.id}-${index}`} parentId={id} />
    ))

    return (
      <Component
        {...rest}
        children={renderChildren.length ? renderChildren : undefined}
        className={clsx(
          platformType !== 'shopify-hydrogen' &&
            generateItemClassName(instance, stitchesInstance),
          rest.data?.className
        )}
        data-wv-id={id}
        data-wv-type={type}
        key={id}
      />
    )
  }
  instance._store.deleted = true
  console.log(`❌ Unknown element: ${type}`)
  return null
})
ItemComponent.displayName = 'WeaverseComponent'

let ItemInstance = memo(
  ({ id, parentId }: { id: string; parentId: string }) => {
    let instance = useItemInstance(id)
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
