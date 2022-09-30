import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { CollectionListContext } from '../context'

let CollectionList = forwardRef<HTMLDivElement, any>((props, ref) => {
  let { itemsPerSlide, collectionNumber, collectionIds, children, ...rest } =
    props
  let styles = {
    ['--items-per-slide']: itemsPerSlide,
  } as React.CSSProperties
  return (
    <div ref={ref} {...rest} style={styles}>
      {!collectionIds
        ? `Select blog`
        : collectionIds
            .slice(0, collectionNumber)
            .map((collectionId: number) => {
              return (
                <CollectionListContext.Provider
                  key={collectionId}
                  value={{
                    collectionId,
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
  collectionIds: [289824702648, 291152593080, 291152658616],
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
