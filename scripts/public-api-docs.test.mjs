import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { getUndocumentedMembers } from './public-api-docs.mjs'

const LINE_SUFFIX = / \(line \d+\)$/

function fixture(name) {
  return fileURLToPath(
    new URL(`./fixtures/public-api-docs/${name}.d.ts`, import.meta.url)
  )
}

describe('getUndocumentedMembers', () => {
  test('should_detect_members_when_exported_variable_has_direct_inline_type', () => {
    let gaps = getUndocumentedMembers(fixture('exported-variable'))

    assert.deepEqual(
      gaps.map((gap) => gap.replace(LINE_SUFFIX, '')),
      [
        'placeholders.undocumented',
        'load.undocumentedOption',
        'load.undocumentedResult',
      ]
    )
  })

  test('should_detect_members_when_exported_function_uses_inline_shapes', () => {
    let gaps = getUndocumentedMembers(fixture('exported-function'))

    assert.deepEqual(
      gaps.map((gap) => gap.replace(LINE_SUFFIX, '')),
      ['createValue.undocumentedOption', 'createValue.undocumentedResult']
    )
  })

  test('should_accept_accessor_pair_when_one_accessor_is_documented', () => {
    let gaps = getUndocumentedMembers(fixture('accessor-pair'))

    assert.deepEqual(gaps, [])
  })

  test('should_not_traverse_members_when_ancestor_is_private_or_protected', () => {
    let gaps = getUndocumentedMembers(fixture('non-public-ancestor'))

    assert.deepEqual(gaps, [])
  })

  test('should_not_traverse_external_generic_type_arguments', () => {
    let gaps = getUndocumentedMembers(fixture('external-generic'))

    assert.deepEqual(gaps, [])
  })

  test('should_accept_documented_named_types', () => {
    let gaps = getUndocumentedMembers(fixture('documented-named-types'))

    assert.deepEqual(gaps, [])
  })
})
