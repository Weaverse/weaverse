---
title: Content Security Policy
description: How Content Security Policy is dynamically configured and enforced in Weaverse Hydrogen projects, with guidance for customization and best practices.
publishedAt: November 20, 2023
updatedAt: April 24, 2025
order: 10
published: true
---

# Content Security Policy (CSP)

Content Security Policy (CSP) is a critical security feature that controls which resources (scripts, styles, frames, etc.) can be loaded by your storefront. In Weaverse Hydrogen projects, CSP is dynamically generated and integrated with Shopify's Hydrogen framework to balance security and flexibility—especially for design mode and embedded apps.

## How CSP Works in Weaverse

Weaverse uses a utility function, `getWeaverseCsp`, to generate a CSP object tailored to your current environment and request. This function is called in your [`entry.server.tsx`](https://github.com/Weaverse/pilot/blob/main/app/entry.server.tsx) file and merged with Shopify's `createContentSecurityPolicy`.

### Dynamic CSP Logic

The CSP is constructed as follows:

- **Trusted hosts** are always allowed: `*.weaverse.io`, `*.shopify.com`, `*.myshopify.com`.
- If the request is in design mode (detected via the `weaverseHost` query parameter), that host is also allowed.
- Additional sources (YouTube, Vimeo, Google Analytics, etc.) are included for compatibility with common integrations.
- In design mode, `frame-ancestors` is set to `*` to allow embedding in the Weaverse Studio.

#### Example: getWeaverseCsp Implementation

```ts
import type { AppLoadContext } from "@shopify/remix-oxygen";

export function getWeaverseCsp(request: Request, context: AppLoadContext) {
  let url = new URL(request.url);
  let weaverseHost = url.searchParams.get("weaverseHost") || context.env.WEAVERSE_HOST;
  let isDesignMode = url.searchParams.get("weaverseHost");
  let weaverseHosts = ["*.weaverse.io", "*.shopify.com", "*.myshopify.com"];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }
  let updatedCsp = {
    defaultSrc: [
      "data:",
      "*.youtube.com",
      "*.youtu.be",
      "*.vimeo.com",
      "*.google.com",
      "*.google-analytics.com",
      "*.googletagmanager.com",
      "cdn.alireviews.io",
      "cdn.jsdelivr.net",
      "*.alicdn.com",
      ...weaverseHosts,
    ],
    connectSrc: ["vimeo.com", "*.google-analytics.com", ...weaverseHosts],
    styleSrc: weaverseHosts,
  };
  if (isDesignMode) {
    updatedCsp.frameAncestors = ["*"];
  }
  return updatedCsp;
}
```

## Integrating CSP in entry.server.tsx

The CSP configuration is passed to Shopify's `createContentSecurityPolicy`, which generates the appropriate policy header and nonce for your React app:

```tsx
import { createContentSecurityPolicy } from "@shopify/hydrogen";
import { getWeaverseCsp } from "~/weaverse/csp";

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
      checkoutDomain: context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  });
  // ...
  responseHeaders.set("Content-Security-Policy-Report-Only", header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

> **Note:** The CSP is currently set as `Content-Security-Policy-Report-Only` for development and debugging. This allows you to monitor violations without breaking the app. When you're confident your policy is correct, switch to the strict `Content-Security-Policy` header for enforcement.

## Customizing Your CSP

To allow additional domains or services, simply update the arrays in `getWeaverseCsp`. For example, to allow a new analytics provider:

```ts
defaultSrc: [
  ...,
  "*.my-analytics.com",
  ...
]
```

You can also add new logic based on environment variables, request parameters, or app features.

## Best Practices
- Always test your CSP in Report-Only mode before enforcing it.
- Only allow the minimum set of domains necessary for your storefront and integrations.
- Regularly review CSP reports to catch unexpected resource loads.
- Avoid using `*` except for `frame-ancestors` in design mode.

## Troubleshooting
- If resources (scripts, styles, images) are blocked, check your browser's CSP console warnings.
- Make sure any new integrations are reflected in the CSP arrays.
- For issues in design mode, verify that the correct `weaverseHost` is set.

## Further Reading
- [MDN: Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Shopify Hydrogen CSP](https://shopify.dev/docs/storefronts/headless/hydrogen/content-security-policy)
