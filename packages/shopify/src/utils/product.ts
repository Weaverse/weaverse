import type { ShopifyProduct } from '~/types'

/**
 * Add missing properties on Shopify product due to the difference between Shopify API and Liquid data
 *
 * @param product ShopifyProduct object
 */
export function updateProductData(product: ShopifyProduct) {
  if (!product?.aspect_ratio) {
    let image = product?.image || product?.images[0]
    if (image) {
      product.aspect_ratio = image.width / image.height
    }
  }
  product.variants.forEach((variant) => {
    if (!('available' in variant)) {
      variant.available =
        variant.inventory_quantity > 0 ||
        variant.inventory_policy === 'continue' ||
        variant.inventory_management === null
    }
  })
}
