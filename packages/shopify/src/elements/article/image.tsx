import React, { forwardRef, useContext } from 'react'
import type { TODO } from '@weaverse/core'
import { WeaverseContext } from '@weaverse/react'
import { ArticleContext } from '~/elements/context'

let ArticleImage = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { ...rest } = props
  let weaverseContext = useContext(WeaverseContext)
  let { ssrMode } = weaverseContext
  let { article, articleId } = useContext(ArticleContext)
  return (
    <div ref={ref} {...rest}>
      <img src={article?.image.src} />
    </div>
  )
})

export default ArticleImage
