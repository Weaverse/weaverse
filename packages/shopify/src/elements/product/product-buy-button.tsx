import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useRef, useState } from 'react'
import { ProductContext } from '~/context'
import type { ProductBuyButtonProps } from '~/types'

let ProductBuyButton = forwardRef<HTMLDivElement, ProductBuyButtonProps>(
  (props, ref) => {
    let { buttonText, soldOutText, unavailableText, ...rest } = props
    let atcRef = useRef<HTMLButtonElement>(null)
    let context = useContext(ProductContext)
    let [status, setStatus] = useState('')
    let [quantity, setQuantity] = useState(1)

    if (context) {
      let { product, formId, selectedVariant, ssrMode } = context

      let handleATC = (e: React.MouseEvent) => {
        e.preventDefault()
        let formElement = atcRef.current!.closest(`form[id="${formId}"]`)
        setStatus('adding')
        fetch('/cart/add.js', {
          method: 'post',
          body: new FormData(formElement as HTMLFormElement),
        })
          .then((res) => res.json())
          .then((data) => {
            setStatus('added')
            setTimeout(() => setStatus(''), 2000)
            // handle after adding item
            window.alert(
              'Product successfully added to cart: ' + data?.variant_title
            )
          })
      }

      if (ssrMode) {
        return (
          <div ref={ref} {...rest}>
            <button type="submit" name="add" className="wv-product-atc-button">
              {`
                <span>
                  {%- if product.available -%}
                    ${buttonText}
                  {%- else -%}
                    ${soldOutText}
                  {%- endif -%}
                </span>
              `}
            </button>
          </div>
        )
      }

      return (
        <div ref={ref} {...rest}>
          <label className="wv-product-quantity-label">Quantity</label>
          <div className="wv-product-buy-buttons">
            <div className="wv-quantity-selector">
              <button
                className="wv-quantity-button dec-button"
                type="button"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                className="wv-quantity-input"
                name="quantity"
                value={quantity}
                aria-label="Product quantity input"
              />
              <button
                type="button"
                className="wv-quantity-button inc-button"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              ref={atcRef}
              disabled={!!status}
              onClick={handleATC}
              type="submit"
              className="wv-product-atc-button"
            >
              <span>{buttonText}</span>
              {/* <Spinner /> */}
            </button>
          </div>
        </div>
      )
    }
    return null
  }
)

function Spinner() {
  return (
    <svg
      className="wv-spinner animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style={{ opacity: '.25' }}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        style={{ opacity: '.75' }}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    marginTop: '20px',
    '.wv-product-quantity-label': {
      display: 'block',
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
        width: '150px',
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
        },
        '.wv-quantity-input': {
          width: '70px',
          height: '40px',
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
        transition: 'background 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#2c3e2f',
        },
        '.wv-spinner': {
          animation: 'spin 1s linear infinite',
        },
      },
    },
  },
}

ProductBuyButton.defaultProps = {
  buttonText: 'Add to cart',
  soldOutText: 'Sold Out',
  unavailableText: 'Unavailable',
}

export default ProductBuyButton
