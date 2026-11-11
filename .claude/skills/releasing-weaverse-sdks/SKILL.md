---
name: releasing-weaverse-sdks
description: Use when releasing @weaverse/* npm packages, bumping SDK versions, publishing to npm, or shipping the Weaverse SDKs. Triggers on "release sdk", "release weaverse", "publish packages", "release core", "release schema", "bump sdk version", "ship sdks".
---

# Releasing Weaverse SDKs

Release ritual for the `@weaverse/*` npm packages monorepo. Covers version bump, build, npm publish, git tagging, GitHub Release, and post-release verification.

**Announce at start:** "I'm using the releasing-weaverse-sdks skill to run the release ritual."

## Context

- **Public npm packages** under `@weaverse/*` scope
- **Package manager:** `pnpm` only for development (never `npm install` or `bun install`)
- **Publish command:** `npm publish` (from individual package directories)
- **Fixed version group:** core, react, hydrogen (always same version)
- **Independent packages:** schema, cli, biome, i18n (each has own version)
- **Next.js adapter:** ships inside `@weaverse/hydrogen` (`/next`, `/next/server`), so it is released with the fixed group and needs no bump of its own
- **Never release:** remix (placeholder), shopify and next (archived)
- **Tag format:** `v{VERSION}` for fixed group, `@weaverse/{pkg}@{VERSION}` for independents
- **Internal deps use exact version pins** (e.g., `"@weaverse/core": "5.9.3"`)
- **Root `package.json` version is never bumped** (private monorepo root)

### Critical: workspace packages do NOT link locally

`link-workspace-packages` was **deliberately removed** from `.npmrc` in commit
`73b71ba7` (Dec 5 2025). Internal `@weaverse/*` deps with exact pins resolve
through the public npm registry, not as workspace links. This has a release
flow consequence: you **cannot run `pnpm install` after bumping versions but
before publishing** — the new versions don't exist on npm yet, so install
fails with `ERR_PNPM_NO_MATCHING_VERSION`.

The correct order is **bootstrap publish**: bump all → build (no install
needed) → publish in dep order → install (now finds new versions on npm)
→ commit (with refreshed lockfile). Steps 5-8 below implement this.

### Dependency Order

```
core (no internal deps)
  → react (depends on core)
    → hydrogen (depends on react + schema)
```

Build and publish MUST follow this order.

### Cross-Group Warning

Hydrogen depends on `@weaverse/schema` (independent group). When releasing schema independently, warn the user that hydrogen's dependency on schema is now stale. Suggest a follow-up fixed group release — but do NOT auto-bump.

### One-time: deprecate `@weaverse/next`

`@weaverse/next` is archived (`archived/next`); its code ships as `@weaverse/hydrogen/next` and `/next/server`. On the **first fixed-group release after the archive** (the first `@weaverse/hydrogen` that no longer depends on `@weaverse/next`), once Step 13 confirms that hydrogen version is on npm, deprecate the package (needs the user's npm OTP):

```bash
npm deprecate @weaverse/next "Use @weaverse/hydrogen/next instead"
```

Verify with `npm view @weaverse/next deprecated`, record it in the Step 13 summary, then delete this section. Already-published versions keep installing; never unpublish them.

## The Release Ritual

Execute these steps in order. Do NOT skip steps or reorder.

### Pre-requisite: Parse Release Intent

From the user's request, determine:
- **Target:** `fixed-group` (core + react + hydrogen) OR specific independent package(s)
- **Bump type:** `patch`, `minor`, or `major`

Only one scope per ritual — either the fixed group OR independent package(s). Do not mix. Run separate rituals if needed.

### Step 1: Ensure on `main` with latest

```bash
git checkout main && git pull origin main
git status --porcelain
```

Working tree must be clean. If dirty, stop and ask the user to resolve.

**Exception:** `templates/pilot` (git submodule) may show as modified — this is a separate repo and irrelevant to npm releases. Ignore it.

### Step 2: Configure npm auth (one-time setup)

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

Replace `YOUR_TOKEN` with your npm access token. This is a one-time setup; if already configured, skip to Step 3.

To verify auth is configured:
```bash
npm whoami
```

### Step 3: Calculate New Versions

Read the current version from each target package's `package.json`:

```bash
# Fixed group — read from core (all three are the same)
node -e "console.log(require('./packages/core/package.json').version)"

# Independent — read from the specific package
node -e "console.log(require('./packages/schema/package.json').version)"
```

Apply the semver bump:
- `patch`: 5.9.3 → 5.9.4
- `minor`: 5.9.3 → 5.10.0
- `major`: 5.9.3 → 6.0.0

**Present the version plan to the user and wait for explicit confirmation before proceeding:**

> Releasing fixed group: 5.9.3 → 5.10.0 (minor)
> - @weaverse/core: 5.9.3 → 5.10.0
> - @weaverse/react: 5.9.3 → 5.10.0
> - @weaverse/hydrogen: 5.9.3 → 5.10.0
>
> Proceed?

### Step 4: Run Verification

```bash
pnpm run biome && pnpm run typecheck && pnpm run test
```

Always runs across ALL packages regardless of release scope. All three MUST pass. Do not proceed if any fail.

### Step 5: Bump Versions in package.json Files

For each target package, edit `package.json`:
1. Update `"version"` field to the new version
2. Update internal dependency references using **exact pins**:
   - When bumping the fixed group, also update:
     - `packages/react/package.json` → `"@weaverse/core": "NEW_VERSION"`
     - `packages/hydrogen/package.json` → `"@weaverse/react": "NEW_VERSION"`
   - When bumping schema independently, do NOT auto-update hydrogen's dep on schema

**Do not run `pnpm install` yet.** The new versions don't exist on npm; install
would fail (see the "Critical: workspace packages do NOT link locally" note
above). The lockfile is regenerated in Step 8 after publish.

### Step 6: Build All Packages

```bash
pnpm run build
```

Turbo builds in dependency order (core → react → hydrogen). `vp pack` bundles
local source and the pinned tsrs CLI emits declarations — no install needed for the build itself. Must succeed.

Quick sanity check after build (optional but recommended):
```bash
for pkg in core react hydrogen; do
  printf "%-25s built v%s\n" "$pkg" \
    "$(node -e "console.log(require('./packages/$pkg/package.json').version)")"
done
```

### Step 7: Publish to npm (dependency order)

```bash
cd packages/core && npm publish && cd ../..
cd packages/react && npm publish && cd ../..
cd packages/hydrogen && npm publish && cd ../..
```

A prerelease of the fixed group publishes with `--tag` (for example `beta`) so it doesn't take `latest`.

For independent packages:
```bash
cd packages/$PKG && npm publish && cd ../..
```

Verify each publish succeeds before continuing to the next. If one fails,
stop and follow the **Rollback Guidance** section below.

**Note:** The `--access public` flag is not needed as `publishConfig.access`
is already set to `public` in each package's `package.json`.

### Step 8: Refresh Lockfile (now that new versions exist on npm)

```bash
pnpm install
```

Now that all bumped packages are published, `pnpm install` succeeds and
updates `pnpm-lock.yaml` to point at the new versions. Verify the diff is
limited to internal `@weaverse/*` specifier/version bumps plus any
transitive churn from `pnpm install`:

```bash
git diff --stat pnpm-lock.yaml
awk '/packages\/hydrogen:/{p=1} p; /packages\/i18n:/{p=0}' pnpm-lock.yaml \
  | grep -B1 -A1 "@weaverse"
```

Internal deps should still show `specifier: <NEW_VERSION>` resolved from
the registry (NOT `link:../<pkg>`). If they show as `link:`, something
added `link-workspace-packages=true` somewhere — abort and investigate.

### Step 9: Commit the Release

```bash
# Fixed group
git add packages/*/package.json pnpm-lock.yaml
git commit -m "release: v$NEW_VERSION (core, react, hydrogen)"

