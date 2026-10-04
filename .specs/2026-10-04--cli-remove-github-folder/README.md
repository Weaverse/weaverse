# Feature: CLI Removes Template .github Folder

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | in-progress                                              |
| **Owner**        | @hta218                                                  |
| **Issue**        | [#532](https://github.com/Weaverse/weaverse/issues/532)  |
| **Branch**       | `fix/cli-remove-github-folder`                           |
| **Created**      | 2026-10-04                                               |
| **Last Updated** | 2026-10-04                                               |

## Initiating Requirement

> Weaverse plans to retire `Weaverse/pilot-demo` and connect Shopify Oxygen deployment directly to `Weaverse/pilot`. Connecting Oxygen commits `.github/workflows/oxygen-deployment-<storefront-id>.yml`, which uses the Weaverse demo storefront's deployment token secret and runs on every push. `pilot` also ships the internal workflows `ci.yml` and `claude-code-review.yml` (the latter needs a `CLAUDE_CODE_OAUTH_TOKEN` secret).
>
> `@weaverse/cli create` currently removes only `.weaverse/` after extracting a template (`packages/cli/src/utils/download.js`), so `.github/` reaches the developer's project and its workflows fail on their first push.
>
> - Remove `.github/` after extraction, next to the existing `.weaverse/` cleanup in `downloadAndExtractTemplate()`.
> - Apply it to every template (pilot, naturelle, aspen, maison).
> - Cover the removal with a CLI test.
> - A project created with `npx @weaverse/cli@latest create --template=pilot` contains no `.github/` folder, and a missing `.github/` folder (including older `--commit` downloads) does not cause an error.
> - Releasing a CLI patch version follows the normal release flow.
>
> Related: `Weaverse/pilot#181` (Pilot setup guide), `Weaverse/docs#56` (docs installation guide), parent `Weaverse/pilot#182`.

## Summary

After extracting a template, the CLI deletes the Weaverse-internal `.weaverse/` and `.github/` folders, so new projects never inherit Weaverse's deployment, CI, or code-review workflows and their secrets dependencies.
