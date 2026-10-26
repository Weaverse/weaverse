import { spawnSync } from 'node:child_process'
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { addSegment, GenMapping, toEncodedMap } from '@jridgewell/gen-mapping'
import { ScriptKind } from 'tsrs/unstable/ast'
import {
  isExportDeclaration,
  isImportDeclaration,
  isImportTypeNode,
  isLiteralTypeNode,
  isStringLiteral,
} from 'tsrs/unstable/ast/is'
import { parseSourceFile } from './source-parser.mjs'

const DECLARATION_SUFFIX = /\.d\.ts$/
const BUNDLED_DECLARATION = /\.d\.(?:ts|mts|cts)(?:\.map)?$/
const SOURCE_MAPPING_COMMENT = /\n?\/\/# sourceMappingURL=.*\n?$/
let packageDir = process.cwd()
let sourceDir = join(packageDir, 'src')
let outputDir = join(packageDir, 'dist', 'types')
let configPath = join(packageDir, 'tsconfig.json')
let packageType = JSON.parse(
  readFileSync(join(packageDir, 'package.json'), 'utf8')
).type
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    let path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function createIdentityMap(source, sourcePath, outputFile) {
  let map = new GenMapping({ file: basename(outputFile), sourceRoot: '' })
  for (let [lineIndex, line] of source.split('\n').entries()) {
    for (let column = 0; column <= line.length; column += 1) {
      addSegment(map, lineIndex, column, sourcePath, lineIndex, column)
    }
  }
  return toEncodedMap(map)
}

function removeBundledDeclarations() {
  let outputPrefix = `${resolve(outputDir)}${sep}`
  for (let file of walk(join(packageDir, 'dist'))) {
    if (
      !resolve(file).startsWith(outputPrefix) &&
      BUNDLED_DECLARATION.test(file)
    ) {
      unlinkSync(file)
    }
  }
}

function copyAuthoredDeclarations() {
  for (let sourceFile of walk(sourceDir).filter((file) =>
    DECLARATION_SUFFIX.test(file)
  )) {
    let outputFile = join(outputDir, relative(sourceDir, sourceFile))
    let mapFile = `${outputFile}.map`
    let source = readFileSync(sourceFile, 'utf8')
    let sourcePath = relative(dirname(outputFile), sourceFile)
      .split(sep)
      .join('/')
    let map = createIdentityMap(source, sourcePath, outputFile)

    mkdirSync(dirname(outputFile), { recursive: true })
    writeFileSync(
      outputFile,
      `${source}\n//# sourceMappingURL=${map.file}.map\n`
    )
    writeFileSync(mapFile, JSON.stringify(map))
  }
}

function collectModuleSpecifiers(sourceFile) {
  let specifiers = []

  function visit(node) {
    if (
      (isImportDeclaration(node) || isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier)
    }
    if (
      isImportTypeNode(node) &&
      isLiteralTypeNode(node.argument) &&
      isStringLiteral(node.argument.literal)
    ) {
      specifiers.push(node.argument.literal)
    }
    node.forEachChild(visit)
  }

  visit(sourceFile)
  return specifiers
}

/**
 * `type: "module"` packages need CommonJS declarations for their `require`
 * conditions. Without them TypeScript reads the shared `.d.ts` as ESM and
 * rejects CommonJS consumers with TS1479 under `module: node16`/`node18`.
 * Relative specifiers are rewritten to `.cjs` so the CommonJS declaration graph
 * stays internally consistent under `skipLibCheck: false`.
 */
function emitCommonJsDeclarations() {
  if (packageType !== 'module') {
    return
  }

  for (let declarationFile of walk(outputDir).filter((file) =>
    DECLARATION_SUFFIX.test(file)
  )) {
    let source = readFileSync(declarationFile, 'utf8').replace(
      SOURCE_MAPPING_COMMENT,
      '\n'
    )
    let sourceFile = parseSourceFile(declarationFile, ScriptKind.TS, source)
    let edits = collectModuleSpecifiers(sourceFile)
      .filter(
        (specifier) =>
          specifier.text.startsWith('.') && specifier.text.endsWith('.js')
      )
      .map((specifier) => ({
        start: specifier.getStart(sourceFile) + 1,
        end: specifier.getEnd() - 1,
        text: `${specifier.text.slice(0, -'.js'.length)}.cjs`,
      }))
      .sort((left, right) => right.start - left.start)
    let output = source

    for (let edit of edits) {
      output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)
    }

    writeFileSync(declarationFile.replace(DECLARATION_SUFFIX, '.d.cts'), output)
  }
}

/**
 * Emits declarations with the pinned tsrs CLI. A generated config extends the
 * package tsconfig, applies the declaration-only overrides, keeps the program
 * rooted at `src/`, and clears `paths` so emitted declarations never depend on
 * the package-local `~/*` alias. Any diagnostic fails the build.
 */
function emitDeclarations() {
  let cacheDir = join(
    packageDir,
    'node_modules',
    '.cache',
    'build-declarations'
  )
  let emitConfig = join(cacheDir, 'tsconfig.json')
  mkdirSync(cacheDir, { recursive: true })
  writeFileSync(
    emitConfig,
    `${JSON.stringify(
      {
        extends: configPath,
        compilerOptions: {
          noEmit: false,
          emitDeclarationOnly: true,
          declaration: true,
          declarationMap: true,
          rootDir: sourceDir,
          outDir: outputDir,
          incremental: false,
          composite: false,
          paths: {},
        },
        include: [join(sourceDir, '**', '*')],
      },
      null,
      2
    )}\n`
  )
  rmSync(outputDir, { recursive: true, force: true })
  let tsrs = join(
    dirname(createRequire(import.meta.url).resolve('tsrs/package.json')),
    'bin',
    'tsrs'
  )
  let result = spawnSync(process.execPath, [tsrs, '--project', emitConfig], {
    cwd: packageDir,
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

emitDeclarations()
copyAuthoredDeclarations()
emitCommonJsDeclarations()
removeBundledDeclarations()
