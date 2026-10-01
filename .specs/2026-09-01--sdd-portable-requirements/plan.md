# Plan — portable SDD requirements

## Contract

- Repository-owned instructions define the portable-requirement policy for every developer and AI agent.
- New and touched specs use the `Initiating Requirement` heading and dated `Scope Updates`.
- Private source-file locations are removed after their substantive requirements are inlined.
- Substantive repository paths, runtime paths, and URLs are normalized to portable forms when possible and then preserved exactly with their meaning.
- Credential and secret redaction takes priority over every preservation rule.
- All remaining substantive constraints, identifiers, commands, literal values, acceptance conditions, and externally meaningful branch, base, and head identifiers are preserved exactly.
- Historical specs are not bulk-migrated.

## Implementation

1. Update the canonical SDD rule.
2. Keep the top-level `AGENTS.md` summary aligned with the canonical rule.
3. Add this minimal canonical spec for the policy feature.
4. Verify obsolete raw-prompt directives are absent and review the full docs-only branch diff.
5. Keep PR #525 open for review; do not merge, deploy, or release.

## Files expected

- `.claude/rules/spec-driven-development.md`
- `AGENTS.md`
- `.specs/2026-09-01--sdd-portable-requirements/README.md`
- `.specs/2026-09-01--sdd-portable-requirements/plan.md`

## Verification

- Search the touched policy files for obsolete exact raw-prompt requirements.
- Run any repository check that directly validates the spec index or Markdown files when available.
- Run `git diff --check`.
- Review the complete `origin/main...HEAD` diff for docs-only scope and policy consistency.
- Push the branch and read back the exact remote PR head, body, and checks.
