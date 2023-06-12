import type { ElementCSS } from '@weaverse/react'
import { Components } from '~/components'
import React, { forwardRef, useState } from 'react'
import { useProductContext } from '~/hooks/use-product-context'
import type { ProductBuyButtonProps } from '~/types'
import { addProductToCart } from '~/utils/cart'
import { QuantitySelector } from './quantity-selector'

let ProductBuyButton = forwardRef<HTMLDivElement, ProductBuyButtonProps>(
  (props, ref) => {
    let {
      showQuantitySelector,
      quantityLabel,
      buttonText,
      soldOutText,
      unavailableText,
      ...rest
    } = props
    let [adding, setAdding] = useState(false)
    let context = useProductContext()
    let { formRef, selectedVariant, ready } = context
    let available = selectedVariant?.available

    let handleATC = (e: React.MouseEvent) => {
      e.preventDefault()
      setAdding(true)
      addProductToCart(formRef?.current as HTMLFormElement, () =>
        setAdding(false)
      )
    }

    let atcText = buttonText
    if (ready) {
      if (!available) atcText = soldOutText
      if (!selectedVariant) atcText = unavailableText
    }

    return (
      <div ref={ref} {...rest}>
        {showQuantitySelector && (
          <label className="wv-product-quantity-label">{quantityLabel}</label>
        )}
        <div className="wv-product-buy-buttons">
          {showQuantitySelector && <QuantitySelector />}
          <button
            disabled={adding || !available || !selectedVariant}
            onClick={handleATC}
            type="submit"
            className="wv-product-atc-button"
          >
            <span>{atcText}</span>
            {adding && <Components.Spinner />}
          </button>
        </div>
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '20px',
    '.wv-product-quantity-label': {
      display: 'inline-block',
      marginBottom: '5px',
      fontWeight: '500',
    },
    '.wv-product-buy-buttons': {
      display: 'flex',
      '.wv-quantity-selector': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
        width: '130px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        '.wv-quantity-button': {
          display: 'flex',
          padding: '0px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          svg: {
            width: '16px',
            height: '16px',
          },
        },
        '.wv-quantity-input': {
          width: '50px',
          height: '40px',
          fontSize: '16px',
          border: 'none',
          textAlign: 'center',
          backgroundColor: 'transparent',
          outline: 'none',
        },
      },
      '.wv-product-atc-button': {
        backgroundColor: '#273820',
        padding: '0px',
        height: '50px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        flexGrow: 1,
        fontWeight: '500',
        fontSize: '1em',
        lineHeight: '1',
        textAlign: 'center',
        transition: 'background-color 0.2s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: '#2c3e2f',
        },
        '&:disabled': {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
    },
  },
  '@mobile': {
    '.wv-product-buy-buttons': {
      '.wv-quantity-selector': {
        width: '110px',
        '.wv-quantity-input': {
          width: '30px',
        },
      },
    },
  },
}

ProductBuyButton.defaultProps = {
  showQuantitySelector: true,
  quantityLabel: 'Quantity',
  buttonText: 'Add to cart',
  soldOutText: 'Sold Out',
  unavailableText: 'Unavailable',
}

export default ProductBuyButton
