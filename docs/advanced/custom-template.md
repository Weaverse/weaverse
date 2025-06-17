---
title: Custom Templates
description: Create and assign unique templates for products, collections, pages, and blogs in your Hydrogen storefront using Weaverse.
publishedAt: July 29, 2024
updatedAt: April 24, 2025
order: 1
published: true
---

# Custom Templates in Weaverse

Custom templates allow you to create unique layouts and designs for specific types of content within your Hydrogen storefront, similar to Shopify's theme templates but fully integrated with Weaverse's visual builder.

## Overview

Unlike **Custom Pages** which create entirely new routes, **Custom Templates** override the default layout for existing Shopify resource types. Use them to:

- Create distinct designs for specific products (e.g., a pre-order layout).
- Design unique collection pages (e.g., a lookbook style).
- Apply special layouts to certain standard pages or blog posts/articles.
- Maintain consistent branding while tailoring the user experience for specific content.

**Supported Template Types:**
- Product
- Collection
- Page (Standard Shopify Pages)
- Blog
- Article

---

## Prerequisites

- Familiarity with Weaverse Studio and Hydrogen development.
- Weaverse Hydrogen package integrated into your storefront.
- Understanding of Shopify resources (Products, Collections, etc.).

---

## Step 1: Creating a Custom Template in Weaverse Studio

1.  Open **Weaverse Studio**.
2.  In the Studio topbar, click the page navigation dropdown.
3.  Click **Create Template** (or similar action).
4.  Select the **Template Type** (e.g., Product, Collection).
5.  Provide a descriptive **Template Name** (e.g., `Product - Preorder`, `Collection - Lookbook Grid`). This name helps you identify it later.
    ![Create Custom Template](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_custom_template.webp?v=1745484169)
    In the dialog, you'll name your template and choose which default template it's based on (e.g., Default product). The Custom prefix field is used internally by Weaverse Studio.
6.  Click **Create**. The Studio will open a new, blank template ready for customization.

---

## Step 2: Assigning the Template to a Shopify Resource

Once your custom template is created, it will open in Weaverse Studio. You can then assign it to specific Shopify resources (like products or collections) directly within the Studio:

1.  **Locate Assignment Options:** You have two main ways to open the template assignment panel:
    *   **Left Panel:** In the left-hand panel, under the template name, find the **Assign** button next to "Custom template".
        ![Assign Button in Left Panel](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/assign_template_left_panel.webp?v=1745484491) 
    *   **Settings Panel (Right):** Alternatively, look for the **Template assignments** button in the Settings panel on the right side of the Studio. It might be grouped under sections like "Layout".
        ![Template Assignments Button in Settings Panel](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/template_assignments_button_inspector.webp?v=1745484491)

2.  **Open Assignment Panel:** Click either the **Assign** button or the **Template assignments** button.

3.  **Select Resources:** A panel will appear displaying a list of available resources (e.g., products) that match the template type. Check the box next to each resource you want to apply this custom template to.
    ![Select Resources for Template Assignment](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/template_assignment_resource_list.webp?v=1745484491)

4.  **Save Assignments:** After selecting the resources, click the main **Save** button in the Studio's top bar to save your template assignments.

Now, whenever a visitor views one of the assigned resources on your live storefront, Hydrogen will need to load the data associated with this specific custom template instead of the default one.

---

## Step 3: Configuring Hydrogen Routing for Custom Templates

Good news! You **do not** need to add complex logic to your Hydrogen route loaders to handle custom templates. Weaverse automatically detects if a custom template has been assigned to a resource (like a product or collection) based on the assignments you configured in Step 2.

As long as your route loader calls `context.weaverse.loadPage()` with the correct `type` and `handle`, Weaverse will return the data for the assigned custom template if one exists, or fall back to the default template data otherwise.

**Standard Loader Logic (Example for Products):**

Your loader should look similar to the standard implementation, focusing on fetching Shopify data and then calling `loadPage`.

```tsx
// app/routes/($locale).products.$productHandle.tsx
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { WeaverseContent } from "~/weaverse";
// ... other imports (storefront query, etc.)

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront, weaverse } = context;

  // 1. Fetch product data from Shopify
  const { product } = await storefront.query(/*... PRODUCT_QUERY ...*/, {
    variables: { handle /* ... */ },
  });

  if (!product) { throw new Response(null, { status: 404 }); }

  // 2. Load Weaverse Page Data (Handles Custom Templates Automatically)
  // Simply provide the type and handle. Weaverse checks for assignments.
  let weaverseData;
  try {
    weaverseData = await weaverse.loadPage({
      type: "PRODUCT",
      handle: handle,
    });
  } catch (error) {
    console.error(`Error loading Weaverse data for product ${handle}:`, error);
    // Implement fallback or throw error
    throw new Response("Could not load page data.", { status: 500 });
  }

  // Ensure data was loaded successfully
  if (!weaverseData?.page?.id /* Add robust check */) {
    console.error(`Failed to load Weaverse page data for product ${handle}`);
    throw new Response("Could not load page data.", { status: 500 });
  }

  // 3. Return all necessary data
  return { product, weaverseData /* ... other data */ };
}

export default function ProductRoute() {
  // Render <WeaverseContent /> using data from useLoaderData()
  // ...
  return <WeaverseContent />;
}
```

**Key Takeaway:** The crucial part is ensuring you always pass the correct `handle` (e.g., product handle, collection handle) to `weaverse.loadPage()`. Weaverse uses this handle to look up assignments internally.

---

## Step 4: Customizing the Template in Weaverse Studio

Once created and assigned, you customize the template visually:

1.  Open the custom template in **Weaverse Studio** (select it from the template list).
2.  Click **Add Section** to add banners, product details blocks, related items, etc.
3.  Configure section settings, layouts, and styles specifically for this template.
4.  **Important:** Sections added here define the *structure* for all resources using this template. Content specific to the resource (like product title, images) will populate automatically based on the data passed from the loader.
5.  Use global theme settings and reuse global sections for consistency, or create unique sections just for this template.
6.  **Save** and **Publish** the template in Weaverse Studio. Preview it by visiting a resource assigned to this template on your storefront.

---

## Best Practices

- **Naming:** Use clear, descriptive names for your templates (e.g., `Product - Landing Page Style`, `Collection - Minimal Grid`).
- **Scope:** Use custom templates when you need a distinct *layout* for multiple items of the same type. For one-off pages or unique routes, consider a **Custom Page**.
- **Organization:** Keep your template list tidy. Delete unused templates.
- **Consistency:** Leverage global sections and theme settings where possible to maintain brand consistency even within custom templates.

---

## Troubleshooting

- **Template Not Applying:**
    - Verify the template is correctly assigned to the resource (check Metafield value or assignment setting).
    - Ensure the template is **Published** in Weaverse Studio.
    - Double-check the Hydrogen route loader logic – is it correctly identifying the assigned template and calling `loadPage` with the right parameters?
    - Check for typos in template handles/IDs entered in Metafields.
    - Clear browser cache or test in incognito mode.
- **Sections Missing/Incorrect:**
    - Confirm sections were added and saved to the *template* in Weaverse Studio.
    - Check if the necessary data is being passed from the loader if sections rely on it (e.g., ensure the `product` object is available).
    - Ensure there are no JavaScript errors in the browser console related to rendering.

---
