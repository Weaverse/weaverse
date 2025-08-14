---
title: Themes & Templates
description: Learn about Weaverse themes, explore the Pilot template, and discover how to create your own themes.
order: 5
---

# Themes & Templates

Weaverse themes are complete Shopify Hydrogen storefronts that combine code structure with visual editing capabilities. Whether you're using existing themes or building your own, this section covers everything you need to know.

## Theme System Overview

Weaverse themes consist of:

- **Components**: Reusable UI elements with configurable properties
- **Sections**: Page-level building blocks  
- **Templates**: Page layouts for different content types
- **Theme Settings**: Global configuration options
- **Styling**: CSS, Tailwind, and design tokens

## Available Themes

### Pilot Theme
Our flagship starter theme showcasing Weaverse's capabilities:

- **[Overview](/docs/themes-templates/pilot-theme-overview)** - Theme features and structure
- **[Sections](/docs/themes-templates/pilot-theme-sections)** - Available page sections  
- **[Customization](/docs/themes-templates/pilot-theme-customization)** - Fonts, colors, and styling

## Creating Themes

### [Theme Development Guide](/docs/themes-templates/creating-themes)
Complete guide to building your own Weaverse theme from scratch.

### [Theme Marketplace](/docs/themes-templates/theme-marketplace)
Learn how to submit and share your themes with the community.

## Theme Architecture

```
my-weaverse-theme/
├── app/
│   ├── components/          # Reusable UI components
│   ├── sections/            # Weaverse page sections
│   ├── routes/              # React Router pages
│   └── weaverse/            # Weaverse configuration
├── public/                  # Static assets
└── weaverse.config.ts       # Theme configuration
```

## Key Features

- **Visual Editing**: All components work in Weaverse Studio
- **Type Safety**: Full TypeScript support throughout
- **Performance**: Optimized builds with lazy loading
- **SEO Ready**: Built-in meta tags and structured data
- **Mobile First**: Responsive design patterns
- **Shopify Native**: Deep integration with Shopify APIs

## Theme Guidelines

When creating themes, follow these best practices:

- **Accessibility**: Use semantic HTML and ARIA labels
- **Performance**: Optimize images and minimize bundle size
- **Customization**: Provide meaningful settings for merchants
- **Documentation**: Include clear setup and customization guides
- **Testing**: Test across different screen sizes and browsers

## Getting Started

1. **Explore**: Check out the [Pilot theme](/docs/themes-templates/pilot-theme/overview)
2. **Learn**: Follow the [Theme Development Guide](/docs/themes-templates/creating-themes)
3. **Build**: Create your own theme using our [Development Guide](/docs/development-guide)
4. **Share**: Submit to the [Theme Marketplace](/docs/themes-templates/theme-marketplace)

Ready to start building? Check out our [Getting Started guide](/docs/getting-started) to set up your development environment!