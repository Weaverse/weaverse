---
title: Custom Pages
description: Create Hydrogen custom pages with Weaverse.
publishedAt: July 29, 2024
updatedAt: August 21, 2024
order: 0
published: true
---

## Overview

Custom pages are a powerful feature that allows you to create unique routes for your Hydrogen storefront. With Weaverse, you can effortlessly create custom pages tailored to your specific needs and branding.

This guide will walk you through the process of creating a custom page in Weaverse. We will cover the following topics:

- Setting up a custom page in Weaverse
- Configuring the Hydrogen catch-all route
- Customizing the page in Weaverse
- Adding custom components to the page

By the end of this guide, you will have a custom page in Weaverse that is fully customizable and responsive.

## Setting up a Custom Page in Weaverse

To create a custom page in Weaverse, follow these steps:

1. Open the Weaverse Studio and click on the Page navigation dropdown in the top bar.
2. Select the "Create custom page" option to initiate the creation of a new page.
   ![Create custom page](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_custom_page.png?v=1724230968)
3. Enter a name and handle for your new page, then click "Create custom page".
   ![Create custom page 2](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/my_custom_page.png?v=1724231044)

Now that the custom page is created, the Studio will automatically open the newly created page, allowing you to start adding sections to it.

### Adding the Custom Page to Your Website Navigation

1. Go to your Shopify admin panel.
2. Navigate to **Online Store** > **Navigation**.
3. Select the menu to which you want to add the custom page.
4. Click on **Add menu item**.
5. Enter a **Name** for the menu item (this will be the display name in the navigation).
6. In the **Link** field, enter the custom route for your page.
7. Click **Add** to save the menu item.

Your custom page is now accessible through the selected navigation menu on your storefront.

## Configuring the Hydrogen Catch-All Route

To ensure that your Hydrogen storefront can serve the newly created custom page, you need to set up a catch-all route. Here’s how to do it:

1. **Create or update the catch-all file**: In your Hydrogen project, make sure you have the following route file: `($locale).$.tsx`.

**Contents of `($locale).$.tsx`:**

```tsx
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { WeaverseContent } from "~/weaverse";

export async function loader({ context }: LoaderFunctionArgs) {
  let weaverseData = await context.weaverse.loadPage({ type: "CUSTOM" });

  if (weaverseData?.page?.id && !weaverseData.page.id.includes("fallback")) {
    return { weaverseData };
  }
  // If Weaverse Data not found, return 404
  throw new Response(null, { status: 404 });
}

export default function Component() {
  return <WeaverseContent />;
}
```
2. ** Update the index route file: ** In your Hydrogen project, make sure your `($locale)._index.tsx` file checks for custom page handles.

**Contents of `($locale)._index.tsx`:**

```tsx
import type { MetaFunction } from "@remix-run/react";
import { AnalyticsPageType, getSeoMeta } from "@shopify/hydrogen";
import { type LoaderFunctionArgs, defer } from "@shopify/remix-oxygen";
import type { PageType } from "@weaverse/hydrogen";

import { routeHeaders } from "~/data/cache";
import { SHOP_QUERY } from "~/data/queries";
import { seoPayload } from "~/lib/seo.server";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  let { params, context } = args;
  let { pathPrefix } = context.storefront.i18n;
  let locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  if (params.locale && params.locale.toLowerCase() !== locale) {
    // If it is not a locale, it probably is a custom page handle
    type = "CUSTOM";
  }
  let weaverseData = await context.weaverse.loadPage({ type });
  if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
    throw new Response(null, { status: 404 });
  }

  let { shop } = await context.storefront.query(SHOP_QUERY);
  let seo = seoPayload.home();

  return defer({
    shop,
    weaverseData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data?.seo as SeoConfig);
};

export default function Homepage() {
  return <WeaverseContent />;
}
```
These configurations will ensure that your custom pages in Weaverse are correctly fetched and rendered by Hydrogen.

### Customizing the Page in Weaverse
Once your custom page is set up, customize it by adding and configuring sections:

1. In Weaverse Studio, ensure the custom page is open.
2. Click on Add Section to start adding content blocks.
3. Customize each section to match your branding and content requirements.

With this setup, you now have a custom page in Hydrogen that is fully customizable and responsive. Enjoy the flexibility and control you have over your custom pages in Weaverse!