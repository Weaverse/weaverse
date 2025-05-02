---
title: Integrating Weaverse into an Existing Hydrogen Project
description: Enhance your existing Hydrogen project by integrating the Weaverse SDK for visual page building and theme customization.
publishedAt: November 20, 2023
updatedAt: April 24, 2025
order: 0
published: true
---

This guide details how to integrate the Weaverse SDK into your **existing** Shopify Hydrogen project. By adding Weaverse, you empower your storefront with visual page building, theme customization through the Weaverse Studio, and access to a growing library of components, significantly speeding up development and content management.

## Prerequisites

Before you start, ensure you have:

*   An existing Shopify Hydrogen project set up and running locally.
*   Node.js (version recommended by Hydrogen) and npm/yarn installed.
*   Your Hydrogen project connected to your Shopify store.
*   A Weaverse account and a Weaverse Project created for your storefront.
*   Basic familiarity with Remix and Hydrogen concepts.

## Step 1: Install Weaverse SDK

Navigate to your Hydrogen project directory in your terminal and add the Weaverse Hydrogen SDK:

```bash
npm install @weaverse/hydrogen
# or
yarn add @weaverse/hydrogen
```

## Step 2: Configure Environment Variables

Weaverse needs credentials to connect to your project. Add the following variables to your `.env` file (create one if it doesn't exist) at the root of your Hydrogen project:

```env
# .env
WEAVERSE_PROJECT_ID="your-project-id"
WEAVERSE_API_KEY="your-api-key"

# Ensure your existing Shopify variables are also present
# PUBLIC_STORE_DOMAIN=...
# PUBLIC_STOREFRONT_API_TOKEN=...
# ... other variables
```

Replace `"your-project-id"` and `"your-api-key"` with the actual credentials found in your Weaverse project settings.

## Step 3: Set Up Core Weaverse Files

Create a `weaverse` folder inside your `app` directory (`app/weaverse/`). This folder will house Weaverse-specific configurations and utilities.

### 1. Theme Schema ([`~/weaverse/schema.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts))

This file defines your theme's metadata (name, author, version), global settings schema (which populates the Theme Customizer in Weaverse Studio), and i18n configurations.

```typescript
// app/weaverse/schema.server.ts
import type { HydrogenThemeSchema } from "@weaverse/hydrogen";
import pkg from "../../package.json"; // Use your project's package

// Example based on Weaverse Pilot theme
// See: [Pilot schema file on GitHub](https://github.com/Weaverse/pilot/blob/main/app/weaverse/schema.server.ts)
export let themeSchema: HydrogenThemeSchema = {
  info: {
    version: pkg.version,
    author: "Your Store Name", // Customize
    name: "Your Theme Name", // Customize
    authorProfilePhoto:
      "", // Optional: URL to author photo
    documentationUrl: "https://weaverse.io/docs",
    supportUrl: "https://weaverse.io/contact",
  },
  // Define Theme settings accessible in Weaverse Studio > Theme > Customize
  inspector: [
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          label: "Primary Button",
          name: "primaryButtonColor",
          defaultValue: "#000000",
        },
        // Add more color settings...
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          label: "Page width",
          name: "pageWidth",
          configs: {
            min: 1000,
            max: 1600,
            step: 10,
            unit: "px",
          },
          defaultValue: 1280,
        },
        // Add more layout settings...
      ],
    },
    // Add more groups like Typography, etc.
  ],
  // Define i18n settings (optional but recommended)
  i18n: {
    // Refer to Pilot schema for a full example
  },
};
```

### 2. Global Styles ([`~/weaverse/style.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.tsx))

This component applies global CSS variables based on the theme settings defined in `schema.server.ts` and configured in Weaverse Studio.

```tsx
// app/weaverse/style.tsx
import { useThemeSettings } from "@weaverse/hydrogen";

export function GlobalStyle() {
  let settings = useThemeSettings();
  if (settings) {
    let {
      colorBackground,
      colorText,
      // ... other settings extracted from theme
      pageWidth,
    } = settings;

    return (
      <style
        id="global-theme-style"
        key="global-theme-style"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Layout */
              --height-nav: ${settings.navHeightMobile}rem;
              --page-width: ${pageWidth}px;
              
              /* Add more CSS variables based on your settings */
            }
          `,
        }}
      />
    );
  }
  return null;
}
```

### 3. Component Registration ([`~/weaverse/components.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/components.ts))

