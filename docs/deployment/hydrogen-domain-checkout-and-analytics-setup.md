---
title: Hydrogen Domain, Checkout, and Analytics Setup
description: Comprehensive guide to setting up your custom domain, checkout, and analytics for your Weaverse Hydrogen project on Shopify.
publishedAt: April 18, 2024
updatedAt: April 24, 2025
order: 2
published: true
---

# Hydrogen Domain, Checkout, and Analytics Setup

This guide walks you through setting up a custom domain, configuring checkout, and enabling analytics (including cookie banner and Google Tag Manager) for your Weaverse Hydrogen storefront. You’ll also learn how to redirect traffic from your old Shopify Liquid store to your new Hydrogen experience.

> **Prerequisites:**
> - Your Hydrogen storefront is deployed via Oxygen ([deployment guide](/docs/deployment/oxygen)).
> - You have access to your Shopify admin and DNS provider (if using a custom domain).
> - You have your Weaverse Project ID and any analytics IDs ready.

![Deployed and Published Hydrogen Project](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_hydrogen_deployed.png?v=1713692590)

## 1. Setting Up Your Custom Domain

1. In Shopify admin, go to **Settings > Domains**.
2. Click **Connect existing domain** (or **Buy new domain** if needed).
   - Enter your domain (e.g., `weaverse.dev`).
   ![Shopify Domain Settings](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/connect_existing_domain.png?v=1713694033)
3. If your domain is managed by Shopify, DNS is handled automatically. Otherwise, update DNS at your domain provider:
   - **CNAME**: Host: `@` (or subdomain), Points to: `shops.myshopify.com`.
   ![Shopify Domain DNS Records](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/dns_settings.png?v=1713694183)
4. Click **Verify connection** in Shopify.
5. Once verified, click the domain and select **Change target** → choose your Hydrogen storefront and environment → **Save**.
   ![Shopify Domain Target](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/set_hydrogen_target.png?v=1713694386)
6. Set your custom domain as **Primary domain** to make it the default for your store.
   ![Shopify Primary Domain](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/domain_type.png?v=1713695844)

## 2. Redirect Traffic from Liquid Storefront to Hydrogen

To ensure a smooth transition, redirect all traffic from your old Shopify Liquid storefront:
1. Download the [Hydrogen Redirect Theme](https://github.com/Shopify/hydrogen-redirect-theme/archive/refs/heads/master.zip).
2. In Shopify admin: **Online Store > Themes > Add Theme > Upload zip file**.
3. Publish the theme, then in the theme customizer go to **Theme settings > Storefront** and set the Hostname to your Hydrogen store URL (e.g., `weaverse.dev`).
4. Save and publish.
   ![Hydrogen Redirect Theme Setup](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_redirect_theme_setup.png?v=1713694951)

## 3. Setup Checkout Domain

Shopify still manages checkout. For a seamless experience:
1. In Shopify admin, go to **Settings > Domains**.
2. Add your checkout domain (e.g., `www.yourdomain.com`) and set it as the primary for the Online Store.
3. Update DNS at your provider:
   - **CNAME**: Host: `www`, Points to: `shops.myshopify.com`.
4. Use the `www` subdomain for checkout for consistency (or use `checkout`/`buy` if preferred).
5. In your Hydrogen environment variables, set `PUBLIC_CHECKOUT_DOMAIN` to your checkout domain.
6. Redeploy your Hydrogen project to apply changes.

## 4. Setting Up Cookie Banner and Analytics

Hydrogen supports Shopify’s native cookie banner and analytics (April 2024+):
1. Follow the [official guide](https://github.com/Shopify/hydrogen/tree/main/examples/gtm#1-enable-customer-privacy--cookie-consent-banner) to enable the cookie banner.
2. Add `PUBLIC_CHECKOUT_DOMAIN` to your storefront’s environment variables.
3. Redeploy your Hydrogen project (`npx shopify hydrogen deploy`).

![Hydrogen Cookie Banner and Analytics](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_cookie_banner_activated.jpg?v=1713697054)

### Google Tag Manager Integration (Optional)

1. Get your Google Tag Manager ID.
2. Add `PUBLIC_GOOGLE_GTM_ID` to your storefront’s environment variables.
3. Redeploy your Hydrogen project.

## Troubleshooting
- **DNS not propagating:** DNS changes can take up to 24 hours. Use tools like [whatsmydns.net](https://www.whatsmydns.net/) to check.
- **Domain not verifying:** Double-check CNAME and other DNS records for typos or missing entries.
- **Checkout not working:** Ensure `PUBLIC_CHECKOUT_DOMAIN` matches your checkout domain and is set in both Shopify and your Hydrogen env.
- **Analytics not firing:** Confirm analytics IDs are correct and scripts are enabled in your theme/environment.
- **Cookie banner not showing:** Make sure you’ve updated Hydrogen to the latest version and followed Shopify’s guide.

## Best Practices
- Always use HTTPS for all domains.
- Keep environment variables (especially analytics and checkout) secure and up-to-date.
- Test checkout and analytics after every deployment.
- Monitor analytics dashboards to verify data is flowing.
- Review Shopify and Hydrogen docs for updates.

## Summary
Setting up a custom domain, checkout, and analytics ensures your Weaverse Hydrogen storefront is professional, secure, and ready to scale. Follow the steps above for a seamless launch and reliable analytics tracking.

## Further Reading
- [Shopify Domains documentation](https://help.shopify.com/en/manual/domains)
- [Shopify Checkout configuration](https://shopify.dev/docs/custom-storefronts/checkout)
- [Shopify Analytics with Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/analytics/tracking?framework=hydrogen&extension=javascript)
- [Hydrogen Cookie Banner & Analytics](https://github.com/Shopify/hydrogen/tree/main/examples/gtm)
- [Weaverse Hydrogen Deployment](/docs/deployment/oxygen)
