---
title: Weaverse Tutorial - Build Your First Hydrogen Store
description: A complete guide to building a Shopify Hydrogen storefront with Weaverse. Learn to set up, customize, and deploy in 45 minutes.
publishedAt: August 15, 2025
updatedAt: August 15, 2025
order: 1
published: true
---

# Build Your First Weaverse Hydrogen Store

Welcome to the complete Weaverse tutorial! In 45 minutes, you'll build a modern Shopify Hydrogen storefront with visual customization capabilities. By the end, you'll have a live store that you and your team can edit visually through Weaverse Studio.

## What You'll Build

- **Modern Shopify storefront** with React Router v7 and React 19
- **Visual editing capabilities** through Weaverse Studio
- **Custom components** with schema-driven configurations
- **Production-ready deployment** on Shopify Oxygen

## Prerequisites

Before starting, ensure you have:

- **Node.js 20+** (check with `node --version`)
- **Shopify store** (any plan, development store works fine)
- **Basic knowledge** of React, TypeScript, and Shopify concepts
- **30-45 minutes** of focused time

**New to these technologies?** Review these resources first:
- [React Router v7 Quick Start](https://reactrouter.com/start/framework/installation)
- [Shopify Hydrogen Overview](https://shopify.dev/docs/custom-storefronts/hydrogen)

---

## Part 1: Quick Start (5 minutes)

### Install Weaverse Studio

1. **Go to Shopify App Store**: Visit [Weaverse on Shopify App Store](https://apps.shopify.com/weaverse)
2. **Install the app** on your Shopify store
3. **Open Weaverse** from your Shopify admin dashboard

### Create Your First Project

1. **Click "Create Project"** in Weaverse Studio
2. **Choose the Pilot theme** (recommended starter theme)
3. **Name your project** (e.g., "My Store")
4. **Click "Create"**

![Weaverse Studio Project Creation](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/create_weaverse_hydrogen_project.webp?width=1400&crop=center)

🎉 **Success!** You now have a Weaverse project with the Pilot theme. You can see the visual editor with pre-built sections ready to customize.

---

## Part 2: Local Development Setup (10 minutes)

### Set Up Your Development Environment

1. **Clone the Pilot theme**:
   ```bash
   git clone https://github.com/weaverse/pilot.git my-weaverse-store
   cd my-weaverse-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in your project root:

   ```bash
   # Copy from the example
   cp .env.example .env
   ```

   Update `.env` with your store details:
   ```env
   # Required - Get from Weaverse Studio
   WEAVERSE_PROJECT_ID="your-project-id-from-studio"
   
   # Required - Your Shopify store
   PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
   PUBLIC_STOREFRONT_API_TOKEN="your-storefront-access-token"
   
   # Required - Generate a random string
   SESSION_SECRET="your-random-session-secret"
   
   # Optional - For customer accounts
   PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-client-id"
   PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://your-store.myshopify.com/api/2023-04/graphql"
   ```

   **Where to find these values:**
   - `WEAVERSE_PROJECT_ID`: Copy from Weaverse Studio project settings
   - `PUBLIC_STOREFRONT_API_TOKEN`: Create in Shopify Admin → Apps → App and sales channel settings → Develop apps
   - `SESSION_SECRET`: Generate with `openssl rand -base64 32`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   Your store will be available at: **http://localhost:3456**

### Connect to Weaverse Studio

1. **Open Weaverse Studio** in another browser tab
2. **Go to Project Settings** → Preview URL
3. **Set Preview URL** to `http://localhost:3456`
4. **Save changes**

![Weaverse Preview URL Setup](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/update_preview_url.png?v=1712226429)

✅ **Checkpoint**: You should now see your local development server in Weaverse Studio's preview panel. Changes in Studio should appear immediately in your local site.

---

## Part 3: Understanding Weaverse Architecture (5 minutes)

### How Weaverse Works

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Weaverse      │───▶│   Your Local    │───▶│   Production    │
│   Studio        │    │   Development   │    │   (Oxygen)      │
│   (Visual CMS)  │    │   Server        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Weaverse Studio**: Visual editor where you and your team create content
**Your Code**: React components with schemas that define what's editable
**Production**: Shopify Oxygen hosting your fast, static-generated site

### Key Concepts

**Components**: React components that render sections of your store
**Schemas**: Define what users can edit in Studio (text, images, colors, etc.)
**Loaders**: Fetch data from Shopify (products, collections, etc.)
**Studio**: No-code visual editor for content creators

---

## Part 4: Build Your First Component (15 minutes)

Let's create a customizable Hero Banner that showcases your products.

### Create the Component

1. **Create the component file**:
   ```bash
   mkdir -p app/sections/hero-banner
   touch app/sections/hero-banner/index.tsx
   ```

2. **Add the Hero Banner component**:
   ```typescript
   // app/sections/hero-banner/index.tsx
   import { Image } from '@shopify/hydrogen';
   import { createSchema } from '@weaverse/hydrogen';
   import type { HydrogenComponentProps } from '@weaverse/hydrogen';

   interface HeroBannerProps extends HydrogenComponentProps {
     heading: string;
     description: string;
     buttonText: string;
     buttonLink: string;
     backgroundImage: {
       url: string;
       altText: string;
       width: number;
       height: number;
     };
   }

   function HeroBanner(props: HeroBannerProps) {
     const { 
       heading, 
       description, 
       buttonText, 
       buttonLink, 
       backgroundImage,
       ...rest 
     } = props;

     return (
       <section {...rest} className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
         {/* Background Image */}
         {backgroundImage && (
           <div className="absolute inset-0 z-0">
             <Image
               data={backgroundImage}
               className="w-full h-full object-cover"
               sizes="100vw"
             />
             <div className="absolute inset-0 bg-black/40" />
           </div>
         )}
         
         {/* Content */}
         <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">
             {heading}
           </h1>
           <p className="text-lg md:text-xl mb-8 opacity-90">
             {description}
           </p>
           {buttonText && buttonLink && (
             <a
               href={buttonLink}
               className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
             >
               {buttonText}
             </a>
           )}
         </div>
       </section>
     );
   }

   export default HeroBanner;

   export let schema = createSchema({
     type: 'hero-banner',
     title: 'Hero Banner',
     settings: [
       {
         group: 'Content',
         inputs: [
           {
             type: 'text',
             name: 'heading',
             label: 'Heading',
             defaultValue: 'Welcome to Our Store',
           },
           {
             type: 'textarea',
             name: 'description',
             label: 'Description',
             defaultValue: 'Discover amazing products that will transform your life.',
           },
           {
             type: 'text',
             name: 'buttonText',
             label: 'Button Text',
             defaultValue: 'Shop Now',
           },
           {
             type: 'text',
             name: 'buttonLink',
             label: 'Button Link',
             defaultValue: '/collections/all',
           },
         ],
       },
       {
         group: 'Design',
         inputs: [
           {
             type: 'image_picker',
             name: 'backgroundImage',
             label: 'Background Image',
           },
         ],
       },
     ],
   });
   ```

### Register the Component

3. **Add to components registry**:
   ```typescript
   // app/weaverse/components.ts
   import * as HeroBanner from '~/sections/hero-banner';

   export let components: HydrogenComponent[] = [
     // ... existing components
     HeroBanner,
   ];
   ```

### Test Your Component

4. **Go to Weaverse Studio**
5. **Click "Add Section"**
6. **Select "Hero Banner"**
7. **Customize the content** using the settings panel
8. **Upload a background image**
9. **See changes** appear instantly in your local preview

![Hero Banner in Weaverse Studio](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/pilot_development_server.png?v=1712226407)

🎯 **Achievement Unlocked**: You've created your first Weaverse component with full visual editing capabilities!

---

## Part 5: Advanced Features (10 minutes)

### Add Dynamic Product Data

Let's enhance our Hero Banner to feature a specific product.

1. **Create a product loader**:
   ```typescript
   // Add to app/sections/hero-banner/index.tsx

   import type { ComponentLoaderArgs } from '@weaverse/hydrogen';

   export async function loader(args: ComponentLoaderArgs<HeroBannerProps>) {
     const { weaverse } = args;
     const { storefront } = weaverse;

     if (!args.data?.productHandle) {
       return null;
     }

     const { product } = await storefront.query(`
       query GetProduct($handle: String!) {
         product(handle: $handle) {
           id
           title
           handle
           description
           featuredImage {
             url
             altText
             width
             height
           }
           priceRange {
             minVariantPrice {
               amount
               currencyCode
             }
           }
         }
       }
     `, {
       variables: { handle: args.data.productHandle }
     });

     return { product };
   }
   ```

2. **Update component to use product data**:
   ```typescript
   interface HeroBannerProps extends HydrogenComponentProps {
     // ... existing props
     productHandle?: string;
     loaderData?: {
       product?: any;
     };
   }

   function HeroBanner(props: HeroBannerProps) {
     const { loaderData, productHandle, ...rest } = props;
     const product = loaderData?.product;

     // Use product data if available
     const displayHeading = product?.title || props.heading;
     const displayDescription = product?.description || props.description;
     const displayImage = product?.featuredImage || props.backgroundImage;

     return (
       <section {...rest} className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
         {/* ... rest of component */}
         <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">
             {displayHeading}
           </h1>
           <p className="text-lg md:text-xl mb-8 opacity-90">
             {displayDescription}
           </p>
           {product && (
             <p className="text-2xl font-bold mb-4">
               From ${product.priceRange.minVariantPrice.amount}
             </p>
           )}
           {/* ... button code */}
         </div>
       </section>
     );
   }
   ```

3. **Add product selector to schema**:
   ```typescript
   export let schema = createSchema({
     type: 'hero-banner',
     title: 'Hero Banner',
     settings: [
       {
         group: 'Content',
         inputs: [
           // ... existing inputs
           {
             type: 'product_picker',
             name: 'productHandle',
             label: 'Featured Product',
           },
         ],
       },
       // ... rest of schema
     ],
   });
   ```

### Performance Optimization

4. **Add caching to your loader**:
   ```typescript
   export async function loader(args: ComponentLoaderArgs<HeroBannerProps>) {
     const { weaverse } = args;
     const { storefront } = weaverse;

     if (!args.data?.productHandle) {
       return null;
     }

     const { product } = await storefront.query(
       PRODUCT_QUERY,
       {
         variables: { handle: args.data.productHandle },
         cache: storefront.CacheLong(), // Cache for 1 hour
       }
     );

     return { product };
   }
   ```

✨ **Pro Tips**:
- Always cache Shopify API calls for better performance
- Use TypeScript for better development experience
- Test components with different data states (empty, loading, error)

---

## Part 6: Deployment (5 minutes)

### Deploy to Shopify Oxygen

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Deploy using Shopify CLI**:
   ```bash
   npx shopify hydrogen deploy
   ```

3. **Follow the prompts** to connect your Shopify store

4. **Update Weaverse Studio**:
   - Go to Project Settings
   - Update Preview URL to your Oxygen deployment URL
   - Save changes

### Production Checklist

Before going live, ensure:

- [ ] **Environment variables** are set correctly
- [ ] **Images are optimized** and loading properly
- [ ] **All sections work** as expected
- [ ] **Mobile responsive** design looks good
- [ ] **Performance scores** are above 90 (check with Lighthouse)
- [ ] **SEO metadata** is configured

### Go Live

5. **Set your Oxygen deployment** as your primary domain in Shopify admin
6. **Test thoroughly** on the live site
7. **Train your team** on using Weaverse Studio

🚀 **Congratulations!** Your Weaverse Hydrogen store is now live and ready for visual editing.

---

## Next Steps

### Expand Your Store

**Add More Components**:
- Product grids with filtering
- Customer testimonials
- Newsletter signup forms
- Collection showcases

**Advanced Features**:
- Multi-language support
- B2B customer groups
- Advanced search and filtering
- Custom checkout experiences

**Performance Optimization**:
- Image optimization strategies
- Caching best practices
- Core Web Vitals improvements

### Learning Resources

- **[Component Development Guide](/docs/development-guide/weaverse-component)** - Deep dive into component creation
- **[Schema Reference](/docs/development-guide/component-schema)** - Complete schema options
- **[Performance Guide](/docs/development-guide/performance)** - Optimization techniques
- **[Join our Slack](https://wvse.cc/weaverse-slack)** - Get help from the community

### Common Issues

**Component Not Showing in Studio?**
- Check component is exported correctly
- Verify schema syntax
- Ensure component is registered in `components.ts`

**Preview Not Updating?**
- Check development server is running
- Verify Preview URL in Studio settings
- Clear browser cache

**Deployment Issues?**
- Ensure all environment variables are set
- Check build logs for errors
- Verify Shopify app permissions

---

## What You've Accomplished

In just 45 minutes, you've:

✅ **Built a modern Shopify storefront** with React Router v7  
✅ **Created custom components** with visual editing capabilities  
✅ **Connected Shopify data** dynamically to your components  
✅ **Deployed to production** on Shopify Oxygen  
✅ **Set up a workflow** for continuous development and content updates  

Your store is now ready for your team to manage visually through Weaverse Studio, while you focus on building amazing shopping experiences.

**Ready to build something amazing?** [Join our Slack community](https://wvse.cc/weaverse-slack) and show us what you create!