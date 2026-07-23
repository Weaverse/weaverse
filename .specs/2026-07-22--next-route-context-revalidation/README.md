# Fix: Preserve route context during Next per-item revalidation

| Field | Value |
| --- | --- |
| **Status** | in-progress |
| **Owner** | @hta218 |
| **Issue** | [Weaverse/builder#2737](https://github.com/Weaverse/builder/issues/2737) |
| **Branch** | `fix/next-route-context-revalidation` |
| **Created** | 2026-07-22 |
| **Last Updated** | 2026-07-23 |

## Original Prompt

> `@weaverse/next` supports per-item Studio revalidation, but the current request contract carries only `draftItem`. The POC revalidation route constructs its server client with the default `/` context, so loaders on product, collection, custom, localized, or search-dependent routes can run without the original pathname, locale, and search parameters.
>
> The simple resource-picker smoke works because its loader does not depend on route context. This does not prove correctness for production loaders.

## Spec Request

> Okay, that's right. Describe it carefully, create a branch and detailed specs (you write them), then commit, push, and open a PR.

## Summary

Next per-item revalidation currently loses the owning storefront route, so loaders on localized or query-dependent pages can run with `/`, no locale, and empty search state. This spec adds a sanitized route-context envelope, reconstructs a server request context in the handler, and keeps project, host, credentials, and environment server-owned. The existing in-place update, no-remount behavior, and Builder fallback remain unchanged.

## Supporting documents

- [`plan.md`](./plan.md) — contracts, trust boundary, implementation slices, and verification matrix
- [`security-contract.md`](./security-contract.md) — normative validation, sanitization, and origin-safety rules
- [`implementation-handoff.md`](./implementation-handoff.md) — ordered TDD handoff for the implementation agent
- [`work-logs.md`](./work-logs.md) — investigation and decision log

## Related specs

- [`../2026-07-02--next-item-revalidation/`](../2026-07-02--next-item-revalidation/) — original in-place revalidation channel
- [`../2026-06-21--next-studio-bridge/`](../2026-06-21--next-studio-bridge/) — Next Studio bridge contract
- [`../2026-06-19--nextjs-adapter-contract/`](../2026-06-19--nextjs-adapter-contract/) — base Next adapter contract
