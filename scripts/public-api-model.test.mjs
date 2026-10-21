import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, test } from 'node:test'
import { API } from 'tsrs/unstable/sync'
import { analyzeEntrypoint } from './public-api-model.mjs'

let directories = []
after(() => {
  for (let directory of directories) {
    rmSync(directory, { recursive: true, force: true })
  }
})

const TYPES = `/** A docs */
export interface A {
  /** x */
  x: string
}
/** B docs */
export interface B {
  /** x */
  x: number
}
`

/** Runs the real analyzer over a one-package declaration fixture. */
function analyze(files) {
  let directory = mkdtempSync(join(tmpdir(), 'public-api-model-'))
  directories.push(directory)
  let write = (name, value) =>
    writeFileSync(
      join(directory, name),
      typeof value === 'string' ? value : JSON.stringify(value)
    )
  write('package.json', { name: 'api-fixture', type: 'module' })
  write('tsconfig.json', {
    compilerOptions: {
      strict: true,
      target: 'es2022',
      module: 'esnext',
      moduleResolution: 'bundler',
      noEmit: true,
      types: [],
    },
  })
  write('types.d.ts', TYPES)
  for (let [name, text] of Object.entries(files)) {
    write(name, text)
  }
  let api = new API({ cwd: directory })
  try {
    return analyzeEntrypoint(api, {
      packageDir: directory,
      entryFile: join(directory, 'index.d.ts'),
      cacheDir: join(directory, 'cache'),
    })
  } finally {
    api.close()
  }
}

function entry(
  importLine,
  exportLine = "export type { A, B } from './types.js'"
) {
  return {
    'index.d.ts': `/** @packageDocumentation */
${importLine}
${exportLine}
/** API docs */
export interface Api {
  /** value docs */
  value: X
}
`,
  }
}

describe('analyzeEntrypoint reference binding', () => {
  test('should_report_different_targets_when_a_local_alias_is_retargeted', () => {
    let a = analyze(entry("import type { A as X } from './types.js'"))
    let b = analyze(entry("import type { B as X } from './types.js'"))

    assert.deepEqual(a.errors, [])
    assert.deepEqual(b.errors, [])
    assert.notEqual(a.report, b.report)
    assert.match(a.report, /value: A\n/)
    assert.match(b.report, /value: B\n/)
    assert.match(a.rollup, /value: A\n/)
  })

  test('should_report_the_same_api_when_only_the_local_alias_spelling_changes', () => {
    let x = analyze(entry("import type { A as X } from './types.js'"))
    let renamed = analyze({
      'index.d.ts': entry("import type { A as Y } from './types.js'")[
        'index.d.ts'
      ].replace('value: X', 'value: Y'),
    })

    assert.deepEqual(renamed.errors, [])
    assert.equal(renamed.report, x.report)
  })

  test('should_use_the_exported_name_when_the_target_is_reexported_under_an_alias', () => {
    let model = analyze(
      entry(
        "import type { A as X } from './types.js'",
        "export type { A as PublicA, B } from './types.js'"
      )
    )

    assert.deepEqual(model.errors, [])
    assert.match(model.report, /value: PublicA\n/)
    assert.match(model.report, /export \{ A as PublicA \};/)
  })

  test('should_fail_when_the_aliased_target_is_not_exported', () => {
    let model = analyze(
      entry(
        "import type { A as X } from './types.js'",
        "export type { B } from './types.js'"
      )
    )

    assert.equal(model.errors.length, 1)
    assert.match(
      model.errors[0],
      /'A' is referenced by public 'Api' but is not exported from the entrypoint \(forgotten export\)/
    )
  })
})
