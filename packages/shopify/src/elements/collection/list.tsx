import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef } from 'react'
import { CollectionListContext } from '~/context'
import * as Carousel from '~/elements/shared/Carousel'

let CollectionList = forwardRef<HTMLDivElement, any>((props, ref) => {
  let {
    itemsPerSlide,
    itemsSpacing,
    collectionNumber,
    selectedCollections,
    collectionIds,
    collectionHandles,
    children,
    ...rest
  } = props

  let renderContent = () => (
    <Carousel.default itemsPerSlide={itemsPerSlide} gap={itemsSpacing}>
      {selectedCollections.slice(0, collectionNumber).map((c: any) => {
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
    </Carousel.default>
  )
  return (
    <div ref={ref} {...rest}>
      {!selectedCollections ? `Select blog` : renderContent()}
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
  collectionNumber: 12,
  itemsPerSlide: 4,
  itemsSpacing: 4,
}

export let permanentCss: ElementCSS = {
  '@desktop': {
    '& [data-wv-type]:not(:last-child)': {
      marginBottom: 8,
    },
    '& [data-wv-type="collection-box"]': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },

    // carousel
    ...Carousel.css,
  },
}

export default CollectionList
