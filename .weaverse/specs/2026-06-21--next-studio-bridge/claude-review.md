# Claude Review: Next Studio Bridge Spec — Public Summary

Claude reviewed the public SDK spec plus the private Builder-side architecture evidence. The full source-grounded review, including private Builder implementation paths and RPC details, belongs in the private `Weaverse/builder` companion spec.

## Executive verdict

The direction is broadly correct:

- Current `@weaverse/next` is render-only for Studio purposes.
- Studio support needs root-level connect plus page-level runtime bind.
- Reusing the existing structural Studio bridge first is the right default.
- A Next runtime compatibility layer is needed before implementation.

However, the public SDK spec needed several P0 corrections before implementation.

## Required P0 updates folded into this spec

1. **Add the design-mode refresh loop**
   - Studio lifecycle is not only `init(runtime)` once.
   - Reused design-mode runtime renders must also notify Studio through a refresh/update call.

2. **Correct theme store contract**
   - The bridge-compatible method is `updateThemeSettings(next)`.
   - A differently named setter is not enough.

3. **Clarify Next revalidation**
   - `router.refresh()` is necessary but not automatically equivalent to Hydrogen loader revalidation.
   - Loader-backed edits need a deliberate Next request/fetch strategy.

4. **Require design-mode no-store fetching**
   - Design/preview/revision data must bypass stale public cache.

5. **Add iframe embeddability**
   - Studio preview routes must allow iframe rendering from the configured Studio origin.

6. **Document global runtime caveats**
   - The adapter must handle global/static Weaverse item/runtime state deliberately.

## Review conclusion

Proceed with the SDK runtime compatibility design after the public/private spec split. Do not start implementation until the public SDK contract and private Builder companion spec are both reviewable.
