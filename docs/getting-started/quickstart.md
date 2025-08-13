---
title: 5-Minute Quickstart
description: Get a Weaverse Hydrogen storefront running locally in just 5 minutes.
order: 1
---

# 5-Minute Quickstart

Get your first Weaverse Hydrogen storefront up and running in minutes using our Pilot theme template.

## Prerequisites

- Node.js 18+ installed
- Basic familiarity with terminal/command line
- A Shopify store (development store is fine)

## Step 1: Clone the Pilot Theme

```bash
git clone https://github.com/Weaverse/pilot.git my-weaverse-store
cd my-weaverse-store
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Add your Shopify store credentials to `.env`:
```bash
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
```

## Step 4: Start Development Server

```bash
npm run dev
```

Your site will be available at `http://localhost:3000`

## Step 5: Open Weaverse Studio

Navigate to `http://localhost:3000/weaverse` to access the visual page builder and start customizing your storefront.

## What's Next?

- **Customize**: Edit pages using the visual builder
- **Learn**: Read the [Core Concepts](/docs/core-concepts) guide
- **Develop**: Create custom components following our [Development Guide](/docs/development-guide)
- **Deploy**: Use our [Deployment Guide](/docs/deployment) to go live

## Need Help?

- Check the [Troubleshooting Guide](/docs/resources/troubleshooting)
- Join our [Community Forum](/docs/community)
- Review the [FAQ](/docs/resources/faq)

Congratulations! You now have a working Weaverse Hydrogen storefront. 🎉