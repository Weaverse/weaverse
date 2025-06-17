---
title: Weaverse SDKs
description: Weaverse SDKs bundle essential packages, streamlining the development and management of Weaverse Hydrogen themes.
publishedAt: November 20, 2023
updatedAt: May 13, 2025
order: 1
published: true
---

The Weaverse SDK is organized into multiple packages, each serving a specific role in the development of Weaverse
Hydrogen themes. These packages provide the necessary tools and functionalities for an efficient and streamlined
development process.

## Package Overview

### `@weaverse/core`

This foundational package contains the core logic of Weaverse and Weaverse Items, focusing on essential operations and
data handling within the Weaverse ecosystem.

**Key Features:**
- Data model definitions for Weaverse components
- Core rendering logic
- State management utilities
- Type definitions shared across the ecosystem

**Installation:**
```bash
npm install @weaverse/core
```

### `@weaverse/react`

Specializing in the user interface, this package provides React bindings for Weaverse, managing the rendering of Weaverse Items as React components and ensuring proper display and interaction within themes.

**Key Features:**
- React component rendering system for Weaverse items
- Context providers for Weaverse and item states
- Custom hooks for accessing Weaverse data and item instances
- Utility functions for CSS generation and class name handling

**Installation:**
```bash
npm install @weaverse/react
```

**Core Components:**
- `WeaverseRoot`: The main component that renders your Weaverse content tree
- `WeaverseContextProvider`: Provides the Weaverse context to all child components
- `ItemComponent`: Renders individual Weaverse items based on their type and properties

**Essential Hooks:**
- `useWeaverse()`: Access the Weaverse instance from any component
- `useItemInstance(id?)`: Get a specific item instance by ID or the current item
- `useParentInstance()`: Get the parent item of the current component
- `useChildInstances(id?)`: Get all child instances of an item

**Basic Usage:**
```jsx
import { Weaverse } from '@weaverse/core';
import { WeaverseRoot } from '@weaverse/react';

// Initialize Weaverse
const weaverse = new Weaverse({
  projectId: 'your-project-id',
  data: yourWeaverseData
});

// Register your components
weaverse.registerElement({
  type: 'Button',
  Component: ButtonComponent,
  schema: {
    title: 'Button',
    type: 'Button',
    settings: {
      // Configuration options
    }
  }
});

// Render the Weaverse content
function App() {
  return (
    <WeaverseRoot context={weaverse} />
  );
}
```

### `@weaverse/hydrogen`

Tailored for theme development, this package carries the logic required to build a Hydrogen Theme and facilitate its
integration with Weaverse Studio's customization features.

**Key Features:**
- Shopify Hydrogen integration
- Theme customization components
- Studio preview capabilities
- Hydrogen-specific renderers and utilities

**Installation:**
```bash
npm install @weaverse/hydrogen
```

**Basic Usage:**
```jsx
import { WeaverseHydrogenRoot } from '@weaverse/hydrogen';

export default function App() {
  return (
    <WeaverseHydrogenRoot>
      {/* Your app content */}
    </WeaverseHydrogenRoot>
  );
}
```

### `@weaverse/cli`

A command-line tool included in the SDK, aiding developers in creating, managing, and deploying Weaverse Hydrogen themes
with ease and efficiency.

**Key Features:**
- Project scaffolding with templates
- Development workflow utilities
- Project configuration tools
- Build and deployment helpers

**Usage:**
```bash
npx @weaverse/cli@latest create --template=pilot --project-id=YOUR_PROJECT_ID
```

### `@weaverse/biome`

A package that provides standardized [Biome](https://biomejs.dev/) configuration for Weaverse projects, ensuring consistent code formatting and linting across all Weaverse-related codebases.

**Key Features:**
- Preconfigured Biome settings optimized for Weaverse development
- Consistent code style enforcement
- Standardized linting rules with appropriate severity levels
- Compatible with React and TypeScript projects

**Installation:**
```bash
npm install @weaverse/biome --save-dev
```

**Usage:**
In your project's root directory, create or update your `biome.json` file to extend the Weaverse configuration:

```json
{
  "extends": ["./node_modules/@weaverse/biome/biome.json"],
  // Add any project-specific overrides here
}
```

**Key Configuration Details:**

The Weaverse Biome configuration includes:

- **JavaScript/TypeScript formatting:**
  - Uses single quotes
  - Employs spaces for indentation
  - Semicolons only as needed

- **Linting rules with sensible defaults:**
  - Accessibility (a11y) checks
  - React-specific best practices
  - Security protections
  - Code complexity guidance

This configuration helps maintain code quality and consistency across Weaverse projects while providing flexibility for project-specific needs.

## Package Compatibility

The Weaverse SDK packages are designed to work together seamlessly, but each can also be used independently based on your project needs:

| Package | Compatible With | Required Dependencies |
|---------|----------------|----------------------|
| `@weaverse/core` | Any JavaScript project | None |
| `@weaverse/react` | React 18+ applications | `@weaverse/core` |
| `@weaverse/hydrogen` | Shopify Hydrogen | `@weaverse/core`, `@weaverse/react` |
| `@weaverse/cli` | Node.js environment | None |
| `@weaverse/biome` | Any JavaScript/TypeScript project | None (depends on `@biomejs/biome`) |

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v7.0.0 or higher (or equivalent package manager)
- **React**: v18.0.0 or higher (for React-based packages)
- **Shopify Hydrogen**: Latest version recommended (for Hydrogen integration)

## Getting Started

For new Weaverse Hydrogen projects, the easiest way to get started is using the CLI:

```bash
# Create a new project
npx @weaverse/cli@latest create --template=pilot --project-id=YOUR_PROJECT_ID --project-name=my-store

# Navigate to project directory
cd my-store

# Start development server
npm run dev
```

For existing projects, you can install the required packages individually and integrate them according to your needs.

## Open Source Status

The Weaverse team is actively working on improving these packages and expanding their capabilities. For the latest updates on availability and open source status, please check the [official Weaverse GitHub repository](https://github.com/Weaverse/weaverse).

## Additional Resources

- [Weaverse Documentation](https://weaverse.io/docs)
- [API Reference](https://weaverse.io/docs/api)
- [Example Projects](https://weaverse.io/examples)
- [Community Forum](https://github.com/Weaverse/weaverse/discussions)
