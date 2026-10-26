import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
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

const TSRS = join(import.meta.dirname, '../node_modules/.bin/tsrs')

/** Runs the real analyzer over a one-package declaration fixture. */
function analyze(files) {
  let directory = mkdtempSync(join(tmpdir(), 'public-api-model-'))
  directories.push(directory)
  let write = (name, value) => {
    mkdirSync(dirname(join(directory, name)), { recursive: true })
    writeFileSync(
      join(directory, name),
      typeof value === 'string' ? value : JSON.stringify(value)
    )
  }
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
    return {
      directory,
      write,
      ...analyzeEntrypoint(api, {
        packageDir: directory,
        entryFile: join(directory, 'index.d.ts'),
        cacheDir: join(directory, 'cache'),
      }),
    }
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

/** Two external packages whose `Options` types are incompatible. */
function externalPackages(source) {
  let files = {}
  for (let [name, type] of [
    ['alpha-types', 'string'],
    ['beta-types', 'number'],
  ]) {
    files[`node_modules/${name}/package.json`] = {
      name,
      version: '1.0.0',
      types: './index.d.ts',
    }
    files[`node_modules/${name}/index.d.ts`] = source(type)
  }
  return files
}

/**
 * Type-checks `check.ts` against the generated rollup, so a rollup that binds
 * a reference to the wrong package (or does not compile) fails.
 */
function checkRollup(model, check) {
  model.write('rollup.d.ts', model.rollup)
  model.write('check.ts', check)
  model.write('check.json', {
    extends: './tsconfig.json',
    files: ['./check.ts'],
  })
  let result = spawnSync(TSRS, ['-p', 'check.json', '--pretty', 'false'], {
    cwd: model.directory,
    encoding: 'utf8',
  })
  return { status: result.status, output: result.stdout + result.stderr }
}

const CHECK = `import type { First, Second } from './rollup.js'
export const first: First = { value: { value: 'text' } }
export const second: Second = { value: { value: 1 } }
// @ts-expect-error alpha-types Options holds a string
export const wrongFirst: First = { value: { value: 1 } }
// @ts-expect-error beta-types Options holds a number
export const wrongSecond: Second = { value: { value: 'text' } }
`

describe('analyzeEntrypoint external import aliases', () => {
  for (let { form, importOf, ref, source, imports, refs } of [
    {
      form: 'named',
      importOf: (module) => `import type { Options } from '${module}'`,
      ref: 'Options',
      source: (type) => `export interface Options { value: ${type} }\n`,
      // Import lines keep the analyzer's plain text sort.
      imports: [
        "import type { Options as Options2 } from 'beta-types';",
        "import type { Options } from 'alpha-types';",
      ],
      refs: ['Options', 'Options2'],
    },
    {
      form: 'default',
      importOf: (module) => `import type Options from '${module}'`,
      ref: 'Options',
      source: (type) => `export default interface Options { value: ${type} }\n`,
      imports: [
        "import type Options from 'alpha-types';",
        "import type Options2 from 'beta-types';",
      ],
      refs: ['Options', 'Options2'],
    },
    {
      form: 'namespace',
      importOf: (module) => `import type * as Options from '${module}'`,
      ref: 'Options.Options',
      source: (type) => `export interface Options { value: ${type} }\n`,
      imports: [
        "import type * as Options from 'alpha-types';",
        "import type * as Options2 from 'beta-types';",
      ],
      refs: ['Options.Options', 'Options2.Options'],
    },
  ]) {
    test(`should_bind_each_module_to_its_own_${form}_import_when_local_names_collide`, () => {
      let declaration = (name, module) =>
        `${importOf(module)}\n/** ${name} docs */\nexport interface ${name} {\n  /** value docs */\n  value: ${ref}\n}\n`
      let model = analyze({
        ...externalPackages(source),
        'index.d.ts':
          "/** @packageDocumentation */\nexport type { First } from './first.js'\nexport type { Second } from './second.js'\nexport type { Third } from './third.js'\n",
        'first.d.ts': declaration('First', 'alpha-types'),
        'second.d.ts': declaration('Second', 'beta-types'),
        // The same binding imported again shares First's import line.
        'third.d.ts': declaration('Third', 'alpha-types'),
      })
      let body = (name, reference) =>
        `export interface ${name} {\n  value: ${reference}\n}`

      assert.deepEqual(model.errors, [])
      assert.equal(
        model.report,
        `${imports.join('\n')}\n\n${[
          body('First', refs[0]),
          body('Second', refs[1]),
          body('Third', refs[0]),
        ].join('\n\n')}\n`
      )
      assert.ok(model.rollup.startsWith(`${imports.join('\n')}\n\n`))
      assert.deepEqual(checkRollup(model, CHECK), { status: 0, output: '' })
    })
  }

  // The owned `Options` (a named or a named default declaration) is exported
  // under its own name or as an alias; either way the rollup declares
  // `Options`, so the alpha import must not keep it. `imported` is how a
  // sibling module imports it under an alias.
  for (let { title, keyword, spec, exported, imported } of [
    {
      title: 'Options',
      keyword: 'interface',
      spec: 'Options',
      exported: 'Options',
      imported: 'Options as Mine',
    },
    {
      title: 'LocalOptions',
      keyword: 'interface',
      spec: 'Options as LocalOptions',
      exported: 'LocalOptions',
      imported: 'Options as LocalOptions',
    },
    {
      title: 'default_LocalOptions',
      keyword: 'default interface',
      spec: 'default as LocalOptions',
      exported: 'LocalOptions',
      imported: 'default as LocalOptions',
    },
  ]) {
    let alias = imported.split(' as ')[1]
    test(`should_skip_declared_import_and_type_parameter_names_when_renaming_${title}`, () => {
      let model = analyze({
        ...externalPackages(
          (type) => `export interface Options { value: ${type} }\n`
        ),
        'index.d.ts': `/** @packageDocumentation */\nexport type { First } from './first.js'\nexport type { ${spec}, Options2, Second } from './second.js'\nexport type { Third } from './third.js'\nexport { default, type UsesDefault } from './fourth.js'\n`,
        'first.d.ts':
          "import type { Options } from 'alpha-types'\n/** First docs */\nexport interface First {\n  /** value docs */\n  value: Options\n}\n",
        'second.d.ts': [
          "import type { Options as External } from 'beta-types'",
          '/** Local options docs */',
          `export ${keyword} Options {`,
          '  /** flag docs */',
          '  flag: boolean',
          '}',
          '/** Options2 docs */',
          'export type Options2 = Options',
          '/** Second docs */',
          'export interface Second<Options3 = External> {',
          '  /** value docs */',
          '  value: External',
          '  /** extra docs */',
          '  extra: Options3',
          '}',
          '',
        ].join('\n'),
        // `export default interface` binds `Defaulted`, not `default`.
        'fourth.d.ts':
          '/** Defaulted docs */\nexport default interface Defaulted {\n  /** d docs */\n  d: boolean\n}\n/** UsesDefault docs */\nexport type UsesDefault = Defaulted\n',
        // A reference spelled with an import alias of the local `Options`.
        'third.d.ts': `import type { ${imported} } from './second.js'\n/** Third docs */\nexport interface Third {\n  /** local docs */\n  local: ${alias}\n}\n`,
      })

      // `External` keeps its name; the alpha `Options` would clash with the
      // declared local `Options`, and Options2/Options3 are taken.
      assert.deepEqual(model.errors, [])
      assert.match(
        model.rollup,
        /^import type \{ Options as External \} from 'beta-types';\nimport type \{ Options as Options4 \} from 'alpha-types';\n/
      )
      assert.match(model.report, /value: Options4\n/)
      assert.match(
        model.report,
        new RegExp(`export ${keyword} Options \\{\\n {2}flag: boolean\\n\\}`)
      )
      // The report spells the exported name; the rollup the declaration.
      assert.match(model.report, new RegExp(`Options2 = ${exported}\\n`))
      assert.match(model.report, new RegExp(`local: ${exported}\\n`))
      assert.match(model.rollup, /Options2 = Options\n/)
      assert.match(model.rollup, /local: Options\n/)
      assert.match(model.rollup, /UsesDefault = Defaulted\n/)
      assert.equal(
        model.rollup.includes('export { Options as LocalOptions };'),
        exported === 'LocalOptions'
      )
      assert.ok(!model.rollup.includes('export { default as'), model.rollup)
      assert.deepEqual(
        checkRollup(
          model,
          `import type Defaulted from './rollup.js'
import type { First, ${exported}, Options2, Second, Third, UsesDefault } from './rollup.js'
export const first: First = { value: { value: 'text' } }
export const second: Second = { value: { value: 1 }, extra: { value: 2 } }
export const local: ${exported} = { flag: true }
export const alias: Options2 = { flag: false }
export const third: Third = { local: { flag: true } }
export const defaulted: Defaulted = { d: true }
export const usesDefault: UsesDefault = { d: false }
// @ts-expect-error UsesDefault is the default-exported interface
export const wrongDefault: UsesDefault = { d: 1 }
// @ts-expect-error Options2 is the local Options
export const wrongAlias: Options2 = { value: 'text' }
// @ts-expect-error Third holds the local Options
export const wrongThird: Third = { local: { value: 1 } }
// @ts-expect-error alpha-types Options holds a string
export const wrong: First = { value: { value: 1 } }
// @ts-expect-error beta-types Options holds a number
export const wrongSecond: Second = { value: { value: 'text' }, extra: { value: 2 } }
// @ts-expect-error the local Options is not an external Options
export const wrongLocal: ${exported} = { value: 'text' }
`
        ),
        { status: 0, output: '' }
      )
    })
  }
})
