# Public API Reports

These files snapshot the built TypeScript interface for every published TypeScript package entrypoint. They are generated from `dist/*.d.ts` with API Extractor and must not be edited manually.

```sh
pnpm run api:report   # build and accept intentional interface changes
pnpm run api:check    # build and verify reports are current
pnpm run package:check # verify reports and packed strict/non-strict consumers
```

Review report diffs as public package changes. `@weaverse/cli` and `@weaverse/biome` are published directly and do not expose TypeScript declaration entrypoints, so they have no API report.
