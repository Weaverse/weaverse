import type { ElementCSS } from '@weaverse/core'
import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '@weaverse/react'
import { CollectionContext } from '~/elements/context'

let CollectionDescription = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props

  let { ssrMode } = useContext(WeaverseContext)
  let { collection } = useContext(CollectionContext)

  let html = ssrMode ? `{{ wv_collection.description }}` : collection?.body_html
  return (
    <div ref={ref} {...rest}>
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    overflow: 'hidden',
    display: 'none',
  },
}

export default CollectionDescription
