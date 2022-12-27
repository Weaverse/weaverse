import type { ElementCSS } from '@weaverse/react'
import { Components } from '@weaverse/react'
import clsx from 'clsx'
import React from 'react'
import type { ShopifyProduct } from '~/types'
import { getOptionItemStyle, getOptionsGroupConfigs } from '~/utils'
let { Tooltip } = Components

export function ProductCardOptions(props: { product: ShopifyProduct }) {
  let { product } = props
  let { options, url, variants } = product
  let foundOption = options.find((option) => option.name === 'Color')
  if (foundOption) {
    let { values, position } = foundOption
    let { optionDesign, style } = getOptionsGroupConfigs(foundOption)
    style['--size'] = '30px'

    return (
      <div className="wv-pcard__options" style={style}>
        {values.map((value, idx) => {
          let style = getOptionItemStyle(value, optionDesign, position, product)
          let shouldShowTooltip = [
            'color',
            'custom-image',
            'variant-image',
          ].includes(optionDesign)
          let className = clsx(
            'wv-option__value',
            `wv-option__${optionDesign}`,
            shouldShowTooltip && 'wv-tooltip-container'
          )
          let foundVariant = variants.find(
            (v) => v.options[position - 1] === value
          )
          let productURL = url
          if (foundVariant) {
            productURL = `${url}?variant=${foundVariant.id}`
          }

          return (
            <a
              href={productURL}
              target="_self"
              key={value + idx}
              className={className}
              style={style}
            >
              <span>{value}</span>
              {shouldShowTooltip && <Tooltip>{value}</Tooltip>}
            </a>
          )
        })}
      </div>
    )
  }
  return null
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-pcard__options': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '12px',
      '.wv-option__value': {
        display: 'inline-block',
        cursor: 'pointer',
        textTransform: 'capitalize',
        transition: '.3s all',
        minWidth: 'var(--size, 40px)',
        borderRadius: 'var(--radius, 0px)',
        marginBottom: '6px',
        marginRight: '6px',
        '& > span': {
          width: '100%',
          height: '100%',
          display: 'inline-block',
          borderRadius: 'var(--radius, 0px)',
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
            border: '1px solid #dfdfdf',
            '&:hover': {
              borderColor: '#222',
            },
          },
        '&.wv-option__variant-image, &.wv-option__custom-image > span': {
          fontSize: '0',
          backgroundColor: 'var(--background-color)',
          backgroundImage: 'var(--background-image)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        },
        '&.wv-option__color, &.wv-option__custom-image': {
          fontSize: '0',
          '&:hover': {
            padding: '2px',
          },
        },
      },
    },
  },
}
