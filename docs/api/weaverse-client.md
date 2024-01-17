---
title: WeaverseClient
description: The WeaverseClient class provides developers with a suite of methods to interact with the Weaverse inside a Weaverse Hydrogen Theme.
publishedAt: October 10, 2023
updatedAt: January 17, 2024
order: 0
published: true
---

The **`WeaverseClient`** class provides developers with a suite of methods to interact with Weaverse, manage caching
strategies, and load theme-specific settings and pages.

Initialization
--------------

Developers construct an instance with appropriate configurations, including environmental variables, storefront
information, and more, and then inject the instance into the app's load context for global accessibility.

Refer to the [Project Structure article](/docs/guides/project-structure#base-files-explained)
for a detailed walkthrough on setting up.

Methods
-------

#### `fetchWithCache`

* **Arguments**:

* **`url`**: **`string`** - The endpoint to which the fetch request is made.

* **`options`**: **`FetchWithCacheOptions`** - Optional. Configurations for the fetch request, including caching
  strategies and additional request initializations.

* **Returns**: **`Promise<T>`** - A promise that resolves with the fetched data of the generic type **`T`**.

* **Description**: Fetches data from an external API, applying the specified caching strategy.

  Refer to
  the [Data Fetching and Caching](/docs/guides/fetching-and-caching#fetching-data-from-external-apis)
  to learn more.

#### `loadThemeSettings`

* **Arguments**:

* **`strategy`**: **`AllCacheOptions`** - Optional. The caching strategy to use when fetching theme settings.

* **Returns**: **`Promise<any>`** - A promise that resolves with the theme settings data.

* **Description**: Loads the theme settings, applying caching if not in design mode.

  Refer to
  the [Global Theme Settings](/docs/guides/global-theme-settings#load-theme-settings) to
  learn more.

#### `loadPage`

* **Arguments**:

* **`params`**: **`LoadPageParams`** - Optional. Parameters for loading the page, including caching strategy and other
  request-specific data.

* **Returns**: **`Promise<WeaverseLoaderData | null>`** - A promise that resolves with the data necessary for rendering
  a page or **`null`** in case of an error.

* **Description**: Loads the data for a specific page, including configurations and content.

  Refer to
  the [Rendering a Weaverse Page](/docs/guides/rendering-page#fetching-page-data)
  to learn more.