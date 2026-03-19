# Releasing Weaverse SDKs — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Claude Code skill that automates releasing `@weaverse/*` npm packages, and remove the obsolete changeset infrastructure.

**Architecture:** A single SKILL.md file containing the complete 13-step release ritual, placed in the repo's `.claude/skills/` directory so the whole team can use it. Changeset files/deps are removed. AGENTS.md is updated to reference the new workflow.

**Tech Stack:** Claude Code skill (Markdown), bun, git, gh CLI, npm registry

---

## File Structure

| Action | Path | Purpose |
|--------|------|---------|
| Create | `.claude/skills/releasing-weaverse-sdks/SKILL.md` | The release ritual skill |
| Delete | `.changeset/config.json` | Old changeset config |
| Delete | `.changeset/README.md` | Old changeset readme |
| Modify | `package.json` (root) | Remove `@changesets/cli` dep and `changeset` script |
| Modify | `AGENTS.md` | Replace changeset release docs with new workflow reference |
| Modify | `README.md` | Remove changeset step from contributing instructions |
| Modify | `.github/copilot-instructions.md` | Remove changeset mention from project description |
| Modify | `.claude/settings.local.json` | Remove stale changeset permission entries |

---

## Chunk 1: Create the Release Skill

### Task 1: Create the SKILL.md file

**Files:**
- Create: `.claude/skills/releasing-weaverse-sdks/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p .claude/skills/releasing-weaverse-sdks
```

- [ ] **Step 2: Write the SKILL.md file**

Create `.claude/skills/releasing-weaverse-sdks/SKILL.md` with the following content. This is the complete skill — write it exactly as shown:

