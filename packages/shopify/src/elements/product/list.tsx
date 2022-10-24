// import { WeaverseContext } from '@weaverse/react'
// import type { ReactNode } from 'react'
// import React, { forwardRef, useContext } from 'react'
// import { ProductListContext } from '~/context'
// import { Placeholder } from '~/elements/shared'
// import * as Carousel from '~/elements/shared/Carousel'
// import { weaverseShopifyProductsByCollection } from '~/proxy'
// import type { ProductListProps } from '~/types'

// let ProductList = forwardRef<HTMLDivElement, ProductListProps>((props, ref) => {
//   let {
//     collectionId,
//     collectionHandle,
//     productNumber,
//     itemsPerSlide,
//     itemsSpacing,
//     children,
//     ...rest
//   } = props
//   let { ssrMode } = useContext(WeaverseContext)
//   let productIds =
//     weaverseShopifyProductsByCollection[collectionId || 'all'] || []

//   if (ssrMode) {
//     return (
//       <div ref={ref} {...rest}>
//         {` {% for wv_product in collections['${collectionHandle}'].products %} `}
//         {children}
//         {` {% endfor %} `}
//       </div>
//     )
//   }

//   let content: ReactNode = (
//     <Carousel.default itemsPerSlide={itemsPerSlide} gap={itemsSpacing}>
//       {productIds.slice(0, productNumber).map((productId: number) => (
//         <ProductListContext.Provider
//           key={productId}
//           value={{
//             productId,
//           }}
//         >
//           {children}
//         </ProductListContext.Provider>
//       ))}
//     </Carousel.default>
//   )
//   return (
//     <div ref={ref} {...rest}>
//       {productIds.length ? (
//         content
//       ) : (
//         <Placeholder element="Product List">
//           Select a collection and start editing.
//         </Placeholder>
//       )}
//     </div>
//   )
// })

// export default ProductList

// ProductList.defaultProps = {
//   productNumber: 12,
//   itemsPerSlide: 4,
//   itemsSpacing: 8,
// }

// export let permanentCss = {
//   '@desktop': {
//     '& [data-wv-type]:not([data-wv-type="product-details"])': {
//       textAlign: 'center',
//     },
//     '& [data-wv-type="product-details"]': {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: 4,
//       height: '100%',
//     },
//     '& [data-wv-type="product-image"] img': {
//       width: '100%',
//       height: 'auto',
//       objectFit: 'contain',
//     },
//     '& [data-wv-type="product-title"]': {
//       flex: 1,
//     },

//     ...Carousel.css,
//   },
// }
