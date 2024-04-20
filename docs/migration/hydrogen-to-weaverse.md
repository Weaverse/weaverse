---
title: Migrating Hydrogen Project to Weaverse
description: Enhance your Hydrogen project by integrating Weaverse SDKs and Theme Customizer.
publishedAt: November 20, 2023
updatedAt: January 17, 2024
order: 0
published: true
---

This guide focuses on integrating the Weaverse SDKs and Theme Customizer into your existing Hydrogen project, providing
detailed steps to enhance your theme with Weaverse’s powerful features.

## Getting Started

First, let's set up your Shopify Hydrogen project. Open your command line and enter:

```bash
npm create @shopify/hydrogen@latest
```

After setting up, go to your Hydrogen project folder and start it with:

```bash
npm run dev
```

Now you will see your Hydrogen storefront running like this:

![Weaverse Shopify Hydrogen store](https://cdn.hashnode.com/res/hashnode/image/upload/v1702459684104/22cc8e05-ed20-4e3a-8d4f-06591e7ec205.png)

## Integrating Weaverse: Step-by-Step

### Step 1: Install Weaverse

Begin by adding Weaverse to your project. Enter the following command:

```bash
npm install @weaverse/hydrogen
```

### Step 2: Create the Weaverse Directory

Next, you need to set up a directory for Weaverse in your project’s **app** folder. Create two files:

**weaverse/component.ts** – This file is for registering components in Weaverse. Start with an empty array.

```typescript
// weaverse/component.ts

import type {HydrogenComponent} from '@weaverse/hydrogen';

export const components: HydrogenComponent[] = [];
```

**weaverse/schema.ts** – This file is where you define Project/Theme information so that users can later find that information in the Project information section in the Weaverse app.

```typescript
// weaverse/schema.ts

import type {HydrogenThemeSchema} from '@weaverse/hydrogen';

export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: '1.0.0',
    author: 'Weaverse',
    name: 'Pilot',
    authorProfilePhoto:
      'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Weaverse_logo_-_3000x_e2fa8c13-dac2-4dcb-a2c2-f7aaf7a58169.png?v=1698245759',
    documentationUrl: 'https://weaverse.io/docs',
    supportUrl: 'https://weaverse.io/contact',
  },
  inspector: [
    
  ],
};
```

At the same time, this is also where you will define Global Theme settings, similar to how you use `settings_schema.json` in Dawn theme (Shopify theme). I have also left a few settings available, so you can expand them later. Below is an example image of my theme settings:

![Weaverse Theme Information](https://cdn.hashnode.com/res/hashnode/image/upload/v1702459910453/79e5d08c-dbc5-409c-a5f9-3bc738385e34.png)

![Weaverse Theme Settings](https://cdn.hashnode.com/res/hashnode/image/upload/v1702459928397/21317bb3-1458-4d15-99ee-ef60c79bede1.png)

### Step 3: Set Up a Weaverse Client

Create a **weaverse/weaverse.server.ts** file. The “`server.ts`” extension indicates that the code within is intended for server-side execution. This distinction is crucial for maintaining a separation between server-side and client-side logic, ensuring better security and performance.

```typescript
// weaverse/weaverse.server.ts
import {WeaverseClient} from '@weaverse/hydrogen';
import type {CreateWeaverseClientArgs} from '@weaverse/hydrogen';

import {components} from '~/weaverse/components';
import {themeSchema} from '~/weaverse/schema.server';

export function createWeaverseClient(args: CreateWeaverseClientArgs) {
  return new WeaverseClient({
    ...args,
    themeSchema,
    components,
  });
}

export function getWeaverseCsp(request: Request) {
  let url = new URL(request.url);
  // Get weaverse host from query params
  let weaverseHost = url.searchParams.get('weaverseHost');
  let isDesignMode = url.searchParams.get('weaverseHost');
  let weaverseHosts = ['*.weaverse.io', '*.shopify.com', '*.myshopify.com'];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }
  let updatedCsp: {
    [x: string]: string[] | string | boolean;
  } = {
    defaultSrc: [
      'data:',
      '*.youtube.com',
      '*.youtu.be',
      '*.vimeo.com',
      '*.google.com',
      'fonts.gstatic.com',
      ...weaverseHosts,
    ],
    styleSrc: ['fonts.googleapis.com', ...weaverseHosts],
    connectSrc: ['https://vimeo.com', ...weaverseHosts],
  };
  if (isDesignMode) {
    updatedCsp.frameAncestors = ['*'];
  }
  return updatedCsp;
}

```

In this file, you’ll include:

* `createWeaverseClient`: For interacting with the Weaverse API.

* `getWeaverseCsp`: For managing content security policies, ensuring your app adheres to best practices in web security.


### Step 4: Render Weaverse Content

Add a **weaverse/index.tsx** file to render Weaverse content. This file acts as a bridge between your Shopify Hydrogen project and the dynamic content managed through Weaverse.

```typescript
// weaverse/index.tsx

import {WeaverseHydrogenRoot} from '@weaverse/hydrogen';
import {components} from './components';

export function WeaverseContent() {
  return <WeaverseHydrogenRoot components={components} />;
}
```

## Completing the Integration

Once you've set up the necessary files, it's time to fully integrate Weaverse into your Hydrogen project:

### **Integrating weaverse in Remix's Global Context**

In your **server.ts** file, incorporate **weaverse** into Remix's global context. This is done by defining **weaverse** in the fetch handler of Remix, ensuring it's accessible throughout your application. This step is crucial for making sure Weaverse functions correctly within your project.

```typescript
// server.ts

// ...
import {createWeaverseClient} from '~/weaverse/weaverse.server';
// ...

/**
* Create Hydrogen's Storefront client.
*/
const {storefront} = createStorefrontClient({/** ... */ });

const weaverse = createWeaverseClient({
        storefront,
        request,
        env,
        cache,
        waitUntil,
});



/**
* Create a Remix request handler and pass
* Hydrogen's Storefront client to the loader context.
*/
const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          storefront,
          cart,
          env,
          waitUntil,
          weaverse, // add weaverse to Remix loader context
        }),
});
```

**TypeScript Error Handling**: If you encounter a TypeScript error like `TS2739, indicating that Type Env is missing properties from type HydrogenThemeEnv`, don't panic. Simply add the missing properties to `HydrogenThemeEnv` in your `env.d.ts` file. This step ensures your TypeScript environment recognizes the new Weaverse elements.

```typescript
declare global {
	
	/** ... */
  
	/**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {

    /** ... */

    WEAVERSE_PROJECT_ID: string;
    WEAVERSE_API_KEY: string;
  }
}
```

Also, define **weaverse** in the **AppLoadContext** interface to ensure it's recognized as part of your application's context.

```typescript
declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    env: Env;
    cart: HydrogenCart;
    storefront: Storefront;
    session: HydrogenSession;
    waitUntil: ExecutionContext['waitUntil'];

    weaverse: WeaverseClient;
  }

  /** ... */
}
```

### Implementing *getWeaverseCsp*

Open your **app/entry.server.tsx** file and utilize the **getWeaverseCsp** function. This function is crucial for managing your content security policy, which is a key aspect of web application security.

```typescript
// app/entry.server.tsx

// ...
import {getWeaverseCsp} from '~/weaverse/weaverse.server';
// ...

const {nonce, header, NonceProvider} = createContentSecurityPolicy(
    getWeaverseCsp(request),
);
```

### Updating app/root.tsx for Weaverse Theme Settings

In the **app/root.tsx** file, add **weaverseTheme** data to the loader function’s return value. This addition is vital for enabling Weaverse theme settings within your application.

```typescript
// app/root.tsx

export async function loader({context}: LoaderFunctionArgs) {

  /** ... */

  return defer(
    {
      /** ... */
      weaverseTheme: await context.weaverse.loadThemeSettings(),
			/** ... */
    },
    {headers},
  );
}
```

Next, wrap your App component with the **withWeaverse** function. This wrapping is necessary because **withWeaverse** provides your App component with the Global Theme Settings Provider that you can use everywhere from the App context.

```typescript
function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      /** ... */
    </html>
  );
}

export default withWeaverse(App);
```

### Handling Remix Routes for WeaverseContent

For rendering WeaverseContent on routes, include **weaverseData** in the return result of the **loader** function. This ensures that the dynamic content from Weaverse is properly loaded and displayed on each route.

```typescript
// app/routes/_index.tsx

/** ... */

import {WeaverseContent} from '~/weaverse';


export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const recommendedProducts = await storefront.query(
    RECOMMENDED_PRODUCTS_QUERY,
  );
	/** ... */
  return defer({
    recommendedProducts,
    weaverseData: await context.weaverse.loadPage({type: 'INDEX'}),
  });
}

export default function Homepage() {
  return (
    <div className="home">
      <WeaverseContent />
    </div>
  );
}
```

In your route components, explicitly render `WeaverseContent`. This direct rendering allows for the customized content to be displayed as intended.
For more comprehensive setup, refer to the [Weaverse Hydrogen Pilot Routes](https://github.com/Weaverse/pilot/tree/main/app/routes) repository, and learn more about how to [Render a Weaverse Page](https://weaverse.io/docs/guides/rendering-page). 

## Migrating Components to Weaverse

Begin migrating your default components to Weaverse Components. This migration will enable these components to utilize the dynamic customization features provided by Weaverse.

### Connecting to Weaverse CMS / Studio

Ensure the [Weaverse Hydrogen](https://apps.shopify.com/weaverse) app is installed in your Shopify store. Create a storefront, copy the Weaverse Project ID, and add it to your Hydrogen project's **.env** file. This step connects your project with the Weaverse CMS.

![Weaverse Project ID](https://cdn.hashnode.com/res/hashnode/image/upload/v1702460415617/15b47a1f-952a-4a28-ba0c-3bca22a59858.png)

Now start the development server and update the Preview URL in Weaverse Project settings. By default, our Weaverse projects are set to [http://localhost:3456](http://localhost:3456).

```bash
# .env

SESSION_SECRET="foobar"
PUBLIC_STORE_DOMAIN="mock.shop"
WEAVERSE_PROJECT_ID="your-project-id-here"
```

Once saved, you should see your Hydrogen page loaded in Weaverse Studio.

### Customizing Sections with Weaverse

Begin by creating a **recommended-products.tsx** file in the **app/sections** folder. Adapt the original RecommendedProducts component to a **forwardRef** component. This adaptation allows Weaverse Studio to identify and edit the component more easily.

```typescript
// app/sections/recommended-products.tsx

import {forwardRef} from 'react';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

const RecommendedProducts = forwardRef<HTMLDivElement, {productsCount: number}>(
  ({productsCount}, ref) => {
    const {
      recommendedProducts: {products},
    } = useLoaderData<any>();
    const displayProducts = products.nodes.slice(0, productsCount);
    return (
      <div className="recommended-products" ref={ref}>
        <h2>Recommended Products</h2>
        <div className="recommended-products-grid">
          {displayProducts.map((product: any) => (
            <Link
              key={product.id}
              className="recommended-product"
              to={`/products/${product.handle}`}
            >
              <Image
                data={product.images.nodes[0]}
                aspectRatio="1/1"
                sizes="(min-width: 45em) 20vw, 50vw"
              />
              <h4>{product.title}</h4>
              <small>
                <Money data={product.priceRange.minVariantPrice} />
              </small>
            </Link>
          ))}
        </div>
        <br />
      </div>
    );
  },
);

export default RecommendedProducts;

export const schema = {
  type: 'recommended-products',
  title: 'Recommended products',
  inspector: [
    {
      group: 'Settings',
      inputs: [
        {
          type: 'range',
          name: 'productsCount',
          label: 'Number of products',
          defaultValue: 4,
          configs: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
      ],
    },
  ],
};
```

And the result:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1702460530797/277694f4-2614-473b-a244-763839fedd3d.png)

That concludes our basic tutorial on integrating Weaverse with your Shopify Hydrogen project. Keep an eye out for our next blog, where we'll delve into more advanced features like using schema, loaders in Weaverse Components.

**References:**

* Demo repository: [https://github.com/Weaverse/Naturelle](https://github.com/Weaverse/Naturelle)

* Tutorial: [https://weaverse.io/docs/hydrogen/tutorial](https://weaverse.io/docs/hydrogen/tutorial)