import React, { forwardRef, useContext } from 'react'
import { CollectionContext } from '~/elements/context'
import { WeaverseContext } from '@weaverse/react'
import type { ElementCSS } from '@weaverse/core'

let CollectionTitle = forwardRef<HTMLDivElement, any>((props, ref) => {
  let { htmlTag, linkCollection, ...rest } = props
  let { ssrMode } = useContext(WeaverseContext)
  let { collection } = useContext(CollectionContext)
  let content = (
    <span>{ssrMode ? `{{ wv_collection.title }}` : collection?.title}</span>
  )
  if (linkCollection) {
    content = (
      <a
        href={
          ssrMode
            ? `/collections/{{ wv_collection.handle }}`
            : `/collections/${collection?.handle}`
        }
      >
        {ssrMode ? `{{ wv_collection.title }}` : collection?.title}
      </a>
    )
  }
  return React.createElement(htmlTag, { ref, ...rest }, content)
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
