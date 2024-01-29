---
title: Content Security Policy
description: Content Security Policy in Weaverse, how it is automatically configured, and the ability to customize policies for your unique needs
publishedAt: November 20, 2023
updatedAt: January 17, 2024
order: 9
published: true
---

## Understanding Content Security Policy

Content Security Policy (CSP) is a vital security feature implemented by modern web browsers. It defines and enforces a
set of content restrictions for web pages. Essentially, CSP acts as a protective barrier, allowing you to specify which
external resources and scripts your web page can load and execute.

## Weaverse's Automatic CSP Setup

In Weaverse, the implementation of CSP is handled automatically using the **`createContentSecurityPolicy`** utility from
the `@shopify/hydrogen` package within
the [`entry.server.jsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.server.tsx) file:

```tsx
import { RemixServer } from '@remix-run/react'
import { createContentSecurityPolicy } from '@shopify/hydrogen'
import type { EntryContext } from '@shopify/remix-oxygen'
import { getWeaverseCsp } from '~/weaverse/create-weaverse.server'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy(getWeaverseCsp(request))
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      // ...
    },
  )

  responseHeaders.set('Content-Security-Policy', header)
  // ...
}
```

## Customizing CSP Policies

The default CSP policies used by Weaverse are returned from
the [`getWeaverseCsp`](https://github.com/Weaverse/pilot/blob/main/app/weaverse/create-weaverse.server.ts#L24) function.
These policies include directives that allow the loading of Weaverse resources and enable seamless operation within \*
\*Weaverse Studio\*\*.

```tsx
// <root>/app/weaverse/create-weaverse.server.ts

/**
 * Generate default CSP for Weaverse.
 * Change the return directives to match your needs.
 *
 * @param request
 * @returns CSP policies
 */
export function getWeaverseCsp(request: Request) {
  let url = new URL(request.url)
  let weaverseHost = url.searchParams.get('weaverseHost')
  let weaverseHosts = ['https://*.weaverse.io']
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost)
  }
  return {
    frameAncestors: weaverseHosts,
    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://*.youtube.com',
      'https://fonts.gstatic.com',
      ...weaverseHosts,
    ],
    imgSrc: ["'self'", 'data:', 'https://cdn.shopify.com', ...weaverseHosts],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.shopify.com', ...weaverseHosts],
  }
}
```

If your development scenario requires customization, you can easily tailor the CSP policies to your specific needs. To
do this, update the **`getWeaverseCsp`** function to return custom directive values. You can refer to resources
like [content-security-policy.com](https://content-security-policy.com/) for guidance on defining your custom CSP
directives.
