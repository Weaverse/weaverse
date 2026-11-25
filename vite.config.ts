/// <reference types="vite-plus/test/optional-types.js" />
import { defineConfig } from 'vite-plus'
import type { DummyRuleMap } from 'vite-plus/lint'

// Lint/format scope carried over from the retired root biome.json
// (`files.includes` negations). Gitignored paths are skipped by Oxlint and
// Oxfmt themselves, as Biome did through `vcs.useIgnoreFile`. Bare directory
// names match at any depth. `vite.config.ts` files and `pnpm-lock.yaml` were
// outside Biome's scope too.
const LINT_FMT_IGNORE = [
  '**/*.md',
  'dist',
  'build',
  '.turbo',
  'templates',
  'archived',
  'package-lock.json',
  'pnpm-lock.yaml',
  'app/styles/app.css',
  'packages/biome',
  '**/vite.config.ts',
]

// Biome formatted JS/TS, JSON and YAML only; keep Oxfmt off the other file
// types it understands.
const FMT_ONLY_IGNORE = [
  '**/*.{css,scss,less,html,vue,mdx,toml,graphql,gql,hbs,json5}',
]

// Effective Biome policy (root biome.json ⊕ packages/biome/biome.json ⊕
// ultracite core/react/remix presets) mapped to Oxlint at the same severity.
// Biome rules without an Oxlint equivalent are listed in the spec ledger
// (.specs/2026-11-20-sdk-viteplus-checks.md).
const LINT_ERRORS = [
  // a11y
  'jsx-a11y/alt-text',
  'jsx-a11y/anchor-ambiguous-text',
  'jsx-a11y/anchor-has-content',
  'jsx-a11y/anchor-is-valid',
  'jsx-a11y/aria-activedescendant-has-tabindex',
  'jsx-a11y/aria-props',
  'jsx-a11y/aria-proptypes',
  'jsx-a11y/aria-unsupported-elements',
  'jsx-a11y/autocomplete-valid',
  'jsx-a11y/heading-has-content',
  'jsx-a11y/html-has-lang',
  'jsx-a11y/iframe-has-title',
  'jsx-a11y/lang',
  'jsx-a11y/media-has-caption',
  'jsx-a11y/no-access-key',
  'jsx-a11y/no-aria-hidden-on-focusable',
  'jsx-a11y/no-distracting-elements',
  'jsx-a11y/no-interactive-element-to-noninteractive-role',
  'jsx-a11y/no-noninteractive-element-to-interactive-role',
  'jsx-a11y/no-noninteractive-tabindex',
  'jsx-a11y/no-redundant-roles',
  'jsx-a11y/role-has-required-aria-props',
  'jsx-a11y/scope',
  'jsx-a11y/tabindex-no-positive',
  // complexity
  'no-div-regex',
  'no-extra-boolean-cast',
  'no-extra-label',
  'no-lone-blocks',
  'no-regex-spaces',
  'no-sequences',
  'no-unneeded-ternary',
  'no-useless-concat',
  'no-useless-constructor',
  'no-useless-escape',
  'no-useless-rename',
  'prefer-numeric-literals',
  'prefer-regex-literals',
  'prefer-rest-params',
  'react/jsx-no-useless-fragment',
  'typescript/no-this-alias',
  'typescript/no-unnecessary-template-expression',
  'typescript/no-unnecessary-type-constraint',
  'typescript/no-unsafe-function-type',
  'typescript/no-useless-empty-export',
  'typescript/no-wrapper-object-types',
  'typescript/prefer-find',
  'unicorn/no-useless-switch-case',
  'unicorn/prefer-array-flat',
  'unicorn/prefer-array-flat-map',
  'unicorn/prefer-array-index-of',
  'unicorn/prefer-array-some',
  'unicorn/prefer-date-now',
  'unicorn/prefer-math-min-max',
  'unicorn/prefer-optional-catch-binding',
  'unicorn/prefer-regexp-test',
  // correctness
  'constructor-super',
  'for-direction',
  'no-case-declarations',
  'no-const-assign',
  'no-constant-condition',
  'no-constructor-return',
  'no-empty-character-class',
  'no-empty-pattern',
  'no-loss-of-precision',
  'no-new-native-nonconstructor',
  'no-nonoctal-decimal-escape',
  'no-obj-calls',
  'no-self-assign',
  'no-setter-return',
  'no-this-before-super',
  'no-unassigned-vars',
  'no-unreachable',
  'no-unsafe-finally',
  'no-unsafe-optional-chaining',
  'no-unused-labels',
  'require-yield',
  'use-isnan',
  'valid-typeof',
  'oxc/bad-min-max-func',
  'react/jsx-key',
  'react/no-namespace',
  'react/no-render-return-value',
  'react/no-unstable-nested-components',
  'react/void-dom-elements-no-children',
  // performance
  'oxc/no-accumulating-spread',
  'react-perf/jsx-no-new-function-as-prop',
  'nextjs/google-font-preconnect',
  'nextjs/no-sync-scripts',
  'nextjs/no-unwanted-polyfillio',
  'unicorn/prefer-dom-node-text-content',
  // security
  'no-eval',
  'react/iframe-missing-sandbox',
  'react/jsx-no-script-url',
  'react/jsx-no-target-blank',
  'react/no-danger-with-children',
  // style
  'default-param-last',
  'grouped-accessor-pairs',
  'no-array-constructor',
  'no-else-return',
  'no-multi-assign',
  'no-multi-str',
  'no-negated-condition',
  'no-throw-literal',
  'object-shorthand',
  'prefer-exponentiation-operator',
  'prefer-object-spread',
  'prefer-spread',
  'symbol-description',
  'vars-on-top',
  'yoda',
  'react/jsx-fragments',
  'react/prefer-function-component',
  'react/self-closing-comp',
  'typescript/consistent-type-exports',
  'typescript/consistent-type-imports',
  'typescript/no-inferrable-types',
  'typescript/no-mixed-enums',
  'typescript/no-namespace',
  'typescript/prefer-as-const',
  'typescript/prefer-enum-initializers',
  'typescript/prefer-function-type',
  'typescript/prefer-literal-enum-member',
  'typescript/prefer-reduce-type-parameter',
  'typescript/unified-signatures',
  'unicorn/numeric-separators-style',
  'unicorn/prefer-node-protocol',
  'unicorn/prefer-number-properties',
  'unicorn/prefer-query-selector',
  'unicorn/prefer-string-slice',
  'unicorn/prefer-string-trim-start-end',
  'unicorn/throw-new-error',
  // suspicious
  'default-case-last',
  'getter-return',
  'guard-for-in',
  'no-alert',
  'no-async-promise-executor',
  'no-bitwise',
  'no-class-assign',
  'no-compare-neg-zero',
  'no-control-regex',
  'no-debugger',
  'no-dupe-class-members',
  'no-dupe-else-if',
  'no-dupe-keys',
  'no-duplicate-case',
  'no-ex-assign',
  'no-fallthrough',
  'no-func-assign',
  'no-global-assign',
  'no-import-assign',
  'no-irregular-whitespace',
  'no-label-var',
  'no-loop-func',
  'no-misleading-character-class',
  'no-proto',
  'no-prototype-builtins',
  'no-return-assign',
  'no-self-compare',
  'no-shadow-restricted-names',
  'no-sparse-arrays',
  'no-unsafe-negation',
  'no-useless-backreference',
  'no-var',
  'no-with',
  'prefer-object-has-own',
  'oxc/approx-constant',
  'oxc/misrefactored-assign-op',
  'oxc/no-const-enum',
  'oxc/only-used-in-recursion',
  'nextjs/google-font-display',
  'promise/no-nesting',
  'react/jsx-no-comment-textnodes',
  'react/jsx-no-duplicate-props',
  'react/jsx-props-no-spread-multi',
  'react/no-string-refs',
  'react/no-unknown-property',
  'typescript/adjacent-overload-signatures',
  'typescript/no-duplicate-enum-values',
  'typescript/no-extra-non-null-assertion',
  'typescript/no-for-in-array',
  'typescript/no-misused-new',
  'typescript/no-non-null-asserted-optional-chain',
  'typescript/no-unsafe-declaration-merging',
  'typescript/prefer-namespace-keyword',
  'unicorn/error-message',
  'unicorn/no-instanceof-array',
  'unicorn/no-thenable',
  'unicorn/require-number-to-fixed-digits-argument',
]

