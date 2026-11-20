# Replace Biome and ultracite with Vite+ checks

Tracking: [Weaverse/pilot#200](https://github.com/Weaverse/pilot/issues/200)

## Outcome

The SDK monorepo formats and lints with Vite+ (Oxfmt and Oxlint through `vp`), like Builder and Pilot. Biome and ultracite are no longer dependencies, and the lint policy carries over at the same severities. `@weaverse/biome` stays published at 5.8.0 for existing projects, with a deprecation note in its README.

## Scope and non-goals

In scope:

- `fmt` and `lint` blocks in the root `vite.config.ts`.
- `biome-ignore` comments converted to Oxlint disables, or removed when dead.
- Root scripts, the Lefthook pre-commit hook and the CI `quality` job.
- Removing `@biomejs/biome`, `ultracite` and the root `biome.json`.
- Docs: `AGENTS.md`, `README.md`, `ARCHITECTURE.md`, the release skill, and the `packages/biome` README.

Non-goals:

- No version bump or changeset for `@weaverse/biome`, and no npm deprecation. That happens after the Weaverse projects that use it move to Vite+.
- No rules beyond parity. Candidates are listed under Proposals below.
- No warning cleanup. Weaverse/weaverse#562 (the Biome warning cleanup) no longer applies.
- `templates/`, `archived/` and the legacy `.specs/**` folders are unchanged.
- `packages/biome/biome.json` stays as published.

## Acceptance

- `pnpm run ci` (`vp check`) exits 0 with 0 lint errors. Warnings print and do not fail the check.
- The Oxfmt scope matches Biome's formatter scope: 190 files, which is Biome's 191 minus the deleted `biome.json`. The Oxlint scope matches Biome's lint scope for JS/TS: 171 files. Ignores are carried over from `files.includes`; gitignored paths stay skipped.
- Every effective Biome rule is either mapped at the same severity or listed below as dropped, with a reason.
- Typecheck, test, build and `package:check` pass. The pre-commit hook runs unmodified on the commits.

## Approach

### Effective Biome policy (before)

The effective policy was the root `biome.json` ⊕ `packages/biome/biome.json` ⊕ the ultracite 8.3.0 core, react and remix presets, on Biome 2.6.8. It enabled 361 rules: 282 at error and 79 at warn. That count includes 27 CSS, 15 GraphQL, 7 JSON and 1 HTML rule, none of which had files in scope.

`biome ci .` gave 0 errors and 595 warnings across 325 files: 191 JS/TS/JSON/YAML files, plus 134 Markdown files that Biome only checked for suppressions. The 595 warnings include 3 suppression diagnostics: 2 `<explanation>` placeholders in `hydrogen/src/components/main.tsx` and 1 unused `noSkippedTests` suppression.

Formatter settings were: 2-space indent, width 80, LF, single quotes, double quotes in JSX, semicolons as needed, es5 trailing commas, arrow parens always, quote properties as needed, no trailing commas in JSON, and `organizeImports`.

### Vite+ configuration (after)

The setup reuses Builder's pattern:

- Every Oxlint category defaults to off. Explicit `LINT_ERRORS`, `LINT_WARNINGS` and `LINT_CONFIGURED` lists enable 270 Oxlint rules.
- The plugins are `eslint`, `typescript`, `unicorn`, `oxc`, `react`, `react-perf`, `jsx-a11y`, `nextjs`, `import` and `promise`.
- `options.typeAware: true`. The type-aware rules each replace an active Biome rule:
  - `consistent-type-exports` (useExportType)
  - `no-unnecessary-template-expression`
  - `prefer-find` (useArrayFind)
  - `dot-notation` (useLiteralKeys)
  - `prefer-optional-chain`
  - `no-mixed-enums` (useConsistentEnumValueType)
  - `prefer-readonly`
  - `prefer-reduce-type-parameter`
  - `no-for-in-array` (noForIn)
  - `no-unnecessary-condition` (noUnnecessaryConditions)
  - `no-deprecated` (noDeprecatedImports)
- Overrides: `unicorn/filename-case` is off for `routes/**`, and `no-unused-vars` and `consistent-type-imports` are off for `*.d.ts`.
- `fmt` uses the Biome settings above plus `sortImports` with `partitionByNewline`. JSON has no trailing commas, and YAML keeps double quotes.

### Parity ledger

Of 361 rules, 271 are mapped at the same severity: 201 at error and 70 at warn. 90 are dropped. No rule changed severity.

Mapped, by Biome group (error/warn):

| Group | Error | Warn |
| --- | ---: | ---: |
| a11y | 25 | 8 |
| complexity | 34 | 7 |
| correctness | 29 | 10 |
| performance | 6 | 2 |
| security | 5 | 0 |
| style | 37 | 28 |
| suspicious | 65 | 15 |

Mapped with options, so that the Oxlint rule matches the Biome rule's behaviour:

- `eqeqeq` uses `null: ignore`, as Biome noDoubleEquals did.
- `no-inner-declarations` allows block-scoped functions.
- `no-empty-interface` and `no-empty-object-type` allow interfaces that extend one type (noEmptyInterface, noBannedTypes).
- `no-unused-vars` ignores `_`-prefixed names and rest siblings (noUnusedVariables, noUnusedImports, noUnusedFunctionParameters).
- `no-use-before-define` ignores functions, classes and references from nested scopes, as noInvalidUseBeforeDeclaration did.
- `jsx-a11y/label-has-associated-control` uses the same control and label components as noLabelWithoutControl.
- `jsx-a11y/aria-role` uses `ignoreNonDOM`.
- `max-nested-callbacks` 10, `max-params` 4, `max-classes-per-file` 1.
- `typescript/consistent-type-definitions` prefers `interface`.
- `typescript/explicit-member-accessibility` uses `no-public`.
- `typescript/array-type` uses `array`.
- `typescript/ban-ts-comment` bans only `@ts-ignore`.
- `no-labels` allows loops.
- `no-restricted-globals` restricts `event` and `error`.
- `no-magic-numbers` takes Biome's ignore list and exemptions.
- `unicorn/no-useless-undefined` doesn't check arguments or arrow bodies.
- `prefer-arrow-callback` allows named functions.
- `typescript/no-invalid-void-type` allows generic type arguments.

Dropped, with no faithful Oxlint equivalent:

- 50 rules for other languages, none of which had files in scope: 27 CSS, 15 GraphQL, 7 JSON (including the Biome-config rules) and 1 HTML (`noDuplicateAttributes`).
- 40 JS/TS rules:
  - **No Oxlint rule:** noEmptyTypeParameters, noRedundantDefaultExport, noThisInStatic, noUselessContinue, noUselessStringRaw, useSimpleNumberKeys, useSimplifiedLogicExpression, useWhile, noStringCaseMismatch, noVoidTypeReturn, useImageSize, useSingleJsDocAsterisk, noDynamicNamespaceImportAccess, useTopLevelRegex, noEnum, noExportedImports, noShoutyConstants, noUnusedTemplateLiteral, useNodeAssertStrict, noEvolvingTypes, noImplicitAnyLet, noOctalEscape, noRedundantUseStrict, noSuspiciousSemicolonInJsx, useStrictMode, noComponentHookFactories, noReactPropAssignments, useReactAsyncServerFunction, noJsxLeakedDollar, noLeakedRender and noReactForwardRef.
  - **Covered elsewhere:** noDuplicateParameters (the Oxc parser rejects duplicate parameters).
  - **No-ops without options:** noRestrictedElements, noRestrictedImports and noRestrictedTypes were enabled with no configured names.
  - **Different semantics:**
    - noUndeclaredVariables: `no-undef` has no TS environment and reports 440 false positives; tsc already rejects undeclared names.
    - noRedeclare: `no-redeclare` flags legal TS type/value merging such as `ThemeTextStore`; tsc rejects real duplicates.
    - noDelete: `no-delete-var` only covers deleting variables.
    - noGlobalDirnameFilename: `unicorn/prefer-module` also bans CommonJS.
    - useStaticResponseMethods: `unicorn/prefer-response-static-json` also flags `new Response(JSON.stringify(x), init)`, which Biome allowed (5 hits).

Warnings at baseline:

- Dropped rules carried 81 warnings: useTopLevelRegex 30, noExportedImports 26, noComponentHookFactories 23 and noEvolvingTypes 2.
- 3 more were the suppression diagnostics, which are now gone.

### Suppressions

Biome had 23 `biome-ignore` comments in linted files.

19 are converted to `oxlint-disable` comments where Oxlint reproduces the diagnostic:

- no-magic-numbers ×2 (file-wide)
- no-bitwise ×4
- no-control-regex
- no-explicit-any ×4
- no-unsafe-function-type
- unicorn/no-thenable (start/end pair → block)
- react/exhaustive-deps ×2 (block)
- react/rules-of-hooks
- react/no-children-prop
- react/no-danger-with-children

The two `<explanation>` placeholders in `main.tsx` now give real reasons.

4 dead comments are removed:

- useTopLevelRegex ×2, which was dropped.
- useNamingConvention, which was off.
- noSkippedTests, which was disabled and reported unused.

Oxlint also reports some valid code that Biome accepted, so 5 new suppressions carry a reason:

- `consistent-type-exports` on two type-only `export *` barrels. Rewriting them to `export type *` would hide runtime exports added later.
- `no-invalid-void-type` on `Promise.withResolvers<void>()` ×2, which Biome's generic-argument exemption allowed.
- `no-accumulating-spread` in `mergeSchemas`, which Biome only checked in `reduce`.

Two test expectations used unnecessary template expressions. They are now plain text, and the strings are unchanged.

### Formatting

The settings above keep the reflow small:

- The tooling commit reflows three schema files that it also touches (`schema/src/index.ts`, `manifest.ts`, `validation.ts`).
- One mechanical "Reformat with Oxfmt" commit reformats six more files (+18/−21). The changes are `extends` wrapping in interfaces, one import order change (`WeaverseHydrogenRoot` after `weaverse-client`), single-line `type` exports and inline YAML flow sequences.

### Scripts, hook and CI

| Before | After |
| --- | --- |
| `biome` / `biome:fix` / `biome:fix:unsafe` | `check` (`vp check`) / `check:fix` (`vp check --fix`) / `check:fix:unsafe` (`vp check --fix-dangerously`) |
| `format` / `format:check` | `vp fmt` / `vp fmt --check` |
| `ci` (`biome ci --changed`) | `vp check`; Oxlint has no `--changed` mode, so it checks the full scope (under 1 s) |
| Lefthook `biome check --write` with `stage_fixed` | `vp fmt` on staged files with `stage_fixed`, then check-only `vp lint`, piped |
| CI "Setup Biome" + `biome ci .` | `pnpm run ci` |

`pnpm-workspace.yaml` still allows the `@biomejs/biome` postinstall, because `packages/biome` keeps Biome as a devDependency. The release skill now says not to release `@weaverse/biome`. `scripts/check-packed-packages.mjs` still packs and checks it unchanged, and no CLI behaviour referred to Biome.

### Proposals beyond parity (not enabled)

- Oxlint's default `correctness` category.
- `unicorn/prefer-module`.
- `no-undef` with explicit globals.
- `typescript/no-floating-promises` and `typescript/no-misused-promises` on the type-aware backend.

## Verification

- `vp check`: 0 errors and 661 warnings (Biome baseline: 595). Per rule:

  | Rule (Biome → Oxlint) | Biome | Oxlint | Why |
  | --- | ---: | ---: | --- |
  | no-unnecessary-condition | 58 | 115 | Oxlint also checks optional chains |
  | no-deprecated | 2 | 62 | Oxlint checks every use, not only imports |
  | require-await | 5 | 37 | Oxlint also checks async callbacks |
  | array-type | 1 | 9 | Oxlint also flags `Array<T>` for object and union `T` |

  - The dropped rules and suppression diagnostics account for 84 fewer warnings (81 + 3).
  - The rest match within ±5.

- Positive control: a scratch file trips no-debugger, eqeqeq, no-eval, jsx-key, jsx-a11y and jsx-no-script-url as errors and curly and no-eq-null as warnings, and `vp fmt --check` flags it.
- Typecheck, test, build and `package:check` were run on a clean frozen install with pnpm 12.21.0 and Node 26.
