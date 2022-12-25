import React, { useEffect } from 'react'
import type { ProductListProps, ShopifyProduct } from '~/types'

export function useProducts(
  input: Pick<ProductListProps, 'source' | 'collectionId' | 'productIds'>
) {
  let { source, collectionId, productIds } = input
  let [products, setProducts] = React.useState<ShopifyProduct[]>(() => {
    if (source === 'collection') {
      let productsByCollection =
        window.weaverseShopifyProductsByCollection[collectionId] || []
      return productsByCollection.map(
        (pId) => window.weaverseShopifyProducts[pId]
      )
    }
    // if (source === 'fixedProducts') {
    //   products = products.filter((p) => productIds.includes(p.id))
    // }
    return []
  })

  useEffect(() => {
    if (source === 'recommended') {
      let { shopData } = window.weaverseShopifyConfigs
      let { product_id, routes } = shopData
      let { product_recommendations_url } = routes
      fetch(`${product_recommendations_url}?product_id=${product_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 404 || data.status === 422) {
            console.log(
              `❌ Error fetching recommended products, ${data.message} - ${data.description}`,
              data
            )
          } else {
            let { products } = data
            setProducts(products)
          }
        })
    }
  }, [])

  return products
}
