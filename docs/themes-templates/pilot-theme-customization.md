---
title: How to Change the Font in Your Weaverse Theme
description: Learn how to update, extend, or customize fonts in your Weaverse Hydrogen storefront using Fontsource, Google Fonts, or custom uploads.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 3
published: true
---

# How to Change the Font in Your Weaverse Theme

Weaverse themes use modern font loading techniques for performance and flexibility. The default Pilot theme uses [fontsource](https://fontsource.org/) for Google Fonts, but you can use any web font provider or upload custom fonts. This guide covers all approaches with practical examples.

## 1. Using Fontsource (Recommended)

Fontsource provides npm packages for hundreds of Google Fonts and more, including support for variable fonts.

### a. Install the Fontsource Package
To use a specific font (e.g., Inter or a variable font like Nunito Sans):
```sh
npm install @fontsource/inter
# or for variable fonts
npm install @fontsource-variable/nunito-sans
```
Find the package for your font at [fontsource.org](https://fontsource.org/).

### b. Import Font Files in root.tsx
Reference your code (Pilot theme):
```tsx
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
```
Or for variable fonts (Naturelle theme example):
```tsx
import "@fontsource-variable/cormorant";
import "@fontsource-variable/nunito-sans";
```

### c. Update Tailwind's fontFamily Configuration
To ensure Tailwind's `font-sans` and related utilities use your new font, update the `fontFamily` in your `tailwind.config.js`.

**Example (Pilot theme):**
```js
fontFamily: {
  sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  serif: ["Arial", '"IBMPlexSerif"', "Palatino", "ui-serif"],
},
```
For a variable font:
```js
fontFamily: {
  sans: ["Nunito Sans Variable", "ui-sans-serif", "system-ui", "sans-serif"],
},
```
**Tip:** The first value should match the font-family name used by the font provider or your `@font-face` declaration.

### d. Update CSS Variables or Classes (if needed)
If you use global CSS instead of Tailwind utilities, set your font in global styles:
```css
body {
  font-family: 'Inter', sans-serif;
}
```
Or for variable fonts:
```css
body {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-variation-settings: "wght" 400;
}
```

## 2. Using Google Fonts CDN

For a quick setup, add a `<link>` in your `<head>`:
```tsx
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet" />
```
Then update your CSS or Tailwind config:
```css
body {
  font-family: 'Roboto', sans-serif;
}
```
And in `tailwind.config.js`:
```js
fontFamily: {
  sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
},
```

> **CSP Reminder:**
> If you load fonts from an external CDN (such as Google Fonts), make sure to update your Content Security Policy (CSP) to allow the font and stylesheet sources. See the [CSP guide](/docs/guides/csp.md) for details and examples.

## 3. Uploading a Custom Font

### a. Add Font Files to the Public Folder
Place `.woff2`, `.woff`, or `.ttf` files in `public/fonts/`.

### b. Declare @font-face in CSS
```css
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/MyCustomFont.woff2') format('woff2'),
       url('/fonts/MyCustomFont.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
body {
  font-family: 'MyCustomFont', sans-serif;
}
```

### c. Update Tailwind's fontFamily
In your `tailwind.config.js`:
```js
fontFamily: {
  sans: ["MyCustomFont", "ui-sans-serif", "system-ui", "sans-serif"],
},
```

## 4. Switching Fonts Dynamically (Optional)

To let merchants select fonts in Weaverse Studio:
- Add a font selector input in your theme schema (see `schema.server.ts`).
- Use the selected value to set the font-family dynamically in your global styles or inject it into your Tailwind config.

## 5. Best Practices
- Only load the weights/styles you use.
- Use `font-display: swap` for performance.
- Prefer `.woff2` for custom fonts.
- Test on all devices and browsers.
- Respect font licensing for custom fonts.

## 6. Example: Changing to Inter Using Fontsource
```tsx
// 1. Install: npm install @fontsource/inter
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

// 2. Update tailwind.config.js:
fontFamily: {
  sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
},

// 3. In your CSS (if needed):
body {
  font-family: 'Inter', sans-serif;
}
```

## 7. Example: Using a Variable Font
```tsx
// 1. Install: npm install @fontsource-variable/nunito-sans
import "@fontsource-variable/nunito-sans";

// 2. Update tailwind.config.js:
fontFamily: {
  sans: ["Nunito Sans Variable", "ui-sans-serif", "system-ui", "sans-serif"],
},

// 3. In your CSS (if needed):
body {
  font-family: 'Nunito Sans Variable', sans-serif;
  font-variation-settings: "wght" 400;
}
```

## 8. Further Reading
- [Fontsource Documentation](https://fontsource.org/docs/introduction)
- [Google Fonts](https://fonts.google.com/)
- [MDN: @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
