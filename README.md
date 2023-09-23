# Weaverse monorepo

Seamlessly integrate your existing ecommerce store into Shopify with Weaverse.

### Setup

- The project is using git submodules for templates so for the first time cloning this project, if the submodule is not yet downloaded, use the following command:
  ```bash
    git submodule update --init --recursive
  ```
- Start developing Weaverse SDKs and Hydrogen demo with `npm run dev` or `nr dev`.
- In order to make the `pilot` template to watch SDKs changes, you can manually set the `rexmi.config.js` `watchPaths` like this:
  ```js
  watchPaths: [
    './public',
    './.env',
    '../../packages/core/dist/index.js',
    '../../packages/react/dist/index.js',
    '../../packages/hydrogen/dist/index.js',
  ],
  ```
  - However, do not commit it because this is template project and normal users don't need that. To make git stop track that file change, you can use following command in `weaverse-project`:
    `git update-index --assume-unchanged ./remix.config.js`
  - If you need git to track that file again, use the command:
    `git update-index --no-assume-unchanged ./remix.config.js`

### Note for commiting git project with submodule:

- We should commit & push the submodule update first then after the submodule got latest commit code => commit the sdks packages with the latest submodule signature

### How to upgrade packages?

To upgrade all packages, use: `nr up` or `npm run up` with these optional flags:

- Add `--patch` to upgrade all packages to the latest patch version
- Add `--minor` to upgrade all packages to the latest minor version
- Add `--major` to upgrade all packages to the latest major version
- Add `--version <version>` to upgrade/downgrade all packages to the specified version
- If no flag is provided, the default is `--patch`

E.g:

```bash
$ nr up # v1.0.0 -> v1.0.1
$ nr up --patch # v1.0.1 -> v1.0.2
$ nr up --minor # v1.0.2 -> v1.1.0
$ nr up --major # v1.1.0 -> v2.0.0
$ nr up --version 1.3.2 # v2.0.0 -> v1.3.2
```

- Add `-p` to publish all packages to npm after upgrading

E.g:

```bash
$ nr up --patch -p
# v1.0.1 -> v1.0.2 -> publish v1.0.2 to npm
```
