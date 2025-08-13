---
title: Installation
description: Install Weaverse for your Shopify Hydrogen project using our app-based workflow or manual methods.
publishedAt: August 13, 2025
updatedAt: August 13, 2025
published: true
order: 2
---

# Installation

Get Weaverse installed and running in your Shopify Hydrogen project. This guide covers different installation methods to fit your development workflow and experience level.

> **🚀 New to Weaverse?** Try our [5-Minute Quickstart](/docs/getting-started/quickstart) for the fastest setup experience.

## Prerequisites

Before installing Weaverse, make sure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **A Shopify store** - Development store or paid plan
- **Basic terminal knowledge** - For running commands

## Installation Methods

Choose the method that best fits your needs:

### Method A: Via Weaverse App (Recommended)

**Best for**: New users, quick setup, guided experience

This is the easiest way to get started. The Weaverse app provides a guided setup experience:

1. **Install Weaverse App**
   - Visit https://apps.shopify.com/weaverse
   - Install the Weaverse Hydrogen app in your Shopify store

2. **Create Project**
   - Open the app in your Shopify admin
   - Click "Get Started" or "Create New Project"
   - Choose a theme (Pilot recommended for beginners)

3. **Run Generated Command**
   - Copy the custom CLI command provided
   - Example: `npx @weaverse/cli@latest create --template=pilot --project-id=abc123 --project-name=my-store`
   - Paste and run in your terminal

**What this does automatically:**
- Downloads the selected theme
- Installs all dependencies
- Configures environment variables
- Sets up your project structure
- Starts the development server

> **💡 Tip**: This method is covered in detail in our [Quickstart Guide](/docs/getting-started/quickstart).

---

### Method B: Direct CLI Installation

**Best for**: Developers who prefer command-line tools

If you already have a Weaverse account and project ID:

```bash
# Create new project with Pilot theme
npx @weaverse/cli@latest create --template=pilot --project-id=your-project-id --project-name=my-hydrogen-store

# Navigate to project
cd my-hydrogen-store

# Start development server
npm run dev
```

**Available templates:**
- `pilot` - Complete e-commerce template (recommended)
- `naturelle` - Beauty/lifestyle focused design
- `minimal` - Clean, minimal starting point

**Getting your Project ID:**
1. Create a Weaverse account at https://weaverse.io
2. Install the Weaverse app in your Shopify store
3. Create a new project to get your Project ID

---

### Method C: GitHub Clone

**Best for**: Developers who want git history, custom modifications

Clone directly from our GitHub repository:

```bash
# Clone the Pilot theme
git clone https://github.com/Weaverse/pilot.git my-store
cd my-store

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration (see Configuration section)

# Start development server
npm run dev
```

**After cloning, you'll need to:**
1. Get a Weaverse Project ID from the app dashboard
2. Configure environment variables manually
3. Connect to your Shopify store

---

## Configuration

Regardless of installation method, you'll need these environment variables:

### Required Variables

```bash
# Your Shopify store domain (without https://)
PUBLIC_STORE_DOMAIN=your-store.myshopify.com

# Storefront API token
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token

# Weaverse project ID
WEAVERSE_PROJECT_ID=your-weaverse-project-id

# Session secret for secure authentication
SESSION_SECRET=your-random-session-secret
```

### Optional Variables

```bash
# Analytics and integrations
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_KLAVIYO_PRIVATE_API_TOKEN=your-klaviyo-token

# Development settings
NODE_ENV=development
```

### Getting Your Values

#### Storefront API Token
**For paid Shopify stores:**
1. Install the Hydrogen app: https://apps.shopify.com/hydrogen
2. Run `npx shopify hydrogen env pull` in your project folder
3. Follow prompts to select your store and project

