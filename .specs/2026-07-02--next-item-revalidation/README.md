# Feature: Per-item loader revalidation for @weaverse/next

| Field            | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Status**       | completed                                                |
| **Owner**        | @hta218                                                  |
| **Issue**        | Related: [Weaverse/builder#2597](https://github.com/Weaverse/builder/issues/2597), [Weaverse/builder#2533](https://github.com/Weaverse/builder/issues/2533) |
| **Branch**       | `feat/next-item-revalidation` (implementation; spec lands via `fix/next-stale-refresh-studio-payload`) |
| **Created**      | 2026-07-02                                               |
| **Last Updated** | 2026-07-02                                               |

## Original Prompt

> Option 2 is the right one, isn't it? The `@weaverse/hydrogen` package currently
> has a per-item loader mechanism (running server side); on revalidation it only
> needs to re-run this item's loader + revalidate (right?). If so, the
> `@weaverse/next` package needs a similar mechanism too (expected to be doable).

(Context: "Option 2" refers to replacing the `router.refresh()`-based Studio
revalidation with a dedicated per-item loader revalidation channel, chosen over
a header-based draft-item transport and a Builder-side scroll-lock workaround.)

## Summary

Studio resource-picker revalidation for Next.js currently rides on
`router.refresh()` plus a `weaverseDraftItem` query-param rewrite of the RSC
fetch URL. The rewritten URL changes the Next App Router page segment key, so
applying the refreshed payload remounts the page tree — the preview scrolls to
the top and loses client state before Builder scrolls back to the selected
section. This spec adds a per-item loader revalidation channel to
`@weaverse/next`: an SDK-provided route-handler factory the consumer app mounts,
plus a client-side `internal.revalidateItem` that fetches fresh `loaderData` for
just the edited item and applies it in place — no navigation, no remount, no
scroll.

## Supporting documents

- [`plan.md`](./plan.md) — design, contract, implementation slices, verification

## Precursor specs

- [`../2026-06-21--next-studio-bridge/`](../2026-06-21--next-studio-bridge/) — Studio Bridge runtime contract this narrows
- [`../2026-06-19--nextjs-adapter-contract/`](../2026-06-19--nextjs-adapter-contract/) — base `@weaverse/next` adapter contract
