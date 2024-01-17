---
title: Deploy to Shopify Oxygen
description: Deploying Weaverse Hydrogen Project to Shopify Oxygen.
publishedAt: October 10, 2023
updatedAt: January 17, 2024
order: 0
published: true
---

Deploying Weaverse Hydrogen Project to Shopify Oxygen
-----------------------------------------------------

The Weaverse Hydrogen project is designed to be Oxygen-ready, streamlining the deployment process to Shopify Oxygen. You
can follow the official **[Oxygen documentation](https://shopify.dev/docs/custom-storefronts/oxygen)** or adhere to the
simplified steps outlined below to deploy your project:
<iframe src="https://www.youtube.com/embed/j6FT9G01Q1A?rel=0" frameBorder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowFullScreen></iframe>

Deployment Steps
----------------

#### Install Hydrogen App

Navigate to **[Shopify Hydrogen App](https://apps.shopify.com/hydrogen)** and install the Hydrogen app to your Shopify
store.

![](https://downloads.intercomcdn.com/i/o/863207281/1008642aaf81fc72b0056f23/image.png)

#### Create Storefront

Open the Hydrogen app within your Shopify store and click on "**Create storefront**" button

#### Connect Repository

* Choose the option "**Connect existing repository**"

* Select your created **Weaverse Hydrogen** repository and click "**Connect**"

#### Merge Pull Request

* The Hydrogen app will prompt you to merge a pull request to add their **GitHub Action** for deployment to **Oxygen**.

* Merge the pull request and wait for the Github Action to build.

#### Environment Configuration

* Once the Hydrogen storefront is built, navigate to "**Storefront settings**", then "**Environments and variables**"

* Add **`WEAVERSE_PROJECT_ID`** to your environment variables. You can obtain the project ID from the **Weaverse Studio
  ** under the **Project Settings** panel.

#### Rebuild and Publish

After updating the environment variables, you may need to rebuild and publish the storefront to make it live.

Additional Resources
--------------------

For a more detailed understanding, refer to the
**[Shopify Oxygen documentation](https://shopify.dev/docs/custom-storefronts/oxygen)**.
By following these steps, you can successfully deploy your **Weaverse Hydrogen** project to **Shopify Oxygen** and
ensure it's configured correctly to serve your storefront.
