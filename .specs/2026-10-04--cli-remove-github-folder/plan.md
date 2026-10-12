# Plan

1. Replace `removeWeaverseFolder()` with `removeTemplateInternalFolders()`, driven by a `TEMPLATE_INTERNAL_FOLDERS = ['.weaverse', '.github']` constant.
   - `fs.remove()` is a no-op for missing paths, so the `pathExists` check is dropped.
   - Each folder is removed independently; a failure logs a warning and returns `false` without aborting project creation (same behaviour as before).
2. Call it from `downloadAndExtractTemplate()` in place of the old helper. It applies to every template because it runs after any download.
3. Update `__tests__/download.test.js`: both folders are removed, other project files stay, missing folders return `true`.
4. Version bump and npm publish happen in the separate release flow (`.claude/skills/releasing-weaverse-sdks/`).

## Files touched

- `packages/cli/src/utils/download.js`
- `packages/cli/__tests__/download.test.js`
- `.specs/2026-10-04--cli-remove-github-folder/`
