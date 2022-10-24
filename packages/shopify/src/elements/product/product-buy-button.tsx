import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useRef, useState } from 'react'
import { ProductContext } from '~/context'
import type { ProductBuyButtonProps } from '~/types'

let ProductBuyButton = forwardRef<HTMLDivElement, ProductBuyButtonProps>(
  (props, ref) => {
    let { buttonText, soldOutText, unavailableText, ...rest } = props
    let atcRef = useRef<HTMLButtonElement>(null)
    let context = useContext(ProductContext)
    let [adding, setAdding] = useState(false)
    let [quantity, setQuantity] = useState(1)

    if (context) {
      let { formRef, ssrMode } = context

      let handleATC = (e: React.MouseEvent) => {
        e.preventDefault()
        setAdding(true)
        fetch('/cart/add.js', {
          method: 'post',
          body: new FormData(formRef?.current as HTMLFormElement),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 422) {
              throw new Error(data.description)
            } else {
              window?.weaverseCartHelpers?.notify('on_item_added', data)
            }
          })
          .catch((err) => {
            console.error(`Error adding product to cart: ${err.message}`)
          })
          .finally(() => {
            setAdding(false)
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
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <svg
                  width={12}
                  height={12}
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M376 232H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h368c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z" />
                </svg>
              </button>
              <input
                className="wv-quantity-input"
                type="number"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                aria-label="Product quantity input"
              />
              <button
                type="button"
                className="wv-quantity-button inc-button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
              >
                <svg
                  width={12}
                  height={12}
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M376 232H216V72c0-4.42-3.58-8-8-8h-32c-4.42 0-8 3.58-8 8v160H8c-4.42 0-8 3.58-8 8v32c0 4.42 3.58 8 8 8h160v160c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V280h160c4.42 0 8-3.58 8-8v-32c0-4.42-3.58-8-8-8z" />
                </svg>
              </button>
            </div>
            <button
              ref={atcRef}
              disabled={adding}
              onClick={handleATC}
              type="submit"
              className="wv-product-atc-button"
            >
              <span>{buttonText}</span>
              {adding && <Spinner />}
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
    <span className="wv-spinner-wrapper">
      <svg
        className="wv-spinner"
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
    </span>
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
    },
    '.wv-quantity-selector': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '10px',
      width: '130px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
    },
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
      width: '50px',
      height: '40px',
      fontSize: '16px',
      border: 'none',
      textAlign: 'center',
      backgroundColor: 'transparent',
      outline: 'none',
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
      position: 'relative',
      overflow: 'hidden',
    },
    '.wv-product-atc-button:hover': {
      backgroundColor: '#2c3e2f',
    },
    '.wv-spinner-wrapper': {
      position: 'absolute',
      inset: '0px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'inherit',
      '.wv-spinner': {
        width: '20px',
        height: '20px',
        animation: 'spin .75s linear infinite',
      },
    },
  },
  '@mobile': {
    '.wv-quantity-selector': {
      width: '110px',
    },
    '.wv-quantity-input': {
      width: '30px',
    },
  },
}

ProductBuyButton.defaultProps = {
  buttonText: 'Add to cart',
  soldOutText: 'Sold Out',
  unavailableText: 'Unavailable',
}

export default ProductBuyButton
