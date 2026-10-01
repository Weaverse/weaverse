# Feature: Portable SDD requirements

| Field            | Value |
| ---------------- | ----- |
| **Status**       | in-progress |
| **Owner**        | @paul-phan |
| **Issue**        | N/A |
| **Pull Request** | [#525](https://github.com/Weaverse/weaverse/pull/525) |
| **Branch**       | `docs/sdd-portable-requirements` |
| **Base**         | `main` at `1644308586afcf86ae30a2a330032fe4345fb80b` |
| **Created**      | 2026-09-01 |
| **Last Updated** | 2026-09-01 |

## Initiating Requirement

> Publish a docs-only repository-owned SDD policy through branch `docs/sdd-portable-requirements` and PR [#525](https://github.com/Weaverse/weaverse/pull/525), based on `main` at `1644308586afcf86ae30a2a330032fe4345fb80b`, without merging, deploying, or releasing. Require new and touched specs to store a concise, self-contained, professionally revised initiating requirement rather than raw chat. Inline substantive requirements from briefs and attachments; remove private source locations, conversational scaffolding, orchestration chatter, credentials, secrets, and irrelevant prose. Preserve substantive constraints, identifiers, commands, literal values, acceptance conditions, and externally meaningful branch, base, and head identifiers. Record later user intent as dated, similarly revised scope updates. Keep historical specs unchanged.

## Scope Updates

### 2026-09-01

- Distinguish private source-file locations used only to find source material from substantive repository paths, runtime paths, and URLs.
- Normalize substantive paths to portable forms when possible and preserve the normalized paths and their meaning exactly.
- Make credential and secret redaction explicitly higher priority than literal-value or identifier preservation.
- Keep this README and `plan.md` as the minimal canonical spec required by the repository's SDD convention.

## Summary

The canonical SDD rule and top-level agent guidance define one portable requirement contract for developers and AI agents. The change is limited to policy documentation and this required spec; it does not migrate historical specs or modify product code.
