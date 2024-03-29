---
title: Tutorial (20m)
description: A comprehensive guide to Weaverse, the first-ever Theme Customizer & CMS for Shopify Hydrogen.
publishedAt: March 28, 2024
updatedAt: March 28, 2024
order: 2
published: false
---


## **Weaverse Hydrogen Tutorial**

We'll guide you through the process of setting up a Weaverse Hydrogen project, from installation, set up the theme to deployment. We will use the pre-made "[Pilot](https://github.com/weaverse/pilot)" theme in this tutorial, so we expected it will take around 20 minutes if you're following along, otherwise it's a quick read.

![weaverse pilot theme](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/pilot.webp)

### **Prerequisites**
As we're building a Shopify Hydrogen project, we assumed that you have a basic knowledge of following technologies, if not, please click on the links to learn it first:
- [React](https://react.dev)
- [Remix](https://remix.run/docs/en/main/start/tutorial)
- [Shopify Hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started)
- [Shopify Theme](https://shopify.dev/docs/themes/architecture)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

### **Install Weaverse App**
Weaverse is publicly available on Shopify App Store, you can install it from [here](https://apps.shopify.com/weaverse?utm_source=tutorial). Once installed, you can access it from your Shopify Admin Dashboard.

### **Create a New Project**
Once installed the Weaverse app, you can create a new project by clicking on the "Create Project" button. The app now will navigate to the project creation page, where you can select the Hydrogen theme, by default the Pilot theme is selected.
![weaverse create project](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/create-project.webp)


### **Explore the theme editor**
Once the project is created, you can explore the theme editor, where you can customize the theme, add new sections, blocks, and pages. You can also preview the theme in the Hydrogen editor.

### **Setup local development**
To setup the local development, you need to clone the project to your local machine. There are many different way to do that like download the Github repo directly or use it as template in Github and clone it. However, the quickest way is to use the Weaverse CLI, which you can install by running the following command:
```bash
npx @weaverse/cli@latest create --template=pilot --project-id=your-porject-id --project-name=my-hydrogen-storefront
```
This command will create a new project with the Pilot theme in the current directory. You can replace the `--project-id` and `--project-name` with your own project id and name.

### **Start the development server**
After run the above command, the server should start automatically, if not, then go to the project directory and run the following command:

```bash
npm run dev
```
The Hydrogen project now should be running on `http://localhost:3456`.

### **Learn the Weaverse Hydrogen Theme**
The Pilot theme is a fully functional Shopify Hydrogen theme, which you can use as a starting point for your own project. It includes all the necessary components, sections, and blocks to get you started.
Beside the default Hydrogen structure, we added some files and folders to make it integrate with Weaverse in the `app/weaverse` and `app/sections` folders.


```text data-line-numbers=false
🌳 <root>
├── 📁 app
│   ├── 📁 ...
│   ├── 📁 components
│   ├── 📁 data
│   ├── 📁 graphql
│   ├── 📁 hooks
│   ├── 📁 libs
│   ├── 📁 routes
│   ├── 📁 sections
│   ├── 📁 styles
│   ├── 📁 weaverse
│   │   └── 📄 components.ts
│   │   └── 📄 create-weaverse.server.ts
│   │   └── 📄 index.tsx
│   │   └── 📄 schema.server.ts
│   │   └── 📄 style.tsx
│   ├── 📄 entry.client.tsx
│   ├── 📄 entry.server.tsx
│   └── 📄 root.tsx
├── 📁 public
│   └── 📄 favicon.svg
├── 📄 .editorconfig
├── 📄 .env
├── 📄 package.json
├── 📄 remix.config.js
├── 📄 remix.env.d.ts
├── 📄 server.ts
├── 📄 sync-project.md
└── 📄 tailwind.config.js
└── 📄 ...
```

### **Create a customizable Section**

