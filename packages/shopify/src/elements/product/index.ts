import type { WeaverseElement } from '@weaverse/react'
import * as ProductBuyButton from './ProductBuyButton'
import * as ProductDescription from './ProductDescription'
import * as ProductDetails from './ProductDetails'
import * as ProductInfo from './ProductInfo'
import * as ProductMedia from './ProductMedia'
import * as ProductMeta from './ProductMeta'
import * as ProductPrice from './ProductPrice'
import * as ProductTitle from './ProductTitle'
import * as ProductVariant from './ProductVariant'
import * as ProductVendor from './ProductVendor'

export let productElements: Record<string, WeaverseElement> = {
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
