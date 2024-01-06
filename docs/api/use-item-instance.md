---
title: useItemInstance
description: The useItemInstance hook provides components the ability to access and manipulate a specific item instance.
publishedAt: 10-10-2023
updatedAt: 10-10-2023
order: 3
published: true
---

The **`useItemInstance`** hook is utilized to interact with a distinct item. Developers can access and manage that
item’s properties and trigger a re-render when necessary.

Usage
-----

To retrieve the instance of an item, call **`useItemInstance`** with the item's ID as an argument. This ID is a `string`
that uniquely identifies the item within the page.

```tsx
import { useItemInstance } from '@weaverse/hydrogen';

function MyComponent() {
  let instance = useItemInstance('itemId');

  // Interact with the item instance
  // ...

  return (
    // Render your component
  );
};
```

Properties
----------

#### `_id`

* **Type**: **`string`**

* **Description**: The property **`instance._id`** returns the unique identifier of the item.

#### `data`

* **Type**: **`any`**

* **Description**: This property holds the data associated with the item, which can be used to render the item or
  determine its behavior.

#### `_element`

* **Type**: **`HTMLElement | null`**

* **Description**: Provides a reference to the item's corresponding DOM node, allowing direct manipulation of the item
  in the DOM.

Methods
-------

#### `triggerUpdate()`

* **Arguments**: None.

* **Returns**: Void.

* **Description**: When called, **`instance.triggerUpdate()`** will cause the item to re-render. This is useful when the
  item's state changes and you need to reflect these changes in the UI.