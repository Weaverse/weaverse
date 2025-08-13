---
title: Navigation Configuration
description: Learn how to configure and optimize navigation menus in your Weaverse Hydrogen storefront using Shopify's Content > Menus.
publishedAt: July, 2024
updatedAt: April 24, 2025
order: 9
published: true
---

# Navigation Configuration

Navigation in Weaverse is powered by Shopify's native menu system, allowing you to create flexible, multi-level menus for your storefront. With support for mega menus, dropdowns, and resource-linked items, you can build a seamless navigation experience for your customers.

## Menu Types Supported

- **Basic Menu**: Single-level, no sub-menu items.
- **Dropdown Menu**: One level of nested sub-menu items.
- **Image Menu**: Sub-menu items linked to Shopify resources (Product, Collection, Blog) with images.
- **Mega Menu**: Two or more levels of nested sub-menu items, supporting both resource and standard links.

## Configuring Navigation

To set up and manage your storefront navigation:

1. **Open Shopify admin and go to** **Content > Menus**.
2. **Select the Main menu** (handle: `main-menu`).
3. **Add menu items:**
   - Enter a name for each item (this is the label shown in your storefront).
   - Set the link (URL, or choose a Shopify resource like a product, collection, or blog).
   - Click **Add** to save the item.
4. **Rearrange menu items:**
   - Drag to reorder items as needed.
   - To nest an item (create a dropdown or mega menu), drag it slightly to the right under a parent item.

![Add Menu](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/add_menu_item.png?v=1719822975)

**Note:**
The menu “handle” (such as `main-menu` or `footer`) is used in your Hydrogen backend to query the Shopify Storefront API for navigation data. For example:

```ts
let data = await storefront.query<LayoutQuery>(LAYOUT_QUERY, {
  variables: {
    headerMenuHandle: "main-menu",
    footerMenuHandle: "footer",
    language: storefront.i18n.language,
  },
});
```

Make sure the handle you assign in Shopify (**Content > Menus**) exactly matches the one used in your code. If you rename the handle in Shopify, update it in your code as well to ensure your navigation loads correctly.

### Visual Examples

#### Basic Menu
A menu item with no sub-menu items.

![Basic Menu](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/basic_menu.png?v=1719822798)

#### Dropdown Menu
A menu item with one level of sub-menu items.

![Dropdown Menu](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Simple_Dropdown.png?v=1719822797)

#### Image Menu
A menu item whose sub-menu items are all Shopify resources (e.g., collections).

![Image Menu](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/image_menu.png?v=1719823571)

#### Mega Menu
A menu item with two or more levels of nested sub-menu items, or a mix of resources and standard links.

![Mega Menu](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/mega_1.png?v=1719822797)

## Best Practices

Follow these tips to create effective and user-friendly navigation menus in your Weaverse storefront:

- **Organize logically:** Group related links together and use clear, descriptive names for menu items.
- **Keep it simple:** Limit the number of top-level menu items to avoid overwhelming users.
- **Use consistent naming:** Match menu item names with your storefront’s categories and pages for clarity.
- **Limit nesting:** Avoid deeply nested menus; 2–3 levels are usually sufficient for most stores.
- **Use resource links:** When possible, link directly to Shopify resources (products, collections, blogs) for better integration and automatic updates.
- **Test on all devices:** Preview your navigation on desktop and mobile to ensure menus are accessible and easy to use.
- **Review regularly:** Update your menus as your catalog or site structure changes to keep navigation relevant.

## Summary

Navigation menus in Weaverse are managed via Shopify's Content > Menus for flexibility and integration. Use the menu types and best practices above to create a navigation experience that is clear, scalable, and user-friendly.
