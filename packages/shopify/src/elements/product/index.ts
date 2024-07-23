import * as ProductBuyButton from './product-buy-button'
import * as ProductDescription from './product-description'
import * as ProductDetails from './product-details'
import * as ProductInfo from './product-info'
import * as ProductMedia from './product-media'
import * as ProductMeta from './product-meta'
import * as ProductPrice from './product-price'
import * as ProductTitle from './product-title'
import * as ProductVariant from './product-variant'
import * as ProductVendor from './product-vendor'

import type { WeaverseElement } from '~/types'

export let productElements: Record<string, Partial<WeaverseElement>> = {
  ProductDetails: {
    type: 'product-details',
    Component: ProductDetails.default,
    defaultCss: ProductDetails.css,
  },
  ProductInfo: {
    type: 'product-info',
    Component: ProductInfo.default,
    defaultCss: ProductInfo.css,
  },
  ProductMedia: {
    type: 'product-media',
    Component: ProductMedia.default,
    defaultCss: ProductMedia.css,
  },
  ProductTitle: {
    type: 'product-title',
    Component: ProductTitle.default,
    defaultCss: ProductTitle.css,
  },
  ProductDescription: {
    type: 'product-description',
    Component: ProductDescription.default,
    defaultCss: ProductDescription.css,
  },
  ProductVendor: {
    type: 'product-vendor',
    Component: ProductVendor.default,
    defaultCss: ProductVendor.css,
  },
  ProductMeta: {
    type: 'product-meta',
    Component: ProductMeta.default,
    defaultCss: ProductMeta.css,
  },
  ProductPrice: {
    type: 'product-price',
    Component: ProductPrice.default,
    defaultCss: ProductPrice.css,
  },
  ProductBuyButton: {
    type: 'product-buy-button',
    Component: ProductBuyButton.default,
    defaultCss: ProductBuyButton.css,
  },
  ProductVariant: {
    type: 'product-variant',
    Component: ProductVariant.default,
    defaultCss: ProductVariant.css,
  },
}
