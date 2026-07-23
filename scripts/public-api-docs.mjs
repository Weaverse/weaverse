import { readFileSync } from 'node:fs'
import ts from 'typescript'

const MEMBER_KINDS = new Set([
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

function isExported(node) {
  return Boolean(
    ts
      .getModifiers(node)
      ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
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

function getZodImportNames(sourceFile) {
  let names = new Set()
  for (let statement of sourceFile.statements) {
    if (
      !(
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier)
      )
    ) {
      continue
    }
    let moduleName = statement.moduleSpecifier.text
    if (moduleName !== 'zod' && !moduleName.startsWith('zod/')) {
      continue
    }
    let importClause = statement.importClause
    if (importClause?.name) {
      names.add(importClause.name.text)
    }
    let bindings = importClause?.namedBindings
    if (bindings && ts.isNamespaceImport(bindings)) {
      names.add(bindings.name.text)
    } else if (bindings && ts.isNamedImports(bindings)) {
      for (let element of bindings.elements) {
        names.add(element.name.text)
      }
    }
  }
  return names
}

function getTypeReferenceRootName(typeName) {
  let current = typeName
  while (ts.isQualifiedName(current)) {
    current = current.left
  }
  return current.text
}

function isZodImplementationReference(node, zodImportNames) {
  return (
    ts.isTypeReferenceNode(node) &&
    zodImportNames.has(getTypeReferenceRootName(node.typeName))
  )
}

function createPublicTypeVisitor(sourceFile, gaps, zodImportNames) {
  function visitPublicType(node, owner) {
    if (
      isZodImplementationReference(node, zodImportNames) ||
      (ts.canHaveModifiers(node) && !isPublicMember(node))
    ) {
      return
    }

    if (MEMBER_KINDS.has(node.kind) && !hasDocumentation(node, sourceFile)) {
      let position = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile)
      )
      let memberName =
        node.name?.getText(sourceFile) ?? node.getText(sourceFile)
      gaps.push(`${owner}.${memberName} (line ${position.line + 1})`)
    }

    ts.forEachChild(node, (child) => visitPublicType(child, owner))
  }

  return visitPublicType
}

function visitFunctionDeclaration(statement, sourceFile, visitPublicType) {
  let owner = statement.name?.getText(sourceFile) ?? '<anonymous export>'
  for (let parameter of statement.parameters) {
    if (parameter.type) {
      visitPublicType(parameter.type, owner)
    }
  }
  if (statement.type) {
    visitPublicType(statement.type, owner)
  }
}

function visitVariableStatement(statement, sourceFile, visitPublicType) {
  for (let declaration of statement.declarationList.declarations) {
    if (declaration.type) {
      visitPublicType(declaration.type, declaration.name.getText(sourceFile))
    }
  }
}

function visitExportedStatement(statement, sourceFile, visitPublicType) {
  if (
    ts.isClassDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement)
  ) {
    let owner = statement.name?.getText(sourceFile) ?? '<anonymous export>'
    for (let member of statement.members) {
      visitPublicType(member, owner)
    }
    return
  }

  if (ts.isTypeAliasDeclaration(statement)) {
    visitPublicType(statement.type, statement.name.getText(sourceFile))
    return
  }

  if (ts.isFunctionDeclaration(statement)) {
    visitFunctionDeclaration(statement, sourceFile, visitPublicType)
    return
  }

  if (ts.isVariableStatement(statement)) {
    visitVariableStatement(statement, sourceFile, visitPublicType)
  }
}

/**
 * Finds undocumented members in a rolled-up public declaration file.
 *
 * Inline object shapes are checked through unions, intersections, arrays, and
 * generic wrappers. Generated Zod implementation references remain opaque so
 * validator internals are not treated as authored API properties.
 */
export function getUndocumentedMembers(declarationFile) {
  let sourceFile = ts.createSourceFile(
    declarationFile,
    readFileSync(declarationFile, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  )
  let gaps = []
  let zodImportNames = getZodImportNames(sourceFile)
  let visitPublicType = createPublicTypeVisitor(
    sourceFile,
    gaps,
    zodImportNames
  )

  for (let statement of sourceFile.statements) {
    if (isExported(statement)) {
      visitExportedStatement(statement, sourceFile, visitPublicType)
    }
  }

  return gaps
}
