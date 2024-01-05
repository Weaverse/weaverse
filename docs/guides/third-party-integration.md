---
title: Third-party Integration
description: Extend the functionality of your Weaverse Hydrogen theme by integrating third-party applications and services.
publishedAt: 11-20-2023
updatedAt: 11-20-2023
order: 11
---

Merchants often need to extend their store's capabilities with third-party apps for customer reviews, sales promotions,
and more to boost engagement and conversions. Weaverse facilitates two primary methods for integrating such apps into
your Hydrogen theme.

Using the App's Component Library
---------------------------------

If the third-party app offers a React component library, follow these steps:

1. Install the App library component

2. Add the App component to the page

Refer to detailed examples provided by app libraries, such
as [Okendo's Shopify Hydrogen Tutorial](https://github.com/okendo/okendo-shopify-hydrogen-demo/wiki/Okendo-Shopify-Hydrogen---Tutorial)
for guidance.

![Okendo package](https://downloads.intercomcdn.com/i/o/865601463/0e9171c3e19436415e4c09cb/image.png)

Querying App Data from App's API
--------------------------------

If the third-party app provides an API:

1. Secure the API Token:

* Store the third-party app's API token in your **`.env`** file.

  👉 [Learn more about Environment Variables](https://weaverse.io/docs/guides/8460014-environment-variables).

2. Query App Data:

* Use the app's API within your route's loader function or a component's loader function to fetch data.

  👉 [Review data fetching and caching practices](https://weaverse.io/docs/guides/fetching-and-caching).

* Display the fetched data on your Weaverse page effectively.

3. Example:

* Consult examples like the [Judge.me Shopify Hydrogen package](https://www.npmjs.com/package/@judgeme/shopify-hydrogen)
  to understand data querying and rendering.

  ![Judge.me package](https://downloads.intercomcdn.com/i/o/865603384/c38414f7308b69a55d7a1730/image.png)

Conclusion
----------

Integrating third-party apps into your Weaverse Hydrogen theme can significantly enhance your store's features and
improve user engagement. By following the methods outlined above, merchants can ensure a seamless integration process,
leading to a more robust and feature-rich storefront.