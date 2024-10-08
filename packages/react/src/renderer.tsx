import clsx from 'clsx'
import React, { memo, useEffect, useRef, useSyncExternalStore } from 'react'

import { WeaverseContextProvider, WeaverseItemContext } from './context'
import type { ItemComponentProps, WeaverseRootPropsType } from './types'
import { generateItemClassName } from './utils/css'

import { useItemInstance, useWeaverse } from '~/hooks'

let reactVersion = Number(React.version.split('.')[0])

export let WeaverseRoot = memo(({ context }: WeaverseRootPropsType) => {
  let data = useSyncExternalStore(
    context.subscribe,
    context.getSnapShot,
    context.getSnapShot,
  )
  let rootRef = useRef<HTMLElement>()

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
        ref={rootRef}
        data-weaverse-project-id={context.projectId}
        data-weaverse-template-id={data.id}
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

const ItemComponent = memo(({ instance }: ItemComponentProps) => {
  let context = useWeaverse()
  let { stitchesInstance, elementRegistry, platformType } = context
  let data = useSyncExternalStore(
    instance.subscribe,
    instance.getSnapShot,
    instance.getSnapShot,
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
    ...rest
  } = data

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
      <ItemInstance key={`${item.id}-${index}`} id={item.id} parentId={id} />
    ))

    return (
      <Component
        {...rest}
        key={id}
        data-wv-type={type}
        data-wv-id={id}
        className={clsx(
          platformType !== 'shopify-hydrogen' &&
            generateItemClassName(instance, stitchesInstance),
          rest.data?.className,
        )}
        // biome-ignore lint/correctness/noChildrenProp: <explanation>
        children={renderChildren.length ? renderChildren : undefined}
      />
    )
  }
  instance._store.deleted = true
  console.log(`❌ Unknown element: ${type}`)
  return null
})

let ItemInstance = memo(
  ({ id, parentId }: { id: string; parentId: string }) => {
    let instance = useItemInstance(id)
    if (!instance) {
      return <div style={{ display: 'none' }}>Item instance {id} not found</div>
    }
    return (
      <WeaverseItemContext.Provider value={{ parentId, id }}>
        <ItemComponent key={id} instance={instance} />
      </WeaverseItemContext.Provider>
    )
  },
)
