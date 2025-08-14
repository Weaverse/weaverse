---
title: Pilot - Shopify Hydrogen Starter Theme
description: Elevate your Shopify Headless storefront with Pilot, the robust and versatile starter theme by Weaverse.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 1
published: true
---

Meet the [Pilot theme](https://pilot.weaverse.dev/), a comprehensive starter theme from Weaverse designed to be a solid foundation for your Shopify Hydrogen storefront. Think of Pilot as fulfilling a similar foundational role for Hydrogen projects as the Dawn theme does for Shopify Online Store 2.0.

Pilot builds upon Shopify's [Hydrogen Demo Store](https://github.com/Shopify/hydrogen/tree/main/templates/demo-store) and is tightly integrated with Weaverse. This integration streamlines theme development and customization, promoting best practices and ensuring high performance.

[![Pilot Theme Preview](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/landing_hero.webp?v=1703568247)](https://pilot.weaverse.dev/)

## Key Features

---

*   **Instant Live Preview:** See your theme modifications immediately in Weaverse Studio.
*   **Customizable Component Schema:** Define configurable settings for your components within Weaverse Studio.
*   **Component-Level Data Loading:** Utilize Remix-style loaders within individual components to fetch data efficiently from the Shopify Storefront API or third-party sources.
*   **Tailwind CSS Integration:** Leverage the utility-first power of Tailwind CSS for rapid UI development.
*   **Easy Shopify Resource Selection:** Conveniently select products, collections, pages, blogs, articles, and more directly within the editor.
*   **Multi-Market & Language Ready:** Built to support sales across different markets and languages.
*   **Global Theme Settings:** Easily customize site-wide elements like colors, fonts, and layout options.

## Getting Started

---

The Pilot theme is open-source and available on [GitHub](https://github.com/weaverse/pilot). You can deploy it directly to platforms like Oxygen or Vercel, or clone the repository to your local machine for development and customization.

## Available Sections

---

Pilot includes a variety of pre-built sections to help you build pages quickly:

*   Image with Text
*   Image Gallery
*   Featured Product
*   Featured Collection
*   Related Products
*   Blog Posts
*   Rich Text
*   Newsletter Form
*   Map
*   Video Embed
*   Testimonials
*   Custom HTML
*   Metaobject Demo

## Global Theme Settings

---

Pilot offers extensive global theme settings for site-wide customization. Learn more about configuring these options in our [Global Theme Settings](/docs/guides/global-theme-settings) guide.

## Using Metaobjects with Pilot

---

Weaverse integrates a metaobject picker, allowing you to easily select and display Shopify metaobjects within your theme. Follow these steps to set up and use metaobjects with Pilot:

### 1. Define Your Metaobject Structure in Shopify

1.  Navigate to **Settings > Custom data** in your Shopify Admin.
2.  Under **Metaobjects**, click **Add definition**.
3.  Give your metaobject definition a clear name (e.g., "Team Member Profile").
4.  Add the necessary fields using **Add field**. Each field has specific types and validation options. For a team member profile, you might add:
    *   `avatar`: File type (restrict to images).
    *   `name`: Single line text.
    *   `title`: Single line text.
5.  Configure any additional options like access controls.
6.  **Save** the definition.

    *Example Setup:*
    [![Metaobject definition example](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition.png)](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition.png)

### 2. Create Metaobject Entries in Shopify

1.  Navigate to **Content > Metaobjects** in your Shopify Admin.
2.  Click **Add entry** and select the definition you just created (e.g., "Team Member Profile").
3.  Fill in the content for each field (upload an avatar, enter name and title).
4.  **Save** the entry.
5.  Repeat this process to add more entries (e.g., for each team member).

    *Example Entry:*
    [![Metaobject entry example](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Screenshot_2024-01-11_at_14.23.52.png?v=1704968599)](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Screenshot_2024-01-11_at_14.23.52.png?v=1704968599)

### 3. Display Metaobjects in the Pilot Theme

1.  Open your page in Weaverse Studio.
2.  Click **Add section** in the Page Outline (left panel).
3.  Select the **Metaobject demo** section (or another section you've configured to use metaobjects).
4.  In the Settings panel (right panel), use the metaobject picker input field to select the specific metaobject entry you want to display.
5.  Observe the changes in the live preview.

    *Video Demonstration:*
<iframe width="560" height="315" src="https://www.youtube.com/embed/BEf6jfjloiE?rel=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
