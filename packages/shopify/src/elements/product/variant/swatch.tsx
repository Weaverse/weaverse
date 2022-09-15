import React from 'react'
import { weaverseShopifyStoreData } from '../context'

export let Swatch = (props: any) => {
  let { option, value: defaultValue, handleOptionChange } = props
  let { swatches, presets } = weaverseShopifyStoreData
  let swatch = swatches.find((sw: any) => sw.name === option.name)
  let { colors, images } = presets
  if (swatch.type) {
    let defaultSrc = ''
    return (
      <div key={option.id}>
        <label className="swatch-label">
          <span className="option-display-name">
            {swatch.displayName || option.name}:
          </span>
          <span className="selected-value">{defaultValue}</span>
        </label>
        <div className="option-values">
          {option.values.map((val: any) => {
            // color
            let colorValue =
              colors.find((c: any) => c.name === val)?.value || '#ddd'
            // image
            let imageSrc =
              images.find((c: any) => c.name === val)?.value || defaultSrc
            //
            let inputId = `${option.name}${val}`
            return (
              <div key={val}>
                <input
                  checked={val === defaultValue}
                  onChange={(e) =>
                    handleOptionChange(option.position, e.target.value)
                  }
                  id={inputId}
                  type="radio"
                  name={option.name}
                  value={val}
                />
                <label
                  className={`wv-sw wv-sw-${swatch.type} wv-sw-${
                    swatch?.shape || 'square'
                  } ${colorValue === '#ffffff' ? 'bordered' : ''}`}
                  htmlFor={inputId}
                  style={{
                    ['--bg-image' as string]: imageSrc,
                    ['--bg-color' as string]: colorValue,
                  }}
                >
                  {swatch.type === 'button' && val}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <div key={option.id}>
      <label>{swatch.displayName || option.name}</label>
      <select
        value={defaultValue}
        onChange={(e) => handleOptionChange(option.position, e.target.value)}
        name={option.name}
        id={option.id.toString()}
      >
        {option.values.map((val: any) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  )
}
