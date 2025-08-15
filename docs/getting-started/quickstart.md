---
title: 5-Minute Quickstart
description: Get a Weaverse Hydrogen storefront running locally in just 5 minutes.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
published: true
order: 1
---

# 5-Minute Quickstart

Get your first Weaverse Hydrogen storefront up and running locally in just 5 minutes. No complex setup, no manual configuration – just install the app and start building.

## What You'll Build

A complete Shopify Hydrogen storefront powered by Weaverse with:
- **Visual Studio Editor** - Drag-and-drop page builder with live preview
- **Professional Theme** - Start with Pilot or choose from our theme library
- **Real-time Editing** - See changes instantly as you customize
- **Performance Optimized** - Modern React, SSR, and edge-ready architecture
- **Merchant-friendly** - Anyone can edit content without code

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/) and verify with `node --version`
- **A Shopify store** - [Create a development store](https://partners.shopify.com/) (free for testing)
- **Basic terminal knowledge** - Copy/paste commands (we'll guide you!)

> **💡 New to terminal?** On macOS/Linux open Terminal, on Windows use Command Prompt or PowerShell. You'll only need to copy and paste a few commands!

## Step 1: Install Weaverse App

1. **Go to Shopify App Store**
   - Open your Shopify admin panel
   - Navigate to **Apps** in the sidebar
   - Search for "Weaverse Hydrogen" or visit https://apps.shopify.com/weaverse

2. **Install the App**
   - Click **Add app** on the Weaverse Hydrogen listing
   - Review permissions and click **Install app**
   - The app will be added to your store


![Weaverse app in Shopify App Store](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_on_shopify_app_store1.webp?v=1755078035)

---

## Step 2: Create Your First Project

1. **Open Weaverse Dashboard**
   - In your Shopify admin, go to **Apps > Weaverse Hydrogen**
   - You'll see the Weaverse dashboard

2. **Start New Project**
   - Click **Get Started** or **Create New Project**
   - An onboarding modal will appear

![Weaverse dashboard with Get Started button highlighted](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_new_dashboard.webp?v=1755078172)

---

## Step 3: Choose Your Theme

1. **Select a Theme**
   - In the onboarding modal, browse available themes
   - **Pilot Theme** (recommended for beginners) - Complete e-commerce template
   - **Naturelle Theme** - Beauty/lifestyle focused design  
   - **Custom themes** - Explore marketplace options

2. **Preview Theme Features**
   - Each theme shows a preview and key features
   - Click on your preferred theme to select it

![Theme selection modal showing Pilot, Naturelle, and other themes](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_choose_theme_modal.webp?v=1755078289)

---

## Step 4: Quick Setup with CLI

1. **Copy the Generated Command**
   - After selecting your theme, you'll see a custom CLI command
   - This command is unique to your project and includes your Project ID

2. **Example Command:**
```bash
npx @weaverse/cli@latest create --template=pilot --project-id=v3gf5xxth6j1u3qr2fa4im1x --project-name=my-hydrogen-storefront
```

3. **Run in Terminal**
   - Open your terminal/command prompt
   - Paste and run the command
   - The setup process will automatically:
     - ✅ Download the selected theme to your local machine
     - ✅ Install all dependencies (React, Hydrogen, etc.)
     - ✅ Update environment variables with your Project ID
     - ✅ Start the development server

![CLI command displayed in modal with copy button](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_cli_command.webp?v=1755078433)

**Example Terminal Output:**
```bash
🚀 Downloading Pilot theme...
📦 Installing dependencies...
⚙️  Configuring environment...
🔧 Starting development server...

✅ Your Weaverse storefront is ready!
🌐 Local:    http://localhost:3456
📝 Studio:   https://studio.weaverse.io/projects/your-project-id
```

---

## Step 5: Create Project & Load Studio

1. **Complete Project Creation**
   - Back in the Weaverse modal, click **Create Project**
   - The project will be created in your Weaverse dashboard

2. **Studio Loads Automatically**
   - Weaverse Studio will open at `https://studio.weaverse.io/projects/your-project-id`
   - You'll see your theme loaded with `http://localhost:3456` in the preview
   - The content will initially come from demo data

![Weaverse Studio interface with localhost:3456 loaded in preview](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_studio_loaded.webp?v=1755078572)

---

## Step 6: Customize Your Storefront

Now for the fun part! Start customizing your storefront:

1. **Drag & Drop Sections**
   - Add new sections from the left panel
   - Rearrange sections by dragging
   - Remove sections you don't need

2. **Edit Content**
   - Click on any text to edit inline
   - Upload your own images
   - Adjust colors, fonts, and spacing

3. **Preview Changes**
   - See changes instantly in the preview
   - Test on different device sizes
   - Use the mobile/tablet/desktop toggles

![Studio with section being dragged, text being edited, and device preview toggles](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_studio_loaded_2.webp?v=1755078650)

---

## Step 7: Connect Your Real Store Data

Right now you're seeing demo content. Let's connect your actual store data:

### Option A: For Paid Shopify Stores (Recommended)

1. **Install Hydrogen App**
   - Go to https://apps.shopify.com/hydrogen
   - Install the **Hydrogen** app (by Shopify)
   - This creates a Hydrogen sales channel

2. **Pull Store Environment**
   ```bash
   # Make sure you're in your theme folder
   cd my-hydrogen-storefront
   
   # Pull your store's environment variables
   npx shopify hydrogen env pull
   ```

3. **Follow CLI Prompts**
   - Select your Shopify store
   - Choose your Hydrogen project
   - The CLI will automatically update your `.env` file

4. **Restart Development Server**
   ```bash
   npm run dev
   ```

![Hydrogen app installation in Shopify App Store](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_on_shopify_app_store.webp?v=1755078732)


### Option B: For Development/Trial Stores

1. **Create Storefront API Token**
   - In Shopify Admin, go to **Apps > Develop apps**
   - Click **Create an app** 
   - Name it "Weaverse Storefront"
   - Alternative: Use the **Headless** app (https://apps.shopify.com/headless) for easier setup
   - Configure **Storefront API scopes** and enable all permissions

2. **Update Environment Variables**
   ```bash
   # Edit your .env file with:
   PUBLIC_STORE_DOMAIN=your-store.myshopify.com
   PUBLIC_STOREFRONT_API_TOKEN=your_generated_token
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

![Creating Storefront API token in Shopify admin](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/headless_app.webp?v=1755078941)

---

## Step 8: Verify Everything Works

🎉 **Congratulations!** Let's make sure everything is working perfectly:

### ✅ Checklist
- [ ] Storefront loads at `http://localhost:3456`
- [ ] Your real products and collections appear
- [ ] Navigation menus show your store structure  
- [ ] Search finds your actual products
- [ ] Cart and checkout process work
- [ ] Weaverse Studio loads at `https://studio.weaverse.io/projects/your-project-id`
- [ ] You can edit content and see changes instantly

### 🔍 Test Your Store
1. **Browse Products**: Check that your actual products load with correct images and prices
2. **Add to Cart**: Test the shopping cart functionality
3. **Mobile View**: Use browser dev tools to test mobile responsiveness
4. **Studio Editing**: Make a change in Studio and verify it appears immediately


![Live storefront showing real products with Weaverse Studio editing panel](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_real_store_preview.webp?v=1755079014)

---

## Troubleshooting

### CLI Command Not Working
**Problem**: The generated CLI command fails to run
**Solutions**:
- Ensure Node.js 18+ is installed: `node --version`
- Check internet connection for downloading packages
- Try running with npm directly: `npm create @weaverse/cli@latest create --template=pilot ...`
- Clear npm cache: `npm cache clean --force`

### Studio Preview Not Loading  
**Problem**: Weaverse Studio shows a blank preview or connection error
**Solutions**:
- Verify development server is running on port 3456
- Check that `http://localhost:3456` loads in your browser
- Ensure no firewall is blocking port 3456
- Try refreshing the Studio page

### Demo Data Still Showing
**Problem**: Still seeing demo products instead of your store data
**Solutions**:
- Make sure you completed Step 7 (Connect Real Store Data)  
- Verify your `.env` file has correct store domain and API token
- Restart the development server: `Ctrl+C` then `npm run dev`
- Check Shopify store has products published to "Online Store" sales channel

### "Module not found" Errors
```bash
# If packages failed to install properly
cd my-hydrogen-storefront
rm -rf node_modules package-lock.json  
npm install
npm run dev
```

### Port 3456 Already in Use
```bash
# Kill any process using port 3456
npx kill-port 3456

# Or start on a different port
npm run dev -- --port 3457
```
*Note: If you change the port, update the Preview URL in Weaverse Studio accordingly*

### Environment Variables Not Working
**Problem**: Store data or Weaverse features not working
**Solutions**:
- Ensure `.env` file is in the project root (same level as `package.json`)
- Check variable names are exactly correct (case-sensitive)
- Restart development server after any `.env` changes
- Verify no spaces around the `=` sign in environment variables

---

## What's Next?

🎉 **You're ready to build!** Here's your roadmap to mastering Weaverse:

### Immediate Actions (Next 15 minutes)
1. **Customize Your Brand**
   - Replace the logo with your brand
   - Update colors to match your brand palette
   - Edit the hero section with your messaging

2. **Add Your Content**
   - Upload product images
   - Write compelling product descriptions
   - Create your About Us page

3. **Test Everything**
   - Browse on mobile and desktop
   - Test the cart and checkout process
   - Share with team members for feedback

### Short Term Goals (This Week)
1. **[Explore Themes](/docs/themes-templates)** - Browse available themes and components
2. **[Core Concepts](/docs/core-concepts)** - Understand how Weaverse works
3. **[Features](/docs/features)** - Configure meta tags and integrations

### Medium Term (Next Month)
1. **[Custom Components](/docs/development-guide)** - Build sections unique to your brand
2. **[API Reference](/docs/api)** - Learn advanced customization options
3. **[Deployment](/docs/deployment)** - Set up production hosting

### Production Launch
When you're ready to go live:
- **[Deployment Guide](/docs/deployment)** - Choose your hosting platform
- **[Security](/docs/features/content-security)** - Configure SSL and security headers

## Need Help?

- 🚀 **[Complete Tutorial](/docs/resources/tutorial)** - Deep dive walkthrough
- 💬 **[Community](/docs/community)** - Connect with other merchants and developers
- 📚 **[FAQ](/docs/resources/faq)** - Common questions answered

---

## Success! 🎉

**Congratulations!** You've just created a modern, high-performance e-commerce storefront in under 10 minutes. Here's what makes your setup special:

✅ **Lightning Fast** - Hydrogen's SSR and edge deployment
✅ **Visual Editing** - Anyone on your team can update content
✅ **Mobile Optimized** - Perfect on every device
✅ **SEO Ready** - Built for search engine success
✅ **Developer Friendly** - Full React component control when needed

### Your Storefront Features:
- 🏪 **Professional Theme** - Pilot theme with proven conversion patterns
- 🎨 **Visual Builder** - Drag-and-drop customization
- 📱 **Mobile First** - Responsive design out of the box
- ⚡ **Performance** - Sub-second load times
- 🛒 **Complete E-commerce** - Cart, checkout, and payment ready

**Time to live storefront**: Under 10 minutes ⚡

Ready to customize and launch? Dive into [Core Concepts](/docs/core-concepts) to understand how everything works together!