import React, { forwardRef, useContext } from 'react'
import {
  ArticleContext,
  weaverseShopifyArticles,
  BlogContext,
} from '../context'
import type { TODO } from '@weaverse/core'

let ArticleBox = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  let { children, articleId: aId, articleHandle, optionStyles, ...rest } = props
  let { articleId: articleAutoId } = useContext(BlogContext)
  let articleId = articleAutoId || aId
  let article = weaverseShopifyArticles[articleId]
  return (
    <div {...rest} ref={ref}>
      {articleId ? (
        <ArticleContext.Provider
          value={{
            article,
            articleId,
          }}
        >
          {article && children}
        </ArticleContext.Provider>
      ) : (
        'Select a article and start editing.'
      )}
    </div>
  )
})

ArticleBox.defaultProps = {
  // articleId: 7176137277624,
  // articleHandle: 'adidas-kids-stan-smith',
}

export default ArticleBox