const LINT_WARNINGS = [
  // a11y
  'jsx-a11y/img-redundant-alt',
  'jsx-a11y/interactive-supports-focus',
  'jsx-a11y/mouse-events-have-key-events',
  'jsx-a11y/no-noninteractive-element-interactions',
  'jsx-a11y/prefer-tag-over-role',
  'jsx-a11y/role-supports-aria-props',
  'react/button-has-type',
  // complexity
  'no-implicit-coercion',
  'no-useless-catch',
  'no-void',
  'typescript/dot-notation',
  'typescript/prefer-optional-chain',
  'unicorn/no-array-for-each',
  // correctness
  'no-new',
  'no-unused-private-class-members',
  'radix',
  'react/exhaustive-deps',
  'react/no-children-prop',
  'react/rules-of-hooks',
  // performance
  'import/no-namespace',
  'nextjs/no-img-element',
  // style
  'arrow-body-style',
  'class-methods-use-this',
  'default-case',
  'import/first',
  'no-lonely-if',
  'no-nested-ternary',
  'no-new-wrappers',
  'no-param-reassign',
  'no-plusplus',
  'operator-assignment',
  'prefer-destructuring',
  'prefer-named-capture-group',
  'prefer-template',
  'preserve-caught-error',
  'typescript/method-signature-style',
  'typescript/no-non-null-assertion',
  'typescript/parameter-properties',
  'typescript/prefer-for-of',
  'typescript/prefer-readonly',
  'unicorn/no-lonely-if',
  'unicorn/prefer-at',
  // suspicious
  'array-callback-return',
  'no-cond-assign',
  'no-constant-binary-expression',
  'no-empty',
  'no-empty-function',
  'no-empty-static-block',
  'no-eq-null',
  'no-shadow',
  'no-template-curly-in-string',
  'no-unused-expressions',
  'require-await',
  'react/no-array-index-key',
  'typescript/no-deprecated',
  'typescript/no-explicit-any',
  'typescript/no-unnecessary-condition',
  'unicorn/no-document-cookie',
  'unicorn/no-empty-file',
]

