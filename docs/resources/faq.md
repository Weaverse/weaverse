---
title: Frequently Asked Questions
description: Common questions and answers about Weaverse development and usage.
order: 3
---

# Frequently Asked Questions

Find answers to the most common questions about Weaverse development and usage.

## General Questions

### What is Weaverse?

Weaverse is a visual page builder and CMS designed specifically for Shopify Hydrogen storefronts. It allows developers to create customizable themes while giving merchants an intuitive drag-and-drop interface to build pages.

### How is Weaverse different from other page builders?

Weaverse is built specifically for Shopify Hydrogen and React Router v7. Unlike traditional page builders, it:

- Generates optimized static builds with zero runtime overhead
- Provides full developer control over component logic
- Integrates natively with Shopify APIs
- Supports server-side rendering and modern React patterns

### Do I need to know React to use Weaverse?

**For Merchants**: No, Weaverse provides a visual interface for building pages without any coding required.

**For Developers**: Yes, creating custom components requires React knowledge and familiarity with Shopify Hydrogen.

## Development Questions

### Can I use Weaverse with an existing Hydrogen project?

Yes! Weaverse can be added to existing Hydrogen projects. See our [Installation Guide](/docs/getting-started/installation) for step-by-step instructions.

### What's the difference between components and sections?

- **Components**: Small, reusable UI elements (buttons, cards, forms)
- **Sections**: Page-level building blocks that can contain multiple components (headers, hero areas, product grids)

See [Components vs Sections](/docs/core-concepts/components-sections) for detailed explanations.

### How do I create a custom component?

1. Create a React component with props
2. Add a Weaverse schema defining the configuration options
3. Register the component in your Weaverse config

See the [Development Guide](/docs/development-guide/creating-components) for detailed examples.

### Can I style components with custom CSS?

Yes, you can use:
- Tailwind CSS classes (recommended)
- CSS modules
- Styled components
- Custom CSS files

Weaverse works with any styling approach compatible with Hydrogen.

## Performance Questions

### Does Weaverse affect site performance?

No, Weaverse is designed for optimal performance:

- Components are pre-rendered at build time
- No client-side page building JavaScript
- Automatic image optimization
- Code splitting and lazy loading
- Optimized for Core Web Vitals

### How does caching work?

Weaverse leverages Hydrogen's caching strategies:
- Static pages are cached at the CDN level
- Dynamic content uses Shopify's cache tags
- Image assets are optimized and cached globally

## Shopify Integration Questions

### Which Shopify APIs does Weaverse use?

Weaverse uses:
- Storefront API for product data and cart operations
- Admin API for store configuration (when needed)
- Webhook APIs for real-time updates

### Can I use Weaverse with Shopify Plus features?

Yes, Weaverse works with all Shopify plan levels and supports Plus features like:
- Shopify Scripts
- Flow automation
- Multiple markets
- B2B functionality

### How do I handle product variants?

Weaverse provides built-in components for variant selection, or you can create custom variant selectors. See [Product Variants Guide](/docs/features/product-variants).

## Deployment Questions

### Where can I deploy Weaverse sites?

Weaverse sites can be deployed to any platform that supports Node.js:

- Shopify Oxygen (recommended)
- Vercel
- Netlify
- Docker containers
- Self-hosted servers

See our [Deployment Guide](/docs/deployment) for platform-specific instructions.

### How do I set up a staging environment?

1. Create a development store in Shopify
2. Deploy your Weaverse site to a staging URL
3. Configure environment variables for the staging store
4. Use branch-based deployments for testing changes

### Can I use a custom domain?

Yes, you can use custom domains with any deployment platform. Configure DNS settings to point to your hosting provider.

## Pricing and Licensing

### Is Weaverse free?

Weaverse offers both open-source components and commercial features:

- Core SDK: Open source and free
- Visual Studio: Commercial license required
- Premium components: Available with subscription

Check [weaverse.io/pricing](https://weaverse.io/pricing) for current pricing.

### Can I use Weaverse for client projects?

Yes, Weaverse can be used for client projects. Different licensing options are available based on your needs.

## Troubleshooting

### My components aren't showing in the editor

Check that:
- Components are properly exported
- Schemas are defined and valid
- Components are registered in your Weaverse config
- No TypeScript errors in the component files

### I'm getting build errors

Common solutions:
- Verify all dependencies are installed
- Check that environment variables are set correctly
- Ensure TypeScript types are properly defined
- Review the [Troubleshooting Guide](/docs/resources/troubleshooting)

### The visual editor isn't loading

This could be due to:
- Missing or incorrect API keys
- CORS configuration issues
- Network connectivity problems
- Browser security settings

See [Troubleshooting Guide](/docs/resources/troubleshooting) for detailed solutions.

## Getting Help

### Where can I get support?

- **Community Forum**: Free community support and discussions
- **Documentation**: Comprehensive guides and API references  
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community chat
- **Email Support**: Available with commercial licenses

### How do I report bugs?

1. Check existing [GitHub Issues](https://github.com/Weaverse/weaverse/issues)
2. Create a new issue with:
   - Clear reproduction steps
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Code samples if relevant

### Can I request new features?

Yes! Feature requests are welcome:

1. Check if the feature already exists in our roadmap
2. Create a GitHub issue with the "feature request" label
3. Describe the use case and expected behavior
4. Participate in community discussions about the feature

## Still Have Questions?

If you can't find your answer here:

- Browse our [Documentation](/docs)
- Join our [Community Forum](/docs/community)
- Check the [Troubleshooting Guide](/docs/resources/troubleshooting)
- Search [GitHub Issues](https://github.com/Weaverse/weaverse/issues)

We're always here to help! 🚀