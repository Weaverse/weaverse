---
title: Deploy to Shopify Oxygen
description: Step-by-step guide to deploying your Weaverse Hydrogen Project on Shopify Oxygen.
publishedAt: October 10, 2023
updatedAt: January 18, 2024
order: 0
published: true
---

## **Deploying Your Weaverse Hydrogen Project to Shopify Oxygen**

Elevate your e-commerce presence by deploying your Weaverse Hydrogen project to Shopify Oxygen. This guide simplifies the process, aligning closely with the **[official Oxygen documentation](https://shopify.dev/docs/custom-storefronts/oxygen)**, to provide a streamlined deployment experience.

<iframe src="https://share.descript.com/embed/zWZHewI89tJ?transcript=false" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>

## **Deployment Steps**

### Install the Hydrogen App

Visit the **[Shopify Hydrogen App](https://apps.shopify.com/hydrogen)** page and install the Hydrogen app in your Shopify store.

### Create a GitHub Repository

- **For Existing Local Projects**: Commit and push your project to a new GitHub repository.
- **For New Projects**: Navigate to **[Weaverse Hydrogen template](https://github.com/Weaverse/pilot)** and use the "Use this template" option to create a new repository.

### Set Up Your Storefront

Within your Shopify store's Hydrogen app, click the "**Create storefront**" button to initiate the setup.

### Connect to Your Repository

![Connect with Weaverse Pilot Repo](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/connect_with_weaverse_pilot_repo.png)

- Opt for "**Connect existing repository**."
- Choose your Weaverse Hydrogen repository and click "**Connect**."

### Configure the Environment

- Wait for the Hydrogen app to create a pull request.
- In "**Storefront settings**," go to "**Environments and variables**."
- Add the `WEAVERSE_PROJECT_ID` environment variable, obtainable from Weaverse Studio's "Project Settings" or the project URL.

### Merge the Pull Request

- Merge the pull request created by the Hydrogen app to implement the GitHub Action for Oxygen deployment.
- If you merge before adding the `WEAVERSE_PROJECT_ID`, trigger a manual rebuild with a code update.

### Publish Your Storefront & Update Weaverse Preview URL

After the GitHub Action completes:

- **For Single Deployment**: In the Hydrogen app, select the latest deployment and choose "**Make deployment public**" from the "Actions" dropdown.
  ![Make deployment public](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/make_deployment_public.png)
- **For Entire Storefront**: Click "**...**" next to the Storefront name, select "**Edit environment**," and then choose "**Publish**."
  ![Make Hydrogen storefront public](https://cdn.shopify.com/s/files/1/0728/0410/6547/files/make_hydrogen_storefront_public.webp)
- Note: Shopify Plus plans can publish up to 25 Storefronts. Other plans are limited to one.

_Additional Note_: For Shopify Starter or Development plans, alternative deployment methods like [Vercel](/docs/deployment/vercel) are required, as the Hydrogen app cannot deploy to Oxygen.

## **Additional Resources**

For more comprehensive information, refer to the **[Shopify Oxygen documentation](https://shopify.dev/docs/custom-storefronts/oxygen)**. These steps will guide you in successfully deploying and configuring your Weaverse Hydrogen project to Shopify Oxygen, enhancing your storefront's capabilities and performance.