````markdown
---
name: releasing-weaverse-sdks
description: Use when releasing @weaverse/* npm packages, bumping SDK versions, publishing to npm, or shipping the Weaverse SDKs. Triggers on "release sdk", "release weaverse", "publish packages", "release core", "release schema", "bump sdk version", "ship sdks".
---

# Releasing Weaverse SDKs

Release ritual for the `@weaverse/*` npm packages monorepo. Covers version bump, build, npm publish, git tagging, GitHub Release, and post-release verification.

**Announce at start:** "I'm using the releasing-weaverse-sdks skill to run the release ritual."

## Context

- **Public npm packages** under `@weaverse/*` scope
- **Package manager:** `bun` only (never `npm install`)
- **Publish command:** `bun publish --access public`
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

### Step 2: Check npm auth

```bash
npm whoami
```

Must be authenticated. If not, stop — user needs to run `npm login` or configure an automation token.

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
cd packages/core && bun publish --access public && cd ../..
cd packages/react && bun publish --access public && cd ../..
cd packages/hydrogen && bun publish --access public && cd ../..
```

For independent packages:
```bash
cd packages/$PKG && bun publish --access public && cd ../..
```

Verify each publish succeeds before continuing to the next. If one fails, stop and report which packages published successfully and which failed.

**npm auth note:** The npm account must use an automation token (not OTP-based 2FA) to keep the workflow non-interactive. If `bun publish` prompts for OTP, the user needs to configure a publish-level automation token.

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
3. **Fix the failure cause** (usually auth or network), then re-run `bun publish` only for remaining packages
4. **Continue the ritual** from Step 10 once all packages are published
5. If unrecoverable, document the partial state and manually create tag/release noting which packages were published

## Quick Reference

```
parse intent → main + latest → npm auth → calc versions (confirm) →
verify (biome+types+tests) → bump versions → bun install → build →
commit → publish to npm → tag → push → gh release → sync dev → verify npm
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running `npm install` instead of `bun install` | This project uses bun only |
| Publishing without building first | Build must succeed before publish |
| Forgetting internal dep updates | Fixed group packages reference each other — update the exact pins |
| Publishing in wrong order | Must be core → react → hydrogen (dependency order) |
| Not verifying npm registry after publish | Always check `npm view` to confirm |
| Hardcoding version numbers | Always read from package.json and compute |
| Mixing fixed + independent in one release | Run separate rituals for each scope |
| Using `git add -A` for release commit | Only stage package.json files and bun.lock |
````

- [ ] **Step 3: Verify the skill file exists and is well-formed**

```bash
cat .claude/skills/releasing-weaverse-sdks/SKILL.md | head -5
```

Expected output should show the YAML frontmatter:
```
---
name: releasing-weaverse-sdks
description: Use when releasing @weaverse/* npm packages...
---
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/releasing-weaverse-sdks/SKILL.md
git commit -m "feat: add releasing-weaverse-sdks skill"
```

---

## Chunk 2: Remove Changeset Infrastructure

### Task 2: Delete changeset files

**Files:**
- Delete: `.changeset/config.json`
- Delete: `.changeset/README.md`

- [ ] **Step 1: Delete the .changeset directory**

```bash
rm -rf .changeset/
```

- [ ] **Step 2: Verify deletion**

```bash
ls .changeset/ 2>&1
```

Expected: `No such file or directory`

- [ ] **Step 3: Commit**

```bash
git add -A .changeset/
git commit -m "chore: remove changeset infrastructure"
```

### Task 3: Remove changeset dependency and script from root package.json

**Files:**
- Modify: `package.json` (root, lines 22 and 33)

- [ ] **Step 1: Remove the changeset script**

In `package.json`, remove this line from `"scripts"`:
```json
"changeset": "changeset",
```

- [ ] **Step 2: Remove @changesets/cli from devDependencies**

In `package.json`, remove this line from `"devDependencies"`:
```json
"@changesets/cli": "^2.29.8",
```

- [ ] **Step 3: Run bun install to update lockfile**

```bash
bun install
```

This removes the changeset package from the lockfile.

- [ ] **Step 4: Verify changeset command is gone**

```bash
node -e "let pkg = require('./package.json'); console.log('changeset script:', pkg.scripts.changeset ?? 'REMOVED'); console.log('@changesets/cli:', pkg.devDependencies['@changesets/cli'] ?? 'REMOVED')"
```

Expected:
```
changeset script: REMOVED
@changesets/cli: REMOVED
```

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: remove @changesets/cli dependency and script"
```

---

## Chunk 3: Update AGENTS.md

### Task 4: Replace changeset release docs in AGENTS.md

**Files:**
- Modify: `AGENTS.md` (lines 40 and 334-339)

- [ ] **Step 1: Update the tooling line (line 40)**

Replace:
```
- **Releases**: Changesets with fixed version group (core, react, hydrogen stay in sync)
```

With:
```
- **Releases**: Git tag + `bun publish` workflow via `.claude/skills/releasing-weaverse-sdks/` skill (core, react, hydrogen stay in sync)
```

- [ ] **Step 2: Replace the Releasing section (lines 334-339)**

Replace:
```markdown
### Releasing

Uses Changesets for version management:
1. `bun changeset` — create a changeset describing your changes
2. Core, React, and Hydrogen versions stay in sync (fixed group)
3. Schema (`@weaverse/schema`) is versioned independently
```

With:
```markdown
### Releasing

Uses a Claude Code skill (`.claude/skills/releasing-weaverse-sdks/SKILL.md`) for releases:
1. Tell Claude which packages to release and the bump type (e.g., "release the fixed group as minor")
2. The skill runs: verify → bump → build → publish to npm → tag → GitHub Release → sync dev
3. Core, React, and Hydrogen versions stay in sync (fixed group)
4. Schema, CLI, Biome, and i18n are versioned independently
5. See the skill file for the full 13-step ritual
```

- [ ] **Step 3: Fix stale version numbers in the dependency graph (lines 45-48)**

Replace:
```
@weaverse/hydrogen (v5.9.2) → @weaverse/react → @weaverse/core
                             → @weaverse/schema
@weaverse/react (v5.9.2)    → @weaverse/core
@weaverse/core (v5.9.2)     ← foundation, no internal deps
```

With (remove hardcoded versions — they go stale every release):
```
@weaverse/hydrogen → @weaverse/react → @weaverse/core
                   → @weaverse/schema
@weaverse/react    → @weaverse/core
@weaverse/core     ← foundation, no internal deps
```

- [ ] **Step 4: Verify the AGENTS.md changes**

```bash
grep -n "Changesets\|changeset" AGENTS.md
```

Expected: no output (all changeset references removed).

```bash
grep -n "releasing-weaverse-sdks" AGENTS.md
```

Expected: shows the new skill reference on the tooling line and releasing section.

- [ ] **Step 5: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md to reference new release skill, remove changeset docs"
```

### Task 5: Clean up remaining changeset references

**Files:**
- Modify: `README.md` (line 118)
- Modify: `.github/copilot-instructions.md` (line 7)
- Modify: `.claude/settings.local.json` (lines 11-12)

- [ ] **Step 1: Update README.md contributing instructions**

In `README.md`, replace line 118:
```
5. Create a changeset with `pnpm run changeset`
```

With:
```
5. Submit a pull request
```

- [ ] **Step 2: Update .github/copilot-instructions.md**

In `.github/copilot-instructions.md`, replace line 7:
```
The codebase is written in TypeScript and follows modern JavaScript standards, using turborepo for package management and changeset for versioning.
```

With:
```
The codebase is written in TypeScript and follows modern JavaScript standards, using turborepo for package management and git tags for versioning.
```

- [ ] **Step 3: Remove stale changeset permissions from .claude/settings.local.json**

In `.claude/settings.local.json`, remove these two lines (lines 11-12):
```json
"Bash(npm run changeset:*)",
"Bash(pnpm changeset:*)",
```

- [ ] **Step 4: Verify no changeset references remain in tracked files**

```bash
grep -r "changeset" --include="*.md" --include="*.json" --exclude-dir=node_modules --exclude-dir=.git --exclude="CHANGELOG.md" --exclude="bun.lock" . | grep -v "docs/superpowers/"
```

Expected: no output (all changeset references removed except historical CHANGELOGs and our own spec/plan docs).

- [ ] **Step 5: Commit**

```bash
git add README.md .github/copilot-instructions.md .claude/settings.local.json
git commit -m "chore: remove remaining changeset references from README, copilot instructions, and settings"
```
