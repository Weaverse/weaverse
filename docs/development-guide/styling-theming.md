---
title: Styling & Theming
description: Apply consistent styling with Tailwind CSS, global theme settings, and modern design patterns in Weaverse components.
publishedAt: August 15, 2025
updatedAt: August 15, 2025
order: 5
published: true
---

# Styling & Theming

This guide covers how to style Weaverse components effectively using Tailwind CSS, implement global theme settings, and create consistent design systems across your storefront.

## Theme Setup

Before diving into styling, you need to set up the Weaverse theme system. This involves three key files that work together to provide dynamic theming capabilities.

### 1. App Wrapper with withWeaverse

First, wrap your main App component with `withWeaverse` in your root file:

```tsx
// app/root.tsx
import { withWeaverse } from "@weaverse/hydrogen";

function App() {
  return <Outlet />;
}

// This enables Weaverse theming and component system
export default withWeaverse(App);
```

### 2. Theme Schema Definition

Create a theme schema that defines all customizable settings for your storefront:

```tsx
// app/weaverse/schema.server.ts
import type { HydrogenThemeSchema } from "@weaverse/hydrogen";

export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: "1.0.0",
    author: "Your Name",
    name: "Your Theme",
    documentationUrl: "https://your-docs.com",
    supportUrl: "https://your-support.com",
  },
  settings: [
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
        {
          type: "range",
          label: "Nav height (desktop)",
          name: "navHeightDesktop",
          configs: {
            min: 2,
            max: 8,
            step: 1,
            unit: "rem",
          },
          defaultValue: 6,
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          label: "Background",
          name: "colorBackground",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          label: "Text",
          name: "colorText",
          defaultValue: "#0F0F0F",
        },
        {
          type: "color",
          label: "Primary Button",
          name: "buttonPrimaryBg",
          defaultValue: "#000000",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          label: "Body font size",
          name: "bodyBaseSize",
          configs: {
            min: 12,
            max: 48,
            step: 1,
            unit: "px",
          },
          defaultValue: 15,
        },
        {
          type: "range",
          label: "H1 font size",
          name: "h1BaseSize",
          configs: {
            min: 48,
            max: 92,
            step: 1,
            unit: "px",
          },
          defaultValue: 60,
        },
      ],
    },
  ],
};
```

### 3. Global Style Component

Create a global style component that converts theme settings into CSS variables:

```tsx
// app/weaverse/style.tsx
import { useThemeSettings } from "@weaverse/hydrogen";

export function GlobalStyle() {
  const settings = useThemeSettings();
  
  if (!settings) {
    return null;
  }
  
  const {
    colorBackground,
    colorText,
    buttonPrimaryBg,
    bodyBaseSize,
    h1BaseSize,
    pageWidth,
    navHeightDesktop,
  } = settings;

  return (
    <style
      key="global-theme-style"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            /* Layout */
            --page-width: ${pageWidth}px;
            --height-nav: ${navHeightDesktop}rem;
            
            /* Colors */
            --color-background: ${colorBackground};
            --color-text: ${colorText};
            --btn-primary-bg: ${buttonPrimaryBg};
            
            /* Typography */
            --body-base-size: ${bodyBaseSize}px;
            --h1-base-size: ${h1BaseSize}px;
          }
        `,
      }}
    />
  );
}
```

### 4. Include Global Styles in Layout

Add the `GlobalStyle` component to your layout's `<head>` section:

```tsx
// app/root.tsx (Layout function)
import { GlobalStyle } from "./weaverse/style";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <GlobalStyle />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

## Table of Contents

