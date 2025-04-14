---
title: Weaverse Hydrogen Component
description: Learn how to build powerful, customizable components for your Weaverse Hydrogen theme.
publishedAt: November 20, 2023
updatedAt: April 11, 2025
order: 3
published: true
---

# Weaverse Hydrogen Components

Weaverse Components are the building blocks of your Hydrogen theme. They combine React's component model with Weaverse's powerful schema system to create customizable, performant sections for your storefront. This guide provides a comprehensive overview of how to create, configure, and optimize Weaverse components.

## Table of Contents
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Component Structure](#component-structure)
- [Component Types](#component-types)
- [Schema Definition](#schema-definition)
- [Data Integration](#data-integration)
- [Component Organization Patterns](#component-organization-patterns)
- [Styling Patterns](#styling-patterns)
- [Performance Optimization](#performance-optimization)
- [Advanced Patterns](#advanced-patterns)
- [Interactive Components](#interactive-components)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Component Registration

To use your components in Weaverse, you need to register them in your application:

```tsx
// app/weaverse/components.ts
import type { HydrogenComponent } from '@weaverse/hydrogen';
import * as HeroImage from '~/sections/hero-image';
import * as RelatedProducts from '~/sections/related-products';

export const components: HydrogenComponent[] = [
  HeroImage,
  RelatedProducts,
  // Add more components...
];
```

```tsx
// app/weaverse/index.tsx
import { WeaverseHydrogenRoot } from "@weaverse/hydrogen";
import { GenericError } from "~/components/root/generic-error";
import { components } from "./components";

export function WeaverseContent() {
  return (
    <WeaverseHydrogenRoot
      components={components}
      errorComponent={GenericError}
    />
  );
}
```

## Core Concepts

### What Makes a Weaverse Component?

A Weaverse Component consists of three essential parts:

1. **Component Logic**: A React component that renders your UI using TypeScript and modern React patterns
2. **Schema Definition**: Configuration that powers the visual editor in Weaverse Studio
3. **Data Integration**: Optional server-side data fetching for dynamic content

### Component Lifecycle

A Weaverse component follows this lifecycle:

1. **Component Creation**: Define the component file
2. **Schema Definition**: Configure how the component appears in the editor
3. **Component Logic**: Implement the React component with proper props
4. **Data Integration**: Set up data fetching if needed
5. **Render**: Component is rendered on the page
6. **Update**: Component re-renders when props or state change
7. **Cleanup**: Component unmounts and cleans up resources

## Component Structure

### Basic Component Architecture

Every Weaverse component follows a consistent structure:

1. **Imports**: Import necessary types and utilities from Weaverse and React
2. **Interface**: Define the component's props interface
3. **Component**: Create the component (with or without `forwardRef`, see note below)
4. **Schema**: Export the schema that defines how the component appears in Weaverse Studio
5. **Export**: Export the component as default

> **Note about `forwardRef`**: While many examples use `forwardRef`, it's actually optional in Weaverse components. It helps pass the ref to the component's DOM element so that Weaverse Editor can render essential UI elements like overlays and toolbars in the editor. However, if you spread all props to your root DOM element (e.g., `<div {...props}>`), Weaverse will automatically detect the DOM element. Additionally, with React 19, `forwardRef` will become less necessary due to improvements in ref handling.

### Basic Component Template

```tsx
import type { HydrogenComponentProps, HydrogenComponentSchema } from '@weaverse/hydrogen';
import { forwardRef } from 'react';  // Optional but recommended for now

interface MyComponentProps extends HydrogenComponentProps {
  // Add your custom props here
  title?: string;
  description?: string;
}

// Using forwardRef (recommended approach for React 18)
const MyComponent = forwardRef<HTMLElement, MyComponentProps>((props, ref) => {
  const { title, description, children, ...rest } = props;
  
  return (
    <section ref={ref} {...rest}>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {children}
    </section>
  );
});

// Alternative: Without forwardRef (will work if you spread props to root element)
// function MyComponent(props: MyComponentProps) {
//   const { title, description, children, ...rest } = props;
//   
//   return (
//     <section {...rest}>  // Make sure to spread remaining props here
//       {title && <h2>{title}</h2>}
//       {description && <p>{description}</p>}
//       {children}
//     </section>
//   );
// }

export const schema: HydrogenComponentSchema = {
  type: 'my-component',
  title: 'My Component',
  inspector: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
        },
      ],
    },
  ],
};

export default MyComponent;
```

### Key Elements

1. **HydrogenComponentProps**: Base props interface that all Weaverse components extend
2. **forwardRef**: Used to properly pass refs through the component tree (optional if props are spread correctly)
3. **type property in schema**: Unique identifier for the component (must be unique across all components)
4. **inspector**: Defines the UI controls in Weaverse Studio
5. **children prop**: Components can render child components or elements

### Advanced Component Structure

For more complex components, you may need to handle data loading, custom styling, or complex props management:

```tsx
import { Await, useLoaderData } from "@remix-run/react";
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { Suspense, forwardRef } from "react";
import type { ProductCardFragment } from "storefront-api.generated";
import Heading, { type HeadingProps, headingInputs } from "~/components/heading";
import { ProductCard } from "~/components/product/product-card";
import { Section, type SectionProps, layoutInputs } from "~/components/section";
import { Swimlane } from "~/components/swimlane";

interface RelatedProductsProps
  extends Omit<SectionProps, "content">,
    Omit<HeadingProps, "as"> {
  headingTagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const RelatedProducts = forwardRef<HTMLElement, RelatedProductsProps>((props, ref) => {
  const { recommended } = useLoaderData<{
    recommended: { nodes: ProductCardFragment[] };
  }>();
  
  const {
    headingTagName,
    content,
    size,
    mobileSize,
    desktopSize,
    color,
    weight,
    letterSpacing,
    alignment,
    minSize,
    maxSize,
    ...rest
  } = props;

  if (recommended) {
    return (
      <Section ref={ref} {...rest}>
        {content && (
          <Heading
            content={content}
            as={headingTagName}
            color={color}
            size={size}
            mobileSize={mobileSize}
            desktopSize={desktopSize}
            minSize={minSize}
            maxSize={maxSize}
            weight={weight}
            letterSpacing={letterSpacing}
            alignment={alignment}
          />
        )}
        <Suspense>
          <Await
            errorElement="There was a problem loading related products"
            resolve={recommended}
          >
            {(products) => (
              <Swimlane>
                {products.nodes.slice(0, 12).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="snap-start w-80"
                  />
                ))}
              </Swimlane>
            )}
          </Await>
        </Suspense>
      </Section>
    );
  }
  
  return <section ref={ref} {...rest} />;
});

export default RelatedProducts;

export const schema: HydrogenComponentSchema = {
  type: "related-products",
  title: "Related products",
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  inspector: [
    {
      group: "Layout",
      inputs: layoutInputs.filter((i) => i.name !== "borderRadius"),
    },
    {
      group: "Heading",
      inputs: headingInputs.map((input) => {
        if (input.name === "as") {
          return {
            ...input,
            name: "headingTagName",
          };
        }
        return input;
      }),
    },
  ],
  presets: {
    gap: 32,
    width: "full",
    content: "You may also like",
  },
};
```

## Component Types

### 1. Content Sections
- Hero sections (images, videos)
- Text blocks and rich content
- Media galleries and sliders
- Feature sections
- Testimonial sections

### 2. E-commerce Components
- Product displays
- Collection grids
- Related products
- Product information
- Cart components
- Checkout components

### 3. Interactive Elements
- Forms and newsletters
- Reviews and testimonials
- Maps and location displays
- Countdown timers
- Image hotspots

## Schema Definition

The schema defines how your component appears and behaves in Weaverse Studio. It provides the configuration for the visual editor, allowing users to customize your component without writing code.

### Schema Structure

```tsx
export const schema: HydrogenComponentSchema = {
  type: 'component-type',      // Unique identifier
  title: 'Component Title',    // Display name in the Studio
  inspector: [                 // Controls in the inspector panel
    {
      group: 'Group Name',     // Groups related controls
      inputs: [
        {
          type: 'input-type',  // Type of input control
          name: 'inputName',   // Property name in the component
          label: 'Input Label', // Display label
          configs: {           // Type-specific configuration
            // Input-specific configurations
          },
        },
      ],
    },
  ],
  presets: {                   // Default values
    // Default values for properties
  },
  enabledOn: {                 // Page type restrictions
    pages: ['PAGE_TYPE'],
  },
  childTypes: ['component-type'], // Allowed child components
  limit: 1,                    // Maximum instances
};
```

### Common Input Types

1. **Basic Inputs**
   - `text`: Single-line text input
   - `textarea`: Multi-line text input
   - `richtext`: Rich text editor with formatting
   - `number`: Numeric input
   - `color`: Color picker
   - `toggle`: Boolean switch
   - `select`: Dropdown selection
   - `range`: Slider input
   - `toggle-group`: Group of exclusive options

2. **Media Inputs**
   - `image`: Image selector
   - `video`: Video selector
   - `file`: File selector

3. **Layout Inputs**
   - `position`: Position selector (top/center/bottom, left/center/right)
   - `spacing`: Margin and padding controls
   - `alignment`: Text alignment controls

4. **Special Inputs**
   - `product`: Product selector
   - `collection`: Collection selector
   - `datepicker`: Date and time selector
   - `heading`: Section divider with heading

### Input Configuration

Each input type has specific configuration options:

```tsx
// Select input example
{
  type: "select",
  name: "height",
  label: "Section height",
  configs: {
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  defaultValue: "medium",
  helpText: "Controls the height of the section",
}

// Range input example
{
  type: "range",
  name: "opacity",
  label: "Opacity",
  configs: {
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
  },
  defaultValue: 100,
}

// Toggle group example
{
  type: "toggle-group",
  name: "alignment",
  label: "Content alignment",
  configs: {
    options: [
      { value: "left", label: "Left", icon: "align-start-vertical" },
      { value: "center", label: "Center", icon: "align-center-vertical" },
      { value: "right", label: "Right", icon: "align-end-vertical" },
    ],
  },
  defaultValue: "center",
}
```

### Advanced Schema Example

```tsx
export const schema: HydrogenComponentSchema = {
  type: "hero-image",
  title: "Hero image",
  inspector: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        ...layoutInputs.filter(
          (inp) => inp.name !== "divider" && inp.name !== "borderRadius",
        ),
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    height: "large",
    contentPosition: "center center",
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 40,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Hero image with text overlay",
        as: "h2",
        color: "#ffffff",
        size: "default",
      },
      {
        type: "paragraph",
        content:
          "Use this text to share information about your brand with your customers.",
        color: "#ffffff",
      },
    ],
  },
};
```

## Data Integration

In a Weaverse Hydrogen project, there are two distinct types of loader functions:

1. **Remix Route Loaders**: These loaders are used in Remix route files (`routes/*.tsx`) and follow the Remix conventions
2. **Weaverse Component Loaders**: These loaders are defined in Weaverse component files and enable server-side data fetching at the component level

### Remix Route Loaders

In Remix route files, you define loaders that run on the server and provide data to all components rendered by that route:

```tsx
// app/routes/products.$handle.tsx
import { json, type LoaderArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params, context }: LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle },
  });
  
  return json({ product });
}

export default function ProductRoute() {
  const { product } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>{product.title}</h1>
      {/* Weaverse content rendering goes here */}
      <WeaverseContent />
    </div>
  );
}
```

### Weaverse Component Loaders

Weaverse components can define their own loaders, which fetch data specifically for that component. This allows for more modular and reusable components that bring their own data:

```tsx
// app/sections/featured-product/index.tsx
import type { ComponentLoaderArgs, HydrogenComponentProps, HydrogenComponentSchema } from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { PRODUCT_QUERY } from '~/graphql/queries';

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
    variables: {
      handle: data.productHandle,
    },
  });

  return { product };
};

type FeaturedProductProps = HydrogenComponentProps<Awaited<ReturnType<typeof loader>>> & FeaturedProductData;

const FeaturedProduct = forwardRef<HTMLElement, FeaturedProductProps>((props, ref) => {
  const { loaderData, productHandle, ...rest } = props;
  const product = loaderData?.product;
  
  if (!product) {
    return <div>Select a product in the editor</div>;
  }
  
  return (
    <section ref={ref} {...rest}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      {/* Product details */}
    </section>
  );
});

export default FeaturedProduct;

export const schema: HydrogenComponentSchema = {
  type: 'featured-product',
  title: 'Featured Product',
  inspector: [
    {
      group: 'Product',
      inputs: [
        {
          type: 'product',
          name: 'productHandle',
          label: 'Product',
        },
      ],
    },
  ],
};
```

### Key Differences

1. **Scope**:
   - Remix loaders provide data to an entire route
   - Weaverse component loaders provide data only to the specific component

2. **Access**:
   - Remix loader data is accessed via the `useLoaderData()` hook
   - Weaverse component loader data is received via `props.loaderData`

3. **Arguments**:
   - Remix loaders receive `{ params, request, context }`
   - Weaverse component loaders receive `{ weaverse, data, request }` where:
     - `weaverse`: Contains Weaverse-specific utilities and context
     - `data`: Contains the component's configured data from the editor
     - `request`: The original request object

4. **Use cases**:
   - Use Remix loaders for route-level data like page information
   - Use Weaverse component loaders for component-specific data

### Data Flow Between Components

Components can access data from their parent components using the `useParentInstance` hook:

```tsx
import { useParentInstance } from '@weaverse/hydrogen';

function ChildComponent() {
  const parent = useParentInstance();
  const data = parent.data.loaderData;
  // Use the data from parent component
}
```

### Data Fetching Best Practices

1. **Type Safety**: Always define proper TypeScript interfaces for your loader data:

```tsx
interface ComponentData {
  // Define your data structure
}

export async function loader(args: ComponentLoaderArgs): Promise<ComponentData> {
  // Fetch data
  return data;
}
```

2. **Error Handling**: Implement proper error handling in your loaders:

```tsx
export async function loader({ context }: ComponentLoaderArgs) {
  try {
    const data = await fetchData();
    return { data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: null, error: 'Failed to load data' };
  }
}
```

3. **Data Transformation**: Transform data in the loader before passing it to the component:

```tsx
export async function loader({ context }: ComponentLoaderArgs) {
  const rawData = await fetchData();
  return {
    data: transformData(rawData), // Transform data for easier consumption
  };
}
```

4. **Caching**: Leverage Hydrogen's built-in caching mechanisms and Weaverse's utilities for improved performance:

```tsx
import { CacheLong, fetchSync } from '@shopify/hydrogen';

export async function loader({ context }: ComponentLoaderArgs) {
  const { storefront, fetchWithCache } = context.weaverse;
  
  // Using Weaverse's fetchWithCache utility (recommended)
  const data = await fetchWithCache(
    'https://api.example.com/data',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    CacheLong() // Use appropriate cache strategy
  );
  
  // Or using Hydrogen's fetchSync with caching strategy
  const { product } = await fetchSync(
    'https://my-api.com/data',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 'my-product' }),
    },
    {
      cache: CacheLong(), // Use appropriate cache strategy: CacheNone, CacheShort, CacheLong, or custom
    }
  ).json();
  
  // Or using storefront API with caching
  const { collection } = await storefront.query(
    `query CollectionDetails($handle: String!) {
      collection(handle: $handle) {
        title
        description
      }
    }`,
    {
      variables: {
        handle: 'summer-collection',
      },
      cache: CacheLong(), // Cache for a long time (1 day by default)
    }
  );
  
  return { product, collection, data };
}
```

**Weaverse's `fetchWithCache`** is a convenient utility that simplifies cached data fetching from external APIs:
- Available through `context.weaverse.fetchWithCache`
- Automatically handles JSON parsing
- Applies the specified caching strategy
- Provides a cleaner syntax compared to Hydrogen's native `fetchSync`

Hydrogen provides several caching strategies out of the box:
- `CacheNone()`: No caching, always fetches fresh data
- `CacheShort()`: Short-term caching (a few minutes)
- `CacheLong()`: Long-term caching (1 day by default)
- `cache.with()`: Custom cache control

You can also customize cache durations:

```tsx
import { CacheLong } from '@shopify/hydrogen';

// Cache for 60 seconds
const cacheStrategy = CacheLong({
  maxAge: 60,
  staleWhileRevalidate: 10,
});

// Use with Weaverse's fetchWithCache
const { weaverse } = context;
const data = await weaverse.fetchWithCache(
  'https://api.example.com/data',
  { method: 'GET' },
  cacheStrategy
);

// Or use in storefront query
const data = await storefront.query(QUERY, {
  variables,
  cache: cacheStrategy,
});
```

For more details, see [Hydrogen Documentation on Caching](https://shopify.dev/docs/storefronts/headless/hydrogen/caching).

## Component Organization Patterns

### 1. Parent-Child Component Structure

```tsx
// Parent component (image-with-text.tsx)
import { ImageWithTextContent } from './content';
import { ImageWithTextImage } from './image';

const ImageWithText = forwardRef<HTMLElement, ImageWithTextProps>((props, ref) => {
  return (
    <section ref={ref}>
      <ImageWithTextContent />
      <ImageWithTextImage />
    </section>
  );
});

// Child component (content.tsx)
const ImageWithTextContent = forwardRef<HTMLDivElement, ImageWithTextContentProps>((props, ref) => {
  return (
    <div ref={ref}>
      {props.children}
    </div>
  );
});

export const schema: HydrogenComponentSchema = {
  type: "image-with-text--content",
  title: "Content",
  limit: 1,
  childTypes: ["subheading", "heading", "paragraph", "button"],
  // ... schema configuration
};
```

### 2. Reusable Component Parts

```tsx
// Reusable component part (hotspots/item.tsx)
interface HotspotsItemData {
  icon: "circle" | "plus" | "bag" | "tag";
  iconSize: number;
  offsetX: number;
  offsetY: number;
  product: WeaverseProduct;
  popupWidth: number;
  showPrice: boolean;
  showViewDetailsLink: boolean;
  viewDetailsLinkText: string;
}

const HotspotsItem = forwardRef<HTMLDivElement, HotspotsItemProps>((props, ref) => {
  const {
    icon,
    iconSize,
    offsetX,
    offsetY,
    product,
    popupWidth,
    showPrice,
    showViewDetailsLink,
    viewDetailsLinkText,
    children,
    loaderData,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className="absolute -translate-x-1/2 -translate-y-1/2 hover:z-[1]"
      style={{
        top: `${offsetY}%`,
        left: `${offsetX}%`,
      } as CSSProperties}
    >
      {/* Component content */}
    </div>
  );
});
```

## Styling Patterns

### 1. CVA for Variant Management

```tsx
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

const variants = cva("flex flex-col", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "h-screen",
    },
    contentPosition: {
      "center center": "justify-center items-center text-center",
      "top left": "justify-start items-start text-left",
      // ... more positions
    },
  },
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

interface ComponentProps extends VariantProps<typeof variants> {
  // Additional props
}
```

### 2. CSS Custom Properties

```tsx
const Component = forwardRef<HTMLElement, ComponentProps>((props, ref) => {
  const { textColor, ...rest } = props;
  
  const style = {
    "--timer-color": textColor,
  } as CSSProperties;
  
  return (
    <div
      ref={ref}
      {...rest}
      className="countdown--timer flex text-[var(--timer-color)]"
      style={style}
    >
      {/* Component content */}
    </div>
  );
});
```

## Interactive Components

### 1. Countdown Timer

```tsx
const CountdownTimer = forwardRef<HTMLElement, CountdownTimerProps>((props, ref) => {
  const { endTime, ...rest } = props;
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(endTime));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTimeRemaining = calculateRemainingTime(endTime);
      setRemainingTime(updatedTimeRemaining);
      
      if (isTimeUp(updatedTimeRemaining)) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return (
    <div ref={ref} {...rest}>
      {/* Timer display */}
    </div>
  );
});
```

### 2. Hotspots

```tsx
const Hotspots = forwardRef<HTMLElement, HotspotsProps>((props, ref) => {
  const { items, ...rest } = props;
  
  return (
    <div ref={ref} {...rest} className="relative">
      {items.map((item) => (
        <HotspotsItem key={item.id} {...item} />
      ))}
    </div>
  );
});
```

## Best Practices

### 1. Using CVA with Select Inputs

Class Variance Authority (CVA) provides an elegant way to handle component variants that map directly to schema select inputs. This pattern creates a strong connection between your schema inputs and component styling:

```tsx
// Example from hero-image.tsx
import { type VariantProps, cva } from "class-variance-authority";

// Define variants using CVA
const variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "",
    },
    contentPosition: {
      "top left": "justify-start items-start [&_.paragraph]:[text-align:left]",
      "top center": "justify-start items-center [&_.paragraph]:[text-align:center]",
      "top right": "justify-start items-end [&_.paragraph]:[text-align:right]",
      "center left": "justify-center items-start [&_.paragraph]:[text-align:left]",
      "center center": "justify-center items-center [&_.paragraph]:[text-align:center]",
      "center right": "justify-center items-end [&_.paragraph]:[text-align:right]",
      "bottom left": "justify-end items-start [&_.paragraph]:[text-align:left]",
      "bottom center": "justify-end items-center [&_.paragraph]:[text-align:center]",
      "bottom right": "justify-end items-end [&_.paragraph]:[text-align:right]",
    },
  },
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

// Extend component props with CVA variants
export interface HeroImageProps extends VariantProps<typeof variants> {}

// Use variants in component
const HeroImage = forwardRef<HTMLElement, HeroImageProps & SectionProps>(
  (props, ref) => {
    const { children, height, contentPosition, ...rest } = props;
    
    return (
      <Section
        ref={ref}
        {...rest}
        containerClassName={variants({
          contentPosition,
          height,
        })}
      >
        {children}
      </Section>
    );
  },
);

// Define schema with matching select inputs
export const schema: HydrogenComponentSchema = {
  type: "hero-image",
  title: "Hero image",
  inspector: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        // ... more inputs
      ],
    },
    // ... more groups
  ],
  // ... schema continues
};
```

**Benefits of this approach:**

1. **Type Safety**: CVA provides type checking for variant values
2. **Single Source of Truth**: Variant options in schema match exact keys in CVA
3. **Maintainability**: Changes to variant names only need to happen in one place
4. **Composition**: Easily combine multiple variants for complex styling
5. **Default Values**: Set defaults in CVA that match schema defaults
6. **Responsive Design**: Apply responsive styles within variant definitions

This pattern works particularly well for components with multiple configurable aspects like layout, sizing, positioning, or appearance variants.

### 2. Component Architecture

- **Use TypeScript for better type safety**
  - Define explicit prop interfaces
  - Use generics for reusable components
  - Utilize TypeScript's utility types for prop manipulation

- **Follow React's Best Practices**
  - Always use `forwardRef` for all components
  - Separate component logic from presentation
  - Extract reusable UI elements into smaller components
  - Use composition over inheritance

- **Optimize Component Structure**
  - Keep components focused on a single responsibility
  - Create dedicated files for types and utilities
  - Use meaningful names for components and props
  - Document complex logic with comments

### 3. State Management

```tsx
import { useState, useReducer } from 'react';

// Simple state management with useState
const SimpleComponent = forwardRef<HTMLElement, SimpleComponentProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <section ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Content</div>}
    </section>
  );
});

// Complex state management with useReducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const ComplexComponent = forwardRef<HTMLElement, ComplexComponentProps>((props, ref) => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <section ref={ref}>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </section>
  );
});
```

### 4. Error Handling

```tsx
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const SafeComponent = forwardRef<HTMLElement, SafeComponentProps>((props, ref) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <section ref={ref}>
        {/* Component content */}
      </section>
    </ErrorBoundary>
  );
});
```

### 5. Accessibility

- **Follow WAI-ARIA Guidelines**
  - Use semantic HTML elements
  - Add proper ARIA attributes
  - Ensure keyboard navigation works
  - Provide sufficient color contrast

```tsx
const AccessibleComponent = forwardRef<HTMLElement, AccessibleComponentProps>((props, ref) => {
  const { ariaLabel, ariaDescribedby, ...rest } = props;
  
  return (
    <section 
      ref={ref} 
      role="region"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      tabIndex={0}
      {...rest}
    >
      {/* Component content */}
    </section>
  );
});
```

### 6. Performance Considerations

- Memoize expensive calculations with `useMemo`
- Optimize callback functions with `useCallback`
- Use `React.memo` for components that render often but rarely change
- Implement virtualization for long lists
- Lazy load components that aren't immediately visible

## Troubleshooting

### Common Issues

1. **Component not appearing in Studio**
   - **Verify component registration** in `components.ts`
   - **Check schema type uniqueness** across all components
   - **Ensure all required props are handled** in the component
   - **Check for syntax errors** in the component or schema
   - **Verify the component is exported correctly** (both default export and schema)

2. **Schema not updating**
   - **Clear browser cache** and refresh the page
   - **Restart development server** to reload all components
   - **Verify schema syntax** is correct
   - **Check browser console** for errors
   - **Ensure component and schema are properly exported**

3. **Data loading issues**
   - **Check loader implementation** for errors
   - **Verify data types** match what's expected
   - **Implement error boundaries** to catch and display errors
   - **Add logging** to debug data loading process
   - **Check network requests** in browser DevTools

4. **Styling issues**
   - **Check for CSS conflicts** with other components
   - **Verify class names** are being applied correctly
   - **Inspect the DOM** to see which styles are actually applied
   - **Test with inline styles** to isolate CSS framework issues
   - **Check for responsive design breakpoints**

### Debugging Tips

```tsx
// Add debug logging
const DebugComponent = forwardRef<HTMLElement, DebugComponentProps>((props, ref) => {
  console.log('Props:', props);
  
  // Track re-renders
  useEffect(() => {
    console.log('Component rendered');
    return () => console.log('Component unmounted');
  }, []);
  
  // Debug specific prop changes
  useEffect(() => {
    console.log('Specific prop changed:', props.specificProp);
  }, [props.specificProp]);
  
  return (
    <section ref={ref}>
      {/* Component content */}
    </section>
  );
});
```

### Development Environment Setup

For effective debugging:

1. **Enable React DevTools** in your browser
2. **Use VS Code with TypeScript support** for real-time type checking
3. **Configure ESLint** with React and TypeScript rules
4. **Set up source maps** for better debugging in development
5. **Use Chrome DevTools** to inspect components and network requests

## Next Steps

- Learn about [Component Schema](/docs/guides/component-schema) for advanced schema configuration
- Explore [Data Fetching](/docs/guides/fetching-and-caching) for more data integration patterns
- See [Example Components](/docs/guides/example-components) for inspiration and reference implementations
- Join our [Community](/docs/community) for support and sharing best practices

## Conclusion

Building Weaverse components requires understanding the interplay between React components, schema configuration, and data integration. By following the patterns and practices outlined in this guide, you can create powerful, customizable, and performant components that enhance your Hydrogen theme.

Remember that great components are:

- **Reusable**: They can be used in multiple contexts
- **Customizable**: They provide sensible defaults but allow for customization
- **Accessible**: They follow web accessibility guidelines
- **Performant**: They load quickly and render efficiently
- **Maintainable**: They follow clean code principles and are well-documented

As you build your Weaverse components, focus on creating a consistent user experience while enabling flexibility and customization through the schema system.

