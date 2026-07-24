import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { originalPositionFor, TraceMap } from '@jridgewell/trace-mapping'
import ts from 'typescript'
import {
  collectPublishedFiles,
  getEsmExportNames,
  getPublishedPackages,
} from './public-packages.mjs'

let ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
let RUNTIME_REPORT = join(ROOT_DIR, 'api-reports', 'runtime-exports.api.md')
let PNPM = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const RUNTIME_JSON_BLOCK = /```json\n([\s\S]*?)\n```/
// Next's browser entry imports next/navigation, which is resolved by its bundler.
const NODE_ESM_EXCLUSIONS = new Set(['@weaverse/next'])
let publishedPackages = getPublishedPackages(ROOT_DIR)
let typeEntrypoints = publishedPackages.flatMap((publishedPackage) =>
  publishedPackage.entrypoints
    .filter((entrypoint) => entrypoint.types)
    .map((entrypoint) => ({ publishedPackage, entrypoint }))
)
let scratchDir = mkdtempSync(join(tmpdir(), 'weaverse-packed-packages-'))
let consumerDir = join(scratchDir, 'consumer')

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    let path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function run(command, args, options = {}) {
  let result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    ...options,
  })

  if (result.status !== 0) {
    let output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
    throw new Error(`${command} ${args.join(' ')} failed\n${output}`)
  }

  return result.stdout.trim()
}

function verifyIdentityMap(declarationFile, declarationMap, sourceFile) {
  let traceMap = new TraceMap(declarationMap)
  let lines = readFileSync(sourceFile, 'utf8').split('\n')

  for (let [lineIndex, line] of lines.entries()) {
    for (let column of new Set([0, Math.floor(line.length / 2), line.length])) {
      let position = originalPositionFor(traceMap, {
        line: lineIndex + 1,
        column,
      })
      if (position.line !== lineIndex + 1 || position.column !== column) {
        throw new Error(
          `Declaration map is not identity-preserving at ${declarationFile}:${lineIndex + 1}:${column}`
        )
      }
    }
  }
}

function normalizeEntry(entryFile) {
  return entryFile.startsWith('./') ? entryFile.slice(2) : entryFile
}

