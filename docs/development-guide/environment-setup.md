---
title: Environment Variables
description: Setting up and managing environment variables in Weaverse Hydrogen theme.
publishedAt: August 14, 2025
updatedAt: August 14, 2025
order: 2
published: true
---

## Introduction

Environment variables provide a mechanism to protect sensitive data, manage configurations, and streamline different environments like development, testing, and production. In **Weaverse Hydrogen**, you'll frequently interact with a set of predefined variables tailored specifically for the framework.

## Essential Environment Variables

### Core Variables
1. **`SESSION_SECRET`**: A secret key used to sign session cookies. For more details, refer to the [Remix documentation on using sessions](https://remix.run/docs/en/v1/api/remix#use-session).
2. **`PUBLIC_STOREFRONT_API_TOKEN`**: The public access token for the Storefront API. This is not required if you are using the **`mock.shop`** demo setup.
3. **`PUBLIC_STORE_DOMAIN`**: The domain of the store used to communicate with the Storefront API.
4. **`PUBLIC_CHECKOUT_DOMAIN`**: The domain of the checkout page (or the original Online Store domain).
5. **`PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`**: The public access token for the Customer Account API.
6. **`PUBLIC_CUSTOMER_ACCOUNT_API_URL`**: The API URL for the Customer Account API, format: `https://shopify.com/{SHOP_ID}`.
7. **`SHOP_ID`**: Your Shopify store ID.

### Weaverse Specific Variables
1. **`WEAVERSE_PROJECT_ID`**: A unique ID representing your specific **Weaverse** project. You can find this ID inside the Weaverse Studio under **Project Settings**.
2. **`WEAVERSE_API_KEY`** (optional): Weaverse API Key retrieved from your Weaverse Account settings.
3. **`WEAVERSE_HOST`** (optional): The host URL for Weaverse services. Default: **`https://studio.weaverse.io`**.

### Optional Variables
1. **`PUBLIC_STOREFRONT_ID`**: The ID of your storefront.
2. **`PRIVATE_STOREFRONT_API_TOKEN`**: The private access token for the Storefront API.
3. **`PUBLIC_STOREFRONT_API_VERSION`**: The Storefront API version. Defaults to the version used by Hydrogen.

### Third-Party Integration Variables
1. **`PUBLIC_GOOGLE_GTM_ID`**: Google Tag Manager ID for analytics.
2. **`JUDGEME_PRIVATE_API_TOKEN`**: API token for Judge.me reviews integration.
3. **`KLAVIYO_PRIVATE_API_TOKEN`**: API token for Klaviyo integration.
4. **`PUBLIC_SHOPIFY_INBOX_SHOP_ID`**: Shopify Inbox shop ID for chat functionality.

### Custom Metafields & Metaobjects
1. **`METAOBJECT_COLORS_TYPE`**: Type identifier for color metaobjects.
2. **`CUSTOM_COLLECTION_BANNER_METAFIELD`**: Metafield identifier for collection banners.

## Setting Up Environment Variables

### Using Demo Setup (with `mock.shop`)

```plaintext
SESSION_SECRET="my-secret-key"
PUBLIC_STORE_DOMAIN="mock.shop"
WEAVERSE_PROJECT_ID="weaverse-project-id"
```

### Production Setup

```plaintext
# Core Variables
SESSION_SECRET="your-session-secret"
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_CHECKOUT_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="your-customer-account-api-client-id"
PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://shopify.com/your-shop-id"
SHOP_ID="your-shop-id"

# Weaverse Variables
WEAVERSE_PROJECT_ID="your-weaverse-project-id"
WEAVERSE_API_KEY="your-weaverse-api-key"  # Optional
WEAVERSE_HOST="https://studio.weaverse.io"  # Optional

# Optional Variables
PUBLIC_STOREFRONT_ID="your-storefront-id"  # Optional
PRIVATE_STOREFRONT_API_TOKEN="your-private-storefront-api-token"  # Optional

# Third-Party Integrations
PUBLIC_GOOGLE_GTM_ID="your-gtm-id"  # Optional
JUDGEME_PRIVATE_API_TOKEN="your-judgeme-token"  # Optional
KLAVIYO_PRIVATE_API_TOKEN="your-klaviyo-token"  # Optional
PUBLIC_SHOPIFY_INBOX_SHOP_ID="your-inbox-shop-id"  # Optional

# Custom Metafields
METAOBJECT_COLORS_TYPE="shopify--color-pattern"  # Optional
CUSTOM_COLLECTION_BANNER_METAFIELD="custom.collection_banner"  # Optional
```

## TypeScript Support

For TypeScript support, add your environment variables to `env.d.ts`:

```typescript
interface Env extends HydrogenEnv {
  // Core Variables
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
  SHOP_ID: string;
  
  // Weaverse Variables
  WEAVERSE_PROJECT_ID: string;
  WEAVERSE_API_KEY?: string;
  WEAVERSE_HOST?: string;
  
  // Optional Variables
  PUBLIC_STOREFRONT_ID?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  
  // Third-Party Integrations
  PUBLIC_GOOGLE_GTM_ID?: string;
  JUDGEME_PRIVATE_API_TOKEN?: string;
  KLAVIYO_PRIVATE_API_TOKEN?: string;
  PUBLIC_SHOPIFY_INBOX_SHOP_ID?: string;
  
  // Custom Metafields
  METAOBJECT_COLORS_TYPE?: string;
  CUSTOM_COLLECTION_BANNER_METAFIELD?: string;
}
```

## Best Practices

1. **Security**:
   - Never commit `.env` files to version control
   - Use `.env.example` for required variables
   - Keep sensitive tokens private
   - Rotate tokens regularly

2. **Organization**:
   - Group related variables together
   - Use clear, descriptive names
   - Document all variables in your project
   - Keep development and production variables separate

3. **Development**:
   - Use different values for development and production
   - Validate environment variables at startup
   - Provide fallback values where appropriate
   - Use TypeScript for type safety

## Obtaining Required Tokens

### Storefront API Token
1. Install the [Headless](https://apps.shopify.com/headless) or [Hydrogen](https://apps.shopify.com/hydrogen) app
2. Follow [these instructions](https://shopify.dev/docs/custom-storefronts/building-with-the-storefront-api/manage-headless-channels) to obtain the Storefront API Token
3. When setting permissions, enable all Storefront API access scopes to avoid unexpected errors during development

> 💡 **Tip**: Always enable all Storefront API permissions when generating your token. This prevents access-related errors that can be difficult to troubleshoot during development.

<doc-warning>If you are on the Shopify Starter plan, please create a custom app to obtain the Storefront API token. [Learn more](https://help.shopify.com/en/manual/apps/app-types/custom-apps)</doc-warning>

![API Token](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/API-Token.webp?v=1743408636)

### Weaverse Project ID
1. Log in to [Weaverse Studio](https://studio.weaverse.io)
2. Navigate to Project Settings
3. Copy your Project ID

## Using Environment Variables

Access environment variables in your code:

```tsx
// In route loaders
export async function loader({ context }: LoaderArgs) {
  const { env } = context;
  return json({ storeDomain: env.PUBLIC_STORE_DOMAIN });
}

// In Weaverse components
export let loader = async ({ weaverse }: ComponentLoaderArgs<{}, Env>) => {
  const { env } = weaverse;
  return { projectId: env.WEAVERSE_PROJECT_ID };
}
```

## Next Steps

Learn about creating and managing **[Weaverse Components](/docs/development-guide/weaverse-component)** – the foundational building blocks of your theme.
