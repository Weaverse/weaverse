---
title: Data Connectors
description: Learn how to use data connectors to dynamically insert data into text content using template syntax.
publishedAt: September 24, 2025
updatedAt: September 24, 2025
order: 8
published: true
---

# Data Connectors

Data connectors allow you to dynamically insert data from your Weaverse application into text content using a simple template syntax. This feature enables rich, dynamic content that automatically updates when your data changes.

## Overview

Data connectors use the `{{path}}` syntax to reference data from various sources in your application. The system automatically resolves these placeholders with actual values from your data context, making it easy to create dynamic content without complex JavaScript logic.

## Template Syntax

### Basic Syntax

Use double curly braces to wrap data paths:

```html
<!-- Simple property access -->
<h1>{{root.shop.name}}</h1>

<!-- Nested object access -->
<p>{{routes/product.product.title}}</p>

<!-- Array indexing -->
<span>{{routes/product.product.images[0].altText}}</span>
```

### Supported Data Sources

Data connectors can access data from multiple contexts:

#### Root Data (`root.*`)
Access global application data:
```html
{{root.shop.name}}
{{root.shop.domain}}
{{root.user.name}}
```

#### Route Data (`routes/*`)
Access data specific to the current route:
```html
<!-- Simple routes -->
{{routes/product.product.title}}
{{routes/collection.collection.title}}

<!-- Complex routes with special characters -->
{{routes/($locale)._index.weaverseData.page.name}}
{{routes/($locale).blogs.$blogHandle.article.title}}
{{routes/($locale).collections.$collectionHandle.products.$productHandle.product.price}}
```

#### Current Route Data (`current.*`)
Access data for the currently active route:
```html
{{current.product.title}}
{{current.collection.description}}
```

#### Parent Route Data (`parent.*`)
Access data from parent routes in nested layouts:
```html
{{parent.collection.title}}
{{parent.blog.title}}
```

### Complex Route Patterns

Weaverse supports complex Remix route patterns with special characters:

| Pattern | Example | Description |
|---------|---------|-------------|
| Parentheses | `routes/($locale)` | Optional route segments |
| Dollar signs | `routes/$handle` | Dynamic route parameters |
| Dots | `routes/blogs.$handle` | Nested route segments |
| Mixed patterns | `routes/($locale).blogs.$blogHandle.$articleHandle` | Complex nested routes |

### Array Access

Access array elements using bracket notation:

```html
<!-- First image -->
<img src="{{routes/product.product.images[0].url}}" alt="{{routes/product.product.images[0].altText}}" />

<!-- Second breadcrumb -->
<span>{{routes/($locale).blogs.$blogHandle.$articleHandle.breadcrumbs[1].label}}</span>
```

## Usage in Components

### Rich Text Inputs

Data connectors work seamlessly with rich text inputs:

```tsx
// In your component schema
{
  type: "richtext",
  name: "content",
  label: "Content",
  defaultValue: "<h1>Welcome to {{root.shop.name}}</h1><p>Check out our featured product: {{routes/product.product.title}}</p>"
}
```

### Text Inputs

Use in any text input field:

```tsx
// Component settings
{
  type: "text",
  name: "heading",
  label: "Page Heading",
  defaultValue: "{{routes/($locale)._index.weaverseData.page.title}}"
}
```

### Dynamic Content in Components

```tsx
function ProductCard({ data }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <span className="price">${data.price}</span>
    </div>
  )
}

// Schema with data connectors
export let schema = createSchema({
  type: 'product-card',
  title: 'Product Card',
  settings: [
    {
      type: 'text',
      name: 'title',
      label: 'Product Title',
      defaultValue: '{{routes/product.product.title}}'
    },
    {
      type: 'richtext',
      name: 'description',
      label: 'Description',
      defaultValue: '{{routes/product.product.description}}'
    },
    {
      type: 'text',
      name: 'price',
      label: 'Price',
      defaultValue: '${{routes/product.product.price}}'
    }
  ]
})
```

## Data Resolution Priority

When multiple data sources could match a path, Weaverse follows this priority order:

1. **Specific Route Keys**: Exact route matches take precedence
2. **Longest Match**: More specific routes beat general ones
3. **Priority Routes**: `root`, `routes/product`, `routes/collection` are checked first
4. **Fallback Search**: Searches all available routes if no exact match

## Error Handling

Data connectors are designed to be resilient:

