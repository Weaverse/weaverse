# Releasing Weaverse SDKs — Skill Design

A Claude Code skill for releasing `@weaverse/*` npm packages from the SDKs monorepo. Replaces the changesets-based workflow with a direct, non-interactive release ritual using git tags, GitHub Releases, and `bun publish`.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Version groups | Fixed group (core, react, hydrogen) + independent packages | Core trio always moves together; schema/cli/biome/i18n evolve independently |
| Versioning | Manual semver bump (patch/minor/major) | AI specifies bump type explicitly; no interactive prompts |
| Tag format | `v{VERSION}` for fixed group, `@weaverse/{pkg}@{VERSION}` for independents | Unified tag for the trio; per-package tags for others |
| Release scope | Selective — user specifies which packages | Avoids unnecessary publishes |
| Branch flow | Release from main, sync to dev | Matches Builder pattern |
| Publish command | `bun publish --access public` | Project uses bun exclusively |
| Skill location | `weaverse/.claude/skills/releasing-weaverse-sdks/SKILL.md` | Shared with team via repo |
| Changeset removal | Full cleanup | No longer needed |

## Package Inventory

| Package | Current Version | Group | Status |
|---------|----------------|-------|--------|
| @weaverse/core | 5.9.3 | fixed | Active |
| @weaverse/react | 5.9.3 | fixed | Active |
| @weaverse/hydrogen | 5.9.3 | fixed | Active |
| @weaverse/schema | 0.8.2 | independent | Active |
| @weaverse/cli | 5.5.2 | independent | Active |
| @weaverse/biome | 5.7.3 | independent | Active |
| @weaverse/i18n | 1.1.2 | independent | Active |
| @weaverse/shopify | 5.8.4 | — | Archived (never release) |

### Dependency Order (Fixed Group)

```
core (no internal deps)
  → react (depends on core)
    → hydrogen (depends on react + schema)
```

Publishing and building must follow this order.

## The Release Ritual

### Pre-requisite: Parse Release Intent

From the user's request, determine:
- **Target:** `fixed-group` or specific independent package name(s)
- **Bump type:** `patch`, `minor`, or `major`

Example triggers: "release the fixed group as minor", "release schema as patch", "bump cli to 5.6.0"

### Step 1: Ensure on `main` with latest

```bash
git checkout main && git pull origin main
```

Verify the working tree is clean. If not, stop.

### Step 2: Check npm auth

```bash
npm whoami
```

Must be authenticated. Fail early if not.

### Step 3: Calculate New Versions

Read current version from each target package's `package.json`. Apply semver bump:
- `patch`: 5.9.3 → 5.9.4
- `minor`: 5.9.3 → 5.10.0
- `major`: 5.9.3 → 6.0.0

For the fixed group, all three packages get the same new version.

Print the version plan for confirmation before proceeding.

### Step 4: Run Verification

```bash
bun run biome && bun run typecheck && bun run test
```

All three must pass. Do not proceed if any fail.

### Step 5: Build All Packages

```bash
bun run build
```

Turbo builds in dependency order. Must succeed.

### Step 6: Bump Versions in package.json Files

For each target package:
1. Update `"version"` field to new version
2. Update internal dependency references (e.g., hydrogen's dep on `@weaverse/react` gets bumped to the new fixed group version)

### Step 7: Commit the Release

```bash
git add packages/*/package.json
git commit -m "release: v5.10.0 (core, react, hydrogen)"
# or for independent: "release: @weaverse/schema@0.8.3"
```

### Step 8: Publish to npm

In dependency order, for each target package:

```bash
cd packages/core && bun publish --access public
cd packages/react && bun publish --access public
cd packages/hydrogen && bun publish --access public
```

Verify each publish succeeds before continuing to the next. If one fails, stop and report what succeeded.

### Step 9: Tag and Push

```bash
# Fixed group
git tag "v5.10.0"

# Independent packages (if releasing any)
git tag "@weaverse/schema@0.8.3"

git push origin main --follow-tags
```

### Step 10: Create GitHub Release

```bash
# Fixed group
gh release create "v5.10.0" \
  --title "v5.10.0" \
  --generate-notes \
  --latest

# Independent packages (separate release per tag)
gh release create "@weaverse/schema@0.8.3" \
  --title "@weaverse/schema@0.8.3" \
  --generate-notes
```

### Step 11: Sync Dev Branch

```bash
git checkout dev && git pull origin dev
git merge main --no-edit
git push origin dev
git checkout main
```

### Step 12: Post-Release Verification

Check npm registry for each published package:

```bash
npm view @weaverse/core version
npm view @weaverse/react version
npm view @weaverse/hydrogen version
```

Print summary table:

| Package | Old Version | New Version | npm Status |
|---------|------------|-------------|------------|
| @weaverse/core | 5.9.3 | 5.10.0 | published |
| @weaverse/react | 5.9.3 | 5.10.0 | published |
| @weaverse/hydrogen | 5.9.3 | 5.10.0 | published |

## Edge Cases

| Scenario | Handling |
|----------|----------|
| npm auth missing | `npm whoami` check at Step 2, fail early |
| Build fails | Stop immediately at Step 5, don't publish |
| One package publish fails | Stop, report which succeeded and which failed |
| Internal dep version mismatch | Step 6 updates all internal references |
| Tag already exists | Check before creating, fail if tag exists |
| Working tree dirty | Step 1 checks for clean working tree |
| Dev branch has conflicts | Report conflict, let user resolve manually |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running `npm install` instead of `bun install` | This project uses bun only |
| Publishing without building first | Build must succeed before publish |
| Forgetting internal dep updates | Fixed group packages reference each other — update refs |
| Publishing in wrong order | Must be core → react → hydrogen |
| Not verifying npm registry after publish | Always check `npm view` to confirm |
| Hardcoding version numbers | Always read from package.json and compute |

## Changeset Cleanup (One-Time)

As part of implementing this skill, remove all changeset infrastructure:

1. Delete `.changeset/` directory (config.json and any files)
2. Remove `@changesets/cli` from root devDependencies
3. Remove `"changeset": "changeset"` from root package.json scripts
4. Update AGENTS.md — replace changeset release docs with new workflow reference

## Skill File Structure

```
weaverse/.claude/
  skills/
    releasing-weaverse-sdks/
      SKILL.md        # The release ritual skill
```

## Quick Reference

```
parse intent → main + latest → npm auth → calc versions → verify (biome+types+tests) →
build → bump versions → commit → publish to npm → tag → push → gh release → sync dev → verify npm
```
