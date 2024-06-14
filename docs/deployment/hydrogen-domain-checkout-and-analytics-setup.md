---
title: Hydrogen Domain, Checkout, and Analytics Setup
description: Step-by-step guide to setting up your custom domain and analytics for your Shopify Hydrogen project.
publishedAt: April 18, 2024
updatedAt: April 21, 2024
order: 2
published: true
---

This article provides a comprehensive guide to setting up your custom domain and analytics for your Shopify Hydrogen project. We will also show you how to redirect traffic from your old native Shopify store to your new Hydrogen store. Before proceeding, ensure your Hydrogen storefront is deployed via Oxygen by following [instructions](/docs/deployment/oxygen).
![Deployed and Published Hydrogen Project](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_hydrogen_deployed.png?v=1713692590)

## **Setting Up Your Custom Domain**

Navigate to your Shopify store's admin panel, then go to Settings > Domains. Here, you can add your custom domain by clicking on **Connect existing domain** or **Buy new domain**.
For reference, I already own the domain `weaverse.dev` and will connect it to my Hydrogen store.
![Shopify Domain Settings](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/connect_existing_domain.png?v=1713694033)

If your domain is purchased and managed by Shopify, you can skip the step of updating DNS records as Shopify will automatically handle this for you.

For domains not managed by Shopify, you will need to update the DNS records in your domain provider's dashboard. Here are the DNS records you need to add:

- **CNAME**: Host: `@` (or the subdomain you want to connect), Points to: `shops.myshopify.com`.
  ![Shopify Domain DNS Records](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/dns_settings.png?v=1713694183)

After updating the DNS records, click **Verify connection**. Once verified, your domain will be linked to your Shopify store. It's then time to update the domain target to your Hydrogen store:

- Click on the domain you've added and select **Change target** to choose the Hydrogen target.
- Select the Hydrogen store and environment you wish to connect and click **Save**.
  ![Shopify Domain Target](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/set_hydrogen_target.png?v=1713694386)

Your Hydrogen storefront should now be accessible via your custom domain.

The final step is to set your domain type to **Primary domain** to make it the default domain for your store.
![Shopify Primary Domain](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/domain_type.png?v=1713695844)

## **Redirect Traffic from Liquid Storefront to Hydrogen**

To redirect traffic from your old Shopify Liquid storefront to the new Hydrogen store, follow these steps:

- Download the [Hydrogen Redirect Theme](https://github.com/Shopify/hydrogen-redirect-theme/archive/refs/heads/master.zip) and navigate to your Shopify store's admin > Online Store > Themes > Add Theme > Upload zip file.
- Publish the theme, then access the theme customizer.
- In the theme customizer, go to "Theme settings" > "Storefront" and set the Hostname to your Hydrogen store URL, for example, `weaverse.dev`.
- Save and publish the changes.
  ![Hydrogen Redirect Theme Setup](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_redirect_theme_setup.png?v=1713694951)

## **Setup Checkout Domain**

While your Hydrogen store manages the storefront, the checkout process is still handled by Shopify (Liquid). To ensure a seamless checkout experience that matches your custom domain:

- Go to your Shopify store's admin > Settings > Domain.
- Add a domain and set it as the primary target for the Online Store.
- Update the DNS records in your domain provider's dashboard with the following:
  - **CNAME**: Host: `www`, Points to: `shops.myshopify.com`.

I recommend using the `www` subdomain for checkout to maintain a consistent URL format like `yourdomain.com`. Alternatively, you can use subdomains such as `checkout` or `buy` if you prefer.

## **Setting Up Cookie Banner and Analytics**

Following the [Hydrogen April 2024 updates](https://hydrogen.shopify.dev/update/april-2024), Shopify's Hydrogen now supports the Native Cookie Banner and Analytics. If your Hydrogen project has not been updated, please follow [these instructions](https://github.com/Shopify/hydrogen/tree/main/examples/gtm#1-enable-customer-privacy--cookie-consent-banner) to upgrade.

The [Weaverse Hydrogen theme](https://github.com/Weaverse/pilot/tree/main) has been updated to the latest version to include these features. To enable the cookie banner and analytics, follow these steps:

- Enable the cookie banner by following [this guide](https://github.com/Shopify/hydrogen/tree/main/examples/gtm#1-enable-customer-privacy--cookie-consent-banner).
- Add the `PUBLIC_CHECKOUT_DOMAIN` to your storefront's environment variables. Set this variable to your checkout domain, such as `www.yourdomain.com`.
- Redeploy your Hydrogen project to apply these changes using the command `npx shopify hydrogen deploy`.

After redeployment, the cookie banner and analytics will be active on your Hydrogen store.
![Hydrogen Cookie Banner and Analytics](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_cookie_banner_activated.jpg?v=1713697054)

### **Optional: Google Tags Manager Integration**

The Weaverse Hydrogen theme includes integration with Google Tags Manager for enhanced tracking and analytics. To activate this feature, follow these steps:

- Obtain your Google Tags Manager ID from your account.
- Add the `PUBLIC_GOOGLE_GTM_ID` to your storefront's environment variables.
- Redeploy your Hydrogen project to implement these changes.
