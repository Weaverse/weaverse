---
title: FAQs
description: Answers to common questions about Weaverse, its features, and implementation.
publishedAt: April 14, 2025
updatedAt: April 14, 2025
order: 6
published: true
---

# Frequently Asked Questions

This page provides answers to common questions about Weaverse, its features, and implementation details. If you don't find an answer to your question here, please reach out through our [GitHub Discussions](https://github.com/orgs/Weaverse/discussions) or [Slack workspace](https://wvse.cc/weaverse-slack).

## Table of Contents

- [General Questions](#general-questions)
- [Getting Started](#getting-started)
- [Components and Customization](#components-and-customization)
- [Data and Integration](#data-and-integration)
- [Deployment and Performance](#deployment-and-performance)
- [Troubleshooting](#troubleshooting)

## General Questions

### What is Weaverse?

Weaverse is a visual builder and customization platform for Shopify Hydrogen storefronts. It allows you to create, customize, and manage your headless Shopify store without writing code, while still providing developers with the flexibility to extend and customize components.

### How does Weaverse differ from traditional Shopify themes?

Unlike traditional Shopify themes, Weaverse is built on Hydrogen and Remix, providing a modern, component-based architecture that delivers superior performance and flexibility. Weaverse combines the speed and developer experience of a headless architecture with the ease of use of a visual builder.

### Is Weaverse free to use?

Please check our [pricing page](https://weaverse.io/pricing) for the most up-to-date information about our pricing plans.

### Can I use Weaverse with an existing Hydrogen store?

Yes, Weaverse can be integrated with existing Hydrogen stores. However, some refactoring may be required to align your components with the Weaverse component model. Contact us for specific guidance on your integration.

## Getting Started

### How do I install Weaverse?

1. Install the Weaverse Hydrogen Customizer from the Shopify App Store
2. Create a new Hydrogen storefront inside Weaverse
3. Initialize the project and start a local dev server using the `@weaverse/cli` tool as instructed in Weaverse Studio

For detailed instructions, see our [Getting Started Guide](/docs/getting-started).

### What are the system requirements for running Weaverse?

To work with Weaverse, you need:
- Node.js version 18.0.0 or higher
- A Shopify store
- Basic familiarity with React (for developers who want to extend functionality)

### Can I use TypeScript with Weaverse?

Yes, Weaverse fully supports TypeScript and provides type definitions for all its components and APIs. We recommend using TypeScript for type safety and better developer experience.

## Components and Customization

### How do I create custom components for Weaverse?

Creating custom components involves defining the component logic, schema, and integrating it with Weaverse. A basic component looks like this:

```tsx
import type { HydrogenComponentProps, HydrogenComponentSchema } from '@weaverse/hydrogen';
import { forwardRef } from 'react';

interface CustomComponentProps extends HydrogenComponentProps {
  title: string;
  description: string;
}

const CustomComponent = forwardRef<HTMLElement, CustomComponentProps>((props, ref) => {
  const { title, description, ...rest } = props;
  
  return (
    <section ref={ref} {...rest}>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
});

export default CustomComponent;

export const schema: HydrogenComponentSchema = {
  type: 'custom-component',
  title: 'Custom Component',
  settings: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
          defaultValue: 'Default Title',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          defaultValue: 'Default description text',
        },
      ],
    },
  ],
};
```

For more details, see our [Component Development Guide](/docs/guides/weaverse-component).

### How do I add data fetching to my components?

Components can fetch data using a loader function:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

export const loader = async ({ weaverse, data }: ComponentLoaderArgs) => {
  const { product } = await weaverse.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: data.productHandle,
    },
  });
  
  return { product };
};
```

The data is then available in your component via `props.loaderData`.

### What settings input types are available for component customization?

Weaverse provides a variety of input types to customize your components, including:
- Text fields
- Textareas
- Select dropdowns
- Toggles
- Number inputs
- Color pickers
- Image selectors
- Product selectors
- Collection selectors
- Position selectors
- And more

## Data and Integration

### How does Weaverse handle data fetching from Shopify?

Weaverse provides built-in integration with the Shopify Storefront API. Components can define loader functions that use the storefront client to fetch data. This approach allows components to have their own data dependencies and maintain clean separation of concerns.

### Can I use Weaverse with non-Shopify data sources?

Yes, Weaverse components can fetch data from any external API. You can use the component loader function to make HTTP requests to third-party services, and the data will be available to your component.

### How do I integrate third-party services with Weaverse?

You can integrate third-party services at the component level using loaders or at the application level using Remix's loader functions. For services that require client-side initialization, you can create wrapper components that initialize the service in useEffect hooks.

## Deployment and Performance

### Where can I deploy my Weaverse store?

Weaverse stores can be deployed to:
- Shopify Oxygen
- Any platform that supports Hydrogen/Remix applications

### How does Weaverse handle performance optimization?

Weaverse optimizes performance through:
- Server-side rendering (SSR)
- Streaming and deferred loading
- Component-level data fetching
- Static site generation (SSG) for suitable routes
- Image optimization
- Asset bundling and minification

### What are the recommended caching strategies for Weaverse stores?

Weaverse follows Hydrogen's caching recommendations, using the cache API for data fetching. You can also implement CDN caching, client-side caching, and route caching for optimal performance.

## Troubleshooting

### My components aren't appearing in the Weaverse Studio. What should I check?

1. Ensure your component is properly exported in your `components.ts` file
2. Verify that your component has a valid schema with a unique type
3. Check for any errors in the browser console
4. Make sure your component is properly registered with Weaverse

### I'm getting TypeScript errors when using Weaverse. How do I fix them?

1. Make sure you've installed the latest version of `@weaverse/hydrogen`
2. Check that your TypeScript version is compatible (4.5+)
3. Ensure your component props extend `HydrogenComponentProps`
4. Use `forwardRef` with the correct type parameters

### How do I debug data fetching issues in my components?

1. Use the `/debug-network` endpoint to inspect server-side network requests
2. Add console logs in your loader function to track data flow
3. Verify your GraphQL queries are correctly formed
4. Check that you're properly accessing the data in your component

### Why can't I load Preview with Oxygen deployment?

If you're using Oxygen deployment, you might encounter the following error when trying to preview your Weaverse Hydrogen project:

![preview error](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/preview_not_load.jpg?v=1719390592)

This error is caused by the Preview URL not being set to public from Hydrogen's settings. Please follow this [instruction](https://weaverse.io/docs/deployment/oxygen#publish-your-storefront--update-weaverse-preview-url) to set the Hydrogen Environment to public.

### Why am I getting "404 - We've lost this page" errors?

Sometimes, you may click a link in your Hydrogen page and get a 404 error. This happens because the route you clicked on either does not exist or does not include the `<WeaverseContent />` component.

To fix this issue, please follow this [instruction](https://weaverse.io/docs/guides/rendering-page) to add the `<WeaverseContent />` component to your page.

You can refer to our demo repositories for complete examples:
- [Pilot Demo](https://github.com/Weaverse/pilot)
- [Naturelle Demo](https://github.com/Weaverse/naturelle)

---

## Still Have Questions?

If you couldn't find an answer to your question, please:

1. Search existing discussions in our [GitHub Discussions](https://github.com/orgs/Weaverse/discussions)
2. Ask in our [Slack workspace](https://wvse.cc/weaverse-slack)
3. Open a new discussion on GitHub

Our team and community are happy to help! 