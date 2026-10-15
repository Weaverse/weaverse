# Forward in `@weaverse/cli create`

Issue: [#541](https://github.com/Weaverse/weaverse/issues/541)

## Outcome

`npx @weaverse/cli create --template forward` scaffolds Forward, the Next.js starter theme on `@weaverse/next`, the way `--template pilot` scaffolds a Hydrogen theme: it downloads the theme, writes `.env` with the Weaverse project ID, installs dependencies, and prints next steps that are right for Forward. The docs' Next.js quickstart then gets a one-command start.

## Scope & contract

- **Template entry** `forward` in `packages/cli/src/constants/templates.js`: repository `https://github.com/Weaverse/forward`, folder `forward-main`, demo `https://forward-sandy.vercel.app`. Every template now declares:
  - `framework` (`hydrogen` | `nextjs`)
  - `packageManager` (`npm` | `bun`)
  - `devPort`
  Existing templates are `hydrogen` / `npm` / `3456`, so their behavior is unchanged.
- **Package manager:** Forward installs with Bun only (`bun install`, keeping `bun.lock`), and every printed command uses `bun run`. Hydrogen templates keep `npm install --legacy-peer-deps` and still drop `package-lock.json`.
- **Bun check:** for a Bun template, the CLI checks `bun --version` before downloading, unless `--no-install` is passed.
  - Interactive: it offers to install Bun with `npm install -g bun`, then checks again.
  - Declined, or the install fails: it stops with install instructions.
  - Non-interactive: it never installs anything; it fails with the same instructions (pass `--no-install` to skip).
- **Environment:** `.env` comes from the template's `.env.example` with `WEAVERSE_PROJECT_ID` set. `SESSION_SECRET` is generated only for Hydrogen templates; Forward has no such key.
- **Dev server:** the "start the development server now?" prompt and `--dev` behave as for Hydrogen templates, using `bun run dev`.
- **Next steps for Forward:**
  - Forward does not run without a Shopify store. Add `PUBLIC_STORE_DOMAIN`, `PRIVATE_STOREFRONT_API_TOKEN` and `PUBLIC_STOREFRONT_API_TOKEN` from the Headless channel to `.env`.
  - Then `bun run dev`, open `http://localhost:3333`, and connect it in Weaverse Studio.
  - A link to the Next.js quickstart.
  Hydrogen next steps are unchanged.
- **Help and listing text** no longer say "Shopify Hydrogen project" and name each template's framework.
- **Non-goals:**
  - other package managers for Forward
  - prompting for Shopify credentials
  - changing Forward's own scripts
- **Related work, other sub-issues of #541:**
  - Forward's public `AGENTS.md`, `LICENSE` and version `1.0.0` (Weaverse/forward)
  - the docs quickstart update and the `@weaverse/cli` release after merge

## Acceptance

- `create --template forward`, interactive and non-interactive, downloads Forward without `.weaverse`/`.github`, writes `.env` with the project ID and no `SESSION_SECRET`, runs `bun install`, and prints Forward's next steps. `bun run dev` starts on port 3333 once the Shopify keys are set.
- Without Bun:
  - interactive offers the install;
  - non-interactive fails before downloading, with instructions;
  - `--no-install` skips the check.
- Pilot, Naturelle, Aspen and Maison behave exactly as before (same install command, env, next steps).
- Unit tests cover:
  - template metadata
  - the env behavior per framework
  - install command selection
  - the Bun check (present, absent interactive accept/decline, absent non-interactive, `--no-install`)
  - next-step output per framework

## Approach

- `templates.js`: add the three fields to every entry and the `forward` entry.
- New `src/utils/bun.js`: `hasBun()` (`bun --version` via `cross-spawn` sync), `installBun()` (`npm install -g bun`), `ensureBun({ nonInteractive, confirm })` returning or throwing an actionable error.
- `create.js`: resolve the template, then call `ensureBun` before downloading when the template uses Bun and install is not skipped; pass the template to env, install, dev and next-step helpers.
- `environment.js`: `createEnvFile(path, projectId, { sessionSecret })`, defaulting to `true` for existing callers.
- `install.js`: install and dev commands come from `template.packageManager`; next steps come from one `printNextSteps(projectName, template, { installed })` with a Hydrogen and a Next.js variant.

## Verification

- `pnpm run biome` (no new warnings), `typecheck`, `test` (CLI: 25 tests, 13 new) and `package:check` pass.
- Real runs of the workspace CLI against GitHub:
  - `--template forward --yes` with Bun:
    - the download has no `.weaverse` or `.github`
    - `.env` has the project ID and no `SESSION_SECRET`
    - `bun install` runs, `bun.lock` is kept and no `package-lock.json` is created
    - it prints Forward's next steps
  - Without Bun on `PATH`:
    - `--yes` fails before downloading, with the instructions, and creates no folder
    - `--yes --no-install` downloads and prints `bun install` as a step
  - Interactive, through `script`:
    - Declining the Bun install stops with the instructions and creates no folder.
    - Accepting runs `npm install -g bun` (a stubbed `npm`), then checks `bun --version` again.
    - The download step could not be exercised under `script`: the unmodified CLI on `main` spins in the same place with Pilot. That is the harness (ora under a fake pty), so this path is left for a real terminal.
  - `--template pilot --yes --no-install`: next steps and `SESSION_SECRET` generation are unchanged.
- **The scaffolded Forward, with the three Shopify keys set, serves `/` and `/shop` (200) through `bun run dev`.** That needed a Forward fix: its `.env.example` shipped a placeholder `PUBLIC_STOREFRONT_ORIGIN`, which made the all-or-none Customer Account group read as partially configured (500). Fixed in Weaverse/forward#104.