- **Missing Data**: If a path doesn't exist, the original `{{path}}` placeholder is preserved
- **Invalid Paths**: Malformed paths are left unchanged
- **Circular References**: Protected against infinite loops with circular reference detection
- **Type Safety**: Values are sanitized to prevent XSS attacks

## Performance Features

### Caching

Data connectors include intelligent caching:

- **Template Caching**: Compiled templates are cached for reuse
- **Route Parsing Caching**: Route pattern resolution is cached with LRU eviction
- **Fallback Caching**: Common lookup patterns are cached to improve performance

### Batch Processing

When processing multiple templates, data connectors:

- Parse all templates in a single pass
- Cache intermediate results
- Minimize redundant lookups

## Best Practices

### 1. Use Specific Routes

Prefer specific route paths over generic fallbacks:

```html
<!-- ✅ Good: Specific route -->
{{routes/($locale)._index.weaverseData.page.title}}

<!-- ❌ Avoid: Generic fallback -->
{{page.title}}
```

### 2. Handle Missing Data

Always consider fallback content:

```html
<!-- ✅ Good: With fallback -->
{{routes/product.product.title || 'Product Title'}}

<!-- ❌ Avoid: No fallback -->
{{routes/product.product.title}}
```

### 3. Use Appropriate Data Sources

Choose the right data context for your needs:

```html
<!-- Global data -->
{{root.shop.currency}}

<!-- Route-specific data -->
{{routes/product.product.price}}

<!-- Current page data -->
{{current.page.title}}
```

### 4. Performance Considerations

- Cache expensive data transformations
- Use batch processing for multiple connectors
- Avoid deep nesting in frequently accessed paths

## Advanced Usage

### Conditional Content

Combine with component logic for conditional rendering:

```tsx
function HeroSection({ data }: HeroSectionProps) {
  const title = data.title || '{{routes/($locale)._index.weaverseData.page.title}}'
  const subtitle = data.subtitle || '{{root.shop.description}}'

  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  )
}
```

### Dynamic URLs

Create dynamic links using data connectors:

```tsx
function Breadcrumb({ data }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      {data.breadcrumbs.map((crumb, index) => (
        <a key={index} href={crumb.url}>
          {crumb.label}
        </a>
      ))}
    </nav>
  )
}

// Schema with dynamic breadcrumb data
{
  type: 'richtext',
  name: 'breadcrumbText',
  label: 'Breadcrumb Text',
  defaultValue: '<a href="/">Home</a> > <a href="{{routes/($locale).blogs.$blogHandle.url}}">{{routes/($locale).blogs.$blogHandle.blog.title}}</a> > {{routes/($locale).blogs.$blogHandle.$articleHandle.article.title}}'
}
```

## Migration Guide

### From Static Content

Replace hardcoded values with data connectors:

```html
<!-- Before: Static content -->
<h1>My Awesome Store</h1>
<p>Welcome to our online shop!</p>

<!-- After: Dynamic content -->
<h1>{{root.shop.name}}</h1>
<p>{{routes/($locale)._index.weaverseData.page.description}}</p>
```

### From JavaScript Interpolation

Replace complex JavaScript with simple templates:

```tsx
// Before: JavaScript interpolation
<h1>{shop.name || 'Default Shop'}</h1>

// After: Data connector
<h1>{{root.shop.name}}</h1>
```

## Troubleshooting

### Common Issues

**Placeholders not resolving:**
- Check that the data path exists in your data context
- Verify route keys match your application structure
- Ensure data is loaded before component rendering

**Performance issues:**
- Review caching configuration
- Check for excessive template processing
- Consider batching multiple connectors

**XSS concerns:**
- Data connectors automatically sanitize HTML output
- Rich text inputs handle HTML safely
- Avoid inserting unsanitized user data

### Debug Tips

1. **Check Data Context**: Log your component's data context to verify available paths
2. **Test Routes**: Use browser dev tools to inspect route data structure
3. **Validate Syntax**: Ensure proper `{{path}}` syntax without typos
4. **Monitor Performance**: Use browser performance tools to identify bottlenecks

## Related Documentation

- [Component Schema](/docs/development-guide/component-schema) - Define component settings
- [Input Settings](/docs/development-guide/input-settings) - Configure input types
- [Data Fetching](/docs/development-guide/data-fetching) - Load component data
- [Creating Components](/docs/development-guide/creating-components) - Build custom components