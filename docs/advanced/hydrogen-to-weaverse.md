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

### 2. Global Styles ([`~/weaverse/style.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.ts))

This component applies global CSS variables based on the theme settings defined in `schema.server.ts` and configured in Weaverse Studio.

```typescript
// app/weaverse/style.ts
import { useThemeSettings } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";

// Example based on Weaverse Pilot theme
// See: [Pilot style file on GitHub](https://github.com/Weaverse/pilot/blob/main/app/weaverse/style.ts)
export function GlobalStyle() {
  let settings = useThemeSettings();
  if (!settings) {
    return null;
  }
  let { /* Extract settings like primaryButtonColor, pageWidth, etc. */ } = settings;

  let cssVariables: CSSProperties = {
    // Example: '--color-primary-button': primaryButtonColor,
    '--page-width': `${settings.pageWidth || 1280}px`, 
    // Add more CSS variables based on your settings
  } as CSSProperties;

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: `:root {
          ${Object.entries(cssVariables)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n')}
        }`,
      }}
    />
  );
}
```

### 3. Component Registration ([`~/weaverse.tsx`](https://github.com/Weaverse/pilot/blob/main/app/weaverse.tsx))

This is the central file where you register all the React components that you want to be available for use within the Weaverse editor.

```typescript
// app/weaverse.tsx
import type { HydrogenComponent } from "@weaverse/hydrogen";
import { WeaverseContent } from "@weaverse/hydrogen";

// Import your theme components
// Example: import { ProductInformation } from "~/components/product/product-information";
// Example: import { RelatedProducts } from "~/components/product/related-products";
// Example: import { Hero } from "~/components/sections/hero";

// Register the components you want to use in Weaverse
// See: [Pilot weaverse.tsx file on GitHub](https://github.com/Weaverse/pilot/blob/main/app/weaverse.tsx)
export let components: HydrogenComponent[] = [
  // Example: Hero,
  // Example: ProductInformation,
  // Example: RelatedProducts,
  // Add all components intended for Weaverse editing...
];

// Re-export WeaverseContent for use in route components
export { WeaverseContent };
```

### 4. Content Security Policy (CSP) ([`~/weaverse/csp.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/csp.ts))

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

### 2. Wrap Layout with `withWeaverse` in `root.tsx`

The `withWeaverse` Higher-Order Component (HOC) provides the necessary context for Weaverse to function. Wrap your main `Layout` component with it.

```typescript
// app/root.tsx
import {
  // ... other imports
} from "@remix-run/react";
import { withWeaverse } from "@weaverse/hydrogen";
import { components } from "~/weaverse"; // Import registered components
import { GlobalStyle } from "~/weaverse/style"; // Import global style component
// Import your existing Layout components like Header, Footer, etc.
// Example: import { Header } from "./components/layout/header";
// Example: import { Footer } from "./components/layout/footer";

// ... other imports, links function, root loader

// Your existing Layout component
export function Layout({ children }: { children: React.ReactNode }) {
  // ... (fetch header/footer data using useRouteLoaderData('root'))
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        {/* ... meta, links */}
        <GlobalStyle /> {/* Add GlobalStyle */} 
      </head>
      <body>
        {/* Example: <Header data={headerData} /> */}
        {children}
        {/* Example: <Footer data={footerData} /> */}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// Wrap the Layout component with withWeaverse
export default withWeaverse({ components })(function App() {
  // The Outlet will render the matched route's component (wrapped by Layout)
  return <Outlet />;
});

// Your existing ErrorBoundary component
export function ErrorBoundary({ error }: { error: Error }) {
  // ... (keep your existing error boundary logic)
}
```
**Note:** Ensure your root loader (`app/root.tsx -> loader`) fetches any data needed by your `Layout` (like header/footer menus, cart count, etc.). `withWeaverse` handles Weaverse-specific context internally.

### 3. Adapt Route Loaders and Components

For each route you want to make editable with Weaverse (e.g., Homepage, Product pages, Collection pages, Custom pages), you need to:

**a) Modify the Loader:**
   - Determine the `PageType` (e.g., `INDEX`, `PRODUCT`, `COLLECTION`, `PAGE`).
   - Call `context.weaverse.loadPage()` to fetch the Weaverse page data.
   - Fetch any other required data for the page (e.g., Shopify product/collection data).
   - Return `weaverseData` along with other data.

**b) Modify the Component:**
   - Import `WeaverseContent` from `~/weaverse.tsx`.
   - Replace the main content rendering logic with `<WeaverseContent />`. `WeaverseContent` will automatically render the components based on the `weaverseData` fetched in the loader.

**Example: `app/routes/($locale)._index.tsx` (Homepage)**

```typescript
// app/routes/($locale)._index.tsx
import type { LoaderFunctionArgs } from "@shopify/remix-oxygen";
import type { PageType } from "@weaverse/hydrogen";
import { WeaverseContent } from "~/weaverse"; // Import WeaverseContent
// ... other imports (seoPayload, queries, etc.)

export async function loader({ context }: LoaderFunctionArgs) {
  const type: PageType = "INDEX"; // Page type for homepage
  const { weaverse, storefront } = context;

  // Fetch Weaverse data and Shopify data (if needed for SEO/Analytics) concurrently
  const [weaverseData, { shop } ] = await Promise.all([
    weaverse.loadPage({ type }),
    storefront.query(SHOP_QUERY) // Example: Fetch shop data for SEO
  ]);

  // Handle case where Weaverse page data isn't found
  if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
    // Decide how to handle - throw 404 or maybe render without Weaverse
    console.warn(`Weaverse page data not found for type: ${type}`);
    throw new Response("Not Found", { status: 404 });
  }

  const seo = seoPayload.home(); // Example SEO data

  return {
    weaverseData, // Pass Weaverse data to the component
    shop,
    seo,
    analytics: { pageType: AnalyticsPageType.home },
  };
}

// Component renders WeaverseContent
export default function Homepage() {
  return <WeaverseContent />;
}

// ... (Meta function, SHOP_QUERY, etc.)
```

Apply this pattern to other routes like `products.$productHandle.tsx`, `collections.$collectionHandle.tsx`, etc., adjusting the `PageType` and Shopify data fetching accordingly.

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
