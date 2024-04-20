---
title: Content Security Policy
description: Content Security Policy in Weaverse, how it is automatically configured, and the ability to customize policies for your unique needs
publishedAt: November 20, 2023
updatedAt: April 16, 2024
order: 9
published: true
---


### Content Security Policy (CSP) Overview

**Content Security Policy (CSP)** is a security measure used by web browsers to help safeguard your websites by specifying which external resources are allowed to load. Essentially, CSP serves as a safeguard, letting you define approved sources for scripts, stylesheets, and other content.

### Automatic CSP Configuration in Weaverse

Weaverse automatically sets up CSP for your projects using the `createContentSecurityPolicy` utility from the `@shopify/hydrogen` package. This is integrated within your project's [`entry.server.jsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.server.tsx) file. Here's how it's typically implemented:

```tsx
import { RemixServer } from '@remix-run/react';
import { createContentSecurityPolicy } from '@shopify/hydrogen';
import type { EntryContext } from '@shopify/remix-oxygen';
import { getWeaverseCsp } from '~/weaverse/create-weaverse.server';
import { renderToReadableStream } from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy(getWeaverseCsp(request));
  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      // other options
    },
  );

  responseHeaders.set('Content-Security-Policy', header);
  // further response handling
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
 * @returns CSP policies
 */
export function getWeaverseCsp(request: Request) {
  let url = new URL(request.url);
  let weaverseHost = url.searchParams.get('weaverseHost');
  let isDesignMode = url.searchParams.get('weaverseHost');
  let weaverseHosts = ['*.weaverse.io', '*.shopify.com', '*.myshopify.com'];

  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }

  let updatedCsp = {
    defaultSrc: ['data:', '*.youtube.com', '*.vimeo.com', '*.google.com', 'fonts.gstatic.com', ...weaverseHosts],
    styleSrc: ['fonts.googleapis.com', ...weaverseHosts],
    connectSrc: ['https://vimeo.com', ...weaverseHosts],
  };

  if (isDesignMode) {
    updatedCsp.frameAncestors = ['*'];
  }

  return updatedCsp;
}
```

#### Common Customizations

If you need to customize CSP for specific needs, such as loading external scripts or enabling additional integrations, update the `getWeaverseCsp` function with the appropriate sources. For example, to allow scripts from additional external domains, you might modify the `scriptSrc` directive:

```tsx
scriptSrc: [
  'cdn.example.com',
  'www.googletagmanager.com',
  '*.clarity.ms',
  ...weaverseHosts
]
```

For detailed guidance on CSP directive values, visit [content-security-policy.com](https://content-security-policy.com/).
