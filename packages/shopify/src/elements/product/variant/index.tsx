import React, { forwardRef, useContext } from 'react'
import type { ElementCSS} from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { Swatch } from './swatch'
import { ProductContext } from '~/elements/context'
import type { ProductVariantProps } from '~/types'

let ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  (props, ref) => {
    let { variantType, ...rest } = props
    let { product, formId, variantId, onChangeVariant } =
      useContext(ProductContext)
    let { ssrMode } = useContext(WeaverseContext)
    if (ssrMode) {
      return (
        <input
          type="hidden"
          name="id"
          value="{{ wv_product.selected_or_first_available_variant.id }}"
          disabled
        />
      )
    }

    let variants = product.variants || []
    let variant =
      variants.find((variant) => variant.id === variantId) || variants[0]
    let defaultSelectComp = (
      <select
        name="id"
        value={variantId}
        onChange={(e) => onChangeVariant(Number.parseInt(e.target.value))}
        form={formId}
      >
        {product.variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.title}
          </option>
        ))}
      </select>
    )
    if (variantType === 'custom') {
      let { options } = product
      let handleOptionChange = (pos: number, val: string) => {
        let optArr = variant.title.split(' / ') || []
        optArr[pos - 1] = val
        let newTitle = optArr.join(' / ')
        let newVariant = variants.find((variant) => variant.title === newTitle)
        newVariant && onChangeVariant(newVariant.id)
      }
      let swatchesOptionComp = options.map((opt) => {
        // @ts-ignore
        let defaultValue = variant[`option${opt.position}`]
        return (
          <Swatch
            key={opt.position}
            value={defaultValue}
            option={opt}
            handleOptionChange={handleOptionChange}
          />
        )
      })
      return (
        <div ref={ref} {...rest}>
          {/*TODO add default css when finish styling*/}
          <style>
            {`
              [data-wv-type="product-variant"] select {
                display: none;
              }
              [data-wv-type="product-variant"] {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
              label.swatch-label {display: inline-block; margin-bottom: 8px;}
              span.option-display-name {font-weight: bold;}
              span.selected-value {margin-left: 8px;}
              div.option-values {
                display: flex;
                gap: 8px;
                align-items: center;
              }
              label.wv-sw:hover, input:checked + label.wv-sw {
                border-color: #212568;
                background-clip: content-box;
              }
              label.wv-sw-button:hover, input:checked + label.wv-sw-button {
                background-color: #212568;
                color: #fff;
                background-clip: border-box;
              }
              input[type=radio] {display: none;}
              label.wv-sw {
                 width: 40px;
                 height: 40px;
                 padding: 2px;
                 display: inline-flex;
                 justify-content: center;
                 align-items: center;
                 border: 1px solid;
                 cursor: pointer;
              }
              label.wv-sw-round {
                border-radius: 10px;
              }
              label.wv-sw-circle {
                border-radius: 100%;
              }
              label.wv-sw-color {
                background-color: var(--bg-color);
              }
              label.wv-sw-color.bordered {
                border: 1px solid #333;
              }
              label.wv-sw-image {
                background-image: url(var(--bg-image));
              }
            `}
          </style>
          {defaultSelectComp}
          {swatchesOptionComp}
        </div>
      )
    }
    return (
      <div ref={ref} {...rest}>
        {defaultSelectComp}
      </div>
    )
  }
)

export let css: ElementCSS = {
  '@desktop': {
    select: {
      width: '100%',
      padding: 10,
      border: 'none',
      background: '#f0f0f0f0',
    },
  },
}

ProductVariant.defaultProps = {
  variantType: 'custom',
}

export let permanentCss: ElementCSS = {
  '@desktop': {},
}

export default ProductVariant