# Independent package
git add packages/$PKG/package.json pnpm-lock.yaml
git commit -m "release: @weaverse/$PKG@$NEW_VERSION"
```

Only stage `package.json` files and `pnpm-lock.yaml`. Never use `git add -A`.
Lefthook pre-commit hooks will run biome on staged files — this is expected
and should pass.

### Step 10: Tag and Push

```bash
# Check tag doesn't already exist
TAG="v$NEW_VERSION"  # or "@weaverse/$PKG@$NEW_VERSION" for independents
git tag -l "$TAG" | grep -q . && echo "ERROR: Tag $TAG already exists!" && exit 1

# Create the tag
git tag "$TAG"

# Push commit and tag
git push origin main --follow-tags
```

### Step 11: Create GitHub Release

```bash
# Fixed group
gh release create "v$NEW_VERSION" \
  --title "v$NEW_VERSION" \
  --generate-notes \
  --latest

# Independent packages
gh release create "@weaverse/$PKG@$NEW_VERSION" \
  --title "@weaverse/$PKG@$NEW_VERSION" \
  --generate-notes
```

For first-time independent package tags, `--generate-notes` generates notes from all commits. This is expected.

### Step 11b: Open the Public Changelog PR

After each stable GitHub Release from Step 11 is published, run the
`update-changelogs` skill from the `Weaverse/workspace` checkout
(`skills/update-changelogs/SKILL.md`) with `repo=Weaverse/weaverse` and
`tag=` the exact published tag: `v$NEW_VERSION` for the fixed group, or
`@weaverse/$PKG@$NEW_VERSION` once per independent package released. That
skill owns every changelog rule (which releases count, labels, dates, dedupe,
entry copy, and the PR to `Weaverse/docs:main`). Never push the changelog to
`main` directly.

Skip prereleases and drafts; record them as skipped. If the workspace
checkout is missing, read the skill from `Weaverse/workspace` on GitHub; if it
still cannot run, record the handoff as not done with the reason. Never report
a changelog PR that was not opened.

Record one result per tag for the Step 13 summary: the changelog PR link it
opened, the existing entry or open PR link that already covers the release, or
the reason it was skipped (for example, no user-facing changes). Do not wait
for the docs PR review or merge, and a changelog problem never rolls back or
blocks the npm release: continue to Step 12.

### Step 11c: Update Agent Guidance

When the release changes a major version, adds or renames an entry point (such
as `@weaverse/hydrogen/react-router`) or renames exported types, update the
guidance coding agents read in the same release:

- `Weaverse/docs`: `docs.json` → `markdown.instructions`, which tops
  `llms.txt`, `llms-full.txt` and every page's `.md`.
- The weaverse.io website source: the "Guidance for coding agents" list in
  `public/llms.txt` (served at `weaverse.io/llms.txt`).
- `Weaverse/shopify-hydrogen-skills`: the affected skills. Then re-pin the
  website's `other/agent-skills.json` (served at
  `weaverse.io/.well-known/agent-skills/index.json`) to the new skills commit
  with recomputed `sha256` digests.

Skip this step when the release changes none of these, and record which
applied in the Step 13 summary.

### Step 12: Sync Dev Branch

```bash
git checkout dev 2>/dev/null && git pull origin dev && \
  git merge main --no-edit && git push origin dev && \
  git checkout main
