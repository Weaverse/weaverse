---
title: 5-Minute Quickstart
description: Get a Weaverse Hydrogen storefront running locally in just 5 minutes.
order: 1
---

# 5-Minute Quickstart

Get your first Weaverse Hydrogen storefront up and running locally in just 5 minutes. By the end of this guide, you'll have a fully functional e-commerce storefront with visual page building capabilities.

## What You'll Build

A complete Shopify Hydrogen storefront powered by Weaverse with:
- **Visual Studio Editor** - Drag-and-drop page builder with live preview
- **Pre-built Sections** - Hero, product grid, testimonials, and more
- **Mobile-responsive Design** - Optimized for all devices
- **Performance First** - SSR, streaming, and edge deployment ready
- **Merchant-friendly** - Non-technical users can edit content

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Shopify CLI** - Install with `npm install -g @shopify/cli`
- **A Shopify store** - [Create a development store](https://partners.shopify.com/) (free)
- **Basic terminal/command line knowledge**

> **💡 Tip**: New to terminal? On macOS/Linux open Terminal, on Windows use Command Prompt or PowerShell.

## Two Setup Options

Choose the option that best fits your needs:

### Option A: Start with Pilot Theme (Recommended for Beginners)
Use our complete starter theme with Weaverse already integrated.

### Option B: Create Fresh Hydrogen + Add Weaverse
Start with Shopify's CLI and integrate Weaverse step-by-step.

---

## Option A: Pilot Theme Setup (Fastest)

### A1. Install Weaverse Hydrogen App

1. **Install the App in Shopify:**
   - Go to your Shopify admin
   - Install the **Weaverse Hydrogen** app from the App Store
   - Create a new storefront within Weaverse
   - **Copy your Weaverse Project ID** - you'll need this in A3

### A2. Clone the Pilot Theme

```bash
# Clone the latest Pilot theme
git clone https://github.com/Weaverse/pilot.git my-weaverse-store

# Navigate to the project directory
cd my-weaverse-store

# Install dependencies
npm install
```

### A3. Configure Environment Variables

1. **Create environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` with your details:**
```bash
# Your Shopify store domain (without https://)
PUBLIC_STORE_DOMAIN=your-store.myshopify.com

# Storefront API token (create in Shopify Admin > Apps > Develop apps)
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_access_token

# Weaverse Project ID from Step A1
WEAVERSE_PROJECT_ID=your-weaverse-project-id

# Session secret for secure authentication
SESSION_SECRET=your-random-session-secret
```

> **🔑 Getting API Token**: In Shopify Admin → Apps → Develop apps → Create app → Configure Storefront API → Enable product/collection access → Generate token

### A4. Start Development Server

```bash
# Start the development server (note: uses port 3456 by default)
npm run dev
```

### A5. Configure Weaverse Preview

1. **In your Weaverse project settings:**
   - Set Preview URL to: `http://localhost:3456`
   - Save the settings

2. **Test the connection:**
   - Visit `http://localhost:3456` - your storefront
   - Visit `http://localhost:3456/weaverse` - Weaverse Studio editor

---

## Option B: Fresh Hydrogen + Weaverse Integration

### B1. Create Hydrogen Project

```bash
# Create new Hydrogen storefront using Shopify CLI
npm create @shopify/hydrogen@latest my-weaverse-store

# Navigate to project
cd my-weaverse-store

# Start development server
npm run dev
```

### B2. Install Weaverse Integration

1. **Install Weaverse Hydrogen App** (same as A1 above)
2. **Install Weaverse SDK:**
```bash
npm install @weaverse/hydrogen
```

### B3. Configure Environment

Create `.env` with the same variables as Option A:
```bash
SESSION_SECRET=your-random-session-secret
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
WEAVERSE_PROJECT_ID=your-project-id
PUBLIC_STOREFRONT_API_TOKEN=your-token
```

### B4. Integrate Weaverse Components

Add Weaverse to your Hydrogen app:

1. **Update `app/root.tsx`:**
```typescript
import {WeaverseRoot} from '@weaverse/hydrogen'
// ... other imports

export default function App() {
  return (
    <WeaverseRoot>
      {/* Your existing app structure */}
    </WeaverseRoot>
  )
}
```

2. **Create Weaverse configuration file `weaverse.config.ts`:**
```typescript
import {defineWeaverseConfig} from '@weaverse/hydrogen'

export default defineWeaverseConfig({
  // Your theme configuration
})
```

### B5. Set Preview URL

In Weaverse project settings, set Preview URL to: `http://localhost:3456`

---

## Testing Your Setup

Regardless of which option you chose, follow these steps to verify everything works:

### 1. View Your Storefront
- **Option A**: Visit `http://localhost:3456` (Pilot theme default)
- **Option B**: Visit `http://localhost:3456` (or the port shown in your terminal)

### 2. Test Basic Functionality
- ✅ Products and collections load
- ✅ Navigation menus work
- ✅ Search functionality works
- ✅ Mobile layout responsive
- ✅ No console errors in browser dev tools

### 3. Access Weaverse Studio
- Visit `http://localhost:3456/weaverse` to open the visual page builder
- Try editing page content with drag-and-drop
- Make text changes and see live preview
- Add/remove sections and components

> **📝 Important**: The default Hydrogen port is `3456`, not `3000`. Make sure your Preview URL in Weaverse matches exactly.

## Verification Checklist

Make sure everything is working:

- ✅ Storefront loads at `http://localhost:3000`
- ✅ Products display correctly
- ✅ Navigation menus work
- ✅ Search functionality works
- ✅ Mobile layout looks good
- ✅ Weaverse Studio accessible at `/weaverse`
- ✅ No console errors in browser dev tools

## Common Issues & Solutions

### Missing/Incorrect Weaverse Project ID
**Problem**: Hydrogen can't connect to Weaverse CMS
**Solution**: 
- Double-check your `WEAVERSE_PROJECT_ID` in `.env`
- Verify it matches the ID from your Weaverse app dashboard
- Make sure there are no extra spaces or characters

### Port/Preview URL Mismatch  
**Problem**: Weaverse Studio can't preview your storefront
**Solution**:
- Ensure your Hydrogen dev server runs on port `3456` (default)
- Set Preview URL in Weaverse to exactly `http://localhost:3456`
- Check that no firewall is blocking the connection

### Component Migration Errors (Option B users)
**Problem**: Existing Hydrogen components not working with Weaverse
**Solution**:
- Gradually migrate components to use Weaverse's Section/Component architecture
- Follow the [Component Development Guide](/docs/development-guide/weaverse-component)
- Start with simple components before complex ones

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Products not loading
- Double-check your `PUBLIC_STORE_DOMAIN` in `.env`
- Verify your `PUBLIC_STOREFRONT_API_TOKEN` is correct
- Ensure your Shopify store has products published to the storefront
- Check that Storefront API permissions are enabled

### Environment Variables Not Loading
**Problem**: Configuration not taking effect
**Solution**:
- Restart your development server after changing `.env`
- Ensure `.env` file is in project root directory
- Check that variable names match exactly (case-sensitive)

## Project Structure Overview

Here's what you just set up:

```
my-weaverse-store/
├── app/
│   ├── components/          # Reusable UI components
│   ├── sections/            # Weaverse page sections
│   ├── routes/              # React Router pages
│   ├── lib/                 # Utilities and helpers
│   └── weaverse/            # Weaverse configuration
├── public/                  # Static assets (images, icons)
├── .env                     # Environment configuration
├── weaverse.config.ts       # Theme settings
└── package.json             # Dependencies and scripts
```

## What's Next?

Now that you have a working Hydrogen + Weaverse setup, here are your recommended next steps:

### Immediate Actions (5-15 minutes)
1. **Customize Sections**: Use Weaverse Studio to add, configure, and style page sections
2. **Publish Changes**: Use one-click publish to push updates live
3. **Upload Brand Assets**: Replace default logo and colors in theme settings
4. **Test Mobile Experience**: Verify responsive design on different devices

### Short Term (1-2 hours)
1. **[Explore the Marketplace](/docs/themes-templates)**: Browse pre-made components and themes for faster iteration
2. **[Core Concepts](/docs/core-concepts)**: Understand the Weaverse architecture and component system
3. **[Pilot Theme Customization](/docs/themes-templates/pilot-theme-customization)**: Learn advanced customization techniques
4. **Performance Testing**: Take advantage of Hydrogen's SSR and streaming capabilities

### Medium Term (1-2 days)
1. **[Component Development](/docs/development-guide)**: Build custom sections and components
2. **[Join the Community](/docs/community)**: Participate in Slack, forums, or GitHub discussions
3. **[Advanced Features](/docs/features)**: Add analytics, SEO optimization, and third-party integrations
4. **Content Migration**: Move existing content into the visual builder system

### Production Ready (1 week)
1. **[Deployment](/docs/deployment)**: Launch with Oxygen Hosting, Vercel, or other platforms
2. **SEO Optimization**: Leverage Hydrogen's SSR for search engine visibility
3. **Performance Monitoring**: Set up analytics and performance tracking
4. **Team Training**: Onboard content editors to use Weaverse Studio

## Production Deployment

Ready to go live? Check out our deployment guides:

- **[Shopify Oxygen](/docs/deployment/oxygen)** (Recommended for Shopify Plus)
- **[Vercel](/docs/deployment)** (Great for fast global deployment)
- **[Netlify](/docs/deployment)** (Simple and reliable)
- **[Docker](/docs/deployment/docker)** (For custom hosting)

## Need Help?

- 💬 **[Community Forum](/docs/community)** - Connect with other developers
- 📖 **[FAQ](/docs/resources/faq)** - Common questions and answers
- 🔧 **[Troubleshooting](/docs/resources/troubleshooting)** - Solve technical issues
- 📧 **[Support](/docs/community/support)** - Get direct help from our team
- 📚 **[Complete Tutorial](/docs/resources/tutorials/tutorial)** - In-depth walkthrough

## Success! 🎉

Congratulations! You now have:
- ✅ **A fully functional Shopify Hydrogen storefront** with modern SSR and streaming
- ✅ **Visual page building with Weaverse Studio** - drag-and-drop editing with live preview  
- ✅ **Merchant-friendly content management** - non-technical users can edit pages
- ✅ **Developer-friendly architecture** - full control over components and customization
- ✅ **Performance optimized** - ready for edge deployment and excellent SEO
- ✅ **Modern React ecosystem** - React Router v7, Vite, and TypeScript ready

**Time to completion**: 5-15 minutes ⚡

### What Makes This Special?

You've just set up what many consider the **perfect headless commerce solution**:
- **Hydrogen's performance** - Fast, SEO-friendly, edge-deployed
- **Weaverse's usability** - Visual editing like traditional themes
- **Developer flexibility** - Full React component control
- **Merchant empowerment** - Content editing without developer dependency

Ready to build something amazing? Start with the [Marketplace](/docs/themes-templates) to explore components, or jump into [Core Concepts](/docs/core-concepts) to understand the architecture!