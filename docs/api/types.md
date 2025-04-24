---
title: Types
description: TypeScript interfaces and types for Weaverse Hydrogen development.
publishedAt: April 24, 2025
updatedAt: April 24, 2025
order: 8
published: true
---

# Types

This document outlines the key TypeScript interfaces and types used in the Weaverse Hydrogen package. Understanding these types is essential for building type-safe components and integrating with the Weaverse system.

## Component Types

### HydrogenComponent

Defines a component module that can be registered with Weaverse.

```typescript
interface HydrogenComponent<T extends HydrogenComponentProps = any> {
  default: ForwardRefExoticComponent<T>;
  schema: HydrogenComponentSchema;
  loader?: (args: ComponentLoaderArgs) => Promise<unknown>;
}
```

### HydrogenComponentProps

Base props for any Weaverse Hydrogen component.

```typescript
interface HydrogenComponentProps<L = any> extends WeaverseElement {
  className?: string;
  loaderData?: L;
  children?: React.JSX.Element[];
}
```

### HydrogenComponentSchema

Defines the schema for a component, including inspector inputs and settings.

```typescript
interface HydrogenComponentSchema {
  childTypes?: string[];
  inspector: InspectorGroup[];
  presets?: Omit<HydrogenComponentPresets, 'type'>;
  limit?: number;
  enabledOn?: {
    pages?: ('*' | PageType)[];
    groups?: ('*' | 'header' | 'footer' | 'body')[];
  };
  pages?: ('*' | PageType)[];
  groups?: ('*' | 'header' | 'footer' | 'body')[];
}
```

### HydrogenComponentData

Data structure for a component instance.

```typescript
interface HydrogenComponentData {
  data?: { [key: string]: any };
  children?: { id: string }[];
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
```

## Inspector Types

Types used for defining the inspector UI in Weaverse Studio.

### InspectorGroup

```typescript
interface InspectorGroup {
  group: string;
  inputs: (BasicInput | HeadingInput)[];
}
```

### BasicInput

```typescript
type BasicInput = Omit<CoreBasicInput, 'condition'> & {
  shouldRevalidate?: boolean;
  condition?:
    | string
    | ((data: ElementData, weaverse: WeaverseHydrogen) => boolean);
};
```

### HeadingInput

```typescript
type HeadingInput = {
  type: 'heading';
  label: string;
  [key: string]: any;
};
```

## Loader Types

Types related to data loading and server integration.

### ComponentLoaderArgs

```typescript
type ComponentLoaderArgs<T = any, E = any> = {
  data: T;
  weaverse: WeaverseClient;
};
```

### RouteLoaderArgs

```typescript
interface RouteLoaderArgs extends RemixOxygenLoaderArgs {
  context: AppLoadContext & {
    weaverse: WeaverseClient;
  };
}
```

### WeaverseLoaderData

```typescript
interface WeaverseLoaderData {
  configs: Omit<WeaverseProjectConfigs, 'publicEnv'> & {
    requestInfo: WeaverseLoaderRequestInfo;
  };
  page: HydrogenPageData;
  project: HydrogenProjectType;
  pageAssignment: HydrogenPageAssignment;
}
```

## Theme Types

### HydrogenThemeSettings

```typescript
type HydrogenThemeSettings = {
  [key: string]: any;
};
```

### HydrogenThemeSchema

```typescript
interface HydrogenThemeSchema {
  info: {
    name: string;
    version: string;
    author: string;
    authorProfilePhoto: string;
    documentationUrl: string;
    supportUrl: string;
  };
  inspector: InspectorGroup[];
  i18n?: {
    urlStructure: 'url-path' | 'subdomain' | 'top-level-domain';
    defaultLocale: WeaverseI18n;
    shopLocales: WeaverseI18n[];
  };
}
```

## Miscellaneous Types

### PageType

Enumerates supported page types in Shopify Hydrogen.

```typescript
type PageType =
  | 'INDEX'
  | 'PRODUCT'
  | 'ALL_PRODUCTS'
  | 'COLLECTION'
  | 'COLLECTION_LIST'
  | 'PAGE'
  | 'BLOG'
  | 'ARTICLE'
  | 'CUSTOM';
```

### WeaverseI18n

Internationalization configuration.

```typescript
type WeaverseI18n = I18nBase & {
  label?: string;
  pathPrefix?: string;
  [key: string]: any;
};
```

## Usage Example

Here's how you might use these types to define a component:

```tsx
import type {
  HydrogenComponent,
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';

type HeroBannerProps = HydrogenComponentProps<{
  featuredProducts: any[];
}> & {
  heading: string;
  subheading?: string;
  backgroundImage?: string;
  textColor?: string;
};

function HeroBanner({
  heading,
  subheading,
  backgroundImage,
  textColor = '#ffffff',
  loaderData,
}: HeroBannerProps) {
  const { featuredProducts } = loaderData || {};
  
  return (
    <div 
      className="hero-banner" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        color: textColor,
      }}
    >
      <h1>{heading}</h1>
      {subheading && <p>{subheading}</p>}
      
      {featuredProducts?.length > 0 && (
        <div className="featured-products">
          {featuredProducts.map(product => (
            <div key={product.id}>{product.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const schema: HydrogenComponentSchema = {
  type: 'hero-banner',
  inspector: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Welcome to our store',
        },
        {
          type: 'text',
          name: 'subheading',
          label: 'Subheading',
        },
      ],
    },
    {
      group: 'Styling',
      inputs: [
        {
          type: 'image',
          name: 'backgroundImage',
          label: 'Background Image',
        },
        {
          type: 'color',
          name: 'textColor',
          label: 'Text Color',
          defaultValue: '#ffffff',
        },
      ],
    },
  ],
};

async function loader({ data, weaverse }) {
  // Fetch featured products
  const products = await weaverse.storefront.query('FEATURED_PRODUCTS_QUERY');
  
  return {
    featuredProducts: products?.data?.products?.nodes || [],
  };
}

HeroBanner.defaultProps = {
  heading: 'Welcome to our store',
};

export default HeroBanner;
export { schema, loader };
```

## Type Extensions

Weaverse Hydrogen extends several types from Remix Oxygen and Shopify Hydrogen:

```typescript
// Extend AppLoadContext with the weaverse client
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    weaverse: WeaverseClient;
  }
}

// Extend HydrogenEnv with Weaverse environment variables
declare module '@shopify/hydrogen' {
  interface HydrogenEnv {
    WEAVERSE_PROJECT_ID: string;
    WEAVERSE_HOST: string;
    WEAVERSE_API_KEY: string;
  }
}
```

## Related

- [WeaverseHydrogenRoot](/docs/api/weaverse-hydrogen-root) - The main component that uses these types
- [WeaverseClient](/docs/api/weaverse-client) - Client for fetching Weaverse content
