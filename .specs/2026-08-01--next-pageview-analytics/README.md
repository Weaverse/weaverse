# Feature: Next published-pageview analytics parity

| Field            | Value |
| ---------------- | ----- |
| **Status**       | in-progress |
| **Owner**        | @hta218 |
| **Tracker**      | [Builder #2738](https://github.com/Weaverse/builder/issues/2738) |
| **Branch**       | `fix/remove-usage-pixel` |
| **Base**         | `1a695920c3872bc9be0f7ffb81485a7d7bf5d089` |
| **Created**      | 2026-08-01 |
| **Last Updated** | 2026-08-12 |

## Original prompt

> Add the Weaverse published-pageview analytics behavior to `@weaverse/next`, release the next alpha, and keep the starter free of duplicated tracking logic.

## Summary

Corrected on 2026-08-12: new Hydrogen and Next releases remove browser `/api/public/px` calls and mark only live public project requests with `X-Weaverse-SDK-Version: project-request-v1`. Legacy releases remain unchanged. Builder counts successful marked origin project API executions; API-worker cache hits are not counted.
