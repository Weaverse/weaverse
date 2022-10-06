import React, { forwardRef, useContext } from 'react'
import type { ElementCSS } from '@weaverse/react'
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
  '@desktop': {
    select: { display: 'none' },
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    'label.swatch-label': { display: 'inline-block', marginBottom: 8 },
    'span.option-display-name': { fontWeight: 'bold' },
    'span.selected-value': { marginLeft: 8 },
    'div.option-values': { display: 'flex', gap: 8, alignItems: 'center' },
    'label.wv-sw': {
      '&:hover': { borderColor: '#212568', backgroundClip: 'content-box' },
      width: 40,
      height: 40,
      padding: 2,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid',
      cursor: 'pointer',
    },
    input: {
      '&:checked': {
        '+': {
          'label.wv-sw': {
            borderColor: '#212568',
            backgroundClip: 'content-box',
          },
          'label.wv-sw-button': {
            backgroundColor: '#212568',
            color: '#fff',
            backgroundClip: 'border-box',
          },
        },
      },
    },
    'label.wv-sw-button': {
      '&:hover': {
        backgroundColor: '#212568',
        color: '#fff',
        backgroundClip: 'border-box',
      },
    },
    'input[type=radio]': { display: 'none' },
    'label.wv-sw-round': { borderRadius: 10 },
    'label.wv-sw-circle': { borderRadius: '100%' },
    'label.wv-sw-color': { backgroundColor: 'var(--bg-color)' },
    'label.wv-sw-color.bordered': { border: '1px solid #333' },
    'label.wv-sw-image': { backgroundImage: 'url(var(--bg-image))' },
  },
}

export default ProductVariant
