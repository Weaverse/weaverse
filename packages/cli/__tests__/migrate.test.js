import { describe, expect, it } from 'vitest'
import { migrateV6Source } from '../src/commands/migrate.js'

describe('migrateV6Source', () => {
  it('should_move_imports_to_the_framework_entries_when_a_file_imports_weaverse', () => {
    let source = [
      "import { createSchema } from '@weaverse/hydrogen'",
      'import { createWeaverseNextClient } from "@weaverse/next"',
      "import { createWeaverseNextServerClient } from '@weaverse/next/server'",
    ].join('\n')

    let result = migrateV6Source(source)

    expect(result).toBe(
      [
        "import { createSchema } from '@weaverse/hydrogen/react-router'",
        'import { createWeaverseNextClient } from "@weaverse/hydrogen/next"',
        "import { createWeaverseNextServerClient } from '@weaverse/hydrogen/next/server'",
      ].join('\n')
    )
  })

  it('should_rename_public_types_without_touching_longer_names', () => {
    let source = [
      "import type { HydrogenComponentProps, ComponentLoaderArgs } from '@weaverse/hydrogen'",
      'type A = HydrogenComponentProps & WeaverseNextThemeSettingsResponse',
    ].join('\n')

    let result = migrateV6Source(source)

    expect(result).toBe(
      [
        "import type { WeaverseComponentProps, WeaverseComponentLoaderArgs } from '@weaverse/hydrogen/react-router'",
        'type A = WeaverseComponentProps & WeaverseNextThemeSettingsResponse',
      ].join('\n')
    )
  })

  it('should_leave_a_file_unchanged_when_it_does_not_import_weaverse', () => {
    let source = 'type ThemeSettingsResponse = { ok: boolean }'

    let result = migrateV6Source(source)

    expect(result).toBe(source)
  })

  it('should_not_move_an_import_twice_when_it_already_uses_an_entry', () => {
    let source =
      "import { WeaverseClient } from '@weaverse/hydrogen/react-router'"

    let result = migrateV6Source(source)

    expect(result).toBe(source)
  })
})
