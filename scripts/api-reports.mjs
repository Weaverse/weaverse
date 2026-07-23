import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import ts from 'typescript'
import { getEsmExportNames, getPublishedPackages } from './public-packages.mjs'

let ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
let REPORT_DIR = join(ROOT_DIR, 'api-reports')
let TEMP_DIR = join(ROOT_DIR, 'node_modules', '.cache', 'api-reports')
let RUNTIME_REPORT = join(REPORT_DIR, 'runtime-exports.api.md')
let UPDATE_REPORTS = process.argv.includes('--update')
let publishedPackages = getPublishedPackages(ROOT_DIR)
let typeEntrypoints = publishedPackages.flatMap((publishedPackage) =>
  publishedPackage.entrypoints
    .filter((entrypoint) => entrypoint.types)
    .map((entrypoint) => ({ publishedPackage, entrypoint }))
)

mkdirSync(REPORT_DIR, { recursive: true })
mkdirSync(TEMP_DIR, { recursive: true })

let failed = false

function hasDocumentation(node, sourceFile) {
  if (ts.getJSDocCommentsAndTags(node).length > 0) {
    return true
  }
  if (
    !(ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node))
  ) {
    return false
  }
  let memberName = node.name.getText(sourceFile)
  return Boolean(
    node.parent.members?.some(
      (member) =>
        member !== node &&
        (ts.isGetAccessorDeclaration(member) ||
          ts.isSetAccessorDeclaration(member)) &&
        member.name.getText(sourceFile) === memberName &&
        ts.getJSDocCommentsAndTags(member).length > 0
    )
  )
}

function isPublicMember(node) {
  let modifiers = ts.getModifiers(node) ?? []
  return !modifiers.some(
    (modifier) =>
      modifier.kind === ts.SyntaxKind.PrivateKeyword ||
      modifier.kind === ts.SyntaxKind.ProtectedKeyword
  )
}

function getUndocumentedMembers(declarationFile) {
  let sourceFile = ts.createSourceFile(
    declarationFile,
    readFileSync(declarationFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  let gaps = []
  let memberKinds = new Set([
    ts.SyntaxKind.CallSignature,
    ts.SyntaxKind.ConstructSignature,
    ts.SyntaxKind.GetAccessor,
    ts.SyntaxKind.IndexSignature,
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.MethodSignature,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.PropertySignature,
    ts.SyntaxKind.SetAccessor,
  ])

  function visit(node, owner) {
    if (
      memberKinds.has(node.kind) &&
      isPublicMember(node) &&
      !hasDocumentation(node, sourceFile)
    ) {
      let position = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile)
      )
      let memberName =
        node.name?.getText(sourceFile) ?? node.getText(sourceFile)
      gaps.push(`${owner}.${memberName} (line ${position.line + 1})`)
    }
    ts.forEachChild(node, (child) => visit(child, owner))
  }

  for (let statement of sourceFile.statements) {
    if (
      !ts
        .getModifiers(statement)
        ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue
    }
    let owner = statement.name?.getText(sourceFile) ?? '<anonymous export>'
    if (
      ts.isClassDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement)
    ) {
      visit(statement, owner)
      continue
    }
    if (ts.isFunctionDeclaration(statement)) {
      for (let parameter of statement.parameters) {
        if (parameter.type) {
          visit(parameter.type, owner)
        }
      }
      if (statement.type) {
        visit(statement.type, owner)
      }
    }
  }

  return gaps
}

for (let { publishedPackage, entrypoint } of typeEntrypoints) {
  let { folderName, folder } = publishedPackage
  let reportName = `${folderName}${
    entrypoint.subpath === '.'
      ? ''
      : `.${entrypoint.subpath.slice(2).replaceAll('/', '.')}`
  }`
  let extractorConfig = ExtractorConfig.prepare({
    configObject: {
      projectFolder: folder,
      mainEntryPointFilePath: join(folder, entrypoint.types),
      compiler: {
        tsconfigFilePath: join(folder, 'tsconfig.json'),
        skipLibCheck: true,
      },
      apiReport: {
        enabled: true,
        reportFileName: reportName,
        reportFolder: REPORT_DIR,
        reportTempFolder: TEMP_DIR,
      },
      docModel: { enabled: false },
      dtsRollup: {
        enabled: true,
        untrimmedFilePath: join(TEMP_DIR, `${reportName}.d.ts`),
      },
      tsdocMetadata: { enabled: false },
      messages: {
        compilerMessageReporting: {
          default: { logLevel: 'error' },
        },
        extractorMessageReporting: {
          default: { logLevel: 'error' },
          'ae-forgotten-export': { logLevel: 'error' },
          'ae-missing-release-tag': { logLevel: 'none' },
          'ae-undocumented': { logLevel: 'error' },
          'ae-unresolved-link': { logLevel: 'error' },
        },
        tsdocMessageReporting: {
          default: { logLevel: 'none' },
        },
      },
    },
    configObjectFullPath: undefined,
    packageJsonFullPath: join(folder, 'package.json'),
  })

  let result = Extractor.invoke(extractorConfig, {
    localBuild: UPDATE_REPORTS,
    printApiReportDiff: true,
    showVerboseMessages: false,
  })

  if (!result.succeeded) {
    failed = true
    continue
  }

  let declarationFile = join(TEMP_DIR, `${reportName}.d.ts`)
  let documentationGaps = getUndocumentedMembers(declarationFile)
  if (documentationGaps.length > 0) {
    console.error(
      `${entrypoint.specifier} has undocumented public members:\n${documentationGaps
        .map((gap) => `  - ${gap}`)
        .join('\n')}`
    )
    failed = true
  }

  let reportFile = join(REPORT_DIR, `${reportName}.api.md`)
  if (
    existsSync(reportFile) &&
    readFileSync(reportFile, 'utf8').includes(
      '(No @packageDocumentation comment for this package)'
    )
  ) {
    console.error(
      `${entrypoint.specifier} has no @packageDocumentation comment`
    )
    failed = true
  }
}

let runtimeExports = {}
let entrypointBySpecifier = new Map(
  typeEntrypoints.map((entry) => [entry.entrypoint.specifier, entry])
)

function collectRuntimeExports(specifier) {
  if (runtimeExports[specifier]) {
    return runtimeExports[specifier]
  }

  let entry = entrypointBySpecifier.get(specifier)
  if (!entry?.entrypoint.import) {
    throw new Error(`Cannot resolve runtime exports for ${specifier}`)
  }

  let names = getEsmExportNames(
    join(entry.publishedPackage.folder, entry.entrypoint.import),
    collectRuntimeExports
  )
  runtimeExports[specifier] = names
  return names
}

for (let { entrypoint } of typeEntrypoints) {
  if (entrypoint.import) {
    collectRuntimeExports(entrypoint.specifier)
  }
}

let runtimeReport = `## Runtime Export Report

> Do not edit this file. Run \`pnpm run api:report\` after intentional public runtime changes.

\`\`\`json
${JSON.stringify(runtimeExports, null, 2)}
\`\`\`
`
if (UPDATE_REPORTS) {
  writeFileSync(RUNTIME_REPORT, runtimeReport)
} else if (
  !existsSync(RUNTIME_REPORT) ||
  readFileSync(RUNTIME_REPORT, 'utf8') !== runtimeReport
) {
  console.error(
    'Runtime exports changed. Run `pnpm run api:report` and review the diff.'
  )
  failed = true
}

if (failed) {
  process.exitCode = 1
}
