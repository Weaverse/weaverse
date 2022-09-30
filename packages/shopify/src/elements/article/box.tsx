import React, { forwardRef, useContext } from 'react'
import {
  ArticleContext,
  weaverseShopifyArticles,
  BlogContext,
} from '../context'
import type { ElementCSS } from '@weaverse/core'
import type { ArticleBoxProps } from '~/types'

let ArticleBox = forwardRef<HTMLDivElement, ArticleBoxProps>((props, ref) => {
  let { children, articleId: aId, articleHandle, ...rest } = props
  let { articleId: articleAutoId, blogHandle } = useContext(BlogContext)
  let articleId = articleAutoId || aId
  // let article = weaverseShopifyArticles[articleId]
  let article = {
    id: 561778294968,
    title: 'The next generation of leather alternatives',
    created_at: '2022-09-23T17:25:14+07:00',
    body_html:
      '<meta charset="utf-8">\n<div class="mb-4"><responsive-image class="sf-image " intersecting="true"><img srcset="//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=165 165w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=360 360w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=533 533w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=720 720w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=940 940w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=1066 1066w,//cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177 1170w" src="https://cdn.shopify.com/s/files/1/0591/1350/4958/articles/1.png?v=1628336177&amp;width=360" sizes="952px" alt="The next generation of leather alternatives" loading="lazy" class="w-full f-img-loaded" width="952" height="618"></responsive-image></div>\n<div class="mb-10 prose max-w-none">In 1928, a New York City designer named Irving Schott created the world\'s first leather motorcycle jacket. Naming it the "Perfecto" (after his favorite cigar), Schott crafted the coat out of horsehide, a rigid, durable material that soon after became fashion\'s leather of choice. The first Perfectos sold for just $5.50. By the 1950s, the leather jacket was a bona fide clothing mainstay.<br><br><span>Today, leather is one of the most ubiquitous materials in the footwear and fashion industries. But the actual term "leather" hasn\'t always had the same definition that Schott would have used back in his 1920s heyday. In the last half a century, "leather" has expanded to include synthetic "pleather" variations, like polyurethane (PU) and polyvinyl chloride (PVC), which are not only made with fossil fuels, but also don\'t biodegrade. And while these alternatives are theoretically more animal-friendly, in that they don\'t actually require animal hides, they also aren\'t the eco-friendly substitute consumers may have been led to believe.</span>\n</div>',
    blog_id: 84781203640,
    author: 'Hung Nguyen',
    user_id: 81093656760,
    published_at: '2022-09-23T17:25:19+07:00',
    updated_at: '2022-09-23T17:25:19+07:00',
    summary_html:
      'I<meta charset="utf-8"><span>n 1928, a New York City designer named Irving Schott created the world\'s first leather motorcycle jacket. Naming it the "Perfecto" (after his favorite cigar), Schott crafted the coat out of horsehide, a rigid, durable material that soon after became fashion\'s leather of choice. The first Perfectos sold for just $5.50. By the 1950s, the leather jacket was a bona fide clothing mainstay.</span>',
    template_suffix: '',
    handle: 'the-next-generation-of-leather-alternatives',
    tags: '',
    admin_graphql_api_id: 'gid://shopify/OnlineStoreArticle/561778294968',
  }
  return (
    <div {...rest} ref={ref} key={articleId}>
      {articleId ? (
        <ArticleContext.Provider
          value={{
            article,
            articleId,
            blogHandle,
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

export let css: ElementCSS = {
  '@desktop': {},
}

export let permanentCss: ElementCSS = {
  '@desktop': {},
}

ArticleBox.defaultProps = {
  // articleId: 7176137277624,
  // articleHandle: 'adidas-kids-stan-smith',
}

export default ArticleBox
