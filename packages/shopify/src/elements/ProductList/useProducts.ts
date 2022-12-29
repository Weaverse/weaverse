import React, { useEffect } from 'react'
import {
  weaverseShopifyProducts,
  weaverseShopifyProductsByCollection,
} from '~/proxy'
import type { ShopifyProduct, UseProductHookInput } from '~/types'

export function useProducts(input: UseProductHookInput) {
  let { source, collectionId, fixedProducts, isDesignMode } = input
  let [recommendedProducts, setRecommendedProducts] = React.useState<
    ShopifyProduct[]
  >([])

  let products: ShopifyProduct[] = []
  if (source === 'collection') {
    let productsByCollection: number[] =
      weaverseShopifyProductsByCollection[collectionId] || []
    products = productsByCollection.map((pId) => weaverseShopifyProducts[pId])
  }
  if (source === 'recommended' && isDesignMode) {
    let productsByCollection: number[] =
      weaverseShopifyProductsByCollection['all'] || []
    products = productsByCollection.map((pId) => weaverseShopifyProducts[pId])
  }
  if (source === 'fixedProducts' && fixedProducts?.length) {
    let _products = fixedProducts.map(
      ({ productId }) => weaverseShopifyProducts[productId]
    )
    let hasAllProducts = _products.every((p) => p)
    products = hasAllProducts ? _products : []
  }

  useEffect(() => {
    if (source === 'recommended' && !isDesignMode) {
      let { product_id, routes } = window.weaverseShopifyConfigs.shopData
      fetch(`${routes.product_recommendations_url}?product_id=${product_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 404 || data.status === 422) {
            throw new Error(`${data.message} - (${data.description})`)
          } else {
            setRecommendedProducts(data.products)
            data.products.forEach((p: ShopifyProduct) => {
              if (!weaverseShopifyProducts[p.id]) {
                weaverseShopifyProducts[p.id] = {
                  ...p,
                  images: p.media,
                  has_only_default_variant:
                    p.variants.length === 1 &&
                    p.variants[0].title === 'Default Title',
                  selected_or_first_available_variant:
                    p.variants.find((v) => v.available) || null,
                }
              }
            })
          }
        })
        .catch((err) => {
          console.log(`❌ Error fetching recommended products`, err)
        })
    }
  }, [])

  return source === 'recommended' && !isDesignMode
    ? recommendedProducts
    : products
}
