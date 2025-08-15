---
title: useItemInstance
description: Hook for accessing specific component instances in Weaverse Hydrogen components.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 8
published: true
---

# useItemInstance

The `useItemInstance` hook allows you to access and interact with a specific component instance in the Weaverse component tree by its ID. This gives you direct access to the component's data and methods, allowing for advanced interactions and updates.

## Import

```tsx
import { useItemInstance } from '@weaverse/hydrogen'
```

## Type

```typescript
function useItemInstance(id: string): WeaverseItemStore | null
```

## Parameters

- `id: string` - The unique identifier of the component instance to access

## Returns

- `WeaverseItemStore | null` - The component instance, or `null` if no component with the provided ID exists

## Common Use Patterns

### Directly Accessing Component Data

Access and use a specific component's data anywhere in your application:

```tsx
import { useItemInstance } from '@weaverse/hydrogen'

export function ProductDetails() {
  // Access a specific product showcase component by ID
  const showcase = useItemInstance('product-showcase-123')
  
  if (!showcase) {
    return <div>Showcase not found</div>
  }
  
  const { product, selectedVariant, showPricing } = showcase.data
  
  return (
    <div className="product-details">
      <h2>{product.title}</h2>
      {showPricing && selectedVariant && (
        <div className="price">${selectedVariant.price.amount}</div>
      )}
    </div>
  )
}
```

### Finding the Closest Weaverse Component

Use the hook to find the closest Weaverse component to a given element, which is useful for custom integrations:

```tsx
import { useItemInstance } from '@weaverse/hydrogen'
import { useRef, useEffect, useState } from 'react'

export function useClosestWeaverseItem(ref) {
  const [weaverseId, setWeaverseId] = useState('')
  const weaverseItem = useItemInstance(weaverseId)

  useEffect(() => {
    if (!weaverseItem && ref.current) {
      const closest = ref.current.closest('[data-wv-id]')
      if (closest) {
        setWeaverseId(closest.getAttribute('data-wv-id'))
      }
    }
  }, [ref])

  return weaverseItem
}
```

### Accessing and Updating Component State

Use the hook to read and update component state:

```tsx
import { useItemInstance } from '@weaverse/hydrogen'

export function ProductFilterControls() {
  const productGrid = useItemInstance('product-grid-main')
  
  if (!productGrid) return null
  
  const { filters, activeFilters } = productGrid.data
  
  const toggleFilter = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId]
      
    productGrid.updateData({
      activeFilters: newActiveFilters
    })
  }
  
  return (
    <div className="filter-controls">
      {filters.map(filter => (
        <button 
          key={filter.id}
          onClick={() => toggleFilter(filter.id)}
          className={activeFilters.includes(filter.id) ? 'active' : ''}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
```

## Implementation Details

The `useItemInstance` hook accesses the component registry in the Weaverse context to find and return the requested component instance. It returns `null` if no component with the provided ID exists.

## Core Methods and Properties

### `data`

- **Type**: `any`
- **Description**: Contains all the component's data, including its props, state, and any custom data.

### `updateData(newData)`

- **Parameters**: `newData: Partial<ComponentData>`
- **Returns**: `void`
- **Description**: Updates the component's data and triggers a re-render.

### `triggerUpdate()`

- **Returns**: `void`
- **Description**: Forces the component to re-render without changing its data.

### `_id`

- **Type**: `string`
- **Description**: The unique identifier of the component instance.

### `_element`

- **Type**: `HTMLElement | null`
- **Description**: Reference to the component's DOM node, if available.

## When To Use

- When you need to access or manipulate a component that's not in the current component hierarchy
- When implementing custom integrations that need to interact with specific Weaverse components
- When building advanced features that require direct access to component instances
- When implementing cross-component communication patterns

## Related

- [useParentInstance](/docs/api/use-parent-instance) - Access the parent component instance
- [useChildInstances](/docs/api/use-child-instances) - Access child component instances
- [useWeaverse](/docs/api/use-weaverse) - Access the Weaverse instance
