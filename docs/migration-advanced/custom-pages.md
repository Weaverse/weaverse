---
title: Custom Pages
description: Create Hydrogen custom pages with Weaverse.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 0
published: true
---

# Custom Pages in Weaverse

Custom pages let you create unique, fully customizable routes for your Hydrogen storefront using Weaverse Studio. Use these pages for landing pages, promotional campaigns, unique content, or anything outside the standard Shopify page types.

> **What are Custom Pages?**
> Custom Pages in Weaverse allow you to define any route and visually build content for it—without code or deployment. Perfect for landing pages, campaigns, or utility content.

---

## Table of Contents

- [Overview](#overview)
- [When to Use Custom Pages](#when-to-use-custom-pages)
- [Step 1: Creating a Custom Page in Weaverse Studio](#step-1-creating-a-custom-page-in-weaverse-studio)
- [Step 2: Configuring Hydrogen Routing](#step-2-configuring-hydrogen-routing)
- [Step 3: Adding Custom Pages to Navigation](#step-3-adding-custom-pages-to-navigation)
- [Step 4: Customizing Your Page](#step-4-customizing-your-page)
- [SEO & Best Practices](#seo--best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Examples](#advanced-examples)
- [Next Steps & Resources](#next-steps--resources)

---

## Overview

Custom pages empower you to:
- Launch campaign/landing pages without developer deployment
- Build unique content-driven or utility pages (store locator, FAQ, etc.)
- Use Weaverse's drag-and-drop sections for any route you define

## When to Use Custom Pages

- For content or marketing pages not tied to Shopify's built-in page types (product, collection, etc.)
- When you want total layout freedom and section control
- For SEO-optimized, campaign-specific, or seasonal content

> **Tip:** Use clear, descriptive handles for your custom pages (e.g., `/summer-sale`). Handles must be unique and should not conflict with built-in Shopify routes.

---

## Step 1: Creating a Custom Page in Weaverse Studio

1. Open **Weaverse Studio**.
2. Click the **Page navigation dropdown** in the top bar.
3. Select **Create custom page**.
   ![Create custom page](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_custom_page.png?v=1724230968)
4. Enter a **name** and **handle** (URL path) for your new page, then click **Create custom page**.
   ![Create custom page 2](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/my_custom_page.png?v=1724231044)
5. The Studio will open your new page, ready for section editing.

> **Warning:** Handles must be unique. If you reuse a handle, it may override an existing page or cause routing conflicts.

---

## Step 2: Configuring Hydrogen Routing

To serve custom pages, you need a catch-all route in your Hydrogen app. This enables dynamic rendering of any custom page defined in Weaverse Studio.

### Handling Locales vs. Custom Page Handles

In multilingual storefronts, the first segment of the URL may be a locale (e.g., `/en-us`) or a custom page handle. It's essential to distinguish between the two to avoid routing errors.

> **Best Practice:** Always check if the first path segment is a supported locale before treating it as a custom page handle. This prevents accidental 404s or misrouted pages.

#### Example Loader Logic

```tsx
// app/routes/($locale)._index.tsx
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { PageType } from "@weaverse/hydrogen";

export async function loader(args: LoaderFunctionArgs) {
  let { params, context } = args;
  let { pathPrefix } = context.storefront.i18n;
  let locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  if (params.locale && params.locale.toLowerCase() !== locale) {
    // If not a supported locale, treat as custom page handle
    type = "CUSTOM";
  }
  let weaverseData = await context.weaverse.loadPage({ type });
  if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
    throw new Response(null, { status: 404 });
  }
  // ...rest of loader
}
```

- This logic ensures that only non-locale strings are treated as custom page handles.
- If you want to be more robust, consider using an explicit locale list or regex pattern for locale validation.

> **Advanced:**
> If your store supports a finite set of locales, check against a locale array:
> ```ts
> const supportedLocales = ['en-us', 'fr', 'de'];
> if (params.locale && !supportedLocales.includes(params.locale.toLowerCase())) {
>   type = 'CUSTOM';
> }
> ```
> Or use a regex for locale pattern matching.

### 1. Create/Update `($locale).$.tsx`

```tsx
// app/routes/($locale).$.tsx
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { WeaverseContent } from "~/weaverse";

/**
 * Loader for custom pages. Fetches Weaverse custom page data for the current route.
 * @param context - Remix loader context with Weaverse integration
 * @returns Weaverse page data if found, otherwise throws 404
 */
export async function loader({ context }: LoaderFunctionArgs) {
  const weaverseData = await context.weaverse.loadPage({ type: "CUSTOM" });
  if (weaverseData?.page?.id && !weaverseData.page.id.includes("fallback")) {
    return { weaverseData };
  }
  throw new Response(null, { status: 404 });
}

/**
 * Renders the custom page using WeaverseContent.
 */
export default function CustomPage() {
  return <WeaverseContent />;
}
```

#### How it works:
- The loader attempts to fetch a custom page for the current route.
- If found, renders it with `<WeaverseContent />`.
- If not found, returns a 404.

> **Troubleshooting:** If your custom page is not rendering, check the handle, page publication status, and route setup.

### 2. (Optional) Update Index Route for Custom Homepages
If you want a custom page to act as your homepage, ensure your index route (`($locale)._index.tsx`) checks for custom handles and loads the correct page type.

---

## Step 3: Adding Custom Pages to Navigation

1. In Shopify Admin, go to **Online Store > Navigation**.
2. Select your menu and click **Add menu item**.
3. Name the item and set the **Link** to your custom page path (e.g., `/my-custom-page`).
4. Save. Your page is now accessible from your storefront navigation.

> **Tip:** Shopify navigation changes may take a few minutes to appear on your live storefront due to caching.

---

## Step 4: Customizing Your Page

1. In Weaverse Studio, open your custom page.
2. Click **Add Section** to drag in content blocks (banners, products, forms, etc.).
3. Edit and arrange sections as needed. Use settings for layout, colors, and content.
4. Save and preview.

![Edit custom page](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_custom_page_edit.png)

> **Best Practice:** Use global theme settings and reuse global sections for consistent branding across your storefront. Preview changes before publishing to ensure layout and content accuracy.

---

> **Note:** Custom pages created in Weaverse are **not automatically included** in your store’s sitemap (e.g., `sitemap.xml`) yet. To ensure they appear in your sitemap for SEO, you need to manually add them in your sitemap route (e.g., `sitemap.$type.$page[.xml].tsx`). Automatic inclusion will be supported in a future release.

---

## SEO & Best Practices
- Use descriptive handles (e.g., `/summer-sale`)
- Add meta titles/descriptions in your Hydrogen loader or via Weaverse SEO settings
- Use semantic section blocks for accessibility
- Keep images optimized for fast loading
- Link to [Hydrogen SEO Guide](https://shopify.dev/docs/custom-storefronts/hydrogen/seo)

---

## Troubleshooting

**Page shows 404:**
- Check that the custom page exists in Weaverse Studio and is published
- Ensure the handle matches the route in the URL
- Confirm your Hydrogen catch-all route is set up as above
- **If using locales:** Make sure your loader distinguishes between locale codes and custom handles as shown in the example above.
- Check browser console and network requests for errors

**Sections not showing:**
- Make sure you have added and saved sections in Weaverse Studio
- Refresh your Hydrogen storefront after publishing changes
- Confirm there are no errors in the browser console

**Navigation link not working:**
- Double-check the menu item path in Shopify Admin
- Wait a few minutes for navigation cache to update

**Common Mistakes:**
- Reusing a handle that conflicts with built-in Shopify routes
- Not publishing the custom page in Weaverse Studio
- Forgetting to update Hydrogen routes after adding new custom pages

---

## Advanced Examples

### Example 1: Promotional Landing Page
- Create a new custom page `/black-friday`
- Add hero banners, product grids, countdown timers
- Link from your homepage or ads

### Example 2: Custom Store Locator
- Create `/store-locator`
- Add a map section and store info blocks
- Use custom code or embed a map widget if needed

### Example 3: Dynamic Content Page
- Use loader to fetch dynamic data (e.g., from a CMS or API)
- Render with WeaverseContent and pass data as props

```tsx
// Example: Fetching CMS data in loader
export async function loader({ context }: LoaderFunctionArgs) {
  const cmsData = await fetch('https://api.example.com/content').then(res => res.json());
  const weaverseData = await context.weaverse.loadPage({ type: "CUSTOM" });
  return { weaverseData, cmsData };
}

export default function CustomPage({ weaverseData, cmsData }: { weaverseData: any; cmsData: any }) {
  return (
    <>
      <WeaverseContent {...weaverseData} />
      <section>{cmsData.title}</section>
    </>
  );
}
```

### Example 4: Integrating with External APIs
- Fetch data from a third-party API in your loader and merge it with Weaverse content as shown above.

---

## Next Steps & Resources

- Explore [Weaverse Documentation](https://docs.weaverse.io)
- Learn more about [Hydrogen Routing](https://shopify.dev/docs/custom-storefronts/hydrogen/routing)
- Review [Shopify Navigation](https://help.shopify.com/manual/online-store/menus-and-links)
- For advanced customization, see [Weaverse SDK](https://docs.weaverse.io/sdk)

With this setup, your Hydrogen storefront can host any number of flexible, SEO-friendly, and fully branded custom pages—no deployment required. Enjoy building with Weaverse!