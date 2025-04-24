---
title: Deploy to Shopify Oxygen
description: Step-by-step guide to securely deploying your Weaverse Hydrogen Project on Shopify Oxygen, with best practices and troubleshooting.
publishedAt: October 10, 2023
updatedAt: April 24, 2025
order: 1
published: true
---

# Deploying Your Weaverse Hydrogen Project to Shopify Oxygen

Shopify Oxygen is a fully managed, serverless hosting platform for Hydrogen storefronts, offering global CDN, seamless Shopify integration, and zero infrastructure management. Deploying to Oxygen is the recommended way to launch your Weaverse Hydrogen project for maximum performance and reliability.

## Prerequisites

- **Shopify store** (Plus plan for multiple storefronts; one storefront for non-Plus)
- **Weaverse Hydrogen project** ready in a GitHub repository
- **Shopify CLI** installed ([install guide](https://shopify.dev/docs/cli))
- **GitHub account** connected to your Shopify store
- **Weaverse Project ID** (from Weaverse Studio)

## Deployment Steps

### 1. Install the Hydrogen App
Visit the [Shopify Hydrogen App](https://apps.shopify.com/hydrogen) and install it in your Shopify store.

### 2. Create a GitHub Repository
- **Existing Project**: Commit and push your code to a new GitHub repository.
- **New Project**: Use the [Weaverse Hydrogen template](https://github.com/Weaverse/pilot) to create a new repo.

### 3. Set Up Your Storefront
In your Shopify admin, open the Hydrogen app and click "Create storefront" to begin setup.

### 4. Connect to Your Repository
![Connect with Weaverse Pilot Repo](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_create_storefront.png?v=1713672758)
- Select "Set up GitHub continuous deployment now."

### 5. Configure the Environment
- Wait for the Hydrogen app to create a pull request in your repo.
- In "Storefront settings," go to "Environments and variables."
- Add the `WEAVERSE_PROJECT_ID` (from Weaverse Studio's Project Settings or project URL).
  ![Weaverse Hydrogen env setup](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/weaverse_hydrogen_env_setup.png?v=1713673035)
- Add any other required environment variables (see [Environment Variables](/docs/guides/environment-variables)).

### 6. Merge the Pull Request
- Merge the PR created by the Hydrogen app to set up GitHub Actions for Oxygen deployment.
- If you merge before adding `WEAVERSE_PROJECT_ID`, trigger a manual rebuild (`npx shopify hydrogen deploy`).
  ![Hydrogen pull request](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_deployment.png?v=1713672917)
  ![Hydrogen GitHub pull request](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_pull_request.png?v=1713674248)

### 7. Publish Your Storefront & Update Weaverse Preview URL
After the GitHub Action completes:
- **Make the storefront public**: Click "..." next to the storefront name, select "Edit environment," then choose "Publish."
  ![hydrogen edit environment](https://cdn.shopify.com/s/files/1/0838/0052/3057/files/hydrogen_edit_environment.png?v=1713673181)
  ![Make Hydrogen storefront public](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/make_hydrogen_storefront_public.webp)
- **Note**: Shopify Plus plans can publish up to 25 Storefronts. Other plans are limited to one.

_Additional Note_: For Shopify Starter or Development plans, use [Vercel](/docs/deployment/vercel) or another platform, as the Hydrogen app cannot deploy to Oxygen.

## Troubleshooting
- **Missing environment variables**: Ensure all required variables (like `WEAVERSE_PROJECT_ID`) are set before merging the PR.
- **Build or deploy errors**: Check the GitHub Actions logs for details. Re-run the workflow after fixing issues.
- **Storefront not public**: Remember to publish your storefront after deployment.
- **Preview not updating**: Make sure the Weaverse Preview URL is set to your Oxygen deployment.

## Best Practices
- **Keep secrets out of version control**: Use environment variables for all sensitive data.
- **Test locally before deploying**: Run your Hydrogen app with the same environment variables as production.
- **Monitor logs after deployment**: Use GitHub Actions and Shopify dashboards to monitor for errors.
- **Review environment variables regularly**: Remove unused variables and update as your project evolves.
- **Follow Shopify’s security guidelines**: [Shopify Hydrogen Security](https://shopify.dev/docs/custom-storefronts/hydrogen/security)

## Summary
Deploying your Weaverse Hydrogen project to Shopify Oxygen gives you a secure, scalable, and high-performance storefront. Follow the steps and best practices above for a smooth launch.

## Additional Resources
- [Shopify Oxygen documentation](https://shopify.dev/docs/custom-storefronts/oxygen)
- [Shopify Hydrogen deployment](https://shopify.dev/docs/custom-storefronts/hydrogen/deployment)
- [Environment Variables](/docs/guides/environment-variables)