This is the central file where you register all the React components that you want to be available for use within the Weaverse editor.

```typescript
// app/weaverse/components.ts
import type { HydrogenComponent } from "@weaverse/hydrogen";
import * as Heading from "~/components/heading";
import * as Link from "~/components/link";
// Import your theme components
import * as HeroImage from "~/sections/hero-image";
import * as FeaturedProducts from "~/sections/featured-products";
// ... other component imports

// Register the components you want to use in Weaverse
export let components: HydrogenComponent[] = [
  Heading,
  Link,
  HeroImage,
  FeaturedProducts,
  // Add all components intended for Weaverse editing...
];
```

### 4. WeaverseContent Component ([`~/weaverse/index.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/index.tsx))

This component renders the Weaverse content by using the `WeaverseHydrogenRoot` component and passing the registered components.

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

### 5. Content Security Policy (CSP) ([`~/weaverse/csp.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/csp.ts))

This utility helps configure the Content Security Policy headers required for the Weaverse editor iframe to function correctly.

```typescript
// app/weaverse/csp.ts
import type { AppLoadContext } from "@shopify/remix-oxygen";

// Example based on Weaverse Pilot theme
// See: [Pilot csp file on GitHub](https://github.com/Weaverse/pilot/blob/main/app/weaverse/csp.ts)
export function getWeaverseCsp(request: Request, context: AppLoadContext) {
  let url = new URL(request.url);
  let weaverseHost = context.env?.WEAVERSE_HOST || "https://weaverse.io";
  let isDesignMode = url.searchParams.get("weaverse_design_mode") === "true";

  let weaverseHosts = [
    new URL(weaverseHost).host,
    "weaverse.io",
    "*.weaverse.io",
    "shopify.com",
    "*.shopify.com",
    "*.myshopify.com",
  ];

  let updatedCsp: { [key: string]: string[] | string | boolean } = {
    frameAncestors: weaverseHosts,
    defaultSrc: [
      "'self'",
      "data:",
      // Add other necessary sources like CDN, fonts, etc.
      ...weaverseHosts,
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      // Add other necessary sources
      ...weaverseHosts,
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      // Add other necessary sources
      ...weaverseHosts,
    ],
    connectSrc: [
      "'self'",
      // Add other necessary sources (APIs, etc.)
      ...weaverseHosts,
    ],
    // Add other directives as needed (imgSrc, fontSrc, etc.)
  };

  // In design mode, allow broader frame ancestors
  if (isDesignMode) {
    updatedCsp.frameAncestors = ["*"];
  }

  return updatedCsp;
}
```

## Step 4: Integrate Weaverse into Your Application

Now, let's modify your existing Hydrogen files to enable Weaverse.

### 1. Update CSP in `entry.server.tsx`

Modify your `app/entry.server.tsx` to use the `getWeaverseCsp` function.

```typescript
// app/entry.server.tsx
import { RemixServer } from "@remix-run/react";
import { createContentSecurityPolicy } from "@shopify/hydrogen";
// ... other imports
import { getWeaverseCsp } from "~/weaverse/csp"; // Import the CSP utility

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  // Get Weaverse CSP settings and combine with Hydrogen's defaults
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    // Pass the Weaverse CSP directives here by spreading the result
    ...getWeaverseCsp(request, context),
    // Ensure your existing shop CSP config remains
    shop: {
      checkoutDomain: context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
    // Add other directives if needed (e.g., connectSrc for other APIs)
  });

  // ... rest of the function (renderToReadableStream, etc.) using NonceProvider

  responseHeaders.set("Content-Security-Policy", header); // Use 'Content-Security-Policy', not 'Report-Only' for production

  return new Response(/* ... */);
}
```

