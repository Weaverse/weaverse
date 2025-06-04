---
title: Global Theme Settings
description: Learn how to define theme schema, leverage global theme settings, and implement responsive global styles across your Weaverse Hydrogen storefront.
publishedAt: November 20, 2023
updatedAt: April 24, 2025
order: 8
published: true
---

# Global Theme Settings

**Theme Settings** define the global configuration for your entire Weaverse theme. They control the visual identity and behavior of your Hydrogen storefront across all routes and components, ensuring a consistent user experience.

Merchants can easily customize these settings through Weaverse Studio's **Theme Settings** panel, which provides an intuitive interface similar to the native **Shopify Theme Customizer**.

![Weaverse Studio Theme Settings Panel](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-setting.webp?v=1743409893)

## Defining Your Theme Schema

The theme schema is defined in the **[`schema.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts)** file located in the **`weaverse`** directory. This file establishes the structure and customization options available in your theme.

### Basic Schema Structure

```tsx
import type { HydrogenThemeSchema } from '@weaverse/hydrogen'
import { COUNTRIES } from '~/utils/const'
import pkg from '../../package.json'

export let themeSchema: HydrogenThemeSchema = {
  info: {
    version: pkg.version,
    author: 'Weaverse',
    name: 'Pilot',
    authorProfilePhoto: 'https://cdn.shopify.com/s/files/1/0623/5095/0584/files/Pilot_logo_b04f1938-06e5-414d-8a47-d5fcca424000.png?v=1698245759',
    documentationUrl: 'https://weaverse.io/docs',
    supportUrl: 'https://weaverse.io/contact',
  },
  i18n: {
    urlStructure: 'url-path',
    defaultLocale: {
      pathPrefix: '',
      label: 'United States (USD $)',
      language: 'EN',
      country: 'US',
      currency: 'USD',
    },
    shopLocales: Object.entries(COUNTRIES).map(
      ([pathPrefix, { label, language, country }]) => {
        return {
          pathPrefix: pathPrefix === 'default' ? '' : pathPrefix,
          label,
          language,
          country,
        }
      }
    ),
  },
  settings: [
    {
      group: 'Layout',
      inputs: [
        {
          type: 'range',
          label: 'Container width',
          name: 'pageWidth',
          configs: {
            min: 1000,
            max: 1600,
            step: 10,
            unit: 'px',
          },
          defaultValue: 1200,
        },
      ],
    },
  ],
}
```

### Theme Schema Components

The `HydrogenThemeSchema` type consists of three primary sections:

#### 1. Theme Info

The **`info`** section contains metadata displayed within **Weaverse Studio**, helping merchants identify and understand your theme:

- **`name`**: Your theme's name (e.g., "Pilot")
- **`version`**: Theme version (recommended to import from `package.json` for consistent versioning)
- **`author`**: Theme creator or development team
- **`authorProfilePhoto`**: An image URL representing the author/brand
- **`documentationUrl`**: Link to your theme's documentation
- **`supportUrl`**: Link for customer support or assistance

![Weaverse Studio Theme Information Display](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-info.webp?v=1743410159)

#### 2. Internationalization (i18n)

The **`i18n`** section configures multi-language support for your theme:

- **`urlStructure`**: Defines how locale paths are structured in URLs (typically "url-path")
- **`defaultLocale`**: Sets the default language/country/currency configuration
- **`shopLocales`**: An array of supported locales, usually generated from your store's available locales

```tsx
i18n: {
  urlStructure: 'url-path',
  defaultLocale: {
    pathPrefix: '',      // Empty for default locale
    label: 'United States (USD $)', 
    language: 'EN',
    country: 'US',
    currency: 'USD',
  },
  shopLocales: Object.entries(COUNTRIES).map(
    ([pathPrefix, { label, language, country }]) => {
      return {
        pathPrefix: pathPrefix === 'default' ? '' : pathPrefix,
        label,
        language,
        country,
      }
    }
  ),
},
```

#### 3. Settings

The **`settings`** section contains an array of **`InspectorGroup`** objects, each defining a logical group of related settings.

Each group contains:
- A descriptive **`group`** name (e.g., "Layout", "Colors", "Typography")
- An array of **`inputs`** representing individual settings

### Settings Group Example

Here's a real example of a settings group from the Pilot theme:

```tsx
{
  group: 'Layout',
  inputs: [
    {
      type: 'range',
      label: 'Page width',
      name: 'pageWidth',
      configs: {
        min: 1000,
        max: 1600,
        step: 10,
        unit: 'px',
      },
      defaultValue: 1280,
    },
    {
      type: 'range',
      label: 'Nav height (mobile)',
      name: 'navHeightMobile',
      configs: {
        min: 2,
        max: 8,
        step: 1,
        unit: 'rem',
      },
      defaultValue: 3,
    },
    // More inputs...
  ],
},
```

## Input Settings Reference

Theme settings inputs use the same structure as component inputs. Each input setting has standard attributes that determine how it appears and functions in the Weaverse Studio interface.

```tsx
{
  type: 'input-type',       // The type of input (e.g., 'range', 'color', 'select')
  name: 'settingName',       // Unique identifier for accessing this setting
  label: 'User-facing Label', // Display label in the Studio UI
  defaultValue: 'default',   // Initial value when theme is installed
  configs: {},               // Type-specific configuration options
  helpText: 'Explanation',   // Optional help text (can be HTML)
  placeholder: 'Example',    // Optional placeholder text
  condition: (data) => data.someProperty === true  // Function-based condition (recommended)
  // OR condition: 'someProperty.eq.true'         // String-based condition (deprecated)
}
```

For a complete reference of all available input types, configuration options, and advanced usage, please refer to the [Input Settings documentation](/docs/guides/input-settings).

### Common Input Types for Theme Settings

Here are a few examples of frequently used input types in theme settings:

#### Color Input

```tsx
{
  type: 'color',
  label: 'Background',
  name: 'colorBackground',
  defaultValue: '#ffffff',
}
```

#### Select Input

```tsx
{
  type: 'select',
  name: 'headerWidth',
  label: 'Header width',
  configs: {
    options: [
      { value: 'full', label: 'Full page' },
      { value: 'stretch', label: 'Stretch' },
      { value: 'fixed', label: 'Fixed' },
    ],
  },
  defaultValue: 'fixed',
}
```

#### Conditional Settings

You can conditionally display settings based on the values of other settings:

```tsx
{
  type: 'image',
  name: 'transparentLogoData',
  label: 'Logo on transparent header',
  defaultValue: {
    id: 'gid://shopify/MediaImage/34144817938616',
    altText: 'Logo',
    url: 'https://cdn.shopify.com/s/files/1/0623/5095/0584/files/transparent_Pilot_logo.png',
    width: 320,
    height: 116,
  },
  // Only displayed when enableTransparentHeader is true
  condition: (data) => data.enableTransparentHeader === true,
}
```

## Loading Theme Settings

To apply your theme settings throughout your storefront, load them in the root route's `loader` function using the **`loadThemeSettings`** method from **`WeaverseClient`**:

```tsx
// app/root.tsx

import { defer, type LoaderArgs } from '@shopify/remix-oxygen'

export async function loader({ context }: LoaderArgs) {
  return defer({
    // Other root data...
    weaverseTheme: await context.weaverse.loadThemeSettings(),
  })
}
```

> **Important:** The data key must be named **`weaverseTheme`** for Weaverse to properly recognize and utilize these settings.

## Accessing Global Theme Settings

The **`useThemeSettings`** hook provides access to your theme settings from any component in your application. It returns the current settings that have been configured by merchants in the Weaverse Studio.

When a merchant installs your theme, these settings are initialized with the default values specified in your theme schema.

### Example: Creating Global Styles

A common use case is generating global CSS variables based on theme settings:

```tsx
// app/weaverse/style.tsx

import { useThemeSettings } from '@weaverse/hydrogen'

export function GlobalStyle() {
  const settings = useThemeSettings()
  
  if (!settings) return null
  
  const {
    // Layout
    pageWidth,
    navHeightMobile,
    navHeightTablet,
    navHeightDesktop,
    
    // Colors
    colorBackground,
    colorText,
    colorTextSubtle,
    colorLine,
    
    // Typography
    bodyBaseSize,
    bodyBaseLineHeight,
    bodyBaseSpacing,
    h1BaseSize,
    headingBaseLineHeight,
    headingBaseSpacing,
    
    // Other settings...
  } = settings

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            /* Layout */
            --page-width: ${pageWidth}px;
            --nav-height-mobile: ${navHeightMobile}rem;
            --nav-height-tablet: ${navHeightTablet}rem;
            --nav-height-desktop: ${navHeightDesktop}rem;
            
            /* Colors */
            --color-background: ${colorBackground};
            --color-text: ${colorText};
            --color-text-subtle: ${colorTextSubtle};
            --color-line: ${colorLine};
            
            /* Typography */
            --body-size: ${bodyBaseSize}px;
            --body-line-height: ${bodyBaseLineHeight};
            --body-letter-spacing: ${bodyBaseSpacing};
            --heading-size: ${h1BaseSize}px;
            --heading-line-height: ${headingBaseLineHeight};
            --heading-letter-spacing: ${headingBaseSpacing};
          }
          
          /* Responsive styles */
          @media screen and (min-width: 768px) {
            :root {
              --nav-height: var(--nav-height-tablet);
            }
          }
          
          @media screen and (min-width: 1024px) {
            :root {
              --nav-height: var(--nav-height-desktop);
            }
          }
        `,
      }}
    />
  )
}
```

### Integrating Global Styles

Include your `GlobalStyle` component in the root layout to apply these styles across your entire storefront:

```tsx
// app/root.tsx

import { GlobalStyle } from '~/weaverse/style'

export default function App() {
  return (
    <html lang="en">
      <head>
        {/* Other head elements */}
        <GlobalStyle />
      </head>
      <body>
        {/* App content */}
      </body>
    </html>
  )
}
```

## Using Theme Settings in Components

You can access theme settings in any component, not just Weaverse Components:

```tsx
// app/components/Header.tsx

import { useThemeSettings } from '@weaverse/hydrogen'

export function Header() {
  const settings = useThemeSettings()
  
  // Provide fallback values for safety
  const isTransparent = settings?.enableTransparentHeader || false
  const bgColor = isTransparent ? 'transparent' : (settings?.headerBgColor || '#ffffff')
  const textColor = isTransparent ? (settings?.transparentHeaderText || '#ffffff') : (settings?.headerText || '#000000')
  const logo = isTransparent ? settings?.transparentLogoData : settings?.logoData
  
  return (
    <header style={{ 
      backgroundColor: bgColor,
      color: textColor
    }}>
      {logo && (
        <img 
          src={logo.url} 
          alt={logo.altText || 'Logo'}
          width={settings?.logoWidth || 150} 
        />
      )}
      {/* Header content */}
    </header>
  )
}
```

## Organizing Theme Settings

As demonstrated in the Pilot theme, it's a good practice to organize your theme settings into logical groups:

1. **Layout** - Structural settings like page width and element heights
2. **Colors** - Primary color scheme, backgrounds, text colors, etc.
3. **Typography** - Font sizes, line heights, letter spacing
4. **Component-specific** - Grouped settings for major site components like headers, footers, etc.
5. **Feature-specific** - Settings for features like product badges, cards, etc.

Use heading inputs to further organize settings within each group:

```tsx
{
  group: 'Colors',
  inputs: [
    {
      type: 'heading',
      label: 'General',
    },
    // General color settings
    
    {
      type: 'heading',
      label: 'Header',
    },
    // Header-specific color settings
    
    {
      type: 'heading',
      label: 'Footer',
    },
    // Footer-specific color settings
  ],
},
```

## Troubleshooting

- **Settings not applying**: Ensure you've named the loader data key `weaverseTheme`
- **Undefined settings**: Add null checks when accessing settings (`settings?.propertyName`)
- **Type errors**: Make sure your input names in the schema match the properties you access
- **Conditional settings not appearing**: Check your condition syntax and logic

## Next Steps

- Explore [Input Settings](/docs/guides/input-settings) to learn about all available input types
- Learn about [Component Schema](/docs/guides/component-schema) to build customizable components
- Understand [Global Sections](/docs/guides/global-section) for creating reusable sections
