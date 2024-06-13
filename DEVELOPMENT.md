# Weaverse SDKs Development

These instructions are for internal Weaverse development. If you're looking to contribute to the Weaverse SDKs, please refer to the [Contribution Guidelines](./CONTRIBUTING.md).

## Workflow

We currently use [pnpm](https://pnpm.io) to develop our SDKs.

1. **Fork & Clone**: Fork this repository and clone it to your local machine.

2. **Install Dependencies**: Navigate to the desired package or sample project and install dependencies:

   ```bash
   pnpm install
   ```

3. **Run Development Server**: Start the development server:
   ```bash
   pnpm run dev
   ```

## Releases

We're using [Changesets](https://github.com/changesets/changesets) to manage our releases. When you're ready to begin the
release process, follow these steps:

1. Run `pnpm changeset` to create a new changeset.
2. Run `pnpm changeset version` to bump the version of the packages that need to be upgraded.
3. Run `pnpm changeset publish` to publish the new version of the packages to `npm`.
4. Commit and push the changes to the `main` branch.
5. Release the new version of the packages on GitHub.