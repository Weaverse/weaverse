# @weaverse/i18n

Essential i18n utilities for Weaverse Hydrogen themes, featuring waterfall fallback support (Remote API → Local File → Bundled Resources) and legacy theme settings compatibility.

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
  supportedLngs: ['en', 'vi', 'fr'],
  fallbackLng: 'en',
  defaultNS: 'common',

  // 1. Remote Weaverse API (Highest Priority)
  apiUrl: 'https://weaverse.io/api/public/locales/{{lng}}/{{ns}}.json?projectId=...',

  // 2. Local/CDN Fallback (Second Priority)
  localUrl: 'https://cdn.shopify.com/s/files/.../locales/{{lng}}/{{ns}}.json',

  // 3. Bundled Fallback (Lowest Priority)
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
  // Returns { locale, resources } — fully serializable
  const i18nData = await i18nServer.getI18nData(request)

  return {
    i18nData,
    // ... other data
  }
}
```

### 3. Provider Setup

Wrap your app with `WeaverseI18nProvider`, passing the serialized `data` from the loader. The provider automatically creates a client-side i18next instance.

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
import { useWeaverseT } from '@weaverse/i18n'

export function Header() {
  const { t } = useWeaverseT('common')
  return <header>{t('nav.home')}</header>
}
```

#### Legacy Theme Settings Support

Use `useLegacyT` to migrate themes with hardcoded text in settings. It prioritizes the setting value if non-empty, falling back to i18n.

```tsx
import { useLegacyT } from '@weaverse/i18n'

export function Hero({ heading }: { heading?: string }) {
  const { tOrSetting } = useLegacyT('hero')

  // "Summer Sale" → renders "Summer Sale"
  // empty/undefined → renders t("heading") from i18n
  return <h1>{tOrSetting('heading', heading)}</h1>
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
| `getI18nData(request)` | `Promise<WeaverseI18nData>` | Serializable `{ locale, resources }` for client hydration |
| `createInstance(request)` | `Promise<i18n>` | Full i18next instance (server-only, not serializable) |
| `getFixedT(request, ns?)` | `Promise<TFunction>` | Translation function for server-side rendering |

### Client (`@weaverse/i18n`)

| Export | Purpose |
| --- | --- |
| `WeaverseI18nProvider` | Provider accepting `data` (serializable) or `i18n` (instance) |
| `useWeaverseT(ns?)` | Wrapper for `useTranslation` |
| `useLegacyT(ns?)` | Returns `{ tOrSetting }` for backward compatibility |
| `usePrefixPath()` | Returns function to prefix paths with current locale |

## License

MIT
