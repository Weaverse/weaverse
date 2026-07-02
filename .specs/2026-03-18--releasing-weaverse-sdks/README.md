# Feature: Releasing Weaverse SDKs — release skill

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @paul-phan                                                |
| **Issue**        | N/A                                                       |
| **Branch**       | N/A (not recorded)                                        |
| **Created**      | 2026-03-18                                                |
| **Last Updated** | 2026-03-18                                                |

## Original Prompt

> Not captured — this spec predates the SDD convention's requirement to record the original prompt verbatim. It was migrated from `docs/superpowers/{plans,specs}/2026-03-18-releasing-weaverse-sdks*.md` on 2026-07-02.

## Summary

Created a Claude Code skill (`.claude/skills/releasing-weaverse-sdks/SKILL.md`) that automates the full 13-step ritual for releasing `@weaverse/*` npm packages (fixed group: core/react/hydrogen; independent: schema/cli/biome/i18n), and removed the obsolete Changesets infrastructure it replaced. This skill is the current, active release workflow — referenced from `AGENTS.md`. See [`design.md`](./design.md) for the design decisions and [`plan.md`](./plan.md) for the implementation checklist.
