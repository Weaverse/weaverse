---
title: Pilot - Shopify Hydrogen Starter Theme
description: Elevate your Shopify Headless storefront with Pilot, the robust and versatile starter theme by Weaverse.
publishedAt: January 11, 2024
updatedAt: January 15, 2024
order: 1
published: true
---

Discover the [Pilot theme](https://pilot.weaverse.dev/), a comprehensive starter theme brought to you by Weaverse. It's engineered to serve as a dependable cornerstone for your theme development and customization needs. Envision Pilot as the Dawn theme's counterpart for the Shopify Online Store 2.0.

Pilot finds its roots in Shopify's [Hydrogen Demo Store](https://github.com/Shopify/hydrogen/tree/main/templates/demo-store) and is seamlessly integrated with Weaverse. This integration facilitates efficient theme building and customization, ensuring adherence to industry best practices and standards.

[![Pilot](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/landing_hero.webp?v=1703568247)](https://pilot.weaverse.dev/)

## Features

---

- **Live Preview:** Instantly see your theme changes in Weaverse Studio.
- **Component Schema Definition:** Create a customizable component schema in Weaverse Studio.
- **Component-Level Loader:** Incorporate a Remix-style loader at the component level, fetching data from the Shopify Storefront API or other third-party resources.
- **Tailwind CSS Integration:** Design with ease using Tailwind CSS, a utility-first framework for crafting custom interfaces.
- **Shopify Resource Picker:** Conveniently select Shopify resources like products, collections, pages, blogs, articles, etc.
- **Multi-Market and Language Support:** Expand your reach by selling in various markets and languages.
- **Global Theme Settings:** Customize broad theme aspects such as colors, fonts, and more.

## Getting Started

---

Access the Pilot theme on [GitHub](https://github.com/weaverse/pilot). As an open-source project, you can deploy it directly to platforms like Oxygen/Vercel or clone it to your local environment for further customization.

## Available Sections

---

- **Image with Text:** Showcase an image with a text overlay.
- **Image Gallery:** Create a stunning gallery of images.
- **Featured Product:** Highlight a product of your choice.
- **Featured Collection:** Showcase a specific collection.
- **Related Products:** Suggest related products to your customers.
- **Blog Posts:** Display recent blog entries.
- **Rich Text:** Present rich text content.
- **Newsletter:** Incorporate a newsletter subscription form.
- **Map:** Add an interactive map.
- **Video:** Embed a video.
- **Testimonials:** Share customer testimonials.
- **Custom HTML:** Include custom HTML content.
- **Metaobject Demo:** Demonstrate a Shopify metaobject.

## Global Theme Settings

---

Pilot comes equipped with comprehensive global theme settings, offering extensive customization options. Learn more about these settings in our [Global Theme Settings](/docs/guides/global-theme-settings) guide.

## Metaobjects

---

Weaverse introduces a metaobject picker input, enabling users to select and display Shopify metaobjects within the theme. Here's how you can set up and use metaobjects with the Pilot theme.

### Setting Up Metaobjects in Shopify

1. In Shopify Admin, navigate to _Settings_ > _Custom data_.
2. Under _Metaobjects_, click _Add definition_.
3. Name your metaobject definition.
4. Add fields by clicking _Add field_. These fields determine the content of your metaobject, with each offering specific options and validations. For instance, to create a member's profile, include fields for an avatar, name, and title:

- **Avatar:** File type (limit to images by deselecting videos)
- **Name:** Single line text
- **Title:** Single line text
- Save your settings.
  Here's what your setup might look like:
  [![Metaobject definition](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition.png)](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/metaobject_definition.png)

### Creating a Metaobject Entry in Shopify

1. Navigate to _Content_ > _Metaobjects_ in Shopify Admin.
2. Click _Add entry_ and select your previously created metaobject definition.
3. Fill out the fields for your metaobject entry, such as avatar, name, and title for a member profile.
4. Save your entry.
5. Repeat to add more entries as needed.
   [![Metaobject entry](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Screenshot_2024-01-11_at_14.23.52.png?v=1704968599)](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/Screenshot_2024-01-11_at_14.23.52.png?v=1704968599)

### Integrating Metaobjects in the Pilot Theme

1. In Weaverse Studio, go to _Theme_ > _Sections_ > _Add section_.
2. Choose the _Metaobject demo_ section.
3. From the Inspector, select your created metaobject.
4. Preview your changes. Check out this video demo:

<iframe src="https://www.youtube.com/embed/BEf6jfjloiE?rel=0" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>