// Rules that need options to match the Biome behaviour they replace.
const LINT_CONFIGURED: DummyRuleMap = {
  // noLabelWithoutControl options (packages/biome).
  'jsx-a11y/label-has-associated-control': [
    'warn',
    {
      controlComponents: ['Input', 'Select', 'Textarea', 'Checkbox', 'Radio'],
      labelComponents: ['Label'],
    },
  ],
  // useValidAriaRole `ignoreNonDom`.
  'jsx-a11y/aria-role': ['error', { ignoreNonDOM: true }],
  // noExcessiveNestedCallbacks `max: 10` (ultracite).
  'max-nested-callbacks': ['error', { max: 10 }],
  // useMaxParams: Biome's default is 4, ESLint's is 3.
  'max-params': ['warn', { max: 4 }],
  // noExcessiveClassesPerFile default.
  'max-classes-per-file': ['warn', { max: 1 }],
  // noUnusedVariables + noUnusedImports + noUnusedFunctionParameters (warn,
  // `ignoreRestSiblings`); `_`-prefixed names were exempt in Biome too.
  'no-unused-vars': [
    'warn',
    {
      args: 'after-used',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
    },
  ],
  // noInvalidUseBeforeDeclaration ignores hoisted functions and classes and
  // references from nested functions that run after initialization.
  'no-use-before-define': [
    'warn',
    { functions: false, classes: false, variables: false },
  ],
  // useConsistentMemberAccessibility default `noPublic`.
  'typescript/explicit-member-accessibility': [
    'warn',
    { accessibility: 'no-public' },
  ],
  // useConsistentArrayType `shorthand` (`T[]`). Oxlint also flags `Array<T>` for
  // object and union T, which Biome skipped (8 extra warnings at migration).
  'typescript/array-type': ['warn', { default: 'array' }],
  // useConsistentTypeDefinitions `style: interface` (ultracite).
  'typescript/consistent-type-definitions': ['warn', 'interface'],
  // noDoubleEquals allows `== null` / `!= null`.
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  // noTsIgnore: prefer `@ts-expect-error`; other directives allowed.
  'typescript/ban-ts-comment': [
    'error',
    {
      'ts-ignore': true,
      'ts-expect-error': false,
      'ts-nocheck': false,
      'ts-check': false,
    },
  ],
  // noInnerDeclarations allows block-level functions in ES modules.
  'no-inner-declarations': [
    'error',
    'functions',
    { blockScopedFunctions: 'allow' },
  ],
  // noEmptyInterface ignores interfaces that `extends` a type.
  'typescript/no-empty-interface': ['error', { allowSingleExtends: true }],
  // noConfusingLabels allows labels on loops.
  'no-labels': ['error', { allowLoop: true }],
  // noRestrictedGlobals always rejects the `event` and `error` globals.
  'no-restricted-globals': ['error', 'event', 'error'],
  // useFilenamingConvention `kebab-case` (overridden for routes below).
  'unicorn/filename-case': ['warn', { case: 'kebabCase' }],
  // noUselessUndefined did not check call arguments or arrow bodies.
  'unicorn/no-useless-undefined': [
    'error',
    { checkArguments: false, checkArrowFunctionBody: false },
  ],
  // useArrowFunction ignores named function expressions.
  'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
  // noConfusingVoidType allows `void` as any generic type argument.
  'typescript/no-invalid-void-type': [
    'error',
    { allowInGenericTypeArguments: true },
  ],
  // noBannedTypes also bans `{}`; like noEmptyInterface, interfaces that only
  // extend one type stay allowed.
  'typescript/no-empty-object-type': [
    'error',
    { allowInterfaces: 'with-single-extends' },
  ],
  // useBlockStatements (warn).
  curly: ['warn', 'all'],
  // noMagicNumbers skips array indexes, enums, initial and default values.
  'no-magic-numbers': [
    'warn',
    {
      ignore: [-1, 0, 1, 2, 10, 24, 60],
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
      ignoreClassFieldInitialValues: true,
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreTypeIndexes: true,
    },
  ],
}

