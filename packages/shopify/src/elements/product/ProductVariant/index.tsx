import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'
import React, { forwardRef, useContext } from 'react'
import { ProductContext } from '~/context'
import type { OptionKey, ProductVariantProps } from '~/types'
import {
  getOptionItemStyle,
  getOptionsGroupConfigs,
  getVariantFromOptionArray,
  getVariantOptions,
} from '~/utils'
import { CombinedVariantSelector } from './CombinedVariantSelector'

let ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  (props, ref) => {
    let { optionsStyle, ...rest } = props
    let context = useContext(ProductContext)

    if (context) {
      let { product, selectedVariant, setSelectedVariant, ssrMode } = context
      if (selectedVariant) {
        let { variants, options } = product
        let hasOnlyDefaultVariant =
          product.has_only_default_variant ||
          (variants.length === 1 && variants[0].title === 'Default Title')
        let handleSelectOption = (position: number, value: string) => {
          let optionsArray = getVariantOptions(selectedVariant!)
          optionsArray[position - 1] = value
          let newVariant = getVariantFromOptionArray(product, optionsArray)
          setSelectedVariant(newVariant)
        }

        if (!hasOnlyDefaultVariant) {
          if (optionsStyle === 'combined') {
            return (
              <div ref={ref} {...rest}>
                <CombinedVariantSelector context={context} />
              </div>
            )
          }
          return (
            <div ref={ref} {...rest}>
              <input type="hidden" name="id" value={selectedVariant.id} />
              {options.map((option) => {
                let { name, position, values } = option
                let selectedValue =
                  selectedVariant?.[`option${position}` as OptionKey]
                let { optionDisplayName, optionDesign, style } =
                  getOptionsGroupConfigs(option)

                return (
                  <div
                    key={name + position}
                    className="wv-product-option"
                    style={style}
                  >
                    <div className="wv-product-option__label">
                      <span className="wv-product-option__display-name">
                        {optionDisplayName}:
                      </span>
                      <span className="wv-product-option__selected">
                        {selectedValue}
                      </span>
                    </div>
                    <div className="wv-product-option__values">
                      {values.map((value, idx) => {
                        let className = clsx(
                          'wv-product-option__value',
                          `wv-product-option__${optionDesign}`,
                          selectedValue === value &&
                            'wv-product-option__value--selected'
                        )
                        let style = getOptionItemStyle(
                          value,
                          optionDesign,
                          selectedVariant
                        )

                        return (
                          <div
                            key={value + idx}
                            className={className}
                            style={style}
                            onClick={() => handleSelectOption(position, value)}
                          >
                            {value}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
        return (
          <div ref={ref} {...rest}>
            <input type="hidden" name="id" value={selectedVariant.id} />
          </div>
        )
      }
    }
    return null
  }
)

ProductVariant.defaultProps = {
  optionsStyle: 'combined',
}

export let css: ElementCSS = {
  '@desktop': {
    display: 'flex',
    flexDirection: 'column',
    margin: '24px 0',
    '.wv-combined-variant__label': {
      marginBottom: '5px',
    },
    '.wv-combined-variant__selector': {
      backgroundColor: '#fff',
      border: '1px solid #ebebeb',
      borderRadius: '4px',
      lineHeight: '48px',
      transition: '.3s all',
      fontSize: '16px',
      height: '48px',
      width: 'fit-content',
      minWidth: '120px',
    },
    '.wv-product-option': {
      '&:not(:last-child)': {
        marginBottom: '20px',
      },
    },
    '.wv-product-option__label': {},
    '.wv-product-option__display-name': {
      marginRight: '4px',
      fontWeight: 'bold',
    },
    '.wv-product-option__values': {
      marginTop: '8px',
      display: 'flex',
      flexWrap: 'wrap',
    },
    '.wv-product-option__value': {
      display: 'inline-block',
      cursor: 'pointer',
      textTransform: 'capitalize',
      border: '1px solid #cbcbcb',
      transition: '.3s all',
      lineHeight: 'var(--size, 40px)',
      height: 'var(--size, 40px)',
      minWidth: 'var(--size, 40px)',
      textAlign: 'center',
      borderRadius: 'var(--radius, 0px)',
      '&:not(:last-child)': {
        marginBottom: '10px',
        marginRight: '10px',
      },
      '&:hover, &.wv-product-option__value--selected': {
        borderColor: '#222',
      },
      '&.wv-product-option__button': {
        padding: '0 10px',
      },
      '&.wv-product-option__color, &.wv-product-option__custom-image': {
        fontSize: '0',
        border: 'none',
        outline: '1px solid #cbcbcb',
        outlineOffset: '3px',
        marginLeft: '3px',
        '&:not(:last-child)': {
          marginBottom: '14px',
          marginRight: '14px',
        },
        '&:hover, &.wv-product-option__value--selected': {
          outlineColor: '#222',
        },
      },
    },
  },
}

export default ProductVariant
