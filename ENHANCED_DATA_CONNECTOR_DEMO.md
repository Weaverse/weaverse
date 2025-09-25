# Enhanced Data Connector with useMatches Integration

## Overview
The data connector feature has been enhanced to support accessing data from all route matches using Remix Router v7's `useMatches` hook, providing broader context access beyond just the current route's `loaderData`.

## New Features

### 1. Enhanced Data Context Hook
```typescript
import { useWeaverseDataContext } from '@weaverse/react'

function MyComponent() {
  const dataContext = useWeaverseDataContext()
  
  // Access different route data
  console.log(dataContext.root)     // Root route data
  console.log(dataContext.layout)   // Layout route data  
  console.log(dataContext.parent)   // Parent route data
  console.log(dataContext.current)  // Current route data
  console.log(dataContext.combined) // All data merged together
}
```

### 2. Enhanced Template Syntax

#### Route-Specific Prefixes (New)
```typescript
// Access root route data (site-wide settings, global data)
'{{root.siteSettings.title}}'           // "My Store"
'{{root.globalData.announcement}}'      // "Free shipping today!"

// Access layout route data (navigation, shared UI elements)  
'{{layout.navigation.primaryMenu[0]}}'  // "Home"
'{{layout.sidebar.widgets}}'            // Layout-specific data

// Access parent route data (category, section data)
'{{parent.category.name}}'              // "Electronics"
'{{parent.category.description}}'       // "Latest gadgets..."

// Access current route data (specific to current page)
'{{current.product.title}}'             // "iPhone 15 Pro"
'{{current.product.price}}'             // "$999"
```

#### Backward Compatibility (Existing)
```typescript
// These still work - auto-resolved from combined data
'{{user.name}}'                         // "John Doe"
'{{product.title}}'                     // "iPhone 15 Pro"  
'{{siteSettings.title}}'                // "My Store"
```

### 3. Enhanced Data Connector Function

The `replaceContentDataConnectors` function now accepts both formats:

```typescript
import { replaceContentDataConnectors } from '@weaverse/react'

// Enhanced context (new)
const dataContext = useWeaverseDataContext()
const result = replaceContentDataConnectors(template, dataContext)

// Legacy format (still supported)
const loaderData = useLoaderData()  
const result = replaceContentDataConnectors(template, loaderData)
```

## Real-World Examples

### E-commerce Product Page
```typescript
// Template content
const template = `
  <header>{{root.siteSettings.title}}</header>
  <nav>{{layout.navigation.breadcrumbs}}</nav>
  <section>
    <h1>{{parent.category.name}} > {{current.product.title}}</h1>
    <p>Price: ${{current.product.price}}</p>
    <p>Description: {{current.product.description}}</p>
  </section>
  <footer>{{root.siteSettings.footerText}}</footer>
`

// Route data structure
const routeData = {
  root: { 
    siteSettings: { 
      title: "TechStore", 
      footerText: "© 2025 TechStore" 
    } 
  },
  layout: { 
    navigation: { 
      breadcrumbs: "Home > Electronics" 
    } 
  },
  parent: { 
    category: { 
      name: "Smartphones" 
    } 
  },
  current: { 
    product: { 
      title: "iPhone 15 Pro", 
      price: "999", 
      description: "Latest iPhone with Pro features" 
    } 
  }
}

// Result:
// <header>TechStore</header>
// <nav>Home > Electronics</nav>  
// <section>
//   <h1>Smartphones > iPhone 15 Pro</h1>
//   <p>Price: $999</p>
//   <p>Description: Latest iPhone with Pro features</p>
// </section>
// <footer>© 2025 TechStore</footer>
```

### Blog Article Page  
```typescript
const template = `
  <header>
    <h1>{{root.blogSettings.title}}</h1>
    <nav>{{layout.blogNav.categories}}</nav>
  </header>
  <article>
    <h2>{{current.article.title}}</h2>
    <p>Published in: {{parent.category.name}}</p>
    <div>{{current.article.content}}</div>
  </article>
`
```

## Migration Guide

### For Existing Users (No Changes Required)
Your existing templates continue to work exactly as before:

```typescript
// This still works perfectly
const content = 'Hello {{user.name}}, welcome to {{site.title}}!'
const result = replaceContentDataConnectors(content, loaderData)
```

### For New Enhanced Features
To use the new route-specific features:

```typescript
// 1. Import the enhanced hook
import { useWeaverseDataContext } from '@weaverse/react'

// 2. Use enhanced context instead of useLoaderData
function MyComponent() {
  // Old way
  // const loaderData = useLoaderData()
  
  // New way  
  const dataContext = useWeaverseDataContext()
  
  // 3. Use enhanced template syntax
  const template = `
    Site: {{root.settings.name}}
    Section: {{parent.section.title}}  
    Page: {{current.page.title}}
  `
  
  const result = replaceContentDataConnectors(template, dataContext)
}
```

## Benefits

1. **Broader Context**: Access data from any route in the match hierarchy
2. **Better Organization**: Clear separation between global, layout, and page-specific data  
3. **Improved Performance**: Efficient caching across all route data
4. **Backward Compatible**: Existing code continues to work without changes
5. **Type Safe**: Full TypeScript support for all data contexts
6. **Security**: Same XSS protection and sanitization as before

## Test Coverage

- ✅ 36 comprehensive tests covering all scenarios
- ✅ Route-specific prefix resolution  
- ✅ Backward compatibility with legacy format
- ✅ Error handling and edge cases
- ✅ Performance optimization validation
- ✅ Security XSS prevention tests