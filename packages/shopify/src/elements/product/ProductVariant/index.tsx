import type { ElementCSS } from '@weaverse/react'
import React, { forwardRef, useContext, useEffect } from 'react'
import { ProductContext } from '~/context'
import type { ProductVariantProps } from '~/types'
import {
  getOptionsGroupConfigs,
  getVariantFromOptionArray,
  getVariantOptions,
} from '~/utils'
import { CombinedVariantSelector } from './CombinedVariantSelector'
import { OptionValues } from './OptionValues'

let ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  (props, ref) => {
    let { optionsStyle, ...rest } = props
    let context = useContext(ProductContext)
    let [selectedOptions, setSelectedOptions] = React.useState<string[]>(() => {
      if (context?.selectedVariant) {
        return getVariantOptions(context.selectedVariant)
      }
      return []
    })

    useEffect(() => {
      if (context?.selectedVariant) {
        setSelectedOptions(getVariantOptions(context.selectedVariant))
      }
    }, [context?.selectedVariant])

    if (context) {
      let { product, selectedVariant, setSelectedVariant } = context
      let { variants, options } = product
      let hasOnlyDefaultVariant =
        product.has_only_default_variant ||
        (variants.length === 1 && variants[0].title === 'Default Title')

      let handleSelectOption = (position: number, value: string) => {
        selectedOptions[position - 1] = value
        let newVariant = getVariantFromOptionArray(product, selectedOptions)
        setSelectedVariant(newVariant)
        setSelectedOptions(selectedOptions)
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
            <input type="hidden" name="id" value={selectedVariant?.id} />
            {options.map((option) => {
              let { name, position } = option
              let selectedValue = selectedOptions[position - 1]
              let { optionDisplayName, optionDesign, style } =
                getOptionsGroupConfigs(option)

              return (
                <div
                  key={name + position}
                  className="wv-product-option"
                  style={style}
                >
                  <div className="wv-option__label">
                    <span className="wv-option__display-name">
                      {optionDisplayName}:
                    </span>
                    <span className="wv-option__selected-value">
                      {selectedValue}
                    </span>
                  </div>
                  <OptionValues
                    product={product}
                    option={option}
                    type={optionDesign}
                    selectedValue={selectedValue}
                    onSelect={handleSelectOption}
                  />
                </div>
              )
            })}
          </div>
        )
      }
      return (
        <div ref={ref} {...rest}>
          <input type="hidden" name="id" value={selectedVariant?.id} />
        </div>
      )
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
    '.wv-combined-variant__selector, .wv-option__dropdown': {
      border: '1px solid #222',
      borderRadius: '4px',
      lineHeight: '48px',
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
    '.wv-option__label': {
      marginBottom: '8px',
    },
    '.wv-option__display-name': {
      marginRight: '4px',
      fontWeight: 'bold',
    },
    '.wv-option__values': {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    '.wv-option__value': {
      display: 'inline-block',
      cursor: 'pointer',
      textTransform: 'capitalize',
      transition: '.3s all',
      minWidth: 'var(--size, 40px)',
      borderRadius: 'var(--radius, 0px)',
      marginBottom: '10px',
      marginRight: '10px',
      '&.wv-option__button': {
        padding: '0 10px',
        lineHeight: 'var(--size, 40px)',
        textAlign: 'center',
      },
      '&.wv-option__variant-image': {
        aspectRatio: 'var(--aspect-ratio, 1/1)',
      },
      '&.wv-option__button, &.wv-option__color, &.wv-option__custom-image': {
        height: 'var(--size, 40px)',
      },
      '&.wv-option__button, &.wv-option__variant-image': {
        border: '1px solid #cbcbcb',
        '&:hover, &.selected': {
          borderColor: '#222',
        },
      },
      '&.wv-option__custom-image, &.wv-option__variant-image': {
        fontSize: '0',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
      '&.wv-option__color, &.wv-option__custom-image': {
        fontSize: '0',
        outlineOffset: '3px',
        marginLeft: '3px',
        marginBottom: '14px',
        marginRight: '14px',
        outline: '1px solid #cbcbcb',
        '&:hover, &.selected': {
          outlineColor: '#222',
        },
      },
    },
  },
}

export default ProductVariant
