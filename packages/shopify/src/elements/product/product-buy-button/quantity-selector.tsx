import { useState } from 'react'

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
        aria-label="Decrease quantity"
        className="wv-quantity-button dec-button"
        disabled={quantity <= 1}
        onClick={() => setQuantity(quantity - 1)}
        type="button"
      >
        <Icon name="Minus" />
      </button>
      <input
        aria-label="Product quantity input"
        className="wv-quantity-input"
        name="quantity"
        onChange={onQuantityInputChange}
        type="number"
        value={quantity}
      />
      <button
        aria-label="Increase quantity"
        className="wv-quantity-button inc-button"
        onClick={() => setQuantity(quantity + 1)}
        type="button"
      >
        <Icon name="Plus" />
      </button>
    </div>
  )
}