**For development stores:**
1. In Shopify Admin → Apps → Develop apps
2. Create an app and enable all Storefront API scopes
3. Generate the token
4. Alternative: Use the Headless app (https://apps.shopify.com/headless)

#### Weaverse Project ID
1. Install the Weaverse app from Shopify App Store
2. Create a new project in the dashboard
3. Copy the Project ID from your project settings

#### Session Secret
Generate a random string for secure sessions:
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Project Structure

After installation, your project will have this structure:

```
my-hydrogen-store/
├── app/
│   ├── components/          # Reusable UI components
│   ├── sections/            # Weaverse page sections
│   ├── routes/              # React Router v7 pages
│   ├── lib/                 # Utilities and helpers
│   └── weaverse/            # Weaverse configuration
├── public/                  # Static assets (images, icons)
├── .env                     # Environment configuration
├── weaverse.config.ts       # Theme settings and configuration
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

### Key Files

- **`weaverse.config.ts`** - Theme configuration and component registration
- **`.env`** - Environment variables (never commit this!)
- **`app/sections/`** - Custom Weaverse sections you build
- **`app/weaverse/`** - Weaverse-specific configuration and utilities

---

## Verification

After installation, verify everything is working:

### 1. Start Development Server
```bash
npm run dev
```

### 2. Check Your Storefront
- Visit `http://localhost:3456` 
- Verify products and pages load
- Test navigation and search

### 3. Access Weaverse Studio
- Go to `https://studio.weaverse.io/projects/your-project-id`
- Verify the preview loads your localhost
- Try editing content and see changes

### 4. Test Basic Functionality
- ✅ Storefront loads without errors
- ✅ Products display with correct data
- ✅ Studio preview works
- ✅ Content editing reflects changes
- ✅ Mobile layout responsive

---

## Updating Weaverse

Keep your Weaverse installation up to date:

### Update CLI Tool
```bash
# Update to latest CLI version
npm update -g @weaverse/cli@latest

# Check version
npx @weaverse/cli --version
```

### Update SDK Packages
```bash
# Update all Weaverse packages
npm update @weaverse/hydrogen @weaverse/react @weaverse/core

# Check for outdated packages
npm outdated | grep @weaverse
```

### Version Compatibility
- **Weaverse v5.x** requires **React Router v7** and **Node.js 18+**
- **Weaverse v4.x** requires **Remix** (legacy, not recommended)

---

## Uninstalling

To remove Weaverse from your project:

### 1. Remove Weaverse Packages
```bash
npm uninstall @weaverse/hydrogen @weaverse/react @weaverse/core
```

### 2. Clean Up Configuration
```bash
# Remove Weaverse config file
rm weaverse.config.ts

# Remove Weaverse directories
rm -rf app/weaverse app/sections
```

### 3. Update Environment Variables
Remove Weaverse-specific variables from your `.env` file:
- `WEAVERSE_PROJECT_ID`
- `WEAVERSE_API_KEY`

### 4. Update App Structure
Remove Weaverse providers and imports from `app/root.tsx`.

---

## Troubleshooting

### CLI Command Fails
**Problem**: `npx @weaverse/cli` command doesn't work
**Solutions**:
- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Try with full path: `npm create @weaverse/cli@latest create ...`
- Check internet connection and firewall settings

### Project ID Not Found
**Problem**: "Project ID not found" error
**Solutions**:
- Verify Project ID in your Weaverse dashboard
- Ensure you've installed the Weaverse app in Shopify
- Check for typos in the Project ID
- Contact support if the project was recently created

### Environment Variables Not Loading
**Problem**: Configuration not taking effect
**Solutions**:
- Ensure `.env` file is in project root (same level as `package.json`)
- Restart development server after changes: `Ctrl+C` then `npm run dev`
- Verify no spaces around `=` signs in variables
- Check variable names are exact (case-sensitive)

### Studio Preview Not Loading
**Problem**: Blank preview in Weaverse Studio
**Solutions**:
- Verify development server runs on port 3456
- Check `http://localhost:3456` loads in your browser
- Ensure no firewall blocks port 3456
- Try refreshing the Studio page
- Check browser console for JavaScript errors

### Permission Errors
**Problem**: "Permission denied" during installation
**Solutions**:
- Don't use `sudo` with npm commands
- Fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors
- Use Node Version Manager (nvm) to manage Node.js
- Check file/folder permissions in project directory

---

## Version Migration

### Upgrading from v4 to v5
Weaverse v5 brings React Router v7 support. See our [v5 Migration Guide](/docs/migration-advanced/v5-migration) for detailed upgrade instructions.

### Breaking Changes in v5
- React Router v7 replaces Remix
- Updated component schema format
- New CLI command structure
- Different import paths for some utilities

---

## Next Steps

Now that Weaverse is installed:

### Immediate Actions
1. **[Create Your First Component](/docs/getting-started/first-project)** - Learn component development
2. **[Understand Core Concepts](/docs/core-concepts)** - How Weaverse works
3. **[Explore Themes](/docs/themes-templates)** - Browse available themes and components

### Development Resources
- **[Development Guide](/docs/development-guide)** - Build custom sections and components
- **[API Reference](/docs/api)** - Complete API documentation
- **[Example Components](/docs/resources/examples)** - Copy and customize examples

### Getting Help
- 💬 **[Community Forum](/docs/community)** - Connect with other developers
- 📖 **[FAQ](/docs/resources/faq)** - Common questions answered
- 🔧 **[Troubleshooting](/docs/resources/troubleshooting)** - Solve technical issues
- 📧 **[Support](/docs/community/support)** - Get direct help from our team

Ready to start building? Check out our [Development Guide](/docs/development-guide) or explore the [Core Concepts](/docs/core-concepts)! 🚀