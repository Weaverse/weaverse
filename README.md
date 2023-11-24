# Weaverse SDKs
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/vif3.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
[![🚀 Lint & Typecheck](https://github.com/Weaverse/weaverse/actions/workflows/check.yml/badge.svg)](https://github.com/Weaverse/weaverse/actions/workflows/check.yml)
## Overview

The "Weaverse SDKs" is a public collection of SDKs for integrating the Weaverse Headless CMS with modern React/JamStack
frameworks such as Shopify Hydrogen, Remix, and Next.js. Developed by The Weaverse Team, these SDKs are designed to
simplify and enhance the integration of dynamic, content-rich web applications with the Weaverse CMS.

## Quick Links

- **Home Page**: [Weaverse](https://weaverse.io)
- **Playground**: [Playground](https://playground.weaverse.io)
- **Demo**: [Pilot](https://github.com/weaverse/pilot)


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeaverse%2Fpilot&env=SESSION_SECRET,PUBLIC_STORE_DOMAIN,PUBLIC_STOREFRONT_API_TOKEN,WEAVERSE_PROJECT_ID&envDescription=SESSION_SECRET%2C%20PUBLIC_STORE_DOMAIN%2C%20PUBLIC_STOREFRONT_API_TOKEN%2C%20WEAVERSE_PROJECT_ID&envLink=https%3A%2F%2Fweaverse.io%2Fdocs%2Fguides%2F8460014-environment-variables&project-name=my-weaverse-hydrogen-project&repository-name=my-weaverse-hydrogen-project&demo-title=Weaverse%20Hydrogen%20Demo&demo-description=A%20Shopify%20Hydrogen%20storefront%20build%20with%20Weaverse&demo-url=https%3A%2F%2Fpilot.weaverse.dev&demo-image=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0728%2F0410%2F6547%2Ffiles%2FHome.png)

## Community Engagement

Engage with the Weaverse community through these channels:

- **Slack**: [@WeaverseCommunity](https://join.slack.com/t/weaversecommunity/shared_invite/zt-235bv7d80-velzJU8CpZIHWdrzFwAdXg)
- **X (formerly Twitter)**: [@WeaverseIO](https://x.com/WeaverseIO)
- **LinkedIn**: [@company/weaverseio](https://www.linkedin.com/company/weaverseio)

## Key Features

- **Framework-Specific SDKs**: Tailored SDKs for various React/JamStack frameworks, ensuring flexible and efficient
  integration.
- **Seamless CMS Integration**: Facilitates the integration of applications with the Weaverse Headless CMS.
- **Community-Driven**: Open-source and community-focused, welcoming contributions and collaborative development.

## Packages

- [`@weaverse/core`](https://github.com/Weaverse/weaverse/tree/main/packages/core): Foundation package with core logic
  and framework-agnostic code.
- [`@weaverse/react`](https://github.com/Weaverse/weaverse/tree/main/packages/react): React components and utilities for
  CMS integration.
- [`@weaverse/hydrogen`](https://github.com/Weaverse/weaverse/tree/main/packages/hydrogen): SDK for Shopify Hydrogen
  integration with Weaverse CMS.
- [`@weaverse/remix`](https://github.com/Weaverse/weaverse/tree/main/packages/remix): Integration tools for Remix
  applications with Weaverse CMS.
- [`@weaverse/next`](https://github.com/Weaverse/weaverse/tree/main/packages/next): Utilities for integrating Next.js
  applications with Weaverse CMS.

## Installation & Development

### Getting Started

1. **Fork & Clone**: Fork this repository and clone it to your local machine.

2. **Submodule Setup**: Initialize and update the submodule to pull the sample project:
   ```bash
   git submodule init
   git submodule update --recursive
   ```

3. **Install Dependencies**: Navigate to the desired package or sample project and install dependencies:
   ```bash
   npm install
   ```

4. **Run Development Server**: Start the development server:
   ```bash
   npm run dev
   ```

### Contributing

Your contributions are welcome to further enhance the Weaverse SDKs. Feel free to fork the repository, make changes, and
submit pull requests with your improvements.

## License

This project is open-source and licensed under the MIT License.

## About The Weaverse Team

Passionate about empowering developers, The Weaverse Team is committed to creating innovative tools and solutions that
simplify and enhance web development. Our focus is on fostering a vibrant community and driving forward the evolution of
web technologies.
