---
title: useWeaverse
description: Hook for accessing the global Weaverse instance in Weaverse Hydrogen components.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 4
published: true
---

# useWeaverse

The `useWeaverse` hook provides access to the global Weaverse instance, giving components access to page data, component registry, theme settings, and other essential Weaverse functionality. It serves as the main entry point for interacting with the Weaverse system.

## Import

```tsx
import { useWeaverse } from '@weaverse/hydrogen'
```

## Type

```typescript
function useWeaverse(): WeaverseInstance
```

## Returns

- `WeaverseInstance` - The Weaverse instance containing global state and methods

## Common Use Patterns

### Accessing Global Theme Settings

Get access to global theme settings that apply across the entire storefront:

```tsx
import { useWeaverse } from '@weaverse/hydrogen'

export function GlobalFooter() {
  const { themeSettings } = useWeaverse()
  const { copyrightText, showSocialLinks, socialLinks } = themeSettings
  
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {showSocialLinks && socialLinks && (
          <div className="social-links">
            {socialLinks.map(link => (
              <a key={link.platform} href={link.url} target="_blank" rel="noopener">
                {link.platform}
              </a>
            ))}
          </div>
        )}
        <div className="copyright">{copyrightText}</div>
      </div>
    </footer>
  )
}
```

### Accessing Component Registry

Look up specific component instances from anywhere in your application:

```tsx
import { useWeaverse } from '@weaverse/hydrogen'

export function NavigationControls() {
  const { itemInstances } = useWeaverse()
  
  // Access header and announcement bar instances directly
  const header = itemInstances.get('site-header')
  const announcementBar = itemInstances.get('announcement-bar')
  
  const toggleAnnouncementBar = () => {
    if (announcementBar) {
      announcementBar.updateData({
        isVisible: !announcementBar.data.isVisible
      })
    }
  }
  
  const toggleStickyHeader = () => {
    if (header) {
      header.updateData({
        isSticky: !header.data.isSticky
      })
    }
  }
  
  return (
    <div className="nav-controls">
      <button onClick={toggleAnnouncementBar}>
        {announcementBar?.data.isVisible ? 'Hide' : 'Show'} Announcement
      </button>
      <button onClick={toggleStickyHeader}>
        {header?.data.isSticky ? 'Disable' : 'Enable'} Sticky Header
      </button>
    </div>
  )
}
```

### Accessing Page Data

Get access to the current page's data structure:

```tsx
import { useWeaverse } from '@weaverse/hydrogen'

export function PageInfo() {
  const { page } = useWeaverse()
  const { type, handle, title, sections } = page
  
  return (
    <div className="page-info">
      <h1>Current Page: {title}</h1>
      <div>Page Type: {type}</div>
      <div>Handle: {handle}</div>
      <div>Total Sections: {sections.length}</div>
    </div>
  )
}
```

### Global Event Handling

Listen to and dispatch global events across the Weaverse ecosystem:

```tsx
import { useWeaverse } from '@weaverse/hydrogen'
import { useEffect } from 'react'

export function CartSyncComponent() {
  const { eventBus } = useWeaverse()
  
  useEffect(() => {
    // Listen for cart updates from any component
    const unsubscribe = eventBus.on('cart:updated', (cartData) => {
      console.log('Cart was updated:', cartData)
      // Update UI based on cart changes
    })
    
    return () => {
      unsubscribe()
    }
  }, [])
  
  const addToCart = (productId, quantity) => {
    // Dispatch cart event that other components can listen for
    eventBus.emit('cart:add', { productId, quantity })
  }
  
  return (
    <button onClick={() => addToCart('product-123', 1)}>
      Add to Cart
    </button>
  )
}
```

## Core Properties

### `themeSettings`

- **Type**: `HydrogenThemeSettings`
- **Description**: Global theme settings like colors, typography, and layout options

### `itemInstances`

- **Type**: `Map<string, WeaverseItemStore>`
- **Description**: Registry of all component instances available in the current page

### `page`

- **Type**: `WeaversePage`
- **Description**: Current page data including type, handle, and sections

### `eventBus`

- **Type**: `EventBus`
- **Description**: Publish-subscribe system for cross-component communication

### `elementRegistry`

- **Type**: `Map<string, HTMLElement>`
- **Description**: Registry mapping component IDs to their DOM elements

## When To Use

- When you need to access global theme settings
- When you need to find and interact with components that aren't in the current component tree
- When implementing global state management or event handling
- When you need access to page-level configuration data

## Related

- [useItemInstance](/docs/api/use-item-instance) - Access a specific component instance
- [useParentInstance](/docs/api/use-parent-instance) - Access the parent component instance
- [useChildInstances](/docs/api/use-child-instances) - Access child component instances
- [useThemeSettings](/docs/api/use-theme-settings) - Access theme settings
