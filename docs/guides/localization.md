---
title: Localization  
description: Learn how Weaverse enables you to build and manage a multilingual storefront effortlessly.  
publishedAt: January 5, 2025  
updatedAt: January 5, 2025  
order: 12  
published: true  
---

# Localization

## Overview

Weaverse provides a streamlined solution for creating and managing multilingual storefronts. This guide walks you through the process of setting up localization in your Hydrogen theme with Weaverse, allowing you to customize content for various markets and audiences.

### Watch the Video Demo

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

Follow [Shopify’s Country Selector guide](https://shopify.dev/docs/storefronts/headless/hydrogen/markets/country-selector) to integrate a Country Selector component into your Hydrogen storefront. This feature allows users to switch between markets and languages seamlessly.

### Step 2: Configure Localization in the Theme Schema

Update your theme schema to include localization settings. Modify the `schema.server.ts` file to define `i18n` configurations and set a default locale:

```typescript
export let themeSchema: HydrogenThemeSchema = {
  i18n: Object.values(COUNTRIES).map((i) => ({
    language: i.language,
    country: i.country,
    label: i.label,
  })),
  defaultLocale: "en-us",
};
```

### Step 3: Manage Localized Content in Weaverse Studio

After integrating the Country Selector and configuring the theme schema, use Weaverse Studio to manage localized content effectively:

#### a. **Switch Between Markets/Locales**
- Open your site in Weaverse Studio.
- Use the Country Selector to switch to the desired market or locale.
- You will be prompted to create a localized version of the selected page.

#### b. **Create Localized Pages**
- Click on "Create localized page" to generate a specific version for the chosen market.
- Localized pages are independent of the default version, ensuring changes apply only to the selected locale.

![Create Localized Page](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_localized_page.png?v=1735900595)

#### c. **Revert to Default Content**
- Access the localization settings in the top bar of Weaverse Studio.
- Select "Reset to default" to remove the localized version and revert to the global content.

![Reset to Default](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/reset_localization.png?v=1735900576)

### Benefits of Localization

Using Weaverse’s localization capabilities, you can:
- Deliver market-specific content while maintaining a global default version.
- Easily manage and update localized content for specific markets.
- Preview localized storefronts to ensure alignment with audience preferences.
- Revert localized pages to default content when necessary.

## Conclusion

Weaverse simplifies the localization process, enabling you to efficiently manage multilingual content and provide tailored shopping experiences. By following this guide, you can ensure your storefront meets the needs of diverse markets and audiences.
