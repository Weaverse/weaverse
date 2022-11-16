import type { ShopifyProduct } from '~/types'

/**
 * Add missing properties on Shopify product due to the difference between Shopify API and Liquid data
 *
 * @param product ShopifyProduct object
 */
export function updateProductData(product: ShopifyProduct) {
  if (!('aspect_ratio' in product)) {
    let image = product?.image || product?.images[0]
    if (image) {
      product.aspect_ratio = image.width / image.height
    }
  }
  if (!('has_only_default_variant' in product)) {
    product.has_only_default_variant =
      product.variants.length === 1 &&
      product.variants[0].title === 'Default Title'
  }
  product.variants.forEach((variant) => {
    if (!('available' in variant)) {
      variant.available =
        variant.inventory_quantity > 0 ||
        variant.inventory_policy === 'continue' ||
        variant.inventory_management === null
    }
    if (!('featured_image' in variant)) {
      if (variant?.image_id) {
        variant.featured_image = product.images.find(
          (i) => i.id === variant.image_id
        )
      }
    }
    if (!('options' in variant)) {
      variant.options = [
        variant.option1,
        variant.option2,
        variant.option3,
      ].filter(Boolean) as string[]
    }
  })
}
