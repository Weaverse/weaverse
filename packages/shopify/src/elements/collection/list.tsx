import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { CollectionListContext } from '../context'

let CollectionList = forwardRef<HTMLDivElement, any>((props, ref) => {
  let {
    itemsPerSlide,
    collectionNumber,
    selectedCollections,
    collectionIds,
    collectionHandles,
    children,
    ...rest
  } = props
  let styles = {
    ['--items-per-slide']: itemsPerSlide,
  } as React.CSSProperties
  return (
    <div ref={ref} {...rest} style={styles}>
      {!selectedCollections
        ? `Select blog`
        : selectedCollections.slice(0, collectionNumber).map((c: any) => {
            return (
              <CollectionListContext.Provider
                key={c.id}
                value={{
                  collectionId: c.id,
                }}
              >
                {children}
              </CollectionListContext.Provider>
            )
          })}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {},
}

CollectionList.defaultProps = {
  selectedCollections: [
    {
      id: 289824702648,
      handle: 'frontpage',
    },
    {
      id: 291152593080,
      handle: 'vans',
    },
    {
      id: 291152658616,
      handle: 'nike',
    },
  ],
  collectionNumber: 4,
  rows: 1,
  itemsPerSlide: 4,
}

export let permanentCss: ElementCSS = {
  '@desktop': {
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--items-per-slide), 1fr)',
    gap: 8,
    '& [data-wv-type]:not(:last-child)': {
      marginBottom: 8,
    },
    '& [data-wv-type="collection-box"]': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
  },
}

export default CollectionList
