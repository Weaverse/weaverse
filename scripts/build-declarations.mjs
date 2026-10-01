import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { addSegment, GenMapping, toEncodedMap } from '@jridgewell/gen-mapping'
import ts from 'typescript'

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
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier)
    }
    if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      specifiers.push(node.argument.literal)
    }
    ts.forEachChild(node, visit)
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
    let sourceFile = ts.createSourceFile(
      declarationFile,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    )
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

let formatHost = {
  getCanonicalFileName: (file) => file,
  getCurrentDirectory: () => packageDir,
  getNewLine: () => '\n',
}
let config = ts.readConfigFile(configPath, ts.sys.readFile)
if (config.error) {
  console.error(ts.formatDiagnostic(config.error, formatHost))
  process.exit(1)
}

let parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, packageDir, {
  noEmit: false,
  emitDeclarationOnly: true,
  declaration: true,
  declarationMap: true,
  rootDir: sourceDir,
  outDir: outputDir,
  incremental: false,
  composite: false,
})
parsed.options.paths = {}
let sourcePrefix = `${resolve(sourceDir)}${sep}`
let rootNames = parsed.fileNames.filter(
  (file) => file === resolve(sourceDir) || file.startsWith(sourcePrefix)
)
rmSync(outputDir, { recursive: true, force: true })
let program = ts.createProgram({ rootNames, options: parsed.options })
let emitResult = program.emit()
let diagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics)

if (diagnostics.length > 0) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost)
  )
  process.exit(1)
}

copyAuthoredDeclarations()
emitCommonJsDeclarations()
removeBundledDeclarations()