```

If the `dev` branch doesn't exist on remote, skip this step and note it.

### Step 13: Post-Release Verification

Check npm registry for each published package (may need a few seconds to propagate):

```bash
npm view @weaverse/core version
npm view @weaverse/react version
npm view @weaverse/hydrogen version
```

If `npm view` still shows the old version, wait 5 seconds and retry once.

Print summary table:

| Package | Old Version | New Version | npm Status |
|---------|------------|-------------|------------|
| @weaverse/core | X.Y.Z | A.B.C | ✅ published |
| @weaverse/react | X.Y.Z | A.B.C | ✅ published |
| @weaverse/hydrogen | X.Y.Z | A.B.C | ✅ published |

Then report the Step 11b changelog result for each tag:

| Tag | Changelog |
|-----|-----------|
| vA.B.C | PR opened: <docs PR link> / already covered: <entry or PR link> / skipped: <reason> |

## Rollback Guidance

If publish partially succeeds (e.g., core publishes but react fails):

1. **Do NOT revert the version bumps yet** — the already-published package(s) reference the new version, and you need the bumps to retry the failed publish.
2. **Do NOT `npm unpublish`** — it has restrictions and breaks consumers.
3. **Fix the failure cause** (usually auth, network, or a forgotten internal dep pin), then re-run `npm publish` only for the remaining packages from Step 7.
4. **Continue from Step 8** (lockfile refresh) once all packages are published.
5. If unrecoverable, you can revert local `package.json` and lockfile changes (no commit has landed yet at Step 7) and document the partial state — the failed-mid-publish slot can be filled by the next release (e.g., bump straight to 5.13.2).

Key property of the bootstrap order: **no commit/tag/push happens until all
publishes succeed**, so a mid-publish failure leaves git untouched.

## Quick Reference

```
parse intent → main + latest → npm auth (if not set) → calc versions (confirm) →
verify (biome+types+tests) → bump versions → build (no install) →
publish core → react → hydrogen → pnpm install (refresh lockfile) →
commit → tag → push → gh release → changelog per stable tag (update-changelogs) →
agent guidance (major version, entry point or type renames) →
sync dev → verify npm + report changelog results
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running `pnpm install` *before* publish (between Step 5 and Step 7) | Skip it. `link-workspace-packages` is intentionally off; install would fail with `ERR_PNPM_NO_MATCHING_VERSION` because the new versions aren't on npm yet. `pnpm install` happens **after** publish in Step 8. |
| "Fixing" install failures by adding `link-workspace-packages=true` to `.npmrc` | Don't — that flag was deliberately removed in commit `73b71ba7`. The bootstrap publish order is the supported flow. |
| Running `npm install` or `bun install` instead of `pnpm install` | This project uses pnpm only (see `pnpm-lock.yaml` + `pnpm-workspace.yaml`) |
| Publishing without npm auth configured | Run `npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN` once |
| Publishing without building first | Build must succeed before publish |
| Forgetting internal dep updates | Fixed group packages reference each other — update the exact pins |
| Publishing in wrong order | Must be core → react → hydrogen (dependency order) |
| Bumping or publishing `@weaverse/next` | It is archived; the Next.js adapter ships in `@weaverse/hydrogen` |
| Not verifying npm registry after publish | Always check `npm view` to confirm |
| Hardcoding version numbers | Always read from `package.json` and compute |
| Mixing fixed + independent in one release | Run separate rituals for each scope |
| Using `git add -A` for release commit | Only stage `package.json` files and `pnpm-lock.yaml` |
| Committing version bumps before publishes succeed | Commit happens **after** publish (Step 9). Keeps git clean if mid-publish fails. |
