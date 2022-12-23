import type { ShopifyProduct } from '~/types'

/**
 * Resize an image to the specified dimensions.
 *
 * @param imageURL {string} URL of the image
 * @param size {string} Shopify size attribute
 * @returns {string} URL with size attribute
 *
 * @example
 * resizeImage('https://cdn.shopify.com/image.jpg', '100x')
 * resizeImage('https://cdn.shopify.com/image.jpg', '100x100')
 */
export function resizeImage(imageURL: string, size: string): string {
  try {
    if (size === 'original') {
      return imageURL
    } else {
      let matches = imageURL.match(/(.*\/[\w\-_.]+)\.(\w{2,4})/)
      // @ts-ignore
      return matches[1] + '_' + size + '.' + matches[2]
    }
  } catch (e) {
    return imageURL
  }
}