### 2. Update Root Component

The root component needs to be wrapped with `withWeaverse` to enable the Weaverse functionality. Here's how to implement it in your `app/root.tsx` file:

```tsx
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // ... other imports
} from "@remix-run/react";
import { useThemeSettings, withWeaverse } from "@weaverse/hydrogen";
import { GlobalStyle } from "./weaverse/style";
// ... other imports

// Your App component that renders the Outlet
function App() {
  return <Outlet />;
}

// Your Layout component
export function Layout({ children }: { children: React.ReactNode }) {
  let nonce = useNonce();
  // ... other setup code
  
  return (
    <html lang={locale.language}>
      <head>
        {/* ... meta tags, links */}
        <Meta />
        <Links />
        <GlobalStyle /> {/* Include the GlobalStyle component */}
      </head>
      <body>
        {/* ... your layout structure */}
        <main>
          {children}
        </main>
        {/* ... footer, etc */}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// Simply wrap the App component with withWeaverse
export default withWeaverse(App);
```

**Note:** The `withWeaverse` HOC doesn't require components to be passed directly here. The components are imported from the `components.ts` file and used by the `WeaverseContent` component.

### 3. Adapt Route Components

For each route you want to make editable with Weaverse (e.g., Homepage, Product pages, Collection pages, Custom pages), you need to:

1. Import the `WeaverseContent` component
2. Use it in your route component
3. Load the necessary Weaverse data in your loader

Here's an example for a homepage route (`app/routes/($locale)._index.tsx`):

```tsx
import { WeaverseContent } from "~/weaverse";
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { PageType } from "@weaverse/hydrogen";

export async function loader(args: LoaderFunctionArgs) {
  let { params, context } = args;
  let { pathPrefix } = context.storefront.i18n;
  let locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  // Load the Weaverse page data
  let weaverseData = await context.weaverse.loadPage({ type });
  if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
    throw new Response(null, { status: 404 });
  }

  // Load other data needed for the page
  // ...

  return {
    weaverseData,
    // other data...
  };
}

export default function Homepage() {
  // Simply render the WeaverseContent component
  return <WeaverseContent />;
}
```

For a product page (`app/routes/($locale).products.$productHandle.tsx`):

```tsx
import { useLoaderData } from "@remix-run/react";
import { WeaverseContent } from "~/weaverse";
import { Analytics } from "@shopify/hydrogen";

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  let { productHandle: handle } = params;
  
  // Load the product data
  // ...

  // Load the Weaverse page data for this product
  let weaverseData = await context.weaverse.loadPage({ type: "PRODUCT", handle });
  
  return {
    product,
    weaverseData,
    // other data...
  };
}

export default function Product() {
  let { product } = useLoaderData<typeof loader>();
  return (
    <>
      <WeaverseContent />
      {/* Optional: Add Analytics or other components */}
    </>
  );
}
```

The `WeaverseContent` component will automatically render the content based on the page type and handle, using the components registered in your `components.ts` file.

## Step 5: Run and Connect

1.  **Start your dev server:** `npm run dev`
2.  **Open Weaverse Studio:** Go to your project in Weaverse.
3.  **Enter Development Mode:** Click the "Development" button (often looks like `< >`) and enter your local dev server URL (usually `http://localhost:3000`).

You should now see your Hydrogen storefront loaded inside the Weaverse editor, ready for visual editing!

## Next Steps

*   **Create Custom Components:** Learn how to build your own React components and make them editable in Weaverse. ([Link to relevant doc when available])
*   **Explore Theme Settings:** Customize the global styles defined in `schema.server.ts` via the Weaverse Studio.
*   **Utilize Weaverse Features:** Explore Custom Pages, Custom Templates, AI features, and more.

By following these steps, you can successfully integrate Weaverse into your existing Hydrogen project, unlocking powerful visual editing and customization capabilities.
