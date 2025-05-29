import type { ElementCSS } from '@weaverse/react'
import clsx from 'clsx'

import { Components } from '~/components'
import type { OptionValuesProps } from '~/types'
import {
  getOptionItemStyle,
  getSoldOutAndUnavailableState,
} from '~/utils/option'

let { Tooltip } = Components

export function OptionValues(props: OptionValuesProps) {
  let {
    product,
    option,
    type,
    selectedValue,
    selectedOptions,
    onSelect,
    showTooltip,
    hideUnavailableOptions,
  } = props
  let { values, position } = option

  if (type === 'dropdown') {
    return (
      <select
        className="wv-option__dropdown"
        value={selectedValue || values[0]}
        onChange={(e) => onSelect(position, e.target.value)}
      >
        {values.map((value, idx) => {
          let state = getSoldOutAndUnavailableState(
            value,
            position,
            product,
            selectedOptions,
          )
          if (hideUnavailableOptions && state.unavailable) {
            return null
          }

          let className = clsx(
            state.soldOut && 'sold-out',
            state.unavailable && 'unavailable',
          )
          return (
            <option key={value + idx} value={value} className={className}>
              {value}
            </option>
          )
        })}
      </select>
    )
  }

  return (
    <div className="wv-option__values">
      {values.map((value, idx) => {
        let style = getOptionItemStyle(value, type, position, product)
        let state = getSoldOutAndUnavailableState(
          value,
          position,
          product,
          selectedOptions,
        )
        let shouldShowTooltip =
          showTooltip &&
          ['color', 'custom-image', 'variant-image'].includes(type)

        let className = clsx(
          'wv-option__value',
          `wv-option__${type}`,
          selectedValue === value && 'selected',
          state.soldOut && 'sold-out',
          state.unavailable && [
            'unavailable',
            hideUnavailableOptions && 'hidden',
          ],
        )
        let wrapperClassName = clsx(
          'wv-option__value-container',
          shouldShowTooltip && 'wv-tooltip-container',
        )

        return (
          <div key={value + idx} className={wrapperClassName}>
            <div
              className={className}
              style={style}
              onClick={() => onSelect(position, value)}
            >
              <span>{value}</span>
            </div>
            {shouldShowTooltip && <Tooltip>{value}</Tooltip>}
          </div>
        )
      })}
    </div>
  )
}

export let css: ElementCSS = {
  '@desktop': {
    '.wv-option__values': {
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '10px',
      '.wv-option__value-container': {
        display: 'inline-flex',
        '.wv-option__value': {
          display: 'inline-block',
          cursor: 'pointer',
          textTransform: 'capitalize',
          transition: '.3s all',
          minWidth: 'var(--size, 40px)',
          borderRadius: 'var(--radius, 0px)',
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
              background: 'no-repeat center/100% 100% rgba(0,0,0,0)',
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
          '&.wv-option__button, &.wv-option__color, &.wv-option__custom-image':
            {
              height: 'var(--size, 40px)',
            },
          '&.wv-option__button, &.wv-option__color, &.wv-option__variant-image, &.wv-option__custom-image':
            {
              border: '1px solid var(--wv-option-border-color)',
              '&:hover, &.selected': {
                borderColor: 'var(--wv-selected-option-border-color)',
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
            padding: '3px',
          },
        },
      },
    },
  },
}
