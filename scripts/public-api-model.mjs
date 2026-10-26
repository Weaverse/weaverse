import {
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import {
  isExportDeclaration,
  isImportClause,
  isImportDeclaration,
  isImportSpecifier,
  isNamespaceImport,
  SyntaxKind,
} from 'tsrs/unstable/ast'
import { formatDiagnostics, SymbolFlags } from 'tsrs/unstable/sync'

const LEADING_SPACE = /^\s*/

const LINK_KINDS = new Set([
  SyntaxKind.JSDocLink,
  SyntaxKind.JSDocLinkCode,
  SyntaxKind.JSDocLinkPlain,
])

function canonical(path) {
  return realpathSync(path).toLowerCase()
}

/** Tests one checker symbol flag. */
function hasFlag(symbol, flag) {
  // biome-ignore lint/suspicious/noBitwiseOperators: checker symbol flags are a bit set
  return (symbol.flags & flag) !== 0
}

function resolveAlias(checker, symbol) {
  return hasFlag(symbol, SymbolFlags.Alias)
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

function topLevelStatement(node) {
  let current = node
  while (current.parent && current.parent.kind !== SyntaxKind.SourceFile) {
    current = current.parent
  }
  return current
}

function hasExportModifier(statement) {
  return Boolean(
    statement.modifiers?.some(
      (modifier) => modifier.kind === SyntaxKind.ExportKeyword
    )
  )
}

function lineOf(node) {
  let sourceFile = node.getSourceFile()
  let position = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile)
  )
  return `${sourceFile.fileName}:${position.line + 1}`
}

function forEachDescendant(node, callback) {
  callback(node)
  node.forEachChild((child) => forEachDescendant(child, callback))
}

/** Returns every JSDoc node attached anywhere inside `node`. */
function collectJSDoc(node) {
  let docs = []
  forEachDescendant(node, (child) => {
    docs.push(...(child.jsDoc ?? []))
  })
  return docs
}

/**
 * Source text of a declaration statement with every JSDoc block removed and
 * whitespace-only lines dropped, so documentation edits do not count as
 * signature drift.
 */
function isDeprecatedDoc(doc) {
  return Boolean(
    doc.tags?.some((tag) => tag.kind === SyntaxKind.JSDocDeprecatedTag)
  )
}

/**
 * Text edits that turn a declaration into its report form: JSDoc blocks are
 * removed (a `@deprecated` tag leaves a marker), private/`#private` members are
 * dropped because they are not public API, and destructured parameters are
 * shown as `input` so renaming a binding is not reported as API drift.
 */
function reportEdits(statement) {
  let sourceFile = statement.getSourceFile()
  let edits = []
  for (let doc of collectJSDoc(statement)) {
    edits.push([
      doc.getStart(sourceFile),
      doc.end,
      isDeprecatedDoc(doc) ? '// @deprecated' : '',
    ])
  }
  forEachDescendant(statement, (node) => {
    let isMember =
      node.parent &&
      (node.parent.kind === SyntaxKind.ClassDeclaration ||
        node.parent.kind === SyntaxKind.ClassExpression)
    let isPrivate =
      isMember &&
      (node.modifiers?.some(
        (modifier) => modifier.kind === SyntaxKind.PrivateKeyword
      ) ||
        node.name?.kind === SyntaxKind.PrivateIdentifier)
    if (isPrivate) {
      edits.push([node.getFullStart(), node.end, ''])
    } else if (
      node.kind === SyntaxKind.Parameter &&
      (node.name.kind === SyntaxKind.ObjectBindingPattern ||
        node.name.kind === SyntaxKind.ArrayBindingPattern)
    ) {
      edits.push([node.name.getStart(sourceFile), node.name.end, 'input'])
    }
  })
  return edits.sort((a, b) => a[0] - b[0] || b[1] - a[1])
}

