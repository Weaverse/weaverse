import { getSelectedProductOptions as hydrogen_getSelectedProductOptions } from '@shopify/hydrogen'
import type { SelectedOptionInput } from '@shopify/hydrogen/storefront-api-types'
import {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
} from '@weaverse/react'

export function getSelectedProductOptions(
  request: Request
): SelectedOptionInput[] {
  let options = hydrogen_getSelectedProductOptions(request)
  return options.filter(
    ({ name }) => name !== 'isDesignMode' && !name.startsWith('weaverse')
  )
}

export const IMAGES_PLACEHOLDERS = {
  logo_white:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-logo-w-600x200.svg',
  logo_black:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-logo-k-600x200.svg',
  image:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-image-1024x1024.svg',
  banner_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-lifestyle-1-1800x900.svg',
  banner_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-lifestyle-2-1800x900.svg',
  collection_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-hats-1024x1024.svg',
  collection_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-shoes-1024x1024.svg',
  collection_3:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-glasses-1024x1024.svg',
  collection_4:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-lamps-1024x1024.svg',
  collection_5:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-bags-1024x1024.svg',
  collection_6:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-collection-watches-1024x1024.svg',
  product_1:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-3-1024x1024.svg',
  product_2:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-2-1024x1024.svg',
  product_3:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-1-1024x1024.svg',
  product_4:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-2-1024x1024.svg',
  product_5:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-1-1024x1024.svg',
  product_6:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-1-1024x1024.svg',
  product_7:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-2-1024x1024.svg',
  product_8:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-3-1024x1024.svg',
  product_9:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-1-1024x1024.svg',
  product_10:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-2-1024x1024.svg',
  product_11:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-2-1024x1024.svg',
  product_12:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-glasses-3-1024x1024.svg',
  product_13:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-shoe-3-1024x1024.svg',
  product_14:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-bag-3-1024x1024.svg',
  product_15:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-hat-1-1024x1024.svg',
  product_16:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-lamp-3-1024x1024.svg',
  product_17:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-1-1024x1024.svg',
  product_18:
    'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/fpo-product-watch-2-1024x1024.svg',
}

// Re-export utilities from @weaverse/react
export {
  isBrowser,
  isIframe,
  useChildInstances,
  useItemInstance,
  useParentInstance,
  useWeaverse,
}

// Re-export all types and utilities from schema package
export * from '@weaverse/schema'
export * from './components'
// Export Hydrogen-specific hooks
export {
  createWeaverseDataContext,
  useWeaverseDataContext,
  type WeaverseDataContext,
} from './hooks/use-weaverse-data-context'
// Export hydrogen-specific modules
export * from './types'
export * from './utils'
export * from './WeaverseHydrogenRoot'
export * from './weaverse-client'
