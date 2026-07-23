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
let packageDir = process.cwd()
let sourceDir = join(packageDir, 'src')
let outputDir = join(packageDir, 'dist', 'types')
let configPath = join(packageDir, 'tsconfig.json')
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
removeBundledDeclarations()
