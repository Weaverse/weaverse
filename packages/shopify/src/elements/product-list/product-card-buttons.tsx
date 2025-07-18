import type { ElementCSS } from '@weaverse/react'
import type { ProductCardButtonsProps } from '~/types'
import { ProductQuickView } from './product-quick-view'

export function ProductCardButtons(props: ProductCardButtonsProps) {
  let {
    showViewDetailsButton,
    viewDetailsButtonText,
    showQuickViewButton,
    product,
  } = props

  if (showViewDetailsButton || showQuickViewButton) {
    return (
      <div className="wv-pcard__buttons">
        {showViewDetailsButton && (
          <a
            className="wv-pcard__button view-details"
            href={product.url}
            target="_self"
          >
            {viewDetailsButtonText}
          </a>
        )}
        {showQuickViewButton && (
          <>
            <link
              href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css"
              rel="stylesheet"
            />
            <ProductQuickView product={product} />
          </>
        )}
      </div>
    )
  }
  return null
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard__buttons': {
      position: 'absolute',
      bottom: '16px',
      left: '50%',
      transform: 'translate3d(-50%, 80px, 0)',
      opacity: 0,
      transition: '.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '0 16px',
      '.wv-pcard__button': {
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        outline: 'none',
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(0, 0, 0)',
        minWidth: '44px',
        padding: '12px 4px',
        transition: 'all .3s ease',
        svg: {
          width: 20,
          height: 20,
        },
        '&.view-details': {
          width: '180px',
          marginRight: '8px',
          textDecoration: 'none',
          textAlign: 'center',
          display: 'block',
          lineHeight: '20px',
          flexGrow: 1,
        },
        '&.quick-view': {
          position: 'relative',
          height: '44px',
        },
        '&:hover': {
          backgroundColor: '#121212',
          color: 'rgb(255, 255, 255)',
        },
      },
    },
  },
}
