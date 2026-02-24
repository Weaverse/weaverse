# @weaverse/i18n

Essential i18n utilities for Weaverse Hydrogen themes, featuring waterfall fallback support (Remote API → Local File → Bundled Resources) with built-in server-side caching.

## Installation

```bash
npm install @weaverse/i18n i18next react-i18next i18next-http-backend
# or
bun add @weaverse/i18n i18next react-i18next i18next-http-backend
```

## Setup Guide

### 1. Server-Side Configuration

Initialize the `WeaverseI18nServer` in your server entry point (e.g., `app/lib/i18n.server.ts`).

```typescript
// app/lib/i18n.server.ts
import { WeaverseI18nServer } from '@weaverse/i18n/server'

export const i18nServer = new WeaverseI18nServer({
  projectId: '...',
  supportedLngs: ['en', 'vi', 'fr'],
  fallbackLng: 'en',
  defaultNS: 'common',

  // Optional: Cache TTL in ms (default: 5 minutes). Set to 0 to disable.
  cacheTTL: 5 * 60 * 1000,

  // Optional: Custom API URL (default: Weaverse API)
  apiUrl: 'https://weaverse.io/api/translation/static?projectId=...&lng={{lng}}&ns={{ns}}',

  // Optional: Local/CDN fallback
  localUrl: 'https://cdn.shopify.com/s/files/.../locales/{{lng}}/{{ns}}.json',

  // Optional: Bundled fallback (lowest priority)
  bundledResources: {
    en: {
      common: {
        welcome: 'Welcome to our store',
      },
    },
  },
})
```

### 2. Root Loader Integration

In your root loader, use `getI18nData()` to return **serializable** i18n state.

> ⚠️ Do NOT pass the i18next instance directly — it cannot survive JSON serialization across the server → client boundary.

```typescript
// app/.server/root.ts (or app/root.tsx loader)
import { i18nServer } from '~/lib/i18n.server'

export async function loader({ request }: LoaderFunctionArgs) {
  // Returns { locale, resources, supportedLngs, fallbackLng } — fully serializable
  const i18nData = await i18nServer.getI18nData(request)

  return {
    i18nData,
    // ... other data
  }
}
```

### 3. Provider Setup

Wrap your app with `WeaverseI18nProvider`, passing the serialized `data` from the loader. The provider automatically creates a client-side i18next instance with the correct `supportedLngs` and `fallbackLng`.

```tsx
// app/root.tsx
import { useLoaderData, Outlet } from '@remix-run/react'
import { WeaverseI18nProvider } from '@weaverse/i18n'

export default function App() {
  const { i18nData } = useLoaderData<typeof loader>()

  return (
    <html lang={i18nData.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>
        <WeaverseI18nProvider data={i18nData}>
          <Outlet />
        </WeaverseI18nProvider>
      </body>
    </html>
  )
}
```

### 4. Usage in Components

#### Basic Translation

```tsx
import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation('common')
  return <header>{t('nav.home')}</header>
}
```

#### Locale-Aware Routing

```tsx
import { usePrefixPath } from '@weaverse/i18n'

export function Navigation() {
  const prefixPath = usePrefixPath()

  // locale "vi" → "/vi/cart"
  // locale "en" (default) → "/cart"
  return <a href={prefixPath('/cart')}>Cart</a>
}
```

## API Reference

### Server (`@weaverse/i18n/server`)

| Method | Returns | Description |
| --- | --- | --- |
| `getLocale(request)` | `string` | Detect locale from URL → Cookie → Accept-Language → fallback |
| `getI18nData(request)` | `Promise<WeaverseI18nData>` | Serializable `{ locale, resources, supportedLngs, fallbackLng }` for client hydration (cached per locale/namespace) |
| `createInstance(request)` | `Promise<i18n>` | Full i18next instance (server-only, not serializable) |
| `getFixedT(request, ns?)` | `Promise<TFunction>` | Translation function for server-side rendering |

### Client (`@weaverse/i18n`)

| Export | Purpose |
| --- | --- |
| `WeaverseI18nProvider` | Provider accepting serializable `data` from the server loader |
| `useWeaverseT(ns?)` | *(Deprecated)* Wrapper for `useTranslation` — use `useTranslation` from `react-i18next` directly |
| `usePrefixPath()` | Returns memoized function to prefix paths with current locale (skips default locale) |

## License

MIT
