import clsx from 'clsx'
import React from 'react'
import type { OptionValuesProps } from '~/types'
import { getOptionItemStyle } from '~/utils'

export function OptionValues(props: OptionValuesProps) {
  let { product, option, type, selectedValue, onSelect } = props
  let { values, position } = option

  if (type === 'dropdown') {
    return (
      <select
        className="wv-option__dropdown"
        value={selectedValue!}
        onChange={(e) => onSelect(position, e.target.value)}
      >
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="wv-option__values">
      {values.map((value, idx) => {
        let className = clsx(
          'wv-option__value',
          `wv-option__${type}`,
          selectedValue === value && 'selected'
        )
        let style = getOptionItemStyle(value, type, position, product)

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
