import type { ElementCSS, TODO } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { CollectionContext } from '~/elements/context'

let CollectionDescription = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props

  let { ssrMode } = useContext(WeaverseContext)
  let { collection, collectionId } = useContext(CollectionContext)

  let html = ssrMode
    ? `{{ collection_${collectionId}.description }}`
    : collection?.body_html
  return (
    <div ref={ref} {...rest}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    overflow: 'hidden',
  },
}

export default CollectionDescription
