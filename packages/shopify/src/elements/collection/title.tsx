import React, { forwardRef, useContext } from 'react'
import { CollectionContext } from '~/elements/context'
import { WeaverseContext } from '@weaverse/react'
import type { ElementCSS } from '@weaverse/core'

let CollectionTitle = forwardRef<HTMLDivElement, any>((props, ref) => {
  let { htmlTag, linkCollection, ...rest } = props
  let { ssrMode } = useContext(WeaverseContext)
  let { collection, collectionId } = useContext(CollectionContext)
  console.info('9779  collection in title ', collection, props)
  let content = (
    <span>
      {ssrMode ? `{{ collection_${collectionId}.title }}` : collection?.title}
    </span>
  )
  if (linkCollection) {
    content = (
      <a href={`/${collection.handle}`}>
        {ssrMode ? `{{ collection_${collectionId}.title }}` : collection?.title}
      </a>
    )
  }
  return React.createElement(htmlTag, { ref, ...rest }, [content])
})

export let css: ElementCSS = {
  '@desktop': {
    fontSize: 20,
    margin: 0,
    a: {
      all: 'inherit',
      cursor: 'pointer',
    },
  },
}

CollectionTitle.defaultProps = {
  htmlTag: 'h3',
  linkCollection: true,
}

export default CollectionTitle
