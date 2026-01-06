# Migration Guide: v5.8.4 Breaking Changes

This guide helps you migrate from v5.8.3 to v5.8.4, which includes significant architectural changes to the Weaverse SDKs.

## Overview of Breaking Changes

- ✅ **Removed** `@weaverse/shopify` package (archived)
- ✅ **Removed** Stitches CSS-in-JS library
- ✅ **Removed** `platformType` property from core architecture
- ✅ **Simplified** styling system to use className-based approach
- ✅ **Updated** TypeScript configuration for better path resolution

---

## 1. @weaverse/shopify Package Removal

### What Changed
The `@weaverse/shopify` package has been archived and is no longer maintained. All files have been moved to `archived/shopify/` for reference.

### Migration
Replace `@weaverse/shopify` imports with `@weaverse/hydrogen`:

```typescript
// ❌ Before (removed)
import { WeaverseShopify } from '@weaverse/shopify'

// ✅ After
import { WeaverseHydrogen } from '@weaverse/hydrogen'
```

### Key Differences
- `@weaverse/hydrogen` is the modern, maintained package
- Built on React Router v7
- Better TypeScript support
- Regular updates and bug fixes

---

## 2. Stitches CSS-in-JS Removal

### What Changed
The Stitches CSS-in-JS library has been completely removed from the Weaverse SDKs. This means:

- No more automatic CSS class generation
- No more dynamic inline styles
- Components now rely purely on className-based styling
- `WeaverseCSSProperties` now maps to React's `CSSProperties`

### Migration Steps

#### Step 1: Remove Stitches Dependencies
```bash
# Remove from package.json
npm uninstall @stitches/core
```

#### Step 2: Update Component Styling

**Before (Stitches-based):**
```typescript
// Components automatically generated CSS classes
const MyComponent = ({ data }) => {
  return <div>Weaverse handled styling automatically</div>
}
```

**After (className-based):**
```typescript
// Components now use CSS classes
import styles from './MyComponent.module.css'

const MyComponent = ({ data }) => {
  return <div className={styles.container}>Use CSS modules</div>
}
```

#### Step 3: Migrate Dynamic Styles

**Before (automatic inline styles):**
```typescript
// Weaverse automatically applied styles
const element = {
  data: {
    css: {
      backgroundColor: 'red',
      padding: '10px'
    }
  }
}
```

**After (manual styling):**
```typescript
// Option 1: CSS Modules with dynamic classes
import styles from './element.module.css'

const getElementClassName = (css) => {
  return styles[css.variant] || styles.default
}

// Option 2: CSS-in-JS library (styled-components, emotion)
import styled from 'styled-components'

const StyledElement = styled.div`
  background-color: ${(props) => props.backgroundColor || 'red'};
  padding: ${(props) => props.padding || '10px'};
`
```

#### Step 4: Update Type Definitions

**Before:**
```typescript
import type { WeaverseCSSProperties } from '@weaverse/core'
// WeaverseCSSProperties had Stitches-specific properties
```

**After:**
```typescript
import type { CSSProperties } from 'react'
// Use React's built-in CSSProperties type
const styles: CSSProperties = {
  backgroundColor: 'red',
  padding: '10px'
}
```

---

## 3. platformType Property Removal

### What Changed
The `platformType` property has been removed from:
- `WeaverseCoreParams`
- `Weaverse` class
- `WeaverseHydrogen` class

### Migration
Simply remove any `platformType` assignments:

```typescript
// ❌ Before
const weaverse = new Weaverse({
  platformType: 'shopify-hydrogen', // Removed
  projectId: 'abc123',
  data: projectData
})

class MyHydrogen extends WeaverseHydrogen {
  platformType: 'shopify-hydrogen' = 'shopify-hydrogen' // Removed
}

// ✅ After
const weaverse = new Weaverse({
  projectId: 'abc123',
  data: projectData
  // platformType no longer needed
})

class MyHydrogen extends WeaverseHydrogen {
  // platformType property removed
}
```

### Why This Changed
The platform-specific logic was simplified since all platforms now use the same rendering approach without platform-specific styling behavior.

---

## 4. Responsive Styling Impact

### What Changed
With Stitches removal, automatic responsive styling (`@mobile`, `@tablet`) is no longer available through the Weaverse SDK.

### Migration Options

#### Option 1: CSS Media Queries (Recommended)
```css
/* MyComponent.module.css */
.container {
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
```

#### Option 2: CSS-in-JS Libraries
```typescript
import styled from 'styled-components'

const ResponsiveContainer = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`
```

#### Option 3: CSS Custom Properties
```css
.container {
  --padding: 20px;
  padding: var(--padding);
}

