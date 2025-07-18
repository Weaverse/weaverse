import type { ElementCSS } from '@weaverse/react'

import { forwardRef } from 'react'
import { useProductContext } from '~/hooks/use-product-context'
import type { ProductVariantProps } from '~/types'
import { getOptionsGroupConfigs } from '~/utils/option'
import { getVariantFromOptionArray } from '~/utils/variant'
import { CombinedVariantSelector } from './combined-variant-selector'
import { OptionValues, css as optionValuesCss } from './option-values'
import { useOptions } from './use-options'

let ProductVariant = forwardRef<HTMLDivElement, ProductVariantProps>(
  (props, ref) => {
    let { optionsStyle, showTooltip, hideUnavailableOptions, ...rest } = props
    let context = useProductContext()
    let [selectedOptions, setSelectedOptions] = useOptions(context)
    let { product, selectedVariant, setSelectedVariant } = context

    let handleSelectOption = (position: number, value: string) => {
      selectedOptions[position - 1] = value
      let newVariant = getVariantFromOptionArray(product, selectedOptions)
      if (!newVariant && hideUnavailableOptions) {
        let newOptions = selectedOptions.filter((_, idx) => idx < position)
        newVariant = getVariantFromOptionArray(product, newOptions)
        selectedOptions = newVariant.options
      }
      setSelectedVariant(newVariant)
      setSelectedOptions([...selectedOptions])
    }

    if (!product.has_only_default_variant) {
      let style = {
        '--wv-option-border-color': '#cbcbcb',
        '--wv-selected-option-border-color': '#232323',
      } as React.CSSProperties

      if (optionsStyle === 'combined') {
        return (
          <div ref={ref} {...rest} style={style}>
            <CombinedVariantSelector context={context} />
          </div>
        )
      }

      return (
        <div ref={ref} {...rest} style={style}>
          <input name="id" type="hidden" value={selectedVariant?.id} />
          {product.options.map((option) => {
            let { name, position } = option
            let selectedValue = selectedOptions[position - 1]
            let { optionDisplayName, optionDesign, style } =
              getOptionsGroupConfigs(option)

            return (
              <div
                className="wv-product-option"
                key={name + position}
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
                  hideUnavailableOptions={hideUnavailableOptions}
                  onSelect={handleSelectOption}
                  option={option}
                  product={product}
                  selectedOptions={selectedOptions}
                  selectedValue={selectedValue}
                  showTooltip={showTooltip}
                  type={optionDesign}
                />
              </div>
            )
          })}
        </div>
      )
    }
    return (
      <div data-has-only-default-variant ref={ref} {...rest}>
        <input name="id" type="hidden" value={selectedVariant?.id} />
      </div>
    )
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
      border: '1px solid var(--wv-selected-option-border-color)',
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
      '.wv-option__label': {
        marginBottom: '6px',
        '.wv-option__display-name': {
          marginRight: '6px',
          fontWeight: 'bold',
        },
      },
      ...optionValuesCss['@desktop'],
    },
    '&[data-has-only-default-variant]': {
      display: 'none',
    },
  },
}

export default ProductVariant
