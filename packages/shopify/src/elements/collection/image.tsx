import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/core'
import { WeaverseContext } from '@weaverse/react'
import { CollectionContext } from '~/elements/context'
let PLACEHOLDER_IMG =
  'https://ucarecdn.com/04c4766e-7ea7-4af5-9941-64f0c9ffa86b/placeholderimagesimage_large.webp'
let CollectionImage = forwardRef<HTMLDivElement, any>((props, ref) => {
  let { height, linkCollection, ...rest } = props
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { collection, collectionId } = useContext(CollectionContext)
  let src = collection?.image?.src || PLACEHOLDER_IMG
  let styles = {
    ['--image-height']: height,
  }
  let content = ssrMode ? (
    <img
      src={`{{ collection${collectionId}.image.src }}`}
      alt={`{{ collection${collectionId}.image.alt }}`}
    />
  ) : (
    <img src={src} alt={collection.image?.alt || ''} />
  )
  return (
    <div ref={ref} {...rest} style={styles}>
      {linkCollection ? (
        <a href={`/${collection.handle}`}>{content}</a>
      ) : (
        content
      )}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    img: {
      width: '100%',
      height: 'var(--image-height, 100%)',
      objectFit: 'contain',
    },
  },
}

CollectionImage.defaultProps = {
  height: '200px',
}

export default CollectionImage
