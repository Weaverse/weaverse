import clsx from 'clsx'
import React from 'react'
import type { OptionValuesProps } from '~/types'
import { getOptionItemStyle, getSoldOutAndUnavailableState } from '~/utils'

export function OptionValues(props: OptionValuesProps) {
  let { product, option, type, selectedValue, selectedOptions, onSelect } =
    props
  let { values, position } = option

  if (type === 'dropdown') {
    return (
      <select
        className="wv-option__dropdown"
        defaultValue={selectedValue || values[0]}
        onChange={(e) => onSelect(position, e.target.value)}
      >
        {values.map((value, idx) => {
          let state = getSoldOutAndUnavailableState(
            value,
            position,
            product,
            selectedOptions
          )
          let className = clsx(
            state.soldOut && 'sold-out',
            state.unavailable && 'unavailable'
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
          selectedOptions
        )
        let className = clsx(
          'wv-option__value',
          `wv-option__${type}`,
          selectedValue === value && 'selected',
          state.soldOut && 'sold-out',
          state.unavailable && 'unavailable'
        )

        return (
          <div
            key={value + idx}
            className={className}
            style={style}
            onClick={() => onSelect(position, value)}
          >
            {value}
          </div>
        )
      })}
    </div>
  )
}
