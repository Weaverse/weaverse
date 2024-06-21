---
title: Content Security Policy
description: Content Security Policy in Weaverse, how it is automatically configured, and the ability to customize policies for your unique needs
publishedAt: November 20, 2023
updatedAt: Jun 7, 2024
order: 10
published: true
---

### Content Security Policy (CSP) Overview

**Content Security Policy (CSP)** is a security measure used by web browsers to protect your website by specifying which external resources are allowed to load. CSP serves as a safeguard, letting you define approved sources for scripts, stylesheets, and other content.

### Automatic CSP Configuration in Weaverse

Weaverse automatically configures CSP for your projects using the `createContentSecurityPolicy` utility from the `@shopify/hydrogen` package. This is integrated within your project's [`entry.server.jsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.server.tsx) file. Here's a typical implementation:

```tsx
import { RemixServer } from '@remix-run/react'
import { createContentSecurityPolicy } from '@shopify/hydrogen'
import type { AppLoadContext, EntryContext } from '@shopify/remix-oxygen'
import { getWeaverseCsp } from '~/weaverse/create-weaverse.server'
import { isbot } from 'isbot'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    ...getWeaverseCsp(request, context),
    shop: {
      checkoutDomain:
        context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  })
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error)
        responseStatusCode = 500
      },
    },
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')
  responseHeaders.set('Content-Security-Policy', header)
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
```

### Customizing Your CSP

Weaverse uses default CSP policies that are suitable for most needs, defined in the `getWeaverseCsp` function. These policies ensure that all Weaverse resources load correctly and that the system operates smoothly within Weaverse Studio.

```tsx
// <root>/app/weaverse/create-weaverse.server.ts

/**
 * Generates default CSP for Weaverse.
 * Modify the return directives based on your requirements.
 *
 * @param request
 * @param context
 * @returns CSP policies
 */
export function getWeaverseCsp(request: Request, context: AppLoadContext) {
  let url = new URL(request.url)
  let weaverseHost =
    url.searchParams.get('weaverseHost') || context.env.WEAVERSE_HOST
  let isDesignMode = url.searchParams.get('weaverseHost')
  let weaverseHosts = ['*.weaverse.io', '*.shopify.com', '*.myshopify.com']
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost)
  }
  let updatedCsp: {
    [x: string]: string[] | string | boolean
  } = {
    defaultSrc: [
      'data:',
      '*.youtube.com',
      '*.google.com',
      '*.google-analytics.com',
      '*.googletagmanager.com',
      ...weaverseHosts,
    ],
    connectSrc: ['vimeo.com', '*.google-analytics.com', ...weaverseHosts],
  }
  if (isDesignMode) {
    updatedCsp.frameAncestors = ['*']
  }
  return updatedCsp
}
```

#### Common Customizations

If you need to customize CSP for specific requirements, such as loading external scripts or enabling additional integrations, update the `getWeaverseCsp` function with the appropriate sources. For example, to allow scripts from additional external domains, you might modify the `scriptSrc` directive:

```tsx
scriptSrc: [
  'cdn.example.com',
  'www.googletagmanager.com',
  '*.clarity.ms',
  ...weaverseHosts,
]
```

For detailed guidance on CSP directive values, visit [content-security-policy.com](https://content-security-policy.com/).

### Conclusion

CSP is a critical security feature that helps protect your website by controlling the sources of content. Weaverse provides automatic CSP configuration, but you can customize it to fit your specific needs. Properly managing CSP can enhance the security and functionality of your Weaverse Hydrogen theme.