@media (max-width: 768px) {
  .container {
    --padding: 10px;
  }
}
```

---

## 5. TypeScript Configuration Changes

### What Changed
- Root `tsconfig.json` changed `moduleResolution` from `"bundler"` to `"node"`
- Added `typecheck` scripts to individual packages
- Added `include`/`exclude` patterns to package tsconfig files

### Migration
Update your project's TypeScript configuration if you extend from the Weaverse SDKs:

```json
// Your project's tsconfig.json
{
  "extends": "./node_modules/@weaverse/core/tsconfig.json",
  "compilerOptions": {
    "moduleResolution": "node", // Changed from bundler
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"], // Added include pattern
  "exclude": ["dist", "node_modules"] // Added exclude pattern
}
```

---

## 6. Component Development Updates

### New Styling Patterns

#### CSS Modules Pattern (Recommended)
```typescript
// Button/index.tsx
import styles from './Button.module.css'

export const Button = ({ children, variant = 'primary' }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  )
}
```

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
}

.primary {
  background-color: #007bff;
  color: white;
}

.secondary {
  background-color: #6c757d;
  color: white;
}
```

#### Styled Components Pattern
```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;

  background-color: ${({ variant = 'primary' }) =>
    variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
`

export { Button }
```

#### Emotion Pattern
```typescript
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const buttonStyles = (variant = 'primary') => css`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  background-color: ${variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
`

export const Button = ({ children, variant = 'primary', ...props }) => (
  <button css={buttonStyles(variant)} {...props}>
    {children}
  </button>
)
```

---

## 7. Common Migration Scenarios

### Scenario 1: Migrating an Existing Component

**Before:**
```typescript
export const HeroSection = ({ data }) => {
  // Weaverse automatically handled styling
  return (
    <section>
      <h1>{data.heading}</h1>
      <p>{data.subheading}</p>
    </section>
  )
}
```

**After:**
```typescript
import styles from './HeroSection.module.css'

export const HeroSection = ({ data }) => {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heading}>{data.heading}</h1>
      <p className={styles.subheading}>{data.subheading}</p>
    </section>
  )
}
```

### Scenario 2: Dynamic Theme Support

**Before:**
```typescript
// Stitches automatically handled theme
const themedComponent = stitchesInstance.css({
  backgroundColor: '$primaryColor',
  color: '$textColor'
})
```

**After:**
```typescript
// Option 1: CSS Variables
const styles = css`
  .component {
    background-color: var(--primary-color);
    color: var(--text-color);
  }
`

// Option 2: Theme Provider
import { useTheme } from './ThemeContext'

const ThemedComponent = ({ children }) => {
  const theme = useTheme()
  const style = {
    backgroundColor: theme.primaryColor,
    color: theme.textColor
  }

  return <div style={style}>{children}</div>
}
```

---

## 8. Testing Your Migration

### Migration Checklist

- [ ] Remove all `@stitches/core` imports
- [ ] Replace Weaverse automatic styling with CSS classes
- [ ] Remove all `platformType` properties
- [ ] Update TypeScript configuration
- [ ] Test responsive designs work correctly
- [ ] Verify dynamic styling still functions
- [ ] Check that all component styles load
- [ ] Run existing tests and fix any failures

### Common Issues and Solutions

**Issue:** Missing CSS classes
```typescript
// Check that you're importing CSS modules
import styles from './Component.module.css' // ✅
// import './Component.css' // ❌
```

**Issue:** TypeScript errors
```typescript
// Update type imports
import type { CSSProperties } from 'react' // ✅
// import type { WeaverseCSSProperties } from '@weaverse/core' // ❌
```

**Issue:** Build failures
```bash
# Clear build cache
rm -rf dist node_modules/.cache
npm run build
```

---

## 9. Getting Help

### Resources
- **GitHub Issues**: Report migration problems at [Weaverse Issues](https://github.com/Weaverse/weaverse/issues)
- **Discord Community**: Get help from other developers
- **Documentation**: Check updated [Weaverse Documentation](https://docs.weaverse.io)

### Support for Legacy Code
If you need to maintain compatibility with old Stitches-based code:

1. **Gradual Migration**: Migrate components one at a time
2. **Wrapper Components**: Create compatibility layers
3. **Feature Flags**: Use feature flags to switch between old and new implementations

---

## Summary

These changes simplify the Weaverse SDK architecture and provide better developer experience:

- ✅ **Cleaner API**: No more platform-specific logic
- ✅ **Better TypeScript**: Improved type safety and resolution
- ✅ **Standard Tools**: Use familiar CSS and React patterns
- ✅ **Future-Proof**: Easier to maintain and extend

While these are breaking changes, the migration path is straightforward and results in more maintainable code. Take advantage of this opportunity to improve your component styling architecture!

---

**Version:** v5.8.4
**Last Updated:** 2025-01-02
**Compatible With:** React 18+, TypeScript 5.0+