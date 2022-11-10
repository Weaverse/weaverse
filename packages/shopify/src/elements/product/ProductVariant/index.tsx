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
    let { optionsStyle, hideUnavailableOptions, ...rest } = props
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
        if (optionsStyle === 'combined') {
          return (
            <div ref={ref} {...rest}>
              <CombinedVariantSelector context={context} />
            </div>
          )
        }
        let style = {
          '--wv-option-border-color': '#cbcbcb',
          '--wv-selected-option-border-color': '#232323',
        } as React.CSSProperties

        return (
          <div ref={ref} style={style} {...rest}>
            <input type="hidden" name="id" value={selectedVariant?.id} />
            {product.options.map((option) => {
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
                    selectedOptions={selectedOptions}
                    onSelect={handleSelectOption}
                    hideUnavailableOptions={hideUnavailableOptions}
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
    },
    '.wv-option__label': {
      marginBottom: '6px',
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
      '& > span': {
        width: '100%',
        height: '100%',
        display: 'inline-block',
        borderRadius: 'var(--radius, 0px)',
      },
      '&.sold-out, &.unavailable': {
        opacity: '0.6',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          zIndex: '1',
          inset: '0px',
          opacity: '1',
          border: 'none',
          visibility: 'visible',
          background: 'no-repeat center/100% 100% rgba(0,0,0,-2.95)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(112, 113, 115, 0.5)' stroke-width='0.4' preserveAspectRatio='none' %3E%3Cline x1='24' y1='0' x2='0' y2='24'%3E%3C/line%3E%3C/svg%3E\")",
        },
      },
      '&.unavailable.hidden': {
        display: 'none',
      },
      '&.wv-option__button': {
        padding: '0 10px',
        lineHeight: 'var(--size, 40px)',
        textAlign: 'center',
      },
      '&.wv-option__color > span': {
        backgroundColor: 'var(--background-color)',
      },
      '&.wv-option__variant-image': {
        aspectRatio: 'var(--aspect-ratio, 1/1)',
      },
      '&.wv-option__button, &.wv-option__color, &.wv-option__custom-image': {
        height: 'var(--size, 40px)',
      },
      '&.wv-option__button, &.wv-option__color, &.wv-option__variant-image, &.wv-option__custom-image':
        {
          border: '1px solid var(--wv-option-border-color)',
          '&:hover, &.selected': {
            borderColor: 'var(--wv-selected-option-border-color)',
          },
        },
      '&.wv-option__custom-image, &.wv-option__variant-image': {
        fontSize: '0',
        backgroundColor: 'var(--background-color)',
        backgroundImage: 'var(--background-image)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
      '&.wv-option__color, &.wv-option__custom-image': {
        fontSize: '0',
        padding: '3px',
        // borderColor: 'var(--wv-selected-option-border-color)',
        // outlineOffset: '3px',

        // marginLeft: '3px',
        // marginBottom: '14px',
        // marginRight: '14px',
        // outline: '1px solid var(--wv-option-border-color)',
        '&:hover, &.selected': {
          // outlineColor: 'var(--wv-selected-option-border-color)',
          // borderColor: 'var(--wv-selected-option-border-color)',
        },
      },
    },
  },
}

export default ProductVariant
