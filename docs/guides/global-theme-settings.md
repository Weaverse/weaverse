---
title: Global Theme Settings
description: Walking through how to define theme schema, leverage global theme settings, and render global styles.
publishedAt: November 20, 2023
updatedAt: January 17, 2024
order: 8
published: true
---

**Theme Settings** define the global configuration of your entire Weaverse theme. They impact the look and behavior of
your store across all routes and components.

Merchants can easily tweak these settings in Weaverse Studio's "**Theme Settings**" panel, which provides a familiar
experience akin to editing settings in the native **Shopify Theme Customizer**.

<img alt="theme_settings" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-setting.webp?v=1743409893" width="300"/>

## Define Theme Schema

The theme schema is stored in a file named
**[`schema.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts)**, which resides under
the **`weaverse`** directory. In this file, you define the various elements of your theme schema.

Here's a sample code block illustrating the structure of a theme schema:

```tsx
import type { HydrogenThemeSchema } from '@weaverse/hydrogen'
import pkg from '../../package.json'

export let themeSchema: HydrogenThemeSchema = {
  info: {
    version: pkg.version,
    author: '',
    name: '',
    authorProfilePhoto: '',
    documentationUrl: '',
    supportUrl: '',
  },
  inspector: [
    {
      group: '',
      inputs: [
        // Define your inputs here
      ],
    },
  ],
}
```

The type of the theme schema is **`HydrogenThemeSchema`**, which comprises two primary components:

#### Theme Info

The **`info`** section of the schema includes vital metadata to be displayed within **Weaverse Studio**. It contains
details such as:

- **`name`**: The name of your theme.

- **`version`**: The theme's version (should be imported from `package.json` file for consistency versioning).

- **`author`**: The theme's author or developer.

- **`authorProfilePhoto`**: An image representing the author.

- **`documentationUrl`**: A link to the theme's documentation.

- **`supportUrl`**: A link for users to seek support or assistance.

<img alt="support_url_img" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-info.webp?v=1743410159" width="300"/>

#### Inspector

The **`inspector`** section of the schema shares the same structure as
a [Component Schema's Inspector](/docs/guides/component-schema#inspector). It contains an
array of **`InspectorGroup`** objects, each of which specifies a group name and an array of inputs.

These inputs are all supported **Input Settings**, which can be explored further in
the [Input Settings](/docs/guides/input-settings) article.

## Load Theme Settings

To make sure your theme’s global settings are applied consistently, you'll need to load them in the `loader` function at
the root route. For this, the **`loadThemeSettings`** function from **`WeaverseClient`** is used.

```tsx
// <root>/app/root.tsx

import { defer, type LoaderArgs } from '@shopify/remix-oxygen'

export async function loader({ context }: LoaderArgs) {
  return defer({
    // Root data...
    weaverseTheme: await context.weaverse.loadThemeSettings(),
  })
}
```

📌 **Note**: It's important to name the resulting data key as **`weaverseTheme`**. It's a requirement for the settings to
integrate properly with your theme.

## Accessing Global Theme Settings

To work with global theme settings, you'll utilize the **`useThemeSettings`** hook. This hook returns the settings that
have been saved or updated by merchants within the Weaverse Studio's "**Theme Settings**" panel.

When merchants first install your theme, these settings are generated based on the default values you've defined for
each input in the theme schema.

Here's a straightforward example found in
the [`weaverse/style.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.tsx) file:

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

The `useThemeSettings` hook can be used in any component within your Weaverse theme, not just Weaverse Components,
making it a versatile and powerful tool for customization.