function signatureText(statement, renames) {
  let sourceFile = statement.getSourceFile()
  let start = statement.getStart(sourceFile)
  let edits = [...reportEdits(statement), ...renames].sort(
    (a, b) => a[0] - b[0] || b[1] - a[1]
  )
  let text = edits.some(([from, , replacement]) => from < start && replacement)
    ? '// @deprecated\n'
    : ''
  let cursor = start
  for (let [from, to, replacement] of edits) {
    if (to <= cursor) {
      continue
    }
    if (from < cursor) {
      continue
    }
    text += sourceFile.text.slice(cursor, from) + replacement
    cursor = to
  }
  text += sourceFile.text.slice(cursor, statement.end)
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
}

/**
 * Statement text including its own and its members' JSDoc. A rename's optional
 * fourth element is the rollup spelling when it differs from the report's.
 * `dropDefault` removes the `default` modifier of a named declaration the
 * entrypoint does not export as `default`, which would otherwise make the
 * rollup default-export it.
 */
function documentedText(statement, renames, dropDefault) {
  let sourceFile = statement.getSourceFile()
  let edits = renames
  let modifier = statement.modifiers?.find(
    (node) => node.kind === SyntaxKind.DefaultKeyword
  )
  if (dropDefault && modifier && statement.name) {
    let from = modifier.getStart(sourceFile)
    let end =
      modifier.end +
      LEADING_SPACE.exec(sourceFile.text.slice(modifier.end))[0].length
    edits = [...renames, [from, end, '']].sort((a, b) => a[0] - b[0])
  }
  let docs = statement.jsDoc ?? []
  let start = docs.length
    ? docs[0].getStart(sourceFile)
    : statement.getStart(sourceFile)
  let body = ''
  let cursor = statement.getStart(sourceFile)
  for (let [from, to, replacement, binding = replacement] of edits) {
    body += sourceFile.text.slice(cursor, from) + binding
    cursor = to
  }
  body += sourceFile.text.slice(cursor, statement.end)
  let leading = sourceFile.text.slice(start, statement.getStart(sourceFile))
  return `${leading}${hasExportModifier(statement) ? '' : 'export '}${body}`
}

function rootIdentifier(node) {
  let current = node
  while (
    current.kind === SyntaxKind.QualifiedName ||
    current.kind === SyntaxKind.PropertyAccessExpression
  ) {
    current =
      current.kind === SyntaxKind.QualifiedName
        ? current.left
        : current.expression
  }
  return current.kind === SyntaxKind.Identifier ? current : undefined
}

/** Identifiers in type positions whose symbols the public API depends on. */
function referenceRoots(statement) {
  let roots = []
  forEachDescendant(statement, (node) => {
    let target
    if (node.kind === SyntaxKind.TypeReference) {
      target = node.typeName
    } else if (node.kind === SyntaxKind.ExpressionWithTypeArguments) {
      target = node.expression
    } else if (node.kind === SyntaxKind.TypeQuery) {
      target = node.exprName
    } else if (node.kind === SyntaxKind.ImportType) {
      let specifier = node.argument.literal?.text
      if (!specifier || specifier.startsWith('.')) {
        throw new Error(
          `${lineOf(node)}: relative import() types cannot be checked for forgotten exports`
        )
      }
    }
    let root = target && rootIdentifier(target)
    if (target && !root) {
      throw new Error(
        `${lineOf(node)}: unsupported public type reference '${target.getText()}'`
      )
    }
    if (root) {
      roots.push(root)
    }
  })
  return roots
}

function linkNameParts(name) {
  if (name.kind === SyntaxKind.Identifier) {
    return [name.text]
  }
  if (name.kind === SyntaxKind.QualifiedName) {
    return [...linkNameParts(name.left), name.right.text]
  }
  return
}

