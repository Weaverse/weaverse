---
title: Getting Started
description: 'Begin your Weaverse journey: Learn how to install the app on Shopify and set up your first Weaverse Hydrogen project with React Router v7.'
publishedAt: November 20, 2023
updatedAt: May 27, 2025
order: 1
published: true
---

## Welcome to Weaverse

Transform your Shopify store with Weaverse Hydrogen - the modern solution for building fast, customizable storefronts powered by React Router v7. This guide will help you get started with your first Weaverse project in minutes.

> **🚀 New in v5**: Weaverse now uses React Router v7 for improved performance and developer experience. If you're upgrading from a previous version, see our [Migration Guide](/docs/hydrogen/migration-to-v5).

## Try the Weaverse Playground

Want to explore before installing? Visit our [interactive Playground](https://studio.weaverse.io/demo) to experience Weaverse's features firsthand. Watch our quick demo:

<iframe src="https://www.youtube.com/embed/1XwheeIImlE?rel=0" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>

## Install Weaverse

1. Go to [Weaverse on Shopify App Store](https://apps.shopify.com/weaverse)
2. Click "Add app"
3. Follow the installation prompts

![Weaverse on Shopify Apps Store](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_on_shopify_app_store.webp?v=1745846024)

## Create Your First Project

### 1. Start a New Project

In your Weaverse dashboard, click "Create New Project" to begin.

![Create Weaverse Hydrogen Project](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_new_weaverse_project.webp?v=1745846207)

### 2. Choose Your Theme

Select from our Hydrogen starter themes. Currently, we support "Pilot" and "Naturelle", with more coming soon! We recommend starting with "Pilot"—it's packed with essential features and best practices.

![Select Weaverse Starter Theme](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/select_weaverse_theme.webp?v=1745846236)

### 3. Clone Theme & Start Development

![Clone Weaverse Theme](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/create_weaverse_cli.webp?v=1745846272)

Follow the instructions provided in the next step within the Weaverse dashboard. You'll be given a command line instruction similar to this:

```bash
npx @weaverse/cli create project-name --theme pilot-theme
```

This command will:

1. Clone the selected theme's code to a new directory (`project-name`) on your local machine.
2. Install necessary dependencies.
3. Automatically start the development server (usually at `http://localhost:3456`).

### 4. Preview & Connect Store Data

Once the development server is running, you can preview your project in the Weaverse Studio. Initially, it will display sample data.

To develop using your own Shopify store data, you need to configure your environment variables:

1. **Locate your `.env` file:** This file is in the root directory of the project you just cloned.
2. **Update with your Storefront API credentials.**

   * **If your store is on a paid Shopify plan:** Ensure you have the official [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) installed and logged in. Then, install Shopify's [Hydrogen app](https://apps.shopify.com/hydrogen) to your store. Finally, run the following command in your project's root directory:

       ```bash
       npx shopify hydrogen env pull
       ```

       This command automatically fetches and populates your `.env` file.

   * **If your store is a development store:** You'll need to install the [Shopify Headless app](https://apps.shopify.com/shopify-headless). Refer to our [Environment Variables guide](/docs/hydrogen/environment-variables) for detailed instructions on obtaining and setting up the necessary credentials manually.

3. **Restart your development server** after updating the `.env` file for the changes to take effect.

💡 **Tip**: You can manage your project's preview URL in **Project Settings -> General** within the Weaverse dashboard.

![Weaverse Project Settings](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/weaverse_project_settings.webp)

⚠️ **Browser Note**: For the best local development experience, use a **Chrome-based browser**. Some features might have limitations in browsers like Safari when interacting with `localhost`.

### 5. Start Customizing

![Weaverse Theme Customizer](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_theme_customizer.webp?v=1745846304)

Our visual editor mirrors Shopify's familiar interface, making it easy to:

* Add and arrange sections
* Customize components
* Adjust layouts and styles
* Preview changes in real-time

## Next Steps

Ready to dive deeper? Learn how to build custom themes and components:

👉 [Build Your First Weaverse Hydrogen Theme](/docs/guides/prerequisites)

---
