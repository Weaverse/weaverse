# Feature: Next published-pageview analytics parity

| Field            | Value |
| ---------------- | ----- |
| **Status**       | in progress |
| **Owner**        | @hta218 |
| **Tracker**      | [Builder #2738](https://github.com/Weaverse/builder/issues/2738) |
| **Branch**       | `feat/next-pageview-analytics` |
| **Base**         | `1a695920c3872bc9be0f7ffb81485a7d7bf5d089` |
| **Created**      | 2026-08-01 |
| **Last Updated** | 2026-08-01 |

## Original prompt

> Add the Weaverse published-pageview analytics behavior to `@weaverse/next`, release the next alpha, and keep the starter free of duplicated tracking logic.

## Summary

`@weaverse/hydrogen` automatically sends one Weaverse pageview pixel per page per real navigation, but `@weaverse/next` has no equivalent. This slice makes the Next renderer own the same Weaverse-internal pageview protocol while adapting deduplication to App Router navigation and React Strict Mode. It does not add a generic analytics API, third-party vendor integrations, consent management, Builder changes, or starter-owned tracking.
