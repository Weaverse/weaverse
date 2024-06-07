---
title: Environment Variables
description: Setting up and managing environment variables in Weaverse Hydrogen theme.
publishedAt: November 20, 2023
updatedAt: Jun 7, 2024
order: 2
published: true
---

## Introduction

Environment variables provide a mechanism to protect sensitive data, manage configurations, and streamline different environments like development, testing, and production. In **Weaverse Hydrogen**, you'll frequently interact with a set of predefined variables tailored specifically for the framework.

## Essential Environment Variables for a Hydrogen Theme

1. **`SESSION_SECRET`**: A secret key used to sign session cookies. For more details, refer to the [Remix documentation on using sessions](https://remix.run/docs/en/v1/api/remix#use-session).
2. **`PUBLIC_STOREFRONT_API_TOKEN`**: The public access token for the Storefront API. This is not required if you are using the **`mock.shop`** demo setup.
3. **`PUBLIC_STORE_DOMAIN`**: The domain of the store used to communicate with the Storefront API. By default, if you're using the demo setup, the **`.env`** file will point to **`mock.shop`**.
4. **`PUBLIC_CHECKOUT_DOMAIN`**: The domain of the checkout page (or the original Online Store domain). This is used for the consent banner and analytics.
5. **`PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`**: The public access token for the Customer Account API. This is not required if you are using the old login method with a password.
6. **`PUBLIC_CUSTOMER_ACCOUNT_API_URL`**: The API URL for the Customer Account API, which should look like this: `https://shopify.com/12345678`.
7. **`PRIVATE_STOREFRONT_API_TOKEN`** (optional): The private access token for the Storefront API.
8. **`PUBLIC_STOREFRONT_API_VERSION`** (optional): The Storefront API version. If not specified, it defaults to the version used by Hydrogen.

## Weaverse Specific Environment Variables

1. **`WEAVERSE_PROJECT_ID`**: A unique ID representing your specific **Weaverse** project. You can find this ID inside the Weaverse Studio under **Project Settings**.
2. **`WEAVERSE_API_KEY`** (optional): Weaverse API Key retrieved from your Weaverse Account settings. This is used for some secured backend operations.
3. **`WEAVERSE_HOST`** (optional): The host URL for Weaverse services. If not specified, the default value is **`https://studio.weaverse.io`**.

## Setting Up Environment Variables

Define these environment variables in your **`.env`** file located at the root of your theme.

### Using Demo Setup (with `mock.shop`)

```plaintext
SESSION_SECRET="my-secret-key"
PUBLIC_STORE_DOMAIN="mock.shop"
WEAVERSE_PROJECT_ID="weaverse-project-id"
```

### When Using a Token

```plaintext
# These variables are only available locally in MiniOxygen

SESSION_SECRET="my-secret-key"
PUBLIC_STOREFRONT_API_TOKEN="storefront-api-token"
PUBLIC_STORE_DOMAIN="my-store.myshopify.com"
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="customer-account-api-client-id"
PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://shopify.com/12345678"
WEAVERSE_PROJECT_ID="weaverse-project-id"
```

📌 **Note**: Avoid committing the **`.env`** file to version control to prevent exposing sensitive data. Use the **`.env.example`** file to display required variables without revealing actual values.

## Obtaining the Public Storefront API Token

To get your **`PUBLIC_STOREFRONT_API_TOKEN`** and preview your real store data, install the [Headless](https://apps.shopify.com/headless) or [Hydrogen](https://apps.shopify.com/hydrogen) app and follow [these instructions](https://shopify.dev/docs/custom-storefronts/building-with-the-storefront-api/manage-headless-channels) to obtain the _Storefront API Token_.

<doc-warning>If you are on the Shopify Starter plan, please create a custom app to obtain the Storefront API token. [Learn more](https://help.shopify.com/en/manual/apps/app-types/custom-apps)</doc-warning>

![API Token](https://downloads.intercomcdn.com/i/o/848678475/033f78182979523f9a7a23e1/image.png)

Then, add them to the **.env** file.

## Using Environment Variables

Within your Weaverse Hydrogen theme, access environment variables via routes' `loader` function or Weaverse component's `loader` function.

For instance, within a **`loader`** function:

```tsx
import { json, type LoaderArgs } from '@shopify/remix-oxygen'

export async function loader({ context }: LoaderArgs) {
  // Get `env` variables from App Load Context
  let { env } = context

  return json({
    // ... route data
  })
}
```

Inside a **Weaverse** component's `loader`:

```tsx
import type { ComponentLoaderArgs } from '@weaverse/hydrogen'

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  // Get `env` variables from `weaverse` client
  let { env } = weaverse

  return {
    // ... component loader data
  }
}
```

## Conclusion

Correctly understanding and managing environment variables is crucial for both the security and functionality of your Weaverse Hydrogen theme. Always ensure that they are treated with the utmost care, keeping any sensitive data well protected.

Next, learn about creating and managing **[Weaverse Components](/docs/guides/weaverse-component)** – the foundational building blocks of your theme.
