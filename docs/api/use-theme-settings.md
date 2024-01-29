---
title: useThemeSettings
description: The useThemeSettings hook provides a simple way for Weaverse Hydrogen components to retrieve and utilize the global theme settings.
publishedAt: October 10, 2023
updatedAt: January 17, 2024
order: 1
published: true
---

The **`useThemeSettings`** hook is an interface for accessing the global theme settings within a Weaverse Hydrogen
theme, enabling components to adapt to merchant-configured preferences.

## Usage

Import the hook from `@weaverse/hydrogen` package then call it within a React component to get an object containing the
current global theme settings.

```tsx
import { useThemeSettings } from '@weaverse/hydrogen'

export function GlobalStyle() {
  let settings = useThemeSettings()
  if (settings) {
    let {
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
              --height-nav: ${settings.navHeightMobile}rem;
            }
          `,
        }}
      />
    )
  }
  return null
}
```

For a deeper understanding of how global theme settings are established and how they interact with the
**`useThemeSettings`** hook, you can reference
the [Global Theme Settings article](/docs/guides/global-theme-settings).