- [Theme Setup](#theme-setup)
- [Global Theme Settings](#global-theme-settings)
- [Theme Schema Configuration](#theme-schema-configuration)
- [Dynamic Styling](#dynamic-styling)
- [Tailwind CSS Integration](#tailwind-css-integration)
- [Design System Patterns](#design-system-patterns)
- [Component Variants](#component-variants)
- [Responsive Design](#responsive-design)
- [Color Management](#color-management)
- [Typography System](#typography-system)
- [Spacing & Layout](#spacing--layout)
- [Best Practices](#best-practices)

## Global Theme Settings

Once your theme setup is complete, you can use theme settings throughout your components to create consistent, customizable designs.

### Using Theme Settings in Components

Access theme settings using the `useThemeSettings` hook:

```tsx
// app/components/header.tsx
import { useThemeSettings } from "@weaverse/hydrogen";

export function Header() {
  const { headerBgColor, headerText, logoWidth } = useThemeSettings();
  
  return (
    <header 
      className="w-full px-4 py-2"
      style={{ 
        backgroundColor: headerBgColor,
        color: headerText,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src="/logo.png" 
          alt="Logo"
          style={{ width: `${logoWidth}px` }}
          className="h-auto"
        />
        <nav className="space-x-6">
          {/* Navigation items */}
        </nav>
      </div>
    </header>
  );
}
```

### CSS Custom Properties Integration

Your Tailwind CSS can reference the CSS custom properties generated by your `GlobalStyle` component:

```css
/* app/styles/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-size: var(--body-base-size);
    max-width: var(--page-width);
    margin: 0 auto;
  }
  
  h1 {
    font-size: var(--h1-base-size);
    line-height: var(--heading-base-line-height);
    letter-spacing: var(--heading-base-spacing);
  }
}

@layer components {
  .btn-primary {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary:hover {
    opacity: 0.9;
  }
}
```

### Conditional Theme Settings

Theme schema supports conditional inputs that show/hide based on other settings:

```tsx
// In your theme schema
{
  type: "switch",
  label: "Enable transparent header",
  name: "enableTransparentHeader",
  defaultValue: false,
},
{
  type: "image",
  name: "transparentLogoData",
  label: "Logo for transparent header",
  // This input only appears when transparent header is enabled
  condition: (theme) => theme.enableTransparentHeader === true,
}
```

## Theme Schema Configuration

### Input Types Reference

Weaverse theme schema supports various input types for different customization needs:

```tsx
settings: [
  {
    group: "Layout & Spacing",
    inputs: [
      // Range slider
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
      
      // Select dropdown
      {
        type: "select",
        label: "Header layout",
        name: "headerLayout",
        configs: {
          options: [
            { value: "centered", label: "Centered" },
            { value: "left", label: "Left aligned" },
            { value: "split", label: "Split layout" },
          ],
        },
        defaultValue: "centered",
      },
      
      // Toggle switch
      {
        type: "switch",
        label: "Enable sticky header",
        name: "stickyHeader",
        defaultValue: true,
      },
    ],
  },
  {
    group: "Visual Design",
    inputs: [
      // Color picker
      {
        type: "color",
        label: "Primary color",
        name: "primaryColor",
        defaultValue: "#000000",
      },
      
      // Image upload
      {
        type: "image",
        label: "Logo",
        name: "logoData",
        defaultValue: {
          id: "gid://shopify/MediaImage/123",
          altText: "Logo",
          url: "https://cdn.shopify.com/logo.png",
          width: 320,
          height: 116,
        },
      },
      
      // Text input
      {
        type: "text",
        label: "Store tagline",
        name: "storeTagline",
        defaultValue: "Your amazing store",
        placeholder: "Enter tagline",
      },
      
      // Textarea
      {
        type: "textarea",
        label: "Store description",
        name: "storeDescription",
        defaultValue: "Welcome to our store...",
      },
      
      // Rich text editor
      {
        type: "richtext",
        label: "Footer content",
        name: "footerContent",
        defaultValue: "<p>© 2024 Your Store</p>",
      },
    ],
  },
]
```

### Advanced Schema Features

#### Section Headers
```tsx
{
  type: "heading",
  label: "Button Styles",
}
```

#### Help Text
```tsx
{
  type: "switch",
  label: "Enable animations",
  name: "enableAnimations",
  defaultValue: true,
  helpText: "Disable if you prefer reduced motion for accessibility.",
}
```

#### Conditional Inputs
```tsx
{
  type: "color",
  label: "Dark mode background",
  name: "darkBgColor",
  defaultValue: "#1a1a1a",
  condition: (theme) => theme.enableDarkMode === true,
}
```

## Dynamic Styling

### Responsive Theme Settings

Your theme schema can include responsive values:

```tsx
// Theme schema with responsive nav heights
{
  group: "Layout",
  inputs: [
    {
      type: "range",
      label: "Nav height (mobile)",
      name: "navHeightMobile",
      configs: { min: 2, max: 8, step: 1, unit: "rem" },
      defaultValue: 3,
    },
    {
      type: "range", 
      label: "Nav height (tablet)",
      name: "navHeightTablet",
      configs: { min: 2, max: 8, step: 1, unit: "rem" },
      defaultValue: 4,
    },
    {
      type: "range",
      label: "Nav height (desktop)", 
      name: "navHeightDesktop",
      configs: { min: 2, max: 8, step: 1, unit: "rem" },
      defaultValue: 6,
    },
  ],
}
```

Then use them in your `GlobalStyle` component with media queries:

```tsx
return (
  <style
    suppressHydrationWarning
    dangerouslySetInnerHTML={{
      __html: `
        :root {
          --height-nav: ${navHeightMobile}rem;
        }
        
        @media (min-width: 48rem) {
          :root {
            --height-nav: ${navHeightTablet}rem;
          }
        }
        
        @media (min-width: 64rem) {
          :root {
            --height-nav: ${navHeightDesktop}rem;
          }
        }
      `,
    }}
  />
);
```

### Component-Level Theme Integration

Use theme settings directly in your Weaverse components:

```tsx
// app/sections/hero-banner/index.tsx
import { useThemeSettings } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { HydrogenComponentProps } from "@weaverse/hydrogen";

interface HeroBannerProps extends HydrogenComponentProps {
  heading: string;
  showButton: boolean;
}

export default function HeroBanner(props: HeroBannerProps) {
  const { heading, showButton } = props;
  const { 
    buttonPrimaryBg, 
    buttonPrimaryColor,
    h1BaseSize,
    headingBaseSpacing 
  } = useThemeSettings();
  
  return (
    <section className="relative py-20 text-center">
      <h1 
        style={{
          fontSize: `${h1BaseSize}px`,
          letterSpacing: headingBaseSpacing,
        }}
        className="mb-6 font-bold"
      >
        {heading}
      </h1>
      
      {showButton && (
        <button
          style={{
            backgroundColor: buttonPrimaryBg,
            color: buttonPrimaryColor,
          }}
          className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Shop Now
        </button>
      )}
    </section>
  );
}

export const schema = createSchema({
  type: "hero-banner",
  title: "Hero Banner",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading", 
          label: "Heading",
          defaultValue: "Welcome to our store",
        },
        {
          type: "switch",
          name: "showButton",
          label: "Show button",
          defaultValue: true,
        },
      ],
    },
  ],
});
```

## Tailwind CSS Integration

Weaverse works seamlessly with Tailwind CSS v4, providing utility-first styling for your components.

### Basic Styling

```tsx
function ProductCard(props: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <img 
        src={props.image} 
        alt={props.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{props.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{props.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{props.price}</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Class Utilities

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from "~/utils/cn";

function Button(props: ButtonProps) {
  const { variant, size, disabled, className, ...rest } = props;
  
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        
        // Variant styles
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        variant === "secondary" && "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        variant === "outline" && "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500",
        
        // Size styles
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-12 px-6 text-lg",
        
        // State styles
        disabled && "opacity-50 cursor-not-allowed",
        
        // Additional classes
        className
      )}
      disabled={disabled}
      {...rest}
    />
  );
}
```

## Global Theme Settings

### Accessing Theme Settings

Use the `useThemeSettings` hook to access global theme configuration:

```tsx
import { useThemeSettings } from "@weaverse/hydrogen";

function Header(props: HeaderProps) {
  const themeSettings = useThemeSettings();
  
  return (
    <header 
      className="w-full"
      style={{ 
        backgroundColor: themeSettings.headerBackground,
        color: themeSettings.headerText 
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">{themeSettings.siteName}</h1>
      </div>
    </header>
  );
}
```

### Theme Setting Schema

Define global theme settings in your theme configuration:

```tsx
// app/weaverse/theme-settings.ts
export const themeSettings = {
  // Colors
  primaryColor: "#3B82F6",
  secondaryColor: "#6B7280", 
  accentColor: "#F59E0B",
  backgroundColor: "#FFFFFF",
  textColor: "#111827",
  
  // Typography
  headingFont: "Inter",
  bodyFont: "Inter",
  
  // Layout
  containerMaxWidth: "1280px",
  borderRadius: "0.5rem",
  
  // Header
  headerBackground: "#FFFFFF",
  headerText: "#111827",
  showLogo: true,
  
  // Footer
  footerBackground: "#F9FAFB",
  footerText: "#6B7280",
};
```

### Dynamic Color Variables

Create CSS custom properties for dynamic theming:

```tsx
function ThemeProvider({ children }: ThemeProviderProps) {
  const themeSettings = useThemeSettings();
  
  const cssVariables = {
    '--color-primary': themeSettings.primaryColor,
    '--color-secondary': themeSettings.secondaryColor,
    '--color-accent': themeSettings.accentColor,
    '--color-background': themeSettings.backgroundColor,
    '--color-text': themeSettings.textColor,
  };
  
  return (
    <div style={cssVariables} className="min-h-screen">
      {children}
    </div>
  );
}
```

## Design System Patterns

### Color Tokens

Define a consistent color system:

```tsx
// app/styles/design-tokens.ts
export const colors = {
  // Brand colors
  brand: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  
  // Semantic colors
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#047857',
  },
  
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
};

// Usage in components
function Alert(props: AlertProps) {
  const { type, children } = props;
  
  return (
    <div className={cn(
      "p-4 rounded-md border",
      type === "success" && "bg-green-50 border-green-200 text-green-800",
      type === "warning" && "bg-yellow-50 border-yellow-200 text-yellow-800", 
      type === "error" && "bg-red-50 border-red-200 text-red-800"
    )}>
      {children}
    </div>
  );
}
```

### Spacing Scale

Use a consistent spacing system:

```tsx
// app/styles/spacing.ts
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

// Usage
function Card(props: CardProps) {
  const { spacing = 'md' } = props;
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow border",
      spacing === 'sm' && "p-3",
      spacing === 'md' && "p-4",
      spacing === 'lg' && "p-6",
      spacing === 'xl' && "p-8"
    )}>
      {props.children}
    </div>
  );
}
```

## Component Variants

### Using Class Variance Authority (CVA)

Create robust component variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  // Base styles
  "rounded-lg border bg-white shadow-sm transition-shadow",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        outlined: "border-2 border-gray-300",
        elevated: "border-0 shadow-lg",
        minimal: "border-0 shadow-none",
      },
      size: {
        sm: "p-3",
        md: "p-4", 
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        true: "hover:shadow-md cursor-pointer",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "elevated",
        interactive: true,
        className: "hover:shadow-xl",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

function Card(props: CardProps) {
  const { variant, size, interactive, children, className, ...rest } = props;
  
  return (
    <div 
      className={cardVariants({ variant, size, interactive, className })}
      {...rest}
    >
      {children}
    </div>
  );
}
```

### Schema-Driven Variants

Integrate variants with Weaverse schemas:

```tsx
export const schema = createSchema({
  type: "styled-card",
  title: "Styled Card",
  settings: [
    {
      group: "Appearance",
      inputs: [
        {
          type: "select",
          name: "variant",
          label: "Card Style",
          defaultValue: "default",
          configs: {
            options: [
              { value: "default", label: "Default" },
              { value: "outlined", label: "Outlined" },
              { value: "elevated", label: "Elevated" },
              { value: "minimal", label: "Minimal" },
            ],
          },
        },
        {
          type: "select", 
          name: "size",
          label: "Padding",
          defaultValue: "md",
          configs: {
            options: [
              { value: "sm", label: "Small" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
              { value: "xl", label: "Extra Large" },
            ],
          },
        },
        {
          type: "toggle",
          name: "interactive",
          label: "Interactive Hover Effects",
          defaultValue: false,
        },
      ],
    },
  ],
});
```

## Responsive Design

### Mobile-First Approach

Design components with mobile-first responsive patterns:

```tsx
function ProductGrid(props: ProductGridProps) {
  const { columns } = props;
  
  return (
    <div className={cn(
      // Always start with mobile (1 column)
      "grid grid-cols-1 gap-4",
      
      // Add responsive breakpoints
      "sm:grid-cols-2",           // 2 columns on small screens
      "md:grid-cols-3",           // 3 columns on medium screens
      "lg:grid-cols-4",           // 4 columns on large screens
      
      // Dynamic columns based on prop
      columns === 2 && "lg:grid-cols-2",
      columns === 3 && "lg:grid-cols-3",
      columns === 4 && "lg:grid-cols-4",
      columns === 5 && "lg:grid-cols-5"
    )}>
      {props.children}
    </div>
  );
}
```

### Container Patterns

Create responsive container components:

```tsx
function Container(props: ContainerProps) {
  const { size = "default", className, children } = props;
  
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      size === "sm" && "max-w-3xl",
      size === "default" && "max-w-7xl", 
      size === "lg" && "max-w-full",
      className
    )}>
      {children}
    </div>
  );
}
```

### Responsive Text

Implement responsive typography:

```tsx
function ResponsiveHeading(props: ResponsiveHeadingProps) {
  const { level = 1, children } = props;
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag className={cn(
      "font-bold text-gray-900",
      level === 1 && "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
      level === 2 && "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
      level === 3 && "text-lg sm:text-xl md:text-2xl lg:text-3xl",
      level === 4 && "text-base sm:text-lg md:text-xl",
      level === 5 && "text-sm sm:text-base md:text-lg",
      level === 6 && "text-xs sm:text-sm md:text-base"
    )}>
      {children}
    </HeadingTag>
  );
}
```

## Color Management

### Theme Color Integration

Create color inputs that work with your design system:

```tsx
function ColoredSection(props: ColoredSectionProps) {
  const { backgroundColor, textColor, children } = props;
  
  return (
    <section 
      className="py-12"
      style={{ 
        backgroundColor: backgroundColor || 'transparent',
        color: textColor || 'inherit' 
      }}
    >
      {children}
    </section>
  );
}

export const schema = createSchema({
  type: "colored-section",
  title: "Colored Section",
  settings: [
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color", 
          name: "textColor",
          label: "Text Color",
          defaultValue: "#111827",
        },
      ],
    },
  ],
});
```

### CSS Custom Properties

Use CSS variables for dynamic theming:

```tsx
function ThemeSection(props: ThemeSectionProps) {
  const { primaryColor, secondaryColor, children } = props;
  
  const styles = {
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
  } as React.CSSProperties;
  
  return (
    <section style={styles} className="themed-section">
      {children}
    </section>
  );
}

// CSS
.themed-section {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
}
```

## Typography System

### Font Management

Implement consistent typography:

```tsx
function TypographyProvider({ children }: TypographyProviderProps) {
  const themeSettings = useThemeSettings();
  
  return (
    <div 
      className="typography-provider"
      style={{
        '--font-heading': themeSettings.headingFont,
        '--font-body': themeSettings.bodyFont,
      }}
    >
      {children}
    </div>
  );
}

// Typography component
function Typography(props: TypographyProps) {
  const { variant, children, className } = props;
  
  const Component = variant === 'heading' ? 'h2' : 'p';
  
  return (
    <Component className={cn(
      variant === 'heading' && "font-heading font-bold text-2xl md:text-3xl",
      variant === 'body' && "font-body text-base leading-relaxed",
      variant === 'caption' && "font-body text-sm text-gray-600",
      className
    )}>
      {children}
    </Component>
  );
}
```

### Text Scale System

Create a consistent text scale:

```tsx
const textSizes = {
  xs: 'text-xs',     // 12px
  sm: 'text-sm',     // 14px
  base: 'text-base', // 16px
  lg: 'text-lg',     // 18px
  xl: 'text-xl',     // 20px
  '2xl': 'text-2xl', // 24px
  '3xl': 'text-3xl', // 30px
  '4xl': 'text-4xl', // 36px
};

function ScalableText(props: ScalableTextProps) {
  const { size = 'base', weight = 'normal', children } = props;
  
  return (
    <span className={cn(
      textSizes[size],
      weight === 'light' && 'font-light',
      weight === 'normal' && 'font-normal', 
      weight === 'medium' && 'font-medium',
      weight === 'semibold' && 'font-semibold',
      weight === 'bold' && 'font-bold'
    )}>
      {children}
    </span>
  );
}
```

## Spacing & Layout

### Layout Components

Create reusable layout components:

```tsx
function Stack(props: StackProps) {
  const { direction = 'vertical', spacing = 'md', align, children } = props;
  
  return (
    <div className={cn(
      "flex",
      direction === 'vertical' && "flex-col",
      direction === 'horizontal' && "flex-row",
      
      // Spacing
      direction === 'vertical' && spacing === 'sm' && "space-y-2",
      direction === 'vertical' && spacing === 'md' && "space-y-4",
      direction === 'vertical' && spacing === 'lg' && "space-y-6",
      direction === 'horizontal' && spacing === 'sm' && "space-x-2",
      direction === 'horizontal' && spacing === 'md' && "space-x-4", 
      direction === 'horizontal' && spacing === 'lg' && "space-x-6",
      
      // Alignment
      align === 'start' && "items-start",
      align === 'center' && "items-center",
      align === 'end' && "items-end"
    )}>
      {children}
    </div>
  );
}

function Grid(props: GridProps) {
  const { columns = 1, gap = 'md', children } = props;
  
  return (
    <div className={cn(
      "grid",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-2", 
      columns === 3 && "grid-cols-3",
      columns === 4 && "grid-cols-4",
      gap === 'sm' && "gap-2",
      gap === 'md' && "gap-4",
      gap === 'lg' && "gap-6"
    )}>
      {children}
    </div>
  );
}
```

## Best Practices

### 1. Design Tokens

Use consistent design tokens throughout your theme:

```tsx
// app/styles/tokens.ts
export const designTokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem', 
    lg: '1.5rem',
    xl: '2rem',
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
};
```

### 2. Component Composition

Build complex components from simpler ones:

```tsx
function ProductCard(props: ProductCardProps) {
  return (
    <Card variant="elevated" interactive>
      <Card.Image src={props.image} alt={props.title} />
      <Card.Content>
        <Stack spacing="sm">
          <Typography variant="heading">{props.title}</Typography>
          <Typography variant="body">{props.description}</Typography>
          <Button variant="primary">Add to Cart</Button>
        </Stack>
      </Card.Content>
    </Card>
  );
}
```

### 3. Style Isolation

Keep component styles isolated and predictable:

```tsx
// ✅ Good: Isolated styles
function Modal(props: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="modal-content bg-white rounded-lg p-6">
        {props.children}
      </div>
    </div>
  );
}

// ❌ Bad: Global style pollution
function Modal(props: ModalProps) {
  return (
    <div className="overlay">  {/* Too generic */}
      <div className="content"> {/* Could conflict */}
        {props.children}
      </div>
    </div>
  );
}
```

### 4. Performance Optimization

Optimize styles for performance:

```tsx
// ✅ Good: Static classes when possible
const baseClasses = "flex items-center justify-center rounded-md font-medium";

function Button(props: ButtonProps) {
  return (
    <button 
      className={cn(baseClasses, props.variant === 'primary' && 'bg-blue-600')}
    >
      {props.children}
    </button>
  );
}

// ❌ Avoid: Complex dynamic class generation
function Button(props: ButtonProps) {
  const classes = useMemo(() => {
    // Complex computation on every render
    return generateComplexClasses(props);
  }, [props]);
  
  return <button className={classes}>{props.children}</button>;
}
```

## Next Steps

- Explore [Component Schemas](/docs/development-guide/component-schema)
- Learn about [Input Settings](/docs/development-guide/input-settings)
- Master [Component Schemas](/docs/development-guide/component-schema)  
- Review [Example Components](/docs/resources/example-components)

For design inspiration and patterns, join our [Slack community](https://wvse.cc/weaverse-slack) to see what other developers are building.