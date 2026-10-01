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

Corrected on 2026-08-12: new Hydrogen and Next releases remove browser `/api/public/px` calls without changing the project API request contract. Builder counts every successful non-design origin project response, including requests from already-deployed SDKs, and the compatibility pixel endpoint no longer writes usage. API-worker cache hits remain unmetered because they do not reach Builder. Existing daily billing remains $1 per 5,000 requests.
