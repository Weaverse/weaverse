---
title: Markets and Localization  
description: Learn how Weaverse enables you to build and manage a multilingual storefront effortlessly.  
publishedAt: August 14, 2025  
updatedAt: August 14, 2025  
order: 12  
published: true  
---

## Overview

Shopify Markets helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.

Weaverse provides a streamlined solution for creating and managing multilingual storefronts. This guide walks you through the process of setting up localization in your Hydrogen theme with Weaverse, allowing you to customize content for various markets and audiences.

### Quick Demo

For a quick overview of the localization process, watch this video demonstration:

[![Localization Demo](https://img.youtube.com/vi/LJy_KxVeUcs/0.jpg)](https://www.youtube.com/watch?v=LJy_KxVeUcs)

## Prerequisites

Before implementing localization, ensure your project is up-to-date with the latest versions of the Hydrogen library and the `@weaverse/hydrogen` package:

```bash
npx shopify hydrogen upgrade
npm install @weaverse/hydrogen@latest
```

## Implementation Steps

### Step 1: Add a Country Selector

Follow [Shopify’s Country Selector guide](https://shopify.dev/docs/storefronts/headless/hydrogen/markets/country-selector) to integrate a `CountrySelector` component into your Hydrogen storefront. This feature allows users to switch between markets and languages seamlessly.

### Step 2: Configure Localization in the Weaverse Theme Schema

Update your theme schema to include localization settings. Modify the `schema.server.ts` file to define `i18n` configurations:

```typescript
import type { HydrogenThemeSchema } from "@weaverse/hydrogen";
import { COUNTRIES } from "~/utils/const";

export let themeSchema: HydrogenThemeSchema = {
  // ... other schema properties
  i18n: {
    urlStructure: "url-path", // "url-path", "subdomain", or "top-level-domain"
    shopLocales: Object.entries(COUNTRIES).map(
      ([pathPrefix, { label, language, country }]) => {
        return {
          language, // Required
          country, // Required
          pathPrefix: pathPrefix === "default" ? "" : pathPrefix, // Optional, but recommended for better navigation inside Weaverse Studio
          label, // Optional
        };
      },
    ),
  },
};
```

The `i18n` object contains the following properties:
- `urlStructure`: Defines the URL structure for localized content. Options include:
  - `url-path`: Uses path prefixes (e.g., `/en-us`, `/fr-ca`) for different locales.
  - `subdomain`: Uses subdomains (e.g., `en.example.com`, `fr.example.com`).
  - `top-level-domain`: Uses top-level domains (e.g., `example.fr`, `example.de`).

  Weaverse currently supports `url-path` structure. The other two options are under construction and will be available in future releases soon.
- `shopLocales`: An array of locale objects, each containing:
  - `language` (Required): The language code (e.g., `en`, `fr`).
  - `country` (Required): The country code (e.g., `US`, `CA`).
  - `pathPrefix` (Optional, Recommended): An optional path prefix for the locale. It helps in better navigation inside Weaverse Studio. If not provided, it will be computed based on the `language` and `country` codes.
  - `label` (Optional): An optional label for the locale, which can be used for display purposes.

### Step 3: Manage Localized Content in Weaverse Studio

After integrating the `CountrySelector` component and configuring the theme schema, use Weaverse Studio to manage localized content effectively:

#### a. Switch Between Markets/Locales
- Open your site in Weaverse Studio.
- Use the Country Selector to switch to the desired market or locale.
  ![Switch Markets inside Weaverse Studio](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/studio_countries_selector.png?v=1747887045)
- You will be prompted to create a localized version of the selected page.

***Note**: if you don't see the dropdown, but only see a popup like the one below, it means that you have not set up the `i18n` object in your theme schema. Please refer to the previous step to set it up.*
![Read market setup guide](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/market_setup_guide.png?v=1747901370)

#### b. Create Localized Pages
- When switching to a new market, a modal will appear prompting you to create a localized version of the current page.
- Click on **"Create localized page"** to generate a specific version for the chosen market.
- Localized pages are independent of the default version, ensuring changes apply only to the selected locale and you can revert to the default version at any time.
  ![Create Localized Page modal](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_localized_page_modal.png?v=1747887649)

- If the modal does not appear, you can manually click on the **"Create localized page"** button next to the Country Selector in the top bar of Weaverse Studio.
  ![Create Localized Page button](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_localized_page_button.png?v=1747887648)

#### c. Revert to Default Content
- If you want to revert a localized page to the default version, you can do so easily.
- Open the localized page in Weaverse Studio.
- Click on the **"Reset to default"** button next to the Country Selector.
  ![Reset to Default button](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/reset_localized_page_button.png?v=1747887647)
- A confirmation modal will appear. Click **"Reset"** to confirm the action.
  ![Reset to Default](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/reset_localized_page_modal.png?v=1747887648)

  *Please note that this action cannot be undone.*


### Benefits of Markets/Localization

Using Weaverse’s localization capabilities, you can:
- Deliver market-specific content while maintaining a global default version.
- Easily manage and update localized content for specific markets.
- Preview localized storefronts to ensure alignment with audience preferences.
- Revert localized pages to default content when necessary.

## Conclusion

Weaverse simplifies the localization process, enabling you to efficiently manage multilingual content and provide tailored shopping experiences. By following this guide, you can ensure your storefront meets the needs of diverse markets and audiences.
