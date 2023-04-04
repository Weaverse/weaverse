## SDKS Turbo repo

### How to setup:
* The project is using git submodules for templates so for the first time cloning this project, if the submodule is not yet downloaded, use the following command:
  ```bash
    git submodule update --init --recursive
  ```
* To start developing Weaverse SDKS and Hydrogen demo, use the command: `npm run dev` or `nr dev`.
* In order to make the `weaverse-hydrogen` project to watch sdks packages change, you can manually set the `rexmi.config.js` `watchPaths` like this: 
  `watchPaths: ['./public', '../../packages/hydrogen/dist/index.js'],`

* However, do not commit it because this is template project and normal users don't need that. To make git stop track that file change, you can use following command in `weaverse-project`: 
  `git update-index --assume-unchanged ./remix.config.js` 
* If you need git to track that file again, use the command:
`git update-index --no-assume-unchanged ./remix.config.js`

### Note for commiting git project with submodule:
* We should commit & push the submodule update first then after the submodule got latest commit code => commit the sdks packages with the latest submodule signature

### Upgrade all packages

To upgrade all packages use: `nr up`
Add `-p=true` flag to publish all packages to **npm**