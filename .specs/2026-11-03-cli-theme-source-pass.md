# Partner theme source install in `@weaverse/cli create --pass`

Issue: [Weaverse/builder#3255](https://github.com/Weaverse/builder/issues/3255) (CLI side; the shared contract lives with the Weaverse Partner Program spec)

## Outcome

A shop with a license for a partner theme copies `npx @weaverse/cli@latest create --pass=<pass>` from its Weaverse dashboard and gets the theme's source as a local project, set up the same way as a template project. The pass is one-time and short-lived, so the CLI never stores or re-sends it.

## Scope & contract

- **Flag:** `create --pass=<pass>` replaces `--template`. `--pass` with `--template` or `--commit` fails before any request. Without `--pass`, the template flow is unchanged.
- **Builder origin:** `https://studio.weaverse.io`; overridden by the hidden `--api-base` flag, then the `WEAVERSE_BUILDER_URL` env var (testing only).
- **Request:** `POST {origin}/api/public/theme-source` with JSON `{ "pass": "<pass>" }`. The request spends the pass.
  - 200: `{ url, handle, fileName, sha256, revisionId }`; `url` is a presigned GET valid about 2 minutes, `sha256` the hex SHA-256 of the zip bytes. A body without these fields is an error.
  - Errors carry `{ "error": code }`. The CLI prints one message per code and exits 1:

    | Code | Message ends with |
    | --- | --- |
    | `invalid_pass` | check the whole command was copied; get a new install command |
    | `expired_pass`, `used_pass`, `not_found` | get a new install command from your Weaverse dashboard |
    | `no_license` | check the theme in your Weaverse dashboard |
    | `rate_limited` | wait a minute, then retry with a new install command |

    Other statuses and network failures print the HTTP status or the unreachable origin.
- **Download:** the zip is held in memory and checked against `sha256` before anything is written. A mismatch aborts with nothing on disk.
- **Extraction:** the whole zip is rejected, with nothing written, when any entry is a symlink or hard link, or has an absolute path, a drive letter, a backslash or a `..` segment. Every write is checked to resolve inside the project folder.
  - Size: before anything is inflated, the central directory is read and the zip is rejected, with nothing written, when it declares more than 20,000 entries or more than 500 MB unpacked in total. Declared sizes are enforced while inflating.
  - Layout: a root `package.json` means the project is at the zip root. Otherwise, when every nested entry shares one top-level folder, that folder becomes the project root and loose root-level files beside it are skipped. `__MACOSX/` entries are ignored. Any entry whose name ends in `/` is a folder, even when the zip stores no mode bits for it.
  - A failure during extraction removes what was written.
- **Folder:** `--project-name`, else the theme handle. A non-empty folder needs `--force` (non-interactive) or a confirmation prompt, as in the template flow. A `--project-name` folder is checked before the pass is spent; the handle folder only after, because the handle comes from the response. The folder is emptied only after the download is verified.
- **Project ID:** `--project-id` (validated like the template flow) is checked before the pass is spent. Without it, an interactive run asks for it before the request (an empty answer skips it); a non-interactive run goes on without one. Builder's dashboard command includes `--project-id` when the merchant picked or just created a project.
- **Post-steps:** reuse the template flow.
  - `.env`: always written from `.env.example` (or from scratch when there is none) with a generated `SESSION_SECRET`, and `WEAVERSE_PROJECT_ID` when there is a project ID. Without one, `WEAVERSE_PROJECT_ID` stays as `.env.example` has it and the next steps say to set it.
  - Next steps: a partner theme's `.env.example` may have no demo store, so the steps list connecting the Shopify store (`npx shopify hydrogen env pull` or the Headless channel) before `dev`, instead of the template flow's "the demo store works out of the box".
  - Install and dev: `--no-install`, `--dev`/`--no-dev` and the prompts work as in the template flow. The package manager is Bun when the source ships `bun.lock`/`bun.lockb` (with the same Bun check), npm otherwise. The printed dev port comes from `--port` in the `dev` script, else 3000.
- **Non-goals:** storing the pass, retries, resuming a spent pass, Page Templates, theme release selection (the pass is bound to the live revision by Builder).
- **Release:** this must not be published to npm until Builder's `/api/public/theme-source` is live.

## Acceptance

- `create --pass=<pass> --project-id=<id> --no-install --yes` against a Builder that returns a valid source creates `<handle>/` with the project files at its root and `.env` holding the project ID.
- Each error code prints its message and exits 1; a used or expired pass points to the dashboard.
- A checksum mismatch, a symlink entry or a traversal entry aborts with no project folder left behind and nothing written outside it.
- Root and single-folder zips both land at the project root.
- `--pass` with `--template`, an invalid `--project-id`, or a non-empty `--project-name` folder and no `--force`, fails without calling Builder.
- An interactive run without `--project-id` asks for it before calling Builder and writes the answer to `.env`; a run without any project ID still writes `.env` with a generated `SESSION_SECRET`.
- Template runs behave exactly as before.

## Approach

- `src/utils/theme-source.js`: `resolveApiBase`, `requestThemeSource`, `downloadThemeSource` (SHA-256 check), `planThemeSourceFiles` (pure entry validation and layout), `extractThemeSource` (writes the plan via `decompress` without its own writer), `detectThemeSetup`.
- `src/commands/create-from-pass.js`: the flow above; `create.js` dispatches to it when `--pass` is present.
- `src/utils/project-setup.js`: the overwrite confirmation, package-manager check and install/dev steps, moved out of `create.js` so both flows share them.
- `createEnvFile` tolerates a missing `.env.example` and a missing project ID.
- `getNextSteps` has a partner-theme branch (`template.partnerTheme`).

## Verification

- `__tests__/theme-source.test.js` with mocked `fetch` and in-memory zips (`__tests__/helpers/zip.js`): origin precedence, request shape, every error code, malformed success body, network failure, checksum match and mismatch, root and single-folder layout, `__MACOSX` and loose files, folder entries without mode bits, unsafe paths, symlinks, the entry-count and unpacked-size limits (with small injected limits), extraction cleanup, setup detection, and the end-to-end flow (success, mismatch, flag conflict, non-empty folder).
- A local run of the CLI against a stub Builder server: success with `.env`, a `used_pass` error and the `--template` conflict; an interactive run in a terminal answering the project ID prompt.
