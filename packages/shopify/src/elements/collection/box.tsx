import React, { forwardRef, useContext } from 'react'
import { CollectionContext, CollectionListContext } from '~/context'
import type { ElementCSS } from '@weaverse/core'
import type { CollectionBoxProps } from '~/types'
import { WeaverseContext } from '@weaverse/react'
import { weaverseShopifyCollections } from '~/proxy'

let CollectionBox = forwardRef<HTMLDivElement, CollectionBoxProps>(
  (props, ref) => {
    let { children, collectionId: cId, ...rest } = props
    let { collectionId: collectionAutoId } = useContext(CollectionListContext)
    let { ssrMode } = useContext(WeaverseContext)
    let collectionId = collectionAutoId || cId
    let collectionLiquid = `{% assign wv_collection = collection_${collectionId} %}`
    let collection = weaverseShopifyCollections[collectionId]
    return (
      <div {...rest} ref={ref} key={collectionId}>
        {ssrMode && collectionLiquid}
        {collectionId ? (
          <CollectionContext.Provider
            value={{
              collection,
              collectionId,
            }}
          >
            {children}
          </CollectionContext.Provider>
        ) : (
          'Select a collection and start editing.'
        )}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {},
}

export let permanentCss: ElementCSS = {
  '@desktop': {
    display: 'flex',
  },
}

CollectionBox.defaultProps = {
  collectionId: undefined,
}

export default CollectionBox
