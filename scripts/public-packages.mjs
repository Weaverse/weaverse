import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

function findCondition(value, condition) {
  if (typeof value === 'string') {
    return condition === 'default' ? value : undefined
  }

  if (!(value && typeof value === 'object')) {
    return
  }

  if (typeof value[condition] === 'string') {
    return value[condition]
  }

  for (let child of Object.values(value)) {
    let match = findCondition(child, condition)
    if (match) {
      return match
    }
  }

  return
}

function getEntrypoints(packageJson) {
  if (
    packageJson.exports &&
    typeof packageJson.exports === 'object' &&
    Object.keys(packageJson.exports).some((key) => key.startsWith('.'))
  ) {
    return Object.entries(packageJson.exports)
      .filter(([subpath]) => subpath !== './package.json')
      .map(([subpath, value]) => ({
        subpath,
        specifier:
          subpath === '.'
            ? packageJson.name
            : `${packageJson.name}/${subpath.slice(2)}`,
        types: findCondition(value, 'types'),
        import: findCondition(value, 'import'),
        require: findCondition(value, 'require'),
      }))
  }

  return [
    {
      subpath: '.',
      specifier: packageJson.name,
      types: packageJson.types ?? packageJson.typings,
      import:
        packageJson.module ??
        (packageJson.type === 'module' ? packageJson.main : undefined),
      require: packageJson.type === 'module' ? undefined : packageJson.main,
    },
  ]
}

export function getPublishedPackages(rootDir) {
  let packagesDir = join(rootDir, 'packages')

  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      let packageFolder = join(packagesDir, entry.name)
      let packageJsonPath = join(packageFolder, 'package.json')
      let packageJson

      try {
        packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      } catch {
        return []
      }

      if (
        !(packageJson.name && packageJson.publishConfig && !packageJson.private)
      ) {
        return []
      }

      return [
        {
          folderName: entry.name,
          folder: packageFolder,
          packageJson,
          entrypoints: getEntrypoints(packageJson),
        },
      ]
    })
    .sort((left, right) =>
      left.packageJson.name.localeCompare(right.packageJson.name)
    )
}

function addExportDeclarationNames({
  statement,
  sourceFile,
  names,
  resolveWildcard,
  modulePath,
}) {
  if (!statement.exportClause) {
    let specifier = statement.moduleSpecifier?.getText(sourceFile).slice(1, -1)
    if (!(specifier && resolveWildcard)) {
      throw new Error(
        `Cannot inventory wildcard runtime export in ${modulePath}`
      )
    }
    for (let name of resolveWildcard(specifier)) {
      if (name !== 'default') {
        names.add(name)
      }
    }
  } else if (ts.isNamedExports(statement.exportClause)) {
    for (let element of statement.exportClause.elements) {
      names.add(element.name.text)
    }
  } else if (ts.isNamespaceExport(statement.exportClause)) {
    names.add(statement.exportClause.name.text)
  }
}

function addModifiedDeclarationNames(statement, names) {
  let modifiers = ts.canHaveModifiers(statement)
    ? ts.getModifiers(statement)
    : undefined
  if (
    !modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
  ) {
    return
  }
  if (
    modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)
  ) {
    names.add('default')
  } else if (
    (ts.isClassDeclaration(statement) ||
      ts.isFunctionDeclaration(statement) ||
      ts.isEnumDeclaration(statement)) &&
    statement.name
  ) {
    names.add(statement.name.text)
  } else if (ts.isVariableStatement(statement)) {
    for (let declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        names.add(declaration.name.text)
      }
    }
  }
}

export function getEsmExportNames(modulePath, resolveWildcard) {
  let sourceFile = ts.createSourceFile(
    modulePath,
    readFileSync(modulePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )
  let names = new Set()

  for (let statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      addExportDeclarationNames({
        statement,
        sourceFile,
        names,
        resolveWildcard,
        modulePath,
      })
    } else if (ts.isExportAssignment(statement)) {
      names.add('default')
    } else {
      addModifiedDeclarationNames(statement, names)
    }
  }

  return [...names].sort()
}

export function collectPublishedFiles(value, files = new Set()) {
  if (typeof value === 'string') {
    files.add(value)
    return files
  }

  if (value && typeof value === 'object') {
    for (let child of Object.values(value)) {
      collectPublishedFiles(child, files)
    }
  }

  return files
}
