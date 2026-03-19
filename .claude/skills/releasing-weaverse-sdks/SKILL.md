---
name: releasing-weaverse-sdks
description: Use when releasing @weaverse/* npm packages, bumping SDK versions, publishing to npm, or shipping the Weaverse SDKs. Triggers on "release sdk", "release weaverse", "publish packages", "release core", "release schema", "bump sdk version", "ship sdks".
---

# Releasing Weaverse SDKs

Release ritual for the `@weaverse/*` npm packages monorepo. Covers version bump, build, npm publish, git tagging, GitHub Release, and post-release verification.

**Announce at start:** "I'm using the releasing-weaverse-sdks skill to run the release ritual."

## Context

- **Public npm packages** under `@weaverse/*` scope
- **Package manager:** `bun` only for development (never `npm install`)
- **Publish command:** `npm publish` (from individual package directories)
- **Fixed version group:** core, react, hydrogen (always same version)
- **Independent packages:** schema, cli, biome, i18n (each has own version)
- **Never release:** next, remix (placeholders), shopify (archived)
- **Tag format:** `v{VERSION}` for fixed group, `@weaverse/{pkg}@{VERSION}` for independents
- **Internal deps use exact version pins** (e.g., `"@weaverse/core": "5.9.3"`)
- **Root `package.json` version is never bumped** (private monorepo root)

### Dependency Order

```
core (no internal deps)
  → react (depends on core)
    → hydrogen (depends on react + schema)
```

Build and publish MUST follow this order.

### Cross-Group Warning

Hydrogen depends on `@weaverse/schema` (independent group). When releasing schema independently, warn the user that hydrogen's dependency on schema is now stale. Suggest a follow-up fixed group release — but do NOT auto-bump.

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
bun run biome && bun run typecheck && bun run test
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

### Step 6: Update Lockfile

```bash
bun install
```

This regenerates the lockfile to reflect the new version strings.

### Step 7: Build All Packages

```bash
bun run build
```

Turbo builds in dependency order (core → react → hydrogen). Must succeed. Building after the version bump ensures any embedded version strings are correct.

### Step 8: Commit the Release

```bash
# Fixed group
git add packages/*/package.json bun.lock
git commit -m "release: v$NEW_VERSION (core, react, hydrogen)"

# Independent package
git add packages/$PKG/package.json bun.lock
git commit -m "release: @weaverse/$PKG@$NEW_VERSION"
```

Only stage `package.json` files and lockfile. Never use `git add -A`. Lefthook pre-commit hooks will run biome on staged files — this is expected and should pass.

### Step 9: Publish to npm

In dependency order, for each target package:

```bash
cd packages/core && npm publish && cd ../..
cd packages/react && npm publish && cd ../..
cd packages/hydrogen && npm publish && cd ../..
```

For independent packages:
```bash
cd packages/$PKG && npm publish && cd ../..
```

Verify each publish succeeds before continuing to the next. If one fails, stop and report which packages published successfully and which failed.

**Note:** The `--access public` flag is not needed as `publishConfig.access` is already set to `public` in each package's package.json.

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

### Step 12: Sync Dev Branch

```bash
git checkout dev && git pull origin dev
git merge main --no-edit
git push origin dev
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

## Rollback Guidance

If publish partially succeeds (e.g., core publishes but react fails):

1. **Do NOT revert the version commit** — the published package references the new version
2. **Do NOT npm unpublish** — it has restrictions and breaks consumers
3. **Fix the failure cause** (usually auth or network), then re-run `npm publish` only for remaining packages
4. **Continue the ritual** from Step 10 once all packages are published
5. If unrecoverable, document the partial state and manually create tag/release noting which packages were published

## Quick Reference

```
parse intent → main + latest → npm auth (if not set) → calc versions (confirm) →
verify (biome+types+tests) → bump versions → bun install → build →
commit → publish to npm (per-package) → tag → push → gh release → sync dev → verify npm
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running `npm install` instead of `bun install` | This project uses bun only |
| Publishing without npm auth configured | Run `npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN` once |
| Publishing without building first | Build must succeed before publish |
| Forgetting internal dep updates | Fixed group packages reference each other — update the exact pins |
| Publishing in wrong order | Must be core → react → hydrogen (dependency order) |
| Not verifying npm registry after publish | Always check `npm view` to confirm |
| Hardcoding version numbers | Always read from package.json and compute |
| Mixing fixed + independent in one release | Run separate rituals for each scope |
| Using `git add -A` for release commit | Only stage package.json files and bun.lock |
