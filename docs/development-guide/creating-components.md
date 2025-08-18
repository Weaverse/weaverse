---
title: Creating Components
description: Learn how to build Weaverse components with proper schemas, TypeScript support, and modern React 19 patterns.
publishedAt: August 15, 2025
updatedAt: August 15, 2025
order: 2
published: true
---

# Creating Components

This guide walks you through creating Weaverse components from scratch, covering everything from basic component structure to advanced patterns with TypeScript and React 19.

## Table of Contents

- [Component Structure](#component-structure)
- [Basic Component Example](#basic-component-example)
- [Component Registration](#component-registration)
- [Schema Definition](#schema-definition)
- [TypeScript Integration](#typescript-integration)
- [Data Loading](#data-loading)
- [Styling Patterns](#styling-patterns)
- [Best Practices](#best-practices)
- [Advanced Patterns](#advanced-patterns)

## Component Structure

Every Weaverse component follows this structure:

```
app/sections/my-component/
├── index.tsx           # Main component file
├── schema.ts          # Schema definition (optional separate file)
└── loader.ts          # Data loader (optional separate file)
```

Or as a single file:

```
app/sections/my-component.tsx
```

### Required Exports

Each component file must export:

1. **Default export** - The React component
2. **schema export** - Component configuration
3. **loader export** (optional) - Server-side data loading

## Basic Component Example

Here's a simple component following modern React 19 patterns:

```tsx
// app/sections/hero-banner/index.tsx
import { createSchema } from "@weaverse/hydrogen";
import type { HydrogenComponentProps } from "@weaverse/hydrogen";

interface HeroBannerProps extends HydrogenComponentProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

function HeroBanner(props: HeroBannerProps) {
  const { 
    heading, 
    description, 
    buttonText, 
    buttonLink, 
    backgroundImage,
    children,
    ...rest 
  } = props;

  return (
    <section 
      {...rest}
      className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{heading}</h1>
        <p className="text-lg md:text-xl mb-8">{description}</p>
        {buttonText && buttonLink && (
          <a 
            href={buttonLink}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </a>
        )}
        {children}
      </div>
    </section>
  );
}

export default HeroBanner;

export const schema = createSchema({
  type: "hero-banner",
  title: "Hero Banner",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Welcome to Our Store",
          placeholder: "Enter heading text",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description", 
          defaultValue: "Discover amazing products and exceptional service.",
          placeholder: "Enter description text",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: "Shop Now",
        },
        {
          type: "url",
          name: "buttonLink",
          label: "Button Link",
          defaultValue: "/collections/all",
        },
      ],
    },
    {
      group: "Design",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background Image",
        },
      ],
    },
  ],
  childTypes: ["subheading", "paragraph"],
  presets: {
    heading: "Welcome to Our Store",
    description: "Discover amazing products and exceptional service.",
    buttonText: "Shop Now",
    buttonLink: "/collections/all",
    children: [
      {
        type: "subheading",
        content: "Limited Time Offer",
      },
    ],
  },
});
```

## Component Registration

**IMPORTANT**: After creating your component, you must register it in the components file to make it available in Weaverse Studio.

### Registration Steps

1. **Import your component** in the components file:

```tsx
// app/weaverse/components.ts (or templates/pilot/app/weaverse/components.ts)
import type { HydrogenComponent } from "@weaverse/hydrogen";

// Import your new component
import * as HeroBanner from "~/sections/hero-banner";
import * as ExistingComponent from "~/sections/existing-component";
// ... other imports

export const components: HydrogenComponent[] = [
  // Add your component to the array
  HeroBanner,
  ExistingComponent,
  // ... other components
];
```

2. **Restart your development server** to see the component in Weaverse Studio:

```bash
npm run dev
```

### Registration Example from Pilot Template

Here's how components are registered in the official Pilot template:

```tsx
// templates/pilot/app/weaverse/components.ts
import * as HeroImage from "~/sections/hero-image";
import * as FeaturedProducts from "~/sections/featured-products";  
import * as ImageWithText from "~/sections/image-with-text";
// ... many more imports

export const components: HydrogenComponent[] = [
  HeroImage,
  FeaturedProducts,
  ImageWithText,
  // ... 100+ registered components
];
```

### Common Registration Issues

**Problem**: Component doesn't appear in Weaverse Studio after creation
```bash
# ❌ Component created but not registered
```

**Solution**: Always register new components in the components array
```tsx
// ✅ Add to components.ts and restart dev server
import * as MyNewComponent from "~/sections/my-new-component";

export const components: HydrogenComponent[] = [
  MyNewComponent, // Add this line
  // ... existing components
];
```

**Problem**: Import path errors
```bash
# ❌ Wrong: Using default imports  
import MyComponent from "~/sections/my-component";
```

**Solution**: Always use namespace imports with `* as`
```tsx
// ✅ Correct: Using namespace import
import * as MyComponent from "~/sections/my-component";
```

## Schema Definition

The schema defines how your component appears and behaves in Weaverse Studio:

### Basic Schema Structure

```tsx
export const schema = createSchema({
  type: "component-name",        // Unique identifier
  title: "Component Title",      // Display name in Studio
  settings: [                    // Configuration groups
    {
      group: "Content",           // Group name
      inputs: [                   // Input controls
        {
          type: "text",           // Input type
          name: "propertyName",   // Property name
          label: "Display Label", // Label in Studio
          defaultValue: "Default", // Default value
        },
      ],
    },
  ],
  childTypes: ["heading", "paragraph"], // Allowed child components
  presets: {                     // Default values and children
    propertyName: "value",
    children: [
      { type: "heading", content: "Sample Heading" },
    ],
  },
});
```

### Input Types

Weaverse supports various input types:

```tsx
settings: [
  {
    group: "Content",
    inputs: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "richtext", name: "content", label: "Rich Content" },
      { type: "url", name: "link", label: "Link URL" },
      { type: "image", name: "image", label: "Image" },
      { type: "video", name: "video", label: "Video" },
      { type: "color", name: "color", label: "Color" },
      { type: "range", name: "opacity", label: "Opacity", configs: { min: 0, max: 100 } },
      { type: "toggle", name: "enabled", label: "Enable Feature" },
      { type: "select", name: "layout", label: "Layout", configs: {
        options: [
          { value: "grid", label: "Grid" },
          { value: "list", label: "List" },
        ],
      }},
    ],
  },
]
```

## TypeScript Integration

### Component Props Interface

Always define proper TypeScript interfaces:

```tsx
import type { HydrogenComponentProps } from "@weaverse/hydrogen";

interface MyComponentProps extends HydrogenComponentProps {
  // Define your component-specific props
  title: string;
  description?: string;
  layout: "grid" | "list";
  enabled: boolean;
  opacity: number;
}

function MyComponent(props: MyComponentProps) {
  // Component implementation with full type safety
}
```

### Schema Type Safety

You can extract types from your schema:

```tsx
import type { InferInput } from "@weaverse/hydrogen";

export const schema = createSchema({
  // ... schema definition
});

// Extract the props type from schema
type MyComponentProps = InferInput<typeof schema> & HydrogenComponentProps;

function MyComponent(props: MyComponentProps) {
  // Fully typed component
}
```

## Data Loading

For components that need server-side data, export a loader function:

```tsx
import type { ComponentLoaderArgs } from "@weaverse/hydrogen";

interface FeaturedProductData {
  productHandle: string;
}

export const loader = async (args: ComponentLoaderArgs<FeaturedProductData>) => {
  const { weaverse, data } = args;
  const { storefront } = weaverse;
  
  if (!data?.productHandle) {
    return null;
  }
  
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle: data.productHandle },
  });

  return { product };
};

type FeaturedProductProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> & FeaturedProductData;

function FeaturedProduct(props: FeaturedProductProps) {
  const { loaderData, productHandle } = props;
  const product = loaderData?.product;
  
  if (!product) {
    return <div>Select a product in the Studio</div>;
  }
  
  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      {/* Render product details */}
    </div>
  );
}
```

## Styling Patterns

### Tailwind CSS Integration

Use Tailwind classes for styling:

```tsx
function ProductCard(props: ProductCardProps) {
  const { product, layout } = props;
  
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg",
      layout === "compact" && "max-w-sm",
      layout === "wide" && "max-w-2xl"
    )}>
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.title}</h3>
        <p className="mt-1 text-sm text-gray-600">{product.price}</p>
      </div>
    </div>
  );
}
```

### Class Variance Authority (CVA)

For complex component variants:

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button(props: ButtonProps) {
  const { variant, size, children, ...rest } = props;
  
  return (
    <button 
      className={buttonVariants({ variant, size })}
      {...rest}
    >
      {children}
    </button>
  );
}
```

## Best Practices

### 1. Component Organization

```tsx
// ✅ Good: Clear structure and separation of concerns
function ProductGrid(props: ProductGridProps) {
  const { products, columns, spacing } = props;
  
  if (!products?.length) {
    return <EmptyState message="No products found" />;
  }
  
  return (
    <div className={getGridClasses(columns, spacing)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Helper function for grid classes
function getGridClasses(columns: number, spacing: string) {
  return cn(
    "grid",
    columns === 2 && "grid-cols-2",
    columns === 3 && "grid-cols-3", 
    columns === 4 && "grid-cols-4",
    spacing === "tight" && "gap-2",
    spacing === "normal" && "gap-4",
    spacing === "loose" && "gap-8"
  );
}
```

### 2. Error Boundaries

```tsx
import { ErrorBoundary } from "~/components/ErrorBoundary";

function DataComponent(props: DataComponentProps) {
  return (
    <ErrorBoundary fallback={<div>Failed to load data</div>}>
      <DataDisplay {...props} />
    </ErrorBoundary>
  );
}
```

### 3. Loading States

```tsx
function ProductList(props: ProductListProps) {
  const { loaderData } = props;
  
  if (!loaderData) {
    return <ProductListSkeleton />;
  }
  
  const { products } = loaderData;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 4. Responsive Design

```tsx
function ResponsiveGrid(props: ResponsiveGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {props.children}
    </div>
  );
}
```

## Advanced Patterns

### Context Providers

```tsx
import { createContext, useContext } from "react";

const ProductContext = createContext<Product | null>(null);

function ProductProvider({ product, children }: ProductProviderProps) {
  return (
    <ProductContext.Provider value={product}>
      {children}
    </ProductContext.Provider>
  );
}

function useProduct() {
  const product = useContext(ProductContext);
  if (!product) {
    throw new Error("useProduct must be used within ProductProvider");
  }
  return product;
}
```

### Compound Components

```tsx
function Card(props: CardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {props.children}
    </div>
  );
}

function CardHeader(props: CardHeaderProps) {
  return (
    <div className="border-b p-4">
      {props.children}
    </div>
  );
}

function CardContent(props: CardContentProps) {
  return (
    <div className="p-4">
      {props.children}
    </div>
  );
}

// Export as compound component
Card.Header = CardHeader;
Card.Content = CardContent;

export default Card;
```

### Schema Composition

```tsx
import { baseLayoutInputs, spacingInputs } from "~/lib/schema-helpers";

export const schema = createSchema({
  type: "complex-component",
  title: "Complex Component",
  settings: [
    {
      group: "Content",
      inputs: [
        { type: "text", name: "title", label: "Title" },
        { type: "textarea", name: "description", label: "Description" },
      ],
    },
    {
      group: "Layout",
      inputs: baseLayoutInputs,
    },
    {
      group: "Spacing",
      inputs: spacingInputs,
    },
  ],
});
```

## Next Steps

- Learn about [Input Settings](/docs/development-guide/input-settings)
- Master [Component Schemas](/docs/development-guide/component-schema)  
- Explore [Data Fetching](/docs/development-guide/data-fetching)
- Review [Styling & Theming](/docs/development-guide/styling-theming)

For more examples, check out the [Example Components](/docs/resources/example-components) and join our [Slack community](https://wvse.cc/weaverse-slack) for help.