import React, { forwardRef, useContext } from 'react'
import {
  CollectionContext,
  CollectionListContext,
  weaverseShopifyCollections,
} from '../context'
import type { ElementCSS } from '@weaverse/core'
import type { CollectionBoxProps } from '~/types'

let CollectionBox = forwardRef<HTMLDivElement, CollectionBoxProps>(
  (props, ref) => {
    let { children, collectionId: cId, ...rest } = props
    let { collectionId: collectionAutoId } = useContext(CollectionListContext)
    let collectionId = collectionAutoId || cId
    let collection = weaverseShopifyCollections[collectionId]
    return (
      <div {...rest} ref={ref} key={collectionId}>
        {collectionId ? (
          <CollectionContext.Provider
            value={{
              collection,
              collectionId,
            }}
          >
            {collection && children}
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
