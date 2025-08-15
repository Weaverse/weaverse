# Weaverse SDKs

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/vif3.svg)](https://wvse.cc/weaverse-status)
[![🚀 Lint & Typecheck](https://github.com/Weaverse/weaverse/actions/workflows/check.yml/badge.svg)](https://github.com/Weaverse/weaverse/actions/workflows/check.yml)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![committers.top badge](https://org-badge.committers.top/vietnam/weaverse.svg)](https://org-badge.committers.top/vietnam/weaverse)

> **🚀 Weaverse v5 is here!** Now powered by React Router v7 for better performance and developer experience. [See what's new →](./CHANGELOG.md#500---2024-12-20)

## Overview

The **Weaverse SDKs** is a public collection of SDKs for integrating **Weaverse Headless CMS** with modern `React/JamStack`
frameworks such as _Shopify Hydrogen_, _React Router_, or _Next.js_. Developed by The Weaverse Team, these SDKs are designed to
simplify and enhance the integration of dynamic, content-rich web applications with the Weaverse CMS.

## Quick Links

- **Install Weaverse MCP server**: [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=weaverse-mcp&config=eyJjb21tYW5kIjoibnB4IC15IEB3ZWF2ZXJzZS9tY3AifQ%3D%3D)
- **Home page**: https://weaverse.io
- **Weaverse Studio playground**: https://studio.weaverse.io/demo
- **Pilot theme demo**: https://pilot.weaverse.dev
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

## Community Engagement

Engage with the Weaverse community through these channels:

- **Slack**: [@WeaverseCommunity](https://wvse.cc/weaverse-slack)
- **X (formerly Twitter)**: [@WeaverseIO](https://wvse.cc/weaverse-twitter)
- **LinkedIn**: [@company/weaverseio](https://wvse.cc/weaverse-linkedin)

## Key Features

- **Framework-Specific SDKs**: Tailored SDKs for various React/JamStack frameworks, ensuring flexible and efficient
  integration.
- **Seamless CMS Integration**: Facilitates the integration of applications with the Weaverse Headless CMS.
- **Community-Driven**: Open-source and community-focused, welcoming contributions and collaborative development.

## Packages

This monorepo contains the following packages:

- [`@weaverse/core`](https://github.com/Weaverse/weaverse/tree/main/packages/core): Foundation package with core logic
  and framework-agnostic code.
- [`@weaverse/react`](https://github.com/Weaverse/weaverse/tree/main/packages/react): React components and utilities for
  CMS integration.
- [`@weaverse/hydrogen`](https://github.com/Weaverse/weaverse/tree/main/packages/hydrogen): SDK for Shopify Hydrogen
  integration with Weaverse CMS, now powered by React Router v7.
- [`@weaverse/shopify`](https://github.com/Weaverse/weaverse/tree/main/packages/shopify): Shopify-specific utilities and integrations.
- [`@weaverse/schema`](https://github.com/Weaverse/weaverse/tree/main/packages/schema): Schema definitions for Weaverse components.
- [`@weaverse/cli`](https://github.com/Weaverse/weaverse/tree/main/packages/cli): Command-line tools for Weaverse development.
- [`@weaverse/biome`](https://github.com/Weaverse/weaverse/tree/main/packages/biome): Shared Biome configuration for code quality.

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm 10.12.1

### Installation

```bash
# Clone the repository
git clone https://github.com/Weaverse/weaverse.git
cd weaverse

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

### Development

```bash
# Start development mode for all packages
pnpm run dev

# Run type checking
pnpm run typecheck

# Run linting and formatting
pnpm run biome
pnpm run biome:fix

# Run tests
pnpm run test
```

## Templates

The repository includes example implementations:

- **[Pilot Theme](./templates/pilot)**: A complete Shopify Hydrogen storefront with Weaverse integration, featuring:
  - Product listing and detail pages
  - Shopping cart and checkout
  - Customer accounts
  - Weaverse visual page builder sections
  - React Router v7 powered routing

## Contribution Guidelines

Please refer to the [Contribution Guidelines](./CONTRIBUTING.md) for information on how to contribute to the Weaverse SDKs.

Your contributions are welcome to further enhance the Weaverse SDKs. Feel free to fork the repository, make changes, and
submit pull requests with your improvements.

### Development Workflow

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm run biome:fix` and `pnpm run typecheck`
5. Create a changeset with `pnpm run changeset`
6. Submit a pull request

## Documentation

- **[Developer Documentation](https://weaverse.io/docs)**: Comprehensive guides and API references
- **[CLAUDE.md](./CLAUDE.md)**: AI assistant guidance for working with this codebase
- **[Changelog](./CHANGELOG.md)**: Version history and release notes

## About us

Passionate about empowering developers, Weaverse Team is committed to creating innovative tools and solutions that
simplify and enhance web development. Our focus is on fostering a vibrant community and driving forward the evolution of
web technologies.
