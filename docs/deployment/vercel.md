---
title: Deploy to Vercel (Deprecated)
description: Step-by-step guide to deploying your Weaverse Hydrogen Project on Vercel.
publishedAt: January 24, 2024
updatedAt: April 16, 2024
order: 3
published: true
---

## Deploying Your Weaverse Hydrogen Project to Vercel

As a dynamic cloud platform, Vercel provides developers with robust tools for deploying, managing, and scaling their web and application projects. While it excels in deploying Next.js applications, its capabilities extend to a wide range of other application frameworks.

### Deprecated Notice

With the migration to Vite in the [Hydrogen April 2024 release](https://hydrogen.shopify.dev/update/april-2024), the existing Vercel adapter has become incompatible. We are actively updating the adapter to ensure compatibility with Vite. This guide will be revised once the adapter is updated.

In the interim, if you wish to continue using Vercel, you must utilize the classic remix compiler. The necessary code remains accessible on our `classic-compiler` branch. You can find it [here](https://github.com/Weaverse/pilot/tree/classic-compiler). Please clone the branch and adhere to the included instructions for deployment on Vercel.

This revision aims to clarify the message and enhance the formal tone of the document. Let me know if there are specific aspects you'd like further refined or adjusted!

### Important Considerations

Before opting to host your website on Vercel, be aware of these critical points:

- Vercel offers a unique approach to caching requests, which may not natively support the Remix app. Modifications in the code could be necessary for optimal performance on Vercel. Further information can be found [here](https://vercel.com/docs/frameworks/remix).
- Vercel is not included for free in the Shopify Basic plan like Oxygen is. Thus, it incurs additional costs.
- Deploying to Vercel is particularly recommended if:
  - You're on the Shopify Starter/Development plan, which doesn't include the Oxygen feature.
  - Vercel is used solely for development/testing purposes.
  - You prefer Vercel's features and are willing to bear the associated costs.

In this guide, we focus on deploying a Weaverse Hydrogen Project, a Remix-based application, to Vercel.

### Video Tutorial

For a visual walkthrough, watch our video tutorial below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/gCKq5dB95uw" title="Deploying Your Weaverse Hydrogen Project to Vercel" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Guided Deployment Procedure

### Clone the Theme on GitHub

Weaverse offers two distinct starter themes: [Pilot](https://github.com/Weaverse/pilot) and [Naturelle](https://github.com/Weaverse/Naturelle). Select your preferred theme and use the "Use this template" button to forge a new repository. For a more streamlined approach, utilize the "Deploy to Vercel" option found in the theme's README page, allowing Vercel to facilitate the deployment process.

### Connect with Vercel

Once your repository is set up, navigate to your Vercel dashboard and select the "Add New Project" button. Identify and choose the newly created repository, then proceed by clicking the "Continue" button.

### Configure the Environment Variables

Following the repository connection, your next step is to configure the necessary environment variables. Detailed guidance on these variables can be found in our comprehensive [Environment Variables](/docs/guides/environment-variables) guide.

### Deploy

With the environment variables configured, simply click the "Deploy" button to initiate the deployment of your project on Vercel.

### Update Weaverse Preview URL

Upon successful deployment, acquire the public URL of your project and proceed to update the Weaverse Preview URL within the Weaverse Studio interface.

---
