import { readFileSync } from 'node:fs'
import {
  getJSDocCommentsAndTags,
  isClassDeclaration,
  isFunctionDeclaration,
  isGetAccessorDeclaration,
  isImportDeclaration,
  isInterfaceDeclaration,
  isNamedImports,
  isNamespaceImport,
  isQualifiedName,
  isSetAccessorDeclaration,
  isStringLiteral,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
  isVariableStatement,
  ScriptKind,
  SyntaxKind,
} from 'tsrs/unstable/ast'
import { getModifiers, parseSourceFile } from './source-parser.mjs'

const MEMBER_KINDS = new Set([
  SyntaxKind.CallSignature,
  SyntaxKind.ConstructSignature,
  SyntaxKind.GetAccessor,
  SyntaxKind.IndexSignature,
  SyntaxKind.MethodDeclaration,
  SyntaxKind.MethodSignature,
  SyntaxKind.PropertyDeclaration,
  SyntaxKind.PropertySignature,
  SyntaxKind.SetAccessor,
])

function hasDocumentation(node, sourceFile) {
  if (getJSDocCommentsAndTags(node).length > 0) {
    return true
  }
  if (!(isGetAccessorDeclaration(node) || isSetAccessorDeclaration(node))) {
    return false
  }
  let memberName = node.name.getText(sourceFile)
  return Boolean(
    node.parent.members?.some(
      (member) =>
        member !== node &&
        (isGetAccessorDeclaration(member) ||
          isSetAccessorDeclaration(member)) &&
        member.name.getText(sourceFile) === memberName &&
        getJSDocCommentsAndTags(member).length > 0
    )
  )
}

function isExported(node) {
  return Boolean(
    getModifiers(node)?.some(
      (modifier) => modifier.kind === SyntaxKind.ExportKeyword
    )
  )
}

function isPublicMember(node) {
  let modifiers = getModifiers(node) ?? []
  return !modifiers.some(
    (modifier) =>
      modifier.kind === SyntaxKind.PrivateKeyword ||
      modifier.kind === SyntaxKind.ProtectedKeyword
  )
}

function getZodImportNames(sourceFile) {
  let names = new Set()
  for (let statement of sourceFile.statements) {
    if (
      !(
        isImportDeclaration(statement) &&
        isStringLiteral(statement.moduleSpecifier)
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
    if (bindings && isNamespaceImport(bindings)) {
      names.add(bindings.name.text)
    } else if (bindings && isNamedImports(bindings)) {
      for (let element of bindings.elements) {
        names.add(element.name.text)
      }
    }
  }
  return names
}

function getTypeReferenceRootName(typeName) {
  let current = typeName
  while (isQualifiedName(current)) {
    current = current.left
  }
  return current.text
}

function isZodImplementationReference(node, zodImportNames) {
  return (
    isTypeReferenceNode(node) &&
    zodImportNames.has(getTypeReferenceRootName(node.typeName))
  )
}

function createPublicTypeVisitor(sourceFile, gaps, zodImportNames) {
  function visitPublicType(node, owner) {
    if (
      isZodImplementationReference(node, zodImportNames) ||
      (node.modifiers && !isPublicMember(node))
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

    node.forEachChild((child) => visitPublicType(child, owner))
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
  if (isClassDeclaration(statement) || isInterfaceDeclaration(statement)) {
    let owner = statement.name?.getText(sourceFile) ?? '<anonymous export>'
    for (let member of statement.members) {
      visitPublicType(member, owner)
    }
    return
  }

  if (isTypeAliasDeclaration(statement)) {
    visitPublicType(statement.type, statement.name.getText(sourceFile))
    return
  }

  if (isFunctionDeclaration(statement)) {
    visitFunctionDeclaration(statement, sourceFile, visitPublicType)
    return
  }

  if (isVariableStatement(statement)) {
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
  let sourceFile = parseSourceFile(
    declarationFile,
    ScriptKind.TS,
    readFileSync(declarationFile, 'utf8')
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
