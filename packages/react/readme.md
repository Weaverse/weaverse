# @weaverse/react

## Overview

`@weaverse/react` is a specialized package in the Weaverse ecosystem, designed specifically for React applications. It
provides React components and mechanisms to render content from Weaverse CMS data. This package builds upon the core
functionalities of `@weaverse/core`, enabling easy integration of Weaverse content into React projects.

## Features

- React components compatible with Weaverse CMS data.
- Initialization of Weaverse Core instances tailored for React.
- `WeaverseRoot` component for rendering within the Weaverse context.
- Mechanism to register React components for use with Weaverse CMS.

## Installation

```bash
npm install @weaverse/react
```

## Initialization and Component Registration

First, initialize a Weaverse Core instance with the necessary parameters:

```jsx
import { Weaverse } from '@weaverse/core'

let weaverse = new Weaverse({
  projectId: 'your_project_id',
  data: 'WeaverseProjectDataType', // fetched from Weaverse CMS
})
```

Next, register your React components with the Weaverse instance:

```jsx
weaverse.registerElement({
  type: 'Button',
  Component: ButtonComponent,
  schema: {
    title: 'Button',
    type: 'Button',
    inspector: {
      // define settings inputs for customizing the Component here
    },
  },
})
```

## Usage

After initializing and registering elements, use the `WeaverseRoot` component to render your React components within the
Weaverse context:

```jsx
import React from 'react'
import { WeaverseRoot } from '@weaverse/react'

function App() {
  // ... your other React component logic

  return <WeaverseRoot context={weaverse} />
}

export default App
```

## Best Practices

- Initialize the Weaverse instance at your application's root level.
- Register all necessary React components with the Weaverse instance before rendering.
- Use the `WeaverseRoot` component to integrate the Weaverse CMS data into your React application effectively.

## Contributing

We welcome contributions to the `@weaverse/react` package. For more information on contributing, please refer to our
guidelines.

## License

This project is created by The Weaverse Team ([https://weaverse.io](https://weaverse.io)) and is licensed under the MIT
License.
