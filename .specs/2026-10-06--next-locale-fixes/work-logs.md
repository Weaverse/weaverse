# Work Logs

## 2026-10-06 — @hta218

- Fixed #511 and #534 and bumped the internal pins; opened #537.
- Local runs show 8 pre-existing render-test failures (`Cannot read properties of null (reading 'useRef')`). They are a duplicate React instance in the local install: identical on `main`, and CI's Tests job passes.
- Review round on #537:
  - CodeQL `js/polynomial-redos` on the prefix trim regex → index scans.
  - Codex P2: defaults came from the old type when a reused item changed type → resolve the schema from `update.type`, with a regression test.
  - Claude notes: `resolveRequestUrl` now returns an unprefixed url unchanged; the complete-item contract is documented in `setData`; this spec was added. The bundle concern was dismissed, because `request-info.ts` has no runtime imports.