function owningPackage(fileName) {
  let directory = dirname(fileName)
  while (directory !== dirname(directory)) {
    let manifest = join(directory, 'package.json')
    if (existsSync(manifest)) {
      let json = JSON.parse(readFileSync(manifest, 'utf8'))
      if (json.name) {
        return { name: json.name, directory }
      }
    }
    directory = dirname(directory)
  }
  throw new Error(`No package name owns ${fileName}`)
}

function packageNameOf(fileName) {
  return owningPackage(fileName).name
}

/**
 * Builds the public API model of one published declaration entrypoint with
 * the tsrs checker: compiler diagnostics, exported symbols resolved through
 * aliases, local declarations reachable from the public surface (unexported
 * ones are "forgotten exports"), external imports, `{@link}` resolution and
 * the presence of a `@packageDocumentation` comment.
 */
export function analyzeEntrypoint(api, { packageDir, entryFile, cacheDir }) {
  let errors = []
  let configPath = join(cacheDir, 'tsconfig.json')
  mkdirSync(cacheDir, { recursive: true })
  writeFileSync(
    configPath,
    `${JSON.stringify(
      {
        extends: join(packageDir, 'tsconfig.json'),
        compilerOptions: {
          noEmit: true,
          // The published declarations are the subject under test, so they
          // must type-check; diagnostics are collected for local files only.
          skipLibCheck: false,
          incremental: false,
          composite: false,
          paths: {},
        },
        files: [entryFile],
        include: [],
      },
      null,
      2
    )}\n`
  )

  let snapshot = api.createSnapshot({ openProjects: [configPath] })
  try {
    let project = snapshot.getConfiguredProject(configPath)
    let { program, checker } = project
    let localPrefix = `${canonical(packageDir)}${sep}`
    // tsrs reports file names as opened, not realpath'd; compare canonical
    // paths so a symlinked package directory still counts as local.
    let isLocal = (fileName) => {
      let path = canonical(fileName)
      return (
        path.startsWith(localPrefix) &&
        !path.slice(localPrefix.length).split(/[\\/]/).includes('node_modules')
      )
    }

    let localFiles = program.getSourceFileNames().filter(isLocal)
    let diagnostics = [
      ...program.getConfigFileParsingDiagnostics(),
      ...program.getGlobalDiagnostics(),
      ...program.getSyntacticDiagnostics(localFiles),
      ...program.getSemanticDiagnostics(localFiles),
    ]
    if (diagnostics.length > 0) {
      errors.push(formatDiagnostics(diagnostics, api).trimEnd())
    }

    let entry = program.getSourceFile(entryFile)
    let packageDocumented = (entry.statements[0]?.jsDoc ?? []).some((doc) =>
      doc.tags?.some((tag) => tag.tagName.text === 'packageDocumentation')
    )

    let exportsByName = new Map()
    let exportedIds = new Map()
    let exportedNames = new Map()
    let moduleSymbol = checker.getSymbolOfSourceFile(entryFile)
    for (let symbol of checker.getExportsOfModule(moduleSymbol)) {
      let target = resolveAlias(checker, symbol)
      if (checker.isUnknownSymbol(target)) {
        errors.push(`export '${symbol.name}' does not resolve to a declaration`)
        continue
      }
      exportsByName.set(symbol.name, target)
      exportedIds.set(target.id, symbol.name)
      exportedNames.set(target.id, [
        ...(exportedNames.get(target.id) ?? []),
        symbol.name,
      ])
    }

    // A reference to an owned declaration is reported under the name the
    // entrypoint exports it as, so the report binds every local alias
    // (`import { A as X }`) to its exported target: retargeting X changes the
    // report, while renaming only the local alias does not. A target exported
    // under several names keeps the local spelling when it is one of them,
    // otherwise the first in sort order (all of them name the same symbol).
    let canonicalName = (target, root) => {
      let names = exportedNames.get(target.id)
      return names.includes(root.text) ? root.text : [...names].sort()[0]
    }
    // The name an owned declaration binds in the rollup: neither
    // `export { A as B }` nor `export default interface A` binds `B`/`default`.
    let bindingOf = (target) =>
      target.declarations[0]?.resolve(project)?.name?.text ?? target.name
    // Statement key -> [start, end, exported name] edits of its references.
    let renamesByStatement = new Map()
    let statements = new Map()
    let ownersByStatement = new Map()
    let imports = new Map()
    // A symbol belongs to this package only when every declaration is local;
    // a local `declare module`/`declare global` augmentation merges into an
    // externally owned symbol instead.
    let isOwned = (symbol) =>
      symbol.declarations.length > 0 &&
      symbol.declarations.every((handle) => isLocal(handle.path))
    let pending = [...exportsByName.values()].filter(isOwned)
    let visited = new Set()
    // Each distinct external binding, keyed by local name and what it binds;
    // `refs` are the reference roots to rename if the local name must change.
    let addImport = (alias, target, root, key) => {
      let declaration = alias.declarations[0]?.resolve(project)
      if (declaration?.kind === SyntaxKind.NamespaceExportDeclaration) {
        // A UMD global such as `React` from `export as namespace React`.
        return
      }
      let importDeclaration = declaration
      while (importDeclaration && !isImportDeclaration(importDeclaration)) {
        importDeclaration = importDeclaration.parent
      }
      if (!importDeclaration) {
        throw new Error(
          `${lineOf(root)}: '${root.text}' is not imported from a module`
        )
      }
      let module = importDeclaration.moduleSpecifier.text
      if (module.startsWith('.')) {
        // Re-exported through a local file: name the owning package instead.
        module = packageNameOf(target.declarations[0].path)
      }
      let typeOnly =
        Boolean(importDeclaration.importClause?.isTypeOnly) ||
        Boolean(declaration.isTypeOnly)
      // `*` is a namespace import, `default` a default import, otherwise the
      // imported export name.
      let binding
      if (isNamespaceImport(declaration)) {
        binding = '*'
      } else if (isImportSpecifier(declaration)) {
        binding =
          module === importDeclaration.moduleSpecifier.text
            ? (declaration.propertyName?.text ?? declaration.name.text)
            : target.name
      } else if (isImportClause(declaration)) {
        binding = 'default'
      } else {
        throw new Error(
          `${lineOf(root)}: unsupported import form for '${root.text}'`
        )
      }
      let id = JSON.stringify([root.text, module, binding])
      let external = imports.get(id) ?? {
        local: root.text,
        module,
        binding,
        target,
        typeOnly: true,
        refs: [],
      }
      external.typeOnly &&= typeOnly
      external.refs.push([key, root])
      imports.set(id, external)
    }

    while (pending.length > 0) {
      let symbol = pending.pop()
      if (visited.has(symbol.id)) {
        continue
      }
      visited.add(symbol.id)
      let owner = exportedIds.get(symbol.id)
      if (owner === undefined) {
        continue
      }
      for (let handle of symbol.declarations) {
        if (!isLocal(handle.path)) {
          continue
        }
        let declaration = handle.resolve(project)
        let statement = topLevelStatement(declaration)
        if (isExportDeclaration(statement)) {
          continue
        }
        let key = `${handle.path}:${statement.pos}`
        if (!statements.has(key)) {
          statements.set(key, statement)
        }
        ownersByStatement.set(key, owner)
        let documented =
          (
            (declaration.kind === SyntaxKind.VariableDeclaration
              ? statement
              : declaration
            ).jsDoc ?? []
          ).length > 0
        if (!documented) {
          errors.push(
            `${lineOf(declaration)}: exported '${owner}' has no documentation comment`
          )
        }
        let renames = renamesByStatement.get(key) ?? new Map()
        renamesByStatement.set(key, renames)
        let roots = referenceRoots(statement)
        let symbols = roots.length ? checker.getSymbolAtLocation(roots) : []
        for (let [index, root] of roots.entries()) {
          let referenced = symbols[index]
          if (!referenced) {
            errors.push(
              `${lineOf(root)}: cannot resolve '${root.text}' referenced by '${owner}'`
            )
            continue
          }
          if (hasFlag(referenced, SymbolFlags.TypeParameter)) {
            continue
          }
          let target = resolveAlias(checker, referenced)
          if (checker.isUnknownSymbol(target)) {
            errors.push(
              `${lineOf(root)}: '${root.text}' referenced by '${owner}' is unresolved`
            )
            continue
          }
          if (isOwned(target)) {
            if (!exportedIds.has(target.id)) {
              errors.push(
                `${lineOf(root)}: '${target.name}' is referenced by public '${owner}' but is not exported from the entrypoint (forgotten export)`
              )
              continue
            }
            // The report spells the exported name; the rollup the binding.
            let name = canonicalName(target, root)
            let binding = bindingOf(target)
            if (name !== root.text || binding !== root.text) {
              renames.set(root.getStart(), [
                root.getStart(),
                root.end,
                name,
                binding,
              ])
            }
            continue
          }
          if (hasFlag(referenced, SymbolFlags.Alias)) {
            addImport(referenced, target, root, key)
          }
        }
      }
    }

    // Modules may use one local name for different external bindings. The
    // binding sorting first by module keeps the name unless the entrypoint
    // exports that name for another symbol or the rollup declares it (an
    // owned declaration keeps its own name even when exported as an alias);
    // every other one gets the first free `<name><n>` (n >= 2), avoiding every
    // identifier in the reported statements (declarations, type parameters,
    // references), every exported name and every other import, and its
    // references are renamed.
    let reserved = new Set(exportsByName.keys())
    for (let statement of statements.values()) {
      forEachDescendant(statement, (node) => {
        if (node.kind === SyntaxKind.Identifier) {
          reserved.add(node.text)
        }
      })
    }
    let declared = new Set(
      [...exportsByName.values()].filter(isOwned).map(bindingOf)
    )
    let importsByLocal = new Map()
    for (let external of imports.values()) {
      reserved.add(external.local)
      importsByLocal.set(external.local, [
        ...(importsByLocal.get(external.local) ?? []),
        external,
      ])
    }
    let order = (external) => `${external.module}\0${external.binding}`
    for (let [local, externals] of importsByLocal) {
      externals.sort((a, b) => (order(a) < order(b) ? -1 : 1))
      let exported = exportsByName.get(local)
      let keep =
        !declared.has(local) &&
        (!exported || exported.id === externals[0].target.id)
      for (let external of externals.slice(keep ? 1 : 0)) {
        let n = 2
        while (reserved.has(`${local}${n}`)) {
          n += 1
        }
        external.local = `${local}${n}`
        reserved.add(external.local)
        for (let [key, root] of external.refs) {
          renamesByStatement
            .get(key)
            .set(root.getStart(), [root.getStart(), root.end, external.local])
        }
      }
    }

    for (let statement of [entry.statements[0], ...statements.values()]) {
      if (!statement) {
        continue
      }
      for (let doc of collectJSDoc(statement)) {
        forEachDescendant(doc, (node) => {
          if (!LINK_KINDS.has(node.kind)) {
            return
          }
          let parts = node.name ? linkNameParts(node.name) : undefined
          if (!parts) {
            if (node.name || !/^\s*\w+:\/\//.test(node.text ?? '')) {
              errors.push(
                `${lineOf(node)}: unresolvable link ${node.getText()}`
              )
            }
            return
          }
          let current = exportsByName.get(parts[0])
          for (let part of parts.slice(1)) {
            current =
              current?.getMembers().get(part) ??
              current?.getExports().get(part) ??
              (current &&
                checker.getPropertyOfType(
                  checker.getDeclaredTypeOfSymbol(current),
                  part
                ))
          }
          if (!current) {
            errors.push(
              `${lineOf(node)}: ${node.getText()} does not resolve to an exported API item`
            )
          }
        })
      }
    }

    // `export * from '<package>'` in the entrypoint stays one report line;
    // its symbols are not listed again individually.
    let starModules = new Set(
      entry.statements
        .filter(
          (statement) =>
            isExportDeclaration(statement) &&
            !statement.exportClause &&
            statement.moduleSpecifier &&
            !statement.moduleSpecifier.text.startsWith('.')
        )
        .map((statement) => statement.moduleSpecifier.text)
    )
    let entries = [...starModules].map((module) => ({
      name: '',
      text: `export * from '${module}';`,
    }))
    let starNames = new Set()
    for (let statement of entry.statements) {
      if (
        isExportDeclaration(statement) &&
        !statement.exportClause &&
        starModules.has(statement.moduleSpecifier?.text)
      ) {
        let module = checker.getSymbolAtLocation(statement.moduleSpecifier)
        if (!module) {
          errors.push(
            `cannot resolve 'export * from ${statement.moduleSpecifier.text}'`
          )
          continue
        }
        for (let symbol of checker.getExportsOfModule(module)) {
          starNames.add(symbol.name)
        }
      }
    }
    for (let [name, target] of exportsByName) {
      if (!isOwned(target)) {
        let fileName = target.declarations[0]?.path
        if (!fileName) {
          errors.push(`export '${name}' has no declaration`)
          continue
        }
        if (starNames.has(name)) {
          continue
        }
        let owner = owningPackage(fileName)
        let text
        if (hasFlag(target, SymbolFlags.ValueModule)) {
          let subpath = relative(owner.directory, fileName)
            .split(sep)
            .join('/')
            .replace(/\.d\.[cm]?ts$/, '')
          text = `export * as ${name} from '${owner.name}/${subpath}';`
        } else {
          text =
            name === target.name
              ? `export { ${name} } from '${owner.name}';`
              : `export { ${target.name} as ${name} } from '${owner.name}';`
        }
        entries.push({ name, text })
        continue
      }
      let texts = []
      let documented = []
      for (let [key, statement] of statements) {
        if (ownersByStatement.get(key) !== name) {
          continue
        }
        let renames = [...renamesByStatement.get(key).values()].sort(
          (a, b) => a[0] - b[0]
        )
        texts.push(signatureText(statement, renames))
        documented.push(
          documentedText(
            statement,
            renames,
            !exportedNames.get(target.id).includes('default')
          )
        )
      }
      if (name !== target.name) {
        texts.push(`export { ${target.name} as ${name} };`)
      }
      // `export default interface Options` exported as `Options` still
      // needs the named export.
      let binding = bindingOf(target)
      if (name !== target.name) {
        documented.push(
          `export { ${binding === name ? name : `${binding} as ${name}`} };`
        )
      }
      entries.push({ name, text: texts.join('\n'), documented })
    }
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    let importLines = [...imports.values()]
      .map(({ local, module, binding, typeOnly }) => {
        let form = `{ ${binding === local ? local : `${binding} as ${local}`} }`
        if (binding === '*') {
          form = `* as ${local}`
        } else if (binding === 'default') {
          form = local
        }
        return `import ${typeOnly ? 'type ' : ''}${form} from '${module}';`
      })
      .sort()

    let report = `${importLines.join('\n')}${importLines.length ? '\n\n' : ''}${entries
      .map((entry) => entry.text)
      .join('\n\n')}\n`
    let rollup = `${importLines.join('\n')}\n\n${entries
      .flatMap((entry) => entry.documented ?? [])
      .join('\n\n')}\n`

    return {
      errors,
      packageDocumented,
      report,
      rollup,
      fileCount: program.getSourceFileNames().length,
      relativeEntry: relative(packageDir, entryFile),
    }
  } finally {
    snapshot.dispose()
  }
}
