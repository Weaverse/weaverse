import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'

import { forwardRef, useContext } from 'react'
import { useProductContext } from '~/hooks/use-product-context'
import type { ProductDescriptionProps } from '~/types'
import { ViewDetails } from './view-details'

let ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  (props, ref) => {
    let {
      lineClamp,
      showViewDetailsButton,
      viewDetailsText,
      viewDetailsClickAction,
      isInsideProductQuickView,
      children,
      ...rest
    } = props
    let { product } = useProductContext()
    let style = {
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: lineClamp,
    } as React.CSSProperties

    let { isDesignMode } = useContext(WeaverseContext)
    let shopData = window.weaverseShopifyConfigs?.shopData || {}
    let isNotProductPage = shopData?.request?.page_type !== 'product'

    let goToProductPage = () => {
      if (!isDesignMode) {
        window.location.href = product.url
      }
    }

    let viewDetailsButton = null
    if (showViewDetailsButton) {
      if (
        viewDetailsClickAction === 'goToProductPage' &&
        (isNotProductPage || isInsideProductQuickView)
      ) {
        viewDetailsButton = (
          <button
            className="wv-view-details-button"
            onClick={goToProductPage}
            type="button"
          >
            {viewDetailsText}
          </button>
        )
      } else {
        viewDetailsButton = (
          <ViewDetails viewDetailsText={viewDetailsText}>
            <div
              className="wv-product-description-details"
              dangerouslySetInnerHTML={{ __html: product.body_html }}
            />
          </ViewDetails>
        )
      }
    }

    return (
      <div ref={ref} {...rest}>
        <div
          className="wv-product-description"
          style={style}
          dangerouslySetInnerHTML={{ __html: product.body_html }}
        />
        {viewDetailsButton}
      </div>
    )
  },
)

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '16px',
    marginBottom: '24px',
    '.wv-product-description': {
      overflow: 'hidden',
      display: '-webkit-box',
      img: {
        display: 'none',
      },
      div: {
        display: 'block',
      },
      '& > *:first-child': {
        margin: 0,
      },
    },
    '.wv-view-details-button': {
      outline: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      padding: '0',
      color: 'rgb(56, 142, 255)',
      marginTop: '16px',
      '&:hover': {
        textDecoration: 'underline',
        color: 'rgb(0, 42, 140)',
      },
    },
    '.wv-product-description-details': {
      maxHeight: '80vh',
      overflowY: 'auto',
      margin: '0 -24px',
      padding: '0 24px',
      width: 'calc(100% + 48px)',
      maxWidth: 'unset',
    },
  },
}

ProductDescription.defaultProps = {
  lineClamp: 3,
  showViewDetailsButton: true,
  isInsideProductQuickView: false,
  viewDetailsText: 'View details',
}

export default ProductDescription