function hasInterfaceProperty(declarationFile, interfaceName, propertyName) {
  let sourceFile = ts.createSourceFile(
    declarationFile,
    readFileSync(declarationFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  let found = false

  function visit(node) {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === interfaceName &&
      node.members.some(
        (member) =>
          ts.isPropertySignature(member) &&
          member.name?.getText(sourceFile) === propertyName
      )
    ) {
      found = true
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return found
}

function hasDeprecatedMember(
  declarationFile,
  memberName,
  memberKind,
  migrationTarget
) {
  let sourceFile = ts.createSourceFile(
    declarationFile,
    readFileSync(declarationFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  let found = false

  function visit(node) {
    let kindMatches =
      (memberKind === 'property' && ts.isPropertySignature(node)) ||
      (memberKind === 'method' && ts.isMethodDeclaration(node))
    if (kindMatches && node.name?.getText(sourceFile) === memberName) {
      found = ts
        .getJSDocTags(node)
        .some(
          (tag) =>
            tag.kind === ts.SyntaxKind.JSDocDeprecatedTag &&
            tag.getText(sourceFile).includes(migrationTarget)
        )
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return found
}

try {
  mkdirSync(consumerDir, { recursive: true })

  let packedDependencies = {}
  for (let publishedPackage of publishedPackages) {
    let { folderName, folder, packageJson } = publishedPackage
    let tarball = join(scratchDir, `${folderName}.tgz`)

    run(PNPM, ['pack', '--out', tarball], { cwd: folder })
    packedDependencies[packageJson.name] = `file:${tarball}`
  }

  let rootPackageJson = JSON.parse(
    readFileSync(join(ROOT_DIR, 'package.json'), 'utf8')
  )
  packedDependencies['@types/react'] =
    rootPackageJson.devDependencies['@types/react']
  packedDependencies['@types/react-dom'] =
    rootPackageJson.devDependencies['@types/react-dom']

  writeFileSync(
    join(consumerDir, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        type: 'module',
        packageManager: 'pnpm@11.1.2',
        dependencies: packedDependencies,
      },
      null,
      2
    )}\n`
  )
  run(
    PNPM,
    [
      'install',
      '--prefer-offline',
      '--ignore-scripts',
      '--strict-peer-dependencies=false',
    ],
    { cwd: consumerDir }
  )

  for (let publishedPackage of publishedPackages) {
    let { packageJson } = publishedPackage
    let packedFolder = join(
      consumerDir,
      'node_modules',
      ...packageJson.name.split('/')
    )
    let packedPackageJson = JSON.parse(
      readFileSync(join(packedFolder, 'package.json'), 'utf8')
    )
    let entryFiles = collectPublishedFiles(packedPackageJson.exports)

    for (let field of ['main', 'module', 'types', 'typings']) {
      if (packedPackageJson[field]) {
        entryFiles.add(packedPackageJson[field])
      }
    }
    collectPublishedFiles(packedPackageJson.bin, entryFiles)

    for (let entryFile of entryFiles) {
      if (!existsSync(join(packedFolder, normalizeEntry(entryFile)))) {
        throw new Error(
          `${packageJson.name} is missing packed entry ${entryFile}`
        )
      }
    }

    let declarationFolders = new Set(
      publishedPackage.entrypoints
        .filter((entrypoint) => entrypoint.types)
        .map((entrypoint) =>
          dirname(join(packedFolder, normalizeEntry(entrypoint.types)))
        )
    )
    let declarationFiles = [...declarationFolders].flatMap((folder) =>
      walk(folder).filter((file) => file.endsWith('.d.ts'))
    )
    let packedPrefix = `${resolve(packedFolder)}${sep}`

    for (let declarationFile of declarationFiles) {
      let mapFile = `${declarationFile}.map`
      if (!existsSync(mapFile)) {
        throw new Error(`${packageJson.name} is missing ${mapFile}`)
      }

      let declarationMap = JSON.parse(readFileSync(mapFile, 'utf8'))
      for (let source of declarationMap.sources) {
        let target = resolve(
          dirname(mapFile),
          declarationMap.sourceRoot ?? '',
          source
        )
        if (!(target.startsWith(packedPrefix) && existsSync(target))) {
          throw new Error(
            `${packageJson.name} declaration map points outside its tarball: ${source}`
          )
        }
        if (!target.includes(`${sep}src${sep}`)) {
          throw new Error(
            `${packageJson.name} declaration map does not target authored source: ${source}`
          )
        }
        if (target.endsWith('.d.ts')) {
          verifyIdentityMap(declarationFile, declarationMap, target)
        }
      }
    }

    if (packageJson.name === '@weaverse/schema') {
      let validationDeclaration = declarationFiles.find((file) =>
        file.endsWith(`${sep}validation.d.ts`)
      )
      if (
        !(
          validationDeclaration &&
          hasInterfaceProperty(validationDeclaration, 'BasicInput', 'sensitive')
        )
      ) {
        throw new Error(
          '@weaverse/schema packed declarations are missing BasicInput.sensitive'
        )
      }
    }
  }

  let deprecationRequirements = {
    '@weaverse/hydrogen': [['enabledOn', 'property', 'enabled']],
    '@weaverse/schema': [
      ['enabledOn', 'property', 'enabled'],
      ['inspector', 'property', 'settings'],
      ['enabledOn', 'method', 'enabled'],
    ],
  }

  for (let [packageName, requirements] of Object.entries(
    deprecationRequirements
  )) {
    let publishedPackage = publishedPackages.find(
      (candidate) => candidate.packageJson.name === packageName
    )
    let declarationFiles = publishedPackage.entrypoints
      .filter((entrypoint) => entrypoint.types)
      .flatMap((entrypoint) => {
        let entryFile = join(
          consumerDir,
          'node_modules',
          ...packageName.split('/'),
          normalizeEntry(entrypoint.types)
        )
        return walk(dirname(entryFile)).filter((file) => file.endsWith('.d.ts'))
      })

    for (let [memberName, memberKind, migrationTarget] of requirements) {
      if (
        !declarationFiles.some((file) =>
          hasDeprecatedMember(file, memberName, memberKind, migrationTarget)
        )
      ) {
        throw new Error(
          `${packageName} lost ${memberName} ${memberKind} migration guidance`
        )
      }
    }
  }

  let runtimeJson = readFileSync(RUNTIME_REPORT, 'utf8').match(
    RUNTIME_JSON_BLOCK
  )?.[1]
  if (!runtimeJson) {
    throw new Error('Runtime export report does not contain a JSON block')
  }
  let runtimeExports = JSON.parse(runtimeJson)
  if (
    runtimeExports['@weaverse/schema'].includes('generateComponentManifest')
  ) {
    throw new Error(
      '@weaverse/schema must not expose the build-only manifest generator'
    )
  }
  let esmEntrypoints = typeEntrypoints.filter(
    ({ entrypoint }) => entrypoint.import
  )
  let cjsEntrypoints = typeEntrypoints.filter(
    ({ entrypoint }) => entrypoint.require
  )

  for (let { publishedPackage, entrypoint } of esmEntrypoints) {
    let packedModule = join(
      consumerDir,
      'node_modules',
      ...publishedPackage.packageJson.name.split('/'),
      normalizeEntry(entrypoint.import)
    )
    let actual = getEsmExportNames(packedModule, (specifier) => {
      let exports = runtimeExports[specifier]
      if (!exports) {
        throw new Error(`Cannot resolve runtime exports for ${specifier}`)
      }
      return exports
    })
    if (
      JSON.stringify(actual) !==
      JSON.stringify(runtimeExports[entrypoint.specifier])
    ) {
      throw new Error(`Runtime exports changed for ${entrypoint.specifier}`)
    }
  }

  let runtimeCheck = `let expected = ${JSON.stringify(runtimeExports)}

function verify(specifier, runtimeModule) {
  let expectedNames = expected[specifier]
  let actual = Object.keys(runtimeModule)
    .filter(
      (name) =>
        !['default', 'module.exports'].includes(name) || expectedNames.includes(name)
    )
    .sort()
  if (JSON.stringify(actual) !== JSON.stringify(expectedNames)) {
    throw new Error(
      \`Runtime exports changed for \${specifier}: expected \${expectedNames.join(', ')}, received \${actual.join(', ')}\`
    )
  }
}
`
  let executableEsmEntrypoints = esmEntrypoints.filter(
    ({ entrypoint }) => !NODE_ESM_EXCLUSIONS.has(entrypoint.specifier)
  )
  writeFileSync(
    join(consumerDir, 'runtime.mjs'),
    `${executableEsmEntrypoints
      .map(({ publishedPackage, entrypoint }, index) => {
        let modulePath = join(
          consumerDir,
          'node_modules',
          ...publishedPackage.packageJson.name.split('/'),
          normalizeEntry(entrypoint.import)
        )
        return `import * as runtime${index} from '${pathToFileURL(modulePath).href}'`
      })
      .join('\n')}\n\n${runtimeCheck}\n${executableEsmEntrypoints
      .map(
        ({ entrypoint }, index) =>
          `verify('${entrypoint.specifier}', runtime${index})`
      )
      .join('\n')}\n`
  )
  writeFileSync(
    join(consumerDir, 'runtime.cjs'),
    `${runtimeCheck}\n${cjsEntrypoints
      .map(
        ({ entrypoint }) =>
          `verify('${entrypoint.specifier}', require('${entrypoint.specifier}'))`
      )
      .join('\n')}\n`
  )
  run(process.execPath, ['runtime.mjs'], { cwd: consumerDir })
  run(process.execPath, ['runtime.cjs'], { cwd: consumerDir })
  writeFileSync(
    join(consumerDir, 'manifest-runtime.mjs'),
    `import { generateComponentManifest } from '@weaverse/schema/manifest'

let artifact = await generateComponentManifest(
  [{ schema: { type: 'hero', title: 'Hero' } }],
  { source: { name: 'packed-consumer', revision: 'abc123' } }
)
if (
  artifact.hash !==
  'sha256:03c8db23865fd426237481016f5f7f24f6b6ead22a4420e8ba374a537400902b'
) {
  throw new Error(\`Unexpected component manifest hash: \${artifact.hash}\`)
}
`
  )
  run(process.execPath, ['manifest-runtime.mjs'], { cwd: consumerDir })

  writeFileSync(
    join(consumerDir, 'index.ts'),
    `${typeEntrypoints
      .map(
        ({ entrypoint }, index) =>
          `import * as api${index} from '${entrypoint.specifier}'`
      )
      .join('\n')}
import type {
  ComponentAvailabilityContext as HydrogenAvailabilityContext,
  Resolvable as HydrogenResolvable,
} from '@weaverse/hydrogen'
import type {
  BasicInput,
  ComponentAvailabilityContext,
  HeadingInput,
  Resolvable,
  SchemaType,
} from '@weaverse/schema'
import {
  type ComponentManifestArtifact,
  generateComponentManifest,
} from '@weaverse/schema/manifest'

let modules = [${typeEntrypoints.map((_, index) => `api${index}`).join(', ')}]
let heading: HeadingInput = {
  type: 'heading',
  label: 'Compatibility heading',
  customProperty: true,
}
let input: BasicInput = {
  type: 'text',
  name: 'title',
  condition: 'data.showTitle',
  defaultValue: Symbol('legacy value'),
}
let componentSchema: SchemaType = {
  type: 'compatibility-section',
  title: 'Compatibility section',
  enabledOn: { pages: ['PRODUCT'], groups: ['body'] },
  settings: [{ group: 'Content', inputs: [heading, input] }],
}
let enabled: Resolvable<boolean, ComponentAvailabilityContext> = ({ page }) =>
  page.type === 'PRODUCT'
let hydrogenEnabled: HydrogenResolvable<
  boolean,
  HydrogenAvailabilityContext
> = enabled
let manifestArtifact: Promise<ComponentManifestArtifact> =
  generateComponentManifest(
    [{ schema: componentSchema }],
    { source: { name: 'consumer', revision: 'abc123' } }
  )

void [modules, componentSchema, hydrogenEnabled, manifestArtifact]
`
  )
  writeFileSync(
    join(consumerDir, 'consumer.cts'),
    `import { Weaverse } from '@weaverse/core'
import { assignVariant } from '@weaverse/experiments'
import { createExposureTracker } from '@weaverse/experiments/react'
import { getExperiments } from '@weaverse/experiments/server'
import { WeaverseClient } from '@weaverse/hydrogen'
import { createWeaverseNextClient } from '@weaverse/next'
import { getWeaverseNextConfigs } from '@weaverse/next/server'
import { WeaverseRoot } from '@weaverse/react'

void [
  Weaverse,
  assignVariant,
  createExposureTracker,
  getExperiments,
  WeaverseClient,
  createWeaverseNextClient,
  getWeaverseNextConfigs,
  WeaverseRoot,
]
`
  )
  writeFileSync(
    join(consumerDir, 'strict.ts'),
    `import type { SchemaType } from '@weaverse/schema'

// @ts-expect-error Strict consumers reject legacy null fields.
let invalidStrictSchema: SchemaType = { title: null, type: null }
void invalidStrictSchema
`
  )
  writeFileSync(
    join(consumerDir, 'loose.ts'),
    `import type { SchemaType } from '@weaverse/schema'

let legacyLooseSchema: SchemaType = { title: null, type: null }
void legacyLooseSchema
`
  )

  for (let strict of [true, false]) {
    let configPath = join(
      consumerDir,
      `tsconfig.${strict ? 'strict' : 'loose'}.json`
    )
    writeFileSync(
      configPath,
      `${JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict,
            noEmit: true,
            skipLibCheck: true,
            jsx: 'react-jsx',
          },
          files: [
            'index.ts',
            'consumer.cts',
            strict ? 'strict.ts' : 'loose.ts',
          ],
        },
        null,
        2
      )}\n`
    )
    run(
      process.execPath,
      [
        join(ROOT_DIR, 'node_modules', 'typescript', 'bin', 'tsc'),
        '--project',
        configPath,
      ],
      { cwd: consumerDir }
    )
  }

  writeFileSync(
    join(consumerDir, 'legacy-resolution.ts'),
    `import {
  type ComponentManifestArtifact,
  generateComponentManifest,
} from '@weaverse/schema/manifest'

let artifact: Promise<ComponentManifestArtifact> = generateComponentManifest(
  [{ schema: { type: 'hero', title: 'Hero' } }],
  { source: { name: 'legacy-consumer', revision: 'abc123' } }
)
void artifact
`
  )
  let legacyResolutionConfig = join(
    consumerDir,
    'tsconfig.legacy-resolution.json'
  )
  writeFileSync(
    legacyResolutionConfig,
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Node10',
          ignoreDeprecations: '6.0',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
        },
        files: ['legacy-resolution.ts'],
      },
      null,
      2
    )}\n`
  )
  run(
    process.execPath,
    [
      join(ROOT_DIR, 'node_modules', 'typescript', 'bin', 'tsc'),
      '--project',
      legacyResolutionConfig,
    ],
    { cwd: consumerDir }
  )

  writeFileSync(
    join(consumerDir, 'declaration-check.ts'),
    `import * as core from '@weaverse/core'
import * as react from '@weaverse/react'
import * as schema from '@weaverse/schema'
import * as schemaManifest from '@weaverse/schema/manifest'
import * as experiments from '@weaverse/experiments'
import * as experimentReact from '@weaverse/experiments/react'
import * as experimentServer from '@weaverse/experiments/server'

void [
  core,
  react,
  schema,
  schemaManifest,
  experiments,
  experimentReact,
  experimentServer,
]
`
  )
  let declarationConfig = join(consumerDir, 'tsconfig.declarations.json')
  writeFileSync(
    declarationConfig,
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          jsx: 'react-jsx',
        },
        files: ['declaration-check.ts'],
      },
      null,
      2
    )}\n`
  )
  run(
    process.execPath,
    [
      join(ROOT_DIR, 'node_modules', 'typescript', 'bin', 'tsc'),
      '--project',
      declarationConfig,
    ],
    { cwd: consumerDir }
  )

  console.log(
    `Verified ${publishedPackages.length} packed packages and ${typeEntrypoints.length} TypeScript entrypoints`
  )
} finally {
  rmSync(scratchDir, { recursive: true, force: true })
}
