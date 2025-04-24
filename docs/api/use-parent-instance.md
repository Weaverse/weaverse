---
title: useParentInstance
description: Hook for accessing the parent component instance in Weaverse Hydrogen components.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 6
published: true
---

# useParentInstance

The `useParentInstance` hook allows a component to access its parent component's instance within the Weaverse component tree. This is useful for implementing child-parent communication patterns and accessing parent component data or methods.

## Import

```tsx
import { useParentInstance } from '@weaverse/hydrogen'
```

## Type

```typescript
function useParentInstance(): WeaverseItemStore | null
```

## Returns

- `WeaverseItemStore | null` - The parent component's instance, or `null` if no parent exists or can't be found

## Common Use Patterns

### Accessing Loader Data

The most common pattern is for child components to access loader data that was fetched by their parent component:

```tsx
import { useParentInstance } from '@weaverse/hydrogen'

export function ProductItems() {
  // Access the parent component's loader data
  const parent = useParentInstance();
  const { products } = parent.data.loaderData;
  
  return (
    <div className="product-grid">
      {products.nodes.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Getting Product/Collection Data in Feature Sections

Child components commonly use parent data to render products, collections, or other resources:

```tsx
import { useParentInstance } from '@weaverse/hydrogen'

export function CollectionItems() {
  const parent = useParentInstance();
  const collections = parent.data.loaderData;
  
  if (!collections?.length) {
    return <div>No collections available</div>;
  }
  
  return (
    <div className="collections-grid">
      {collections.map((collection) => (
        <CollectionCard 
          key={collection.id} 
          title={collection.title}
          image={collection.image}
          handle={collection.handle}
        />
      ))}
    </div>
  )
}
```

### Accessing Configuration Settings

Children can access configuration settings from parent components to adapt their rendering:

```tsx
function ReviewItem() {
  const parent = useParentInstance();
  const { showVerifiedBadge, verifiedBadgeText, showDate, showCountry } = parent.data;
  
  return (
    <div className="review-item">
      {/* Review content */}
      {showVerifiedBadge && (
        <span className="verified-badge">{verifiedBadgeText}</span>
      )}
      {showDate && <div className="review-date">{/* Date content */}</div>}
    </div>
  )
}
```

### Fetching External Data

Children can use parent data to determine what external data to fetch:

```tsx
function JudgemeReview() {
  const { useFetcher } = useRemixRuntime();
  const { load, data: fetchData } = useFetcher();
  const context = useParentInstance();
  
  // Get the product handle from the parent component
  const handle = context?.data?.product?.handle;
  const api = `/api/review/${handle}`;
  
  useEffect(() => {
    if (!handle) return;
    load(api);
  }, [handle, api, load]);
  
  // Render the reviews
}
```

## Implementation Details

The `useParentInstance` hook:

1. Uses React's context API to access the current component's context, which includes the parent ID.
2. Looks up the parent instance in the Weaverse component registry using the parent ID.
3. Returns the parent component instance, which includes all its data and methods.

```tsx
export let useParentInstance = () => {
  let { parentId } = useContext(WeaverseItemContext)
  return useItemInstance(parentId || '')
}
```

## When To Use

- When a child component needs to access data or configuration from its parent.
- When implementing coordinated behavior between parent and child components.
- When you need to access loader data that was fetched at the parent level.
- When a child component's rendering depends on parent component state or settings.

## Related

- [useItemInstance](/docs/api/use-item-instance) - Access a specific component instance
- [useChildInstances](/docs/api/use-child-instances) - Access child component instances
- [useWeaverse](/docs/api/use-weaverse) - Access the Weaverse instance
