import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import clsx from 'clsx'
import React, { useContext } from 'react'

import { Components } from '~/components'
import { PRODUCT_IMAGE_PLACEHOLDER } from '~/constant'
import ProductBuyButton, {
  css as buyButtonCss,
} from '~/elements/product/product-buy-button'
import ProductDescription, {
  css as descriptionCss,
} from '~/elements/product/product-description'
import ProductDetails, {
  css as detailsCss,
} from '~/elements/product/product-details'
import ProductInfo, { css as infoCss } from '~/elements/product/product-info'
import ProductMedia, {
  css as mediasCss,
} from '~/elements/product/product-media'
import ProductPrice, { css as priceCss } from '~/elements/product/product-price'
import ProductTitle, { css as titleCss } from '~/elements/product/product-title'
import ProductVariant, {
  css as variantCss,
} from '~/elements/product/product-variant'
import ProductVendor, {
  css as vendorCss,
} from '~/elements/product/product-vendor'
import type { ShopifyProduct } from '~/types/shopify'

let { Icon, ModalComponents } = Components
let { Modal, ModalContent, ModalTrigger } = ModalComponents

export function ProductQuickView({ product }: { product: ShopifyProduct }) {
  let { stitchesInstance } = useContext(WeaverseContext)
  let { className } = stitchesInstance.css(css)()
  let quickViewModalClass = clsx('wv-pcard__quickview', className)

  return (
    <Modal>
      <ModalTrigger className="wv-pcard__button quick-view">
        <Icon name="Eye" />
      </ModalTrigger>
      <ModalContent size="auto" className={quickViewModalClass} portal>
        <ProductDetails
          productId={product.id}
          productHandle={product.handle}
          useDefaultProduct={false}
          className="wv-pcard__details"
        >
          <ProductMedia
            mediaSize="medium"
            aspectRatio="auto"
            fallbackImage={PRODUCT_IMAGE_PLACEHOLDER}
            allowFullscreen={false}
            thumbnailSlidePerView={5}
            className="wv-pcard__media"
          />
          <ProductInfo className="wv-pcard__info">
            <ProductVendor
              showLabel={false}
              labelText=""
              clickAction="none"
              openInNewTab={false}
              className="wv-pcard__vendor"
            />
            <ProductTitle
              htmlTag="h4"
              clickAction="goToProductPage"
              className="wv-pcard__title"
            />
            <ProductPrice
              showCompareAt
              showComparePriceFirst={false}
              showSaleBadge
              className="wv-pcard__price"
            />
            <ProductVariant
              optionsStyle="custom"
              showTooltip
              hideUnavailableOptions={false}
              className="wv-pcard__variant"
            />
            <ProductBuyButton
              showQuantitySelector={false}
              quantityLabel=""
              buttonText="Add to cart"
              soldOutText="Sold out"
              unavailableText="Unavailable"
              className="wv-pcard__buy-button"
            />
            <ProductDescription
              lineClamp={3}
              showViewDetailsButton
              isInsideProductQuickView
              viewDetailsText="View full details"
              viewDetailsClickAction="goToProductPage"
              className="wv-pcard__description"
            />
          </ProductInfo>
        </ProductDetails>
      </ModalContent>
    </Modal>
  )
}

let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard__details': { ...detailsCss['@desktop'] },
    '.wv-pcard__media': { ...mediasCss['@desktop'] },
    '.wv-pcard__info': { ...infoCss['@desktop'] },
    '.wv-pcard__vendor': { ...vendorCss['@desktop'] },
    '.wv-pcard__title': { ...titleCss['@desktop'] },
    '.wv-pcard__price': { ...priceCss['@desktop'] },
    '.wv-pcard__variant': { ...variantCss['@desktop'] },
    '.wv-pcard__buy-button': { ...buyButtonCss['@desktop'] },
    '.wv-pcard__description': { ...descriptionCss['@desktop'] },
  },
  '@mobile': {
    '.wv-pcard__details': { ...detailsCss['@mobile'] },
    '.wv-pcard__media': { ...mediasCss['@mobile'] },
    '.wv-pcard__info': { ...infoCss['@mobile'] },
    '.wv-pcard__vendor': { ...vendorCss['@mobile'] },
    '.wv-pcard__title': { ...titleCss['@mobile'] },
    '.wv-pcard__price': { ...priceCss['@mobile'] },
    '.wv-pcard__variant': { ...variantCss['@mobile'] },
    '.wv-pcard__buy-button': { ...buyButtonCss['@mobile'] },
    '.wv-pcard__description': { ...descriptionCss['@mobile'] },
  },
}
