import React, { useState } from 'react'

import { Components } from '~/components'
let { Icon } = Components

export function QuantitySelector() {
  let [quantity, setQuantity] = useState(1)
  let onQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  return (
    <div className="wv-quantity-selector">
      <button
        className="wv-quantity-button dec-button"
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQuantity(quantity - 1)}
        disabled={quantity <= 1}
      >
        <Icon name="Minus" />
      </button>
      <input
        className="wv-quantity-input"
        type="number"
        name="quantity"
        value={quantity}
        onChange={onQuantityInputChange}
        aria-label="Product quantity input"
      />
      <button
        type="button"
        className="wv-quantity-button inc-button"
        aria-label="Increase quantity"
        onClick={() => setQuantity(quantity + 1)}
      >
        <Icon name="Plus" />
      </button>
    </div>
  )
}
