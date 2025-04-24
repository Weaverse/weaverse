---
title: useThemeSettings
description: The useThemeSettings hook provides a simple way for Weaverse Hydrogen components to retrieve and utilize the global theme settings.
publishedAt: October 10, 2023
updatedAt: April 24, 2025
order: 5
published: true
---

# useThemeSettings

The `useThemeSettings` hook provides access to the global theme settings within a Weaverse Hydrogen theme, enabling components to adapt to merchant-configured preferences set in Weaverse Studio.

## Import

```tsx
import { useThemeSettings } from '@weaverse/hydrogen'
```

## Type

```typescript
function useThemeSettings<T = HydrogenThemeSettings>(): T
```

Where `HydrogenThemeSettings` is a flexible object type that contains all your theme's global settings.

## Usage

Call the hook within a React component to get an object containing the current global theme settings:

### Basic example

```tsx
import { useThemeSettings } from '@weaverse/hydrogen'

export function GlobalStyle() {
  const settings = useThemeSettings()
  
  if (settings) {
    const {
      bodyBaseSize,
      bodyBaseLineHeight,
      headingBaseSize,
      // more settings...
    } = settings

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --body-base-size: ${bodyBaseSize}px;
              --body-base-line-height: ${bodyBaseLineHeight};
              --heading-base-size: ${headingBaseSize}px;
            }
          `,
        }}
      />
    )
  }
  return null
}
```

### With TypeScript for type safety

```tsx
import { useThemeSettings } from '@weaverse/hydrogen'

type MyThemeSettings = {
  colorPrimary: string;
  colorSecondary: string;
  buttonBorderRadius: number;
  navHeightMobile: number;
  bodyBaseSize: number;
  bodyBaseLineHeight: number;
  // other theme settings
}

export function Header() {
  const settings = useThemeSettings<MyThemeSettings>() 
  
  return (
    <header style={{ 
      height: `${settings.navHeightMobile}rem`,
      backgroundColor: settings.colorPrimary 
    }}>
      {/* Header content */}
    </header>
  )
}
```

### Conditional rendering based on theme settings

```tsx
import { useThemeSettings } from '@weaverse/hydrogen'

export function ProductCard() {
  const { showPrices, enableQuickView, productCardStyle } = useThemeSettings()
  
  return (
    <div className={`product-card ${productCardStyle}`}>
      {/* Product image */}
      
      {enableQuickView && (
        <button className="quick-view-button">Quick View</button>
      )}
      
      {showPrices && (
        <div className="price">$99.99</div>
      )}
    </div>
  )
}
```

## How It Works

The `useThemeSettings` hook:

1. Uses React's `useSyncExternalStore` to subscribe to theme setting changes
2. Retrieves settings from the global theme settings store
3. Returns a typed object with all the theme settings

Theme settings are initially loaded from your Weaverse project through the `WeaverseClient` on the server-side, and then synchronized with the client-side store for consistent access throughout your app.

## Related

- [withWeaverse](/docs/api/with-weaverse) - HOC that sets up the theme settings provider
- [Global Theme Settings](/docs/guides/global-theme-settings) - Guide to configuring global theme settings
- [WeaverseHydrogenRoot](/docs/api/weaverse-hydrogen-root) - Main component that initializes Weaverse
