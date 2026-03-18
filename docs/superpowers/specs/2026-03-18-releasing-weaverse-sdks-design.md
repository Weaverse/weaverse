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

| Package | Group | Status |
|---------|-------|--------|
| @weaverse/core | fixed | Active |
| @weaverse/react | fixed | Active |
| @weaverse/hydrogen | fixed | Active |
| @weaverse/schema | independent | Active |
| @weaverse/cli | independent | Active |
| @weaverse/biome | independent | Active |
| @weaverse/i18n | independent | Active |
| @weaverse/next | — | Placeholder (never release) |
| @weaverse/remix | — | Placeholder (never release) |
| @weaverse/shopify | — | Archived in `archived/` (never release) |

Current versions are always read from each package's `package.json` at runtime. Never hardcode them.

### Dependency Order (Fixed Group)

```
core (no internal deps)
  → react (depends on core — exact pin)
    → hydrogen (depends on react — exact pin, + schema — exact pin)
```

All internal dependencies use **exact version pins** (e.g., `"@weaverse/core": "5.9.3"`, not `"^5.9.3"`).

Publishing and building must follow this order.

### Cross-Group Dependency: schema → hydrogen

Hydrogen depends on `@weaverse/schema` (independent group). When releasing schema independently, hydrogen's dependency on schema becomes stale. The skill should warn about this but NOT auto-bump hydrogen — the user decides whether to also release the fixed group to pick up the new schema version.

The root `package.json` version (`"5.0.0"`, private) is never bumped during releases.

## The Release Ritual

### Pre-requisite: Parse Release Intent

From the user's request, determine:
- **Target:** `fixed-group` or specific independent package name(s)
- **Bump type:** `patch`, `minor`, or `major`

Example triggers: "release the fixed group as minor", "release schema as patch", "bump cli to 5.6.0"

Only one scope per ritual — either the fixed group OR one/more independent packages. Do not mix fixed + independent in the same release. Run separate rituals if needed.

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

Print the version plan and ask the user to confirm before proceeding. Wait for explicit approval.

### Step 4: Run Verification

```bash
bun run biome && bun run typecheck && bun run test
```

Always runs across ALL packages regardless of release scope. All three must pass. Do not proceed if any fail.

### Step 5: Bump Versions in package.json Files

For each target package:
1. Update `"version"` field to new version
2. Update internal dependency references using exact pins (e.g., hydrogen's dep on `@weaverse/react` gets bumped to the new fixed group version)

### Step 6: Update Lockfile

```bash
bun install
```

This regenerates the lockfile to reflect the new version strings.

### Step 7: Build All Packages

```bash
bun run build
```

Turbo builds in dependency order. Must succeed. Building after version bump ensures any packages that embed version strings at build time get the correct version.

### Step 8: Commit the Release

```bash
git add packages/*/package.json bun.lock
git commit -m "release: v5.10.0 (core, react, hydrogen)"
# or for independent: "release: @weaverse/schema@0.8.3"
```

Note: Lefthook pre-commit hooks will run biome on staged files. This is expected and should pass since we already verified in Step 4.

### Step 9: Publish to npm

In dependency order, for each target package:

```bash
cd packages/core && bun publish --access public
cd packages/react && bun publish --access public
cd packages/hydrogen && bun publish --access public
```

Verify each publish succeeds before continuing to the next. If one fails, stop and report what succeeded.

### Step 9: Publish to npm

In dependency order, for each target package:

```bash
cd packages/core && bun publish --access public
cd packages/react && bun publish --access public
cd packages/hydrogen && bun publish --access public
```

Verify each publish succeeds before continuing to the next. If one fails, stop and report what succeeded.

**npm auth requirement:** The npm account must use an automation token (not OTP-based 2FA for publishes) to keep the workflow non-interactive. If `bun publish` prompts for OTP, the user needs to configure a publish-level automation token.

### Step 10: Tag and Push

```bash
# Check tag doesn't already exist
git tag -l "v5.10.0" | grep -q . && echo "Tag already exists!" && exit 1

# Fixed group
git tag "v5.10.0"

# Independent packages (if releasing any)
git tag "@weaverse/schema@0.8.3"

git push origin main --follow-tags
```

### Step 11: Create GitHub Release

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

For first-time independent package tags (no prior tag for that package), `--generate-notes` generates notes from all commits. This is expected for the first release.

### Step 12: Sync Dev Branch

```bash
git checkout dev && git pull origin dev
git merge main --no-edit
git push origin dev
git checkout main
```

Prerequisite: `dev` branch must exist on the remote. If it doesn't, skip this step and note the absence.

### Step 13: Post-Release Verification

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
| Build fails | Stop immediately at Step 7, don't publish |
| One package publish fails | Stop, report which succeeded and failed. See Rollback section |
| Internal dep version mismatch | Step 5 updates all internal references with exact pins |
| Tag already exists | Check before creating in Step 10, fail if exists |
| Working tree dirty | Step 1 checks for clean working tree |
| Dev branch has conflicts | Report conflict, let user resolve manually |
| Dev branch doesn't exist | Skip Step 12, note the absence |
| Schema bump leaves hydrogen stale | Warn user, suggest follow-up fixed group release |
| npm 2FA OTP prompt | Requires automation token — see Step 9 note |
| npm registry propagation delay | `npm view` may take a few seconds; retry once after 5s if stale |

## Rollback Guidance

If publish partially succeeds (e.g., core publishes but react fails):

1. **Do NOT revert the version commit** — the published package already references the new version
2. **Do NOT delete the already-published package** — npm unpublish has restrictions and breaks consumers
3. **Fix the failure cause** (usually auth or network), then re-run `bun publish` only for the remaining unpublished packages
4. **Continue the ritual** from Step 10 (tag, push, release) once all packages are published
5. If the failure is unrecoverable, document the partial state and manually create the tag/release noting which packages were published

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
5. Fix stale version numbers in AGENTS.md (or remove hardcoded versions entirely — they go stale every release)

## Skill File Structure

```
weaverse/.claude/
  skills/
    releasing-weaverse-sdks/
      SKILL.md        # The release ritual skill
```

## Quick Reference

```
parse intent → main + latest → npm auth → calc versions (confirm) → verify (biome+types+tests) →
bump versions → bun install → build → commit → publish to npm → tag → push → gh release → sync dev → verify npm
```
