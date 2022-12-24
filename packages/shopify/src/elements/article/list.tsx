// import type { ElementCSS } from '@weaverse/core'
// import React, { forwardRef, useContext } from 'react'
// import { BlogContext } from '~/context'
// import type { ArticleListProps } from '~/types'
// import { WeaverseContext } from '@weaverse/react'
// import * as Carousel from '~/elements/shared/Carousel'
// import { weaverseShopifyBlogs } from '~/proxy'

// let ArticleList = forwardRef<HTMLDivElement, ArticleListProps>((props, ref) => {
//   let {
//     blogId,
//     blogHandle,
//     itemsPerSlide,
//     itemsSpacing,
//     articleNumber,
//     children,
//     ...rest
//   } = props
//   let articleIds: number[] = weaverseShopifyBlogs[blogId] || []

//   let { ssrMode } = useContext(WeaverseContext)
//   if (ssrMode) {
//     return (
//       <div ref={ref} {...rest}>
//         {` {% for wv_article in blogs['${blogHandle}'].articles %} `}
//         {children}
//         {` {% endfor %} `}
//       </div>
//     )
//   }

//   let renderContent = () => {
//     return (
//       <Carousel.default itemsPerSlide={itemsPerSlide} gap={itemsSpacing}>
//         {articleIds.slice(0, articleNumber).map((articleId: number) => {
//           return (
//             <BlogContext.Provider
//               key={articleId}
//               value={{
//                 articleId,
//                 blogHandle,
//               }}
//             >
//               {children}
//             </BlogContext.Provider>
//           )
//         })}
//       </Carousel.default>
//     )
//   }

//   return (
//     <div ref={ref} {...rest}>
//       {!blogId ? `Select blog` : renderContent()}
//     </div>
//   )
// })

// export let css: ElementCSS = {
//   '@desktop': {},
// }

// ArticleList.defaultProps = {
//   blogId: 84781203640,
//   blogHandle: 'news',
//   articleNumber: 12,
//   itemsPerSlide: 4,
//   itemsSpacing: 4,
// }

// export let permanentCss: ElementCSS = {
//   '@desktop': {
//     '& [data-wv-type]:not(:last-child)': {
//       marginBottom: 8,
//     },
//     '& [data-wv-type="article-title"]': {
//       flex: 1,
//     },

//     // carousel
//     ...Carousel.css,
//   },
// }

// export default ArticleList
