import { readFileSync } from 'node:fs'
import { isModifier } from 'tsrs/unstable/ast'
import { API } from 'tsrs/unstable/sync'

let api

/**
 * Parses a file into a tsrs syntax tree. One `tsrs --api` child process serves
 * every parse in the calling script and exits together with it.
 */
export function parseSourceFile(
  fileName,
  scriptKind,
  text = readFileSync(fileName, 'utf8')
) {
  api ??= new API({ cwd: process.cwd() })
  return api.createSourceFile(fileName, text, { scriptKind }).sourceFile
}

/** Returns a node's keyword modifiers, excluding decorators. */
export function getModifiers(node) {
  return node.modifiers?.filter(isModifier)
}
