---
title: Localization
description: Explore how Weaverse empowers you to create a multilingual storefront with ease.
publishedAt: November 20, 2023
updatedAt: January 17, 2024
order: 12
published: false
---

**Weaverse** is designed to provide a seamless multilingual storefront experience,
leveraging [Shopify Markets](https://help.shopify.com/en/manual/markets)
and [Hydrogen's Internationalization](https://shopify.dev/docs/custom-storefronts/hydrogen/markets) features. This
enables you to cater to a global audience by offering your storefront in multiple languages.

## Default Locale

The default locale for your Weaverse store is configured in
the [`server.ts`](https://github.com/Weaverse/pilot/blob/main/server.ts) file. This setting is crucial, especially when
your store does not support multiple languages. It ensures that your storefront always defaults to a specific language
and country.

```tsx
const { storefront } = createStorefrontClient({
  // Other configurations...
  i18n: { language: 'EN', country: 'CA' },
  // More configurations...
})
```

## Multilingual with URL Paths

Weaverse currently supports multilingual storefronts using URL paths. For example, you can have URLs
like `example.com/en-ca` for **English** in **Canada**. The URL paths method offers a straightforward advantage: you can
set it up directly within the app without the need for configuring complex domain infrastructure.

#### Detecting Locale from Requests

To determine the user's preferred locale, Weaverse uses
the [`getLocaleFromRequest`](https://github.com/Weaverse/pilot/blob/main/app/lib/utils.ts#L282) utility. This ensures
that the storefront is displayed in the most relevant language based on the user's request.

```tsx
// <root>/app/lib/utils.ts

import { countries } from '~/data/countries'

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url)
  const firstPathPart = '/' + url.pathname.substring(1).split('/')[0].toLowerCase()

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      }
}
```

#### Customizing Supported Countries

The list of countries supported by your store can be customized to match the specific needs of your merchants. This list
is defined in a [`countries.ts`](https://github.com/Weaverse/pilot/blob/main/app/data/countries.ts) file. Developers
have the flexibility to update this list according to the merchant's requirements.

#### Integrating Supported Countries

For the changes to take effect, you need to pass the list of supported countries as an argument to the `WeaverseClient`.
This is done in
the [`weaverse/create-weaverse.server.ts`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/create-weaverse.server.ts#L15)
file:

```tsx
// <root>/app/weaverse/create-weaverse.server.ts

import { Storefront } from '@shopify/hydrogen'
import { I18nLocale, WeaverseClient } from '@weaverse/hydrogen'
import { countries } from '~/data/countries'

type CreateWeaverseArgs = {
  storefront: Storefront<I18nLocale>
  request: Request
  env: Env
  cache: Cache
  waitUntil: ExecutionContext['waitUntil']
}

export function createWeaverseClient(args: CreateWeaverseArgs) {
  return new WeaverseClient({
    ...args,
    countries,
    themeSchema,
    components,
  })
}
```

This step allows merchants to select the country they want to preview, update, or create page data and content within \*
\*Weaverse Studio\*\*:

<img alt="localization" src="https://downloads.intercomcdn.com/i/o/864542510/3c5654419d7600127cdb7957/image.png" width="300"/>

## Multi-Page Support (Under Construction 🚧)

Weaverse is continually evolving to provide even more multilingual capabilities. Shortly, merchants will be able to
create multiple pages tailored to each selected locale. This feature will further enhance the localization and
accessibility of your Weaverse Hydrogen storefront.

Stay tuned for these exciting enhancements as Weaverse continues to grow and support your internationalization needs.
