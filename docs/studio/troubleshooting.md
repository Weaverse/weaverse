---
title: Troubleshooting
description: Common issues and solutions when using Weaverse Studio.
publishedAt: June 26, 2024
updatedAt: June 26, 2024
order: 1
published: true
---

## Can not load Preview with Oxygen deployment

If you're using Oxygen deployment, you might encounter the following error when trying to preview your Weaverse Hydrogen project:

![preview error](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/preview_not_load.jpg?v=1719390592)

This error is caused by the Preview URL is not set to public from Hydrogen's settings. Please follow this [instruction](https://weaverse.io/docs/deployment/oxygen#publish-your-storefront--update-weaverse-preview-url) to set the Hydrogen Environment to public.

## 404 - We've lost this page

Sometimes, you clicked a link in your Hydrogen page and it's not working. This is because the route you clicked on does not exist or not included the `<WeaverseContent />` component.

To fix this issue, please follow this [instruction](https://weaverse.io/docs/guides/rendering-page) to add the `<WeaverseContent />` component to your page.

You can refer to our demo repository for a complete example:

- [Weaverse Demo](https://github.com/Weaverse/pilot)
- [Naturelle Demo](https://github.com/Weaverse/naturelle)
