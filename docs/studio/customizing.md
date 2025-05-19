---
title: Navigating the Weaverse Studio Interface
description: Understand the key elements and features of the Weaverse Studio editor to efficiently build pages and customize your Hydrogen storefront.
publishedAt: November 20, 2023
updatedAt: April 24, 2025
order: 0
published: true
---

Weaverse Studio provides a powerful yet intuitive interface for visually building and customizing your Shopify Hydrogen storefront. Understanding the different parts of the editor will help you work more efficiently. This guide walks you through the main components of the Studio interface.

## Top Bar: Navigation and Actions

The top bar provides access to essential navigation controls and core actions.

<img alt="Weaverse Studio Top Bar" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/locale-and-pageSelector.webp?v=1743413657" width="600"/>

*   **Locale Selector:** If your store supports multiple languages (configured in `themeSchema.i18n`), use this dropdown to switch between locales and edit content for specific language versions.
*   **Page Selector:** Choose the page you want to edit. This list is populated based on the pages loaded via `context.weaverse.loadPage()` in your Hydrogen project's route loaders. Common examples include the Homepage, Product pages, Collection pages, standard Pages, and any Custom Pages you've defined.
*   **Save Button:** Saves your current changes. These changes will be reflected on your live site.

## Left Panel: Page Outline & Adding Sections

The left panel displays the structure of your currently selected page.

<img alt="Weaverse Studio Page Outline" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/pageoutline.webp?v=1743413723" width="300"/>

*   **Page Outline:** This tree view shows the hierarchical structure of all components (sections, elements) on the page.
    *   **Selection:** Clicking a component name highlights it on the canvas and opens its details in the Inspector panel (right panel).
    *   **Reordering:** Drag and drop components within the outline to change their order on the page.
    *   **Visibility (Eye Icon):** Temporarily hide a component from the preview canvas and the live site (once published). Click again to show it.
    *   **Delete (Trash Icon):** Permanently remove a component from the page.
*   **Add Section Button:** Located at the bottom of the outline, this button opens a library of available components defined in your `~/weaverse.tsx` file. Select a component to add it to the bottom of the current page structure.

## Center Canvas: Live Preview

This is the main area where you see a live, interactive preview of the page you are editing. You can directly click on components within the canvas to select them and open their settings in the Inspector panel.

## Right Panel: Inspector

The Inspector panel on the right is where you configure selected components or global theme settings.

<img alt="Weaverse Studio Component Inspector" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/component-inspector.webp?v=1743413912" width="300"/>
<img alt="Weaverse Studio Theme Settings Inspector" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-setting.webp?v=1743409893" width="300"/>

*   **Component Inspector:** When a component is selected (either from the Outline or the Canvas), this panel shows its specific configuration options, typically organized into tabs:
    *   **Settings:** Modify the component's specific properties. These options are defined in the `inspector` array within the component's `schema` (e.g., text content, image selection, number of items, layout choices).
    *   **Style:** Apply common styling adjustments like padding, margin, background color, text alignment, and border radius without needing custom CSS. Weaverse applies these as inline styles or utility classes.
    *   **General:** Access common actions and settings applicable to most components, such as:
        *   **Visibility:** Control visibility across different devices (Desktop, Tablet, Mobile).
        *   **Duplicate:** Create an exact copy of the selected component below the original.
        *   **Delete:** Remove the component from the page.
*   **Theme Settings Inspector:** Accessed via the 'Theme' button in the bottom bar, this panel allows you to modify global settings for your entire theme. These options are defined in the `inspector` array within your `~/weaverse/schema.server.ts` file (e.g., global colors, typography, layout defaults like page width).

## Bottom Bar: View Controls & Global Settings Access

The bottom bar provides tools for controlling the preview and accessing global settings.

<img alt="Weaverse Studio Bottom Bar" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/device-switcher-inspector.webp?v=1743413912" width="600"/>

*   **Device Switcher:** Preview your page layout on different screen sizes (Desktop, Tablet, Mobile) to ensure responsiveness.
*   **Inspector Toggle (Panel Icon):** Show or hide the right Inspector panel.
*   **Theme Settings Button:** Opens the Theme Settings Inspector in the right panel.
*   **Project Settings Button:** Opens the global project settings modal.

## Project Settings

Accessed via the bottom bar, this modal contains administrative settings for your Weaverse project.

<img alt="Weaverse Studio Project Settings" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/project-setting.webp?v=1743413912" width="300"/>
<img alt="Weaverse Studio Theme Info" src="https://cdn.shopify.com/s/files/1/0838/0052/3057/files/theme-info.webp?v=1743410159" width="300"/>

*   **General:** Manage project name, view Project ID and API Key (needed for your `.env` file).
*   **Domains:** Configure custom domains for your Weaverse-hosted storefront (if applicable).
*   **Billing:** Manage your Weaverse subscription.
*   **Theme:** View theme information (name, author, version) as defined in `themeSchema.info` (`~/weaverse/schema.server.ts`).

By familiarizing yourself with these elements, you can effectively leverage Weaverse Studio to customize your Hydrogen storefront's appearance and content.
