---
title: Prerequisites
description: 'Essential requirements and setup guide for developing with Weaverse Hydrogen'
publishedAt: November 20, 2023
updatedAt: April 11, 2025
order: 0
published: true
---

## Overview

Welcome to Weaverse! Before you begin building your Hydrogen-powered storefront, let's ensure your development environment is properly configured. This guide covers everything you need to get started.

## Quick Requirements Checklist

✅ Node.js 22.x or higher (18.x minimum)

✅ PNPM 8.x or higher (recommended)

✅ Git for version control

✅ Chrome-based browser

✅ Shopify store (Basic plan or higher)

✅ Basic React/TypeScript knowledge

## Detailed Requirements

### 1. Development Environment

#### Node.js Setup
- **Node.js**: `22.x` or higher recommended (`18.x` minimum)
  ```bash
  # Check your Node version
  node --version
  ```
  - 💡 Tip: Use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions
  ```bash
  # Install and use latest LTS Node version with nvm
  nvm install --lts
  nvm use --lts
  ```

#### Package Manager
We recommend using PNPM for better performance and disk space efficiency:
- **PNPM** `8.x` or higher (Recommended)
  ```bash
  # Install pnpm
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

Alternative package managers:
- **npm**: `10.x` or higher (included with Node.js)
- **Yarn**: `1.22.x` or higher

### 2. Development Tools

#### Recommended IDE
- **[Cursor](https://cursor.sh/)** (Highly Recommended)
  - Built-in AI pair programming
  - Native terminal integration
  - Git integration
  - Real-time collaboration

#### AI Coding Assistants
- **[GitHub Copilot](https://github.com/features/copilot)**
  - Works with most popular editors
  - Advanced code completion
  - Natural language to code assistance

#### MCP Servers
To enhance your development experience with AI-powered tools, we recommend these Model Context Protocol servers:

- **[Weaverse MCP](https://github.com/weaverse/mcp)** - Quick access to Weaverse documentation
- **[Shopify MCP](https://github.com/Shopify/dev-mcp)** - Shopify API integration and documentation
- **[Figma MCP](https://github.com/GLips/Figma-Context-MCP)** - For implementing Figma designs

> 💡 Tip: These MCPs work best with Cursor IDE. Follow the setup instructions in each repository.

#### Alternative: Visual Studio Code
If you prefer VS Code, install these essential extensions:
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) - Code formatting and linting
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### 3. Version Control

- **Git**: Latest version
  ```bash
  # Verify Git installation
  git --version
  ```

### 4. Browser Requirements

For the best development experience, use a Chrome-based browser:
- **Google Chrome** (Recommended)
- **Arc Browser**
- **Microsoft Edge**

> 💡 Chrome DevTools are essential for debugging and performance optimization

### 5. Shopify Requirements

#### Store Setup
- Active Shopify store (Basic plan or higher)
- Admin access to your store
- [Shopify Partner](https://partners.shopify.com/) account (recommended)

#### Technical Prerequisites
- Basic understanding of:
  - React fundamentals
  - TypeScript basics
  - Shopify theme structure
  - GraphQL concepts (for advanced usage)

## Getting Started with Weaverse

### 1. Install the Weaverse App

1. Visit [Weaverse on Shopify App Store](https://apps.shopify.com/weaverse)
2. Click "Add app"
3. Follow the installation wizard

### 2. Choose Your Path

#### Starter Theme (Recommended for Beginners)
Choose from our curated themes:
- [Pilot](https://github.com/weaverse/pilot) - Modern, versatile starter
- [Naturelle](https://github.com/weaverse/naturelle) - Nature-inspired design

#### Custom Development
Start from scratch:
- Create a new project
- Follow our [custom development guide](/docs/guides/custom-development)

## Verify Your Setup

Run these commands to ensure everything is properly installed:

```bash
# Environment checks
node --version     # Should be ≥ 18.x
pnpm --version     # Should be ≥ 8.x
git --version      # Should show latest version

# Optional: Install global dependencies
pnpm install -g @shopify/cli
```

## Next Steps

Ready to start building? Continue with:

1. 📚 [Getting Started Guide](/docs/hydrogen/getting-started)
2. 🏗️ [Project Structure](/docs/guides/project-structure)
3. 🧱 [Component Development](/docs/guides/weaverse-component)

## Need Help?

- Join our [Community Slack](https://wvse.cc/weaverse-slack)
- Check our [GitHub Discussions](https://github.com/weaverse/weaverse/discussions)
- Follow [@WeaverseIO](https://twitter.com/WeaverseIO) for updates

---