export default defineConfig({
  test: {
    environment: 'node',
    pool: 'forks',
    isolate: true,
    testTimeout: 30_000,
    // Patterns are relative to cwd so they work both from the repo
    // root (`pnpm run test:run` → picks up every package) and from
    // inside a single package directory (`turbo run test` → cwd is
    // the package).
    include: [
      '**/test/**/*.test.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.test.{ts,tsx,js,jsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      'archived/**',
      'deprecated/**',
      'templates/**',
      // Demo/validation scripts that use the .test.ts suffix but
      // contain no describe/it blocks (just top-level console.log).
      '**/test/blah.test.ts',
      '**/test/enhanced-features.test.ts',
      '**/test/type-alignment.test.ts',
    ],
  },
  lint: {
    // Category defaults off: only the rules mapped from Biome run, so the
    // policy neither silently grows nor shrinks with Oxlint releases.
    categories: {
      correctness: 'off',
      suspicious: 'off',
      pedantic: 'off',
      perf: 'off',
      style: 'off',
      restriction: 'off',
      nursery: 'off',
    },
    plugins: [
      'eslint',
      'typescript',
      'unicorn',
      'oxc',
      'react',
      'jsx-a11y',
      'nextjs',
      'import',
      'promise',
      'react-perf',
    ],
    // Type-aware `typescript/*` rules run on the tsrs checker Vite+ bundles.
    // Each one replaces an active Biome rule (see the spec ledger).
    // typeCheck stays off: `pnpm typecheck` is the type gate.
    options: { typeAware: true },
    ignorePatterns: LINT_FMT_IGNORE,
    rules: {
      ...Object.fromEntries(LINT_ERRORS.map((rule) => [rule, 'error'])),
      ...Object.fromEntries(LINT_WARNINGS.map((rule) => [rule, 'warn'])),
      ...LINT_CONFIGURED,
    },
    overrides: [
      {
        // ultracite remix preset: route modules follow router naming.
        files: ['**/routes/**/*.{js,jsx,ts,tsx}'],
        rules: { 'unicorn/filename-case': 'off' },
      },
      {
        // ultracite core: declaration files.
        files: ['**/*.d.ts'],
        // Type-only imports in declaration files never reach runtime; Biome
        // useImportType did not check them either.
        rules: {
          'no-unused-vars': 'off',
          'typescript/consistent-type-imports': 'off',
        },
      },
    ],
  },
  // Closest Oxfmt match to Biome's formatter: 2-space indent, width 80, LF,
  // single quotes (double in JSX), semicolons as needed, es5 trailing
  // commas, arrow parens always. `sortImports` replaces Biome organizeImports.
  fmt: {
    printWidth: 80,
    useTabs: false,
    tabWidth: 2,
    endOfLine: 'lf',
    singleQuote: true,
    jsxSingleQuote: false,
    semi: false,
    trailingComma: 'es5',
    arrowParens: 'always',
    bracketSpacing: true,
    quoteProps: 'as-needed',
    sortPackageJson: false,
    insertFinalNewline: true,
    sortImports: {
      partitionByNewline: true,
      newlinesBetween: false,
    },
    ignorePatterns: [...LINT_FMT_IGNORE, ...FMT_ONLY_IGNORE],
    // Biome's JSON formatter never added trailing commas.
    overrides: [
      {
        files: ['*.json', '*.jsonc'],
        options: { trailingComma: 'none' },
      },
      // Biome's single-quote preference applied to JS only; YAML kept its
      // double quotes.
      {
        files: ['*.yml', '*.yaml'],
        options: { singleQuote: false },
      },
    ],
  },
})
