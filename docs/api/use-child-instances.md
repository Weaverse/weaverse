---
title: useChildInstances
description: Hook for accessing child component instances in Weaverse Hydrogen components.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 4
published: true
---

# useChildInstances

The `useChildInstances` hook provides access to an array of all direct child component instances of a Weaverse component. This allows parent components to interact with, manipulate, or read data from their children.

## Import

```tsx
import { useChildInstances } from '@weaverse/hydrogen'
```

## Type

```typescript
function useChildInstances(id?: string): WeaverseItemStore[]
```

## Parameters

- `id?: string` - (Optional) The ID of the component whose children to retrieve. If not provided, uses the current component's ID.

## Returns

- `WeaverseItemStore[]` - An array of child component instances, or an empty array if no children exist

## Common Use Patterns

### Coordinating Layout and Styles

Parent components can coordinate layout and styling across all children:

```tsx
import { useChildInstances } from '@weaverse/hydrogen'

export function ProductGrid() {
  // Access configuration settings
  const { gridColumns, gapSize } = useThemeSettings()
  
  // Get all child instances
  const childInstances = useChildInstances()
  
  // Apply consistent layout rules to all children
  useEffect(() => {
    childInstances.forEach(child => {
      child.updateData({
        width: `calc(100% / ${gridColumns})`,
        margin: `${gapSize}px`,
      })
    })
  }, [childInstances, gridColumns, gapSize])
  
  return (
    <div className={`grid grid-cols-${gridColumns} gap-${gapSize}`}>
      {/* Child components rendered here by Weaverse */}
    </div>
  )
}
```

### Managing Interactive Elements

Parent components can manage interactive functionality across children, such as in carousel or tab implementations:

```tsx
import { useChildInstances, useState } from '@weaverse/hydrogen'

export function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = useChildInstances()
  
  // Set visibility state on slides based on active index
  useEffect(() => {
    slides.forEach((slide, index) => {
      slide.updateData({
        isVisible: index === activeIndex,
        zIndex: index === activeIndex ? 10 : 1,
      })
    })
  }, [slides, activeIndex])
  
  return (
    <div className="carousel">
      <div className="carousel-container">
        {/* Slides rendered here by Weaverse */}
      </div>
      <div className="carousel-controls">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Summarizing Child Data

Parent components can collect and summarize data from child components:

```tsx
import { useChildInstances } from '@weaverse/hydrogen'

export function ReviewsSection() {
  const reviewItems = useChildInstances()
  
  // Calculate average rating from all review items
  const averageRating = useMemo(() => {
    if (reviewItems.length === 0) return 0
    
    const total = reviewItems.reduce((sum, item) => {
      const { rating } = item.getSnapShot()
      return sum + (rating || 0)
    }, 0)
    
    return total / reviewItems.length
  }, [reviewItems])
  
  return (
    <div className="reviews-section">
      <div className="reviews-summary">
        <h2>Customer Reviews</h2>
        <div className="average-rating">{averageRating.toFixed(1)} / 5</div>
      </div>
      <div className="reviews-list">
        {/* Review items rendered here by Weaverse */}
      </div>
    </div>
  )
}
```

## Implementation Details

The `useChildInstances` hook:

1. Calls `useItemInstance` to get the current component instance (or the instance with the provided ID)
2. Accesses the children data from the component instance
3. Maps through the children IDs to retrieve each child instance from the Weaverse registry
4. Returns an array of child component instances

```tsx
export let useChildInstances = (id?: string) => {
  let currentInstance = useItemInstance(id)
  if (!currentInstance) return []
  let { itemInstances } = Weaverse

  let {
    data: { children },
  } = currentInstance
  return children.map(({ id }: { id: string }) => {
    return itemInstances.get(id)
  }) as WeaverseItemStore[]
}
```

## When To Use

- When parent components need to coordinate the behavior or appearance of their children
- When implementing interactive components like carousels, tabs, or accordions
- When collecting or summarizing data from multiple child components
- When applying consistent styling or layout rules across child components

## Related

- [useItemInstance](/docs/api/use-item-instance) - Access a specific component instance
- [useParentInstance](/docs/api/use-parent-instance) - Access the parent component instance
- [useWeaverse](/docs/api/use-weaverse) - Access the Weaverse instance
