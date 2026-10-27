import { describe, expect, it, vi } from 'vitest'
import {
  getThemeElementProps,
  type ThemeSettingsGroup,
  ThemeSettingsGroupSchema,
  validateThemeSettingsGroups,
} from '../src'

let inputs = [{ type: 'text', name: 'title', label: 'Title' }] as const

function group(extra: Record<string, unknown> = {}): ThemeSettingsGroup {
  return {
    group: 'Header',
    inputs: [...inputs],
    ...extra,
  } as ThemeSettingsGroup
}

describe('validateThemeSettingsGroups', () => {
  it('should_report_nothing_when_groups_are_untagged_or_validly_tagged', () => {
    let settings = [
      group(),
      group({ outlineGroup: 'header', outlineId: 'header' }),
      group({ outlineGroup: 'footer', outlineId: 'footer' }),
      group({ outlineGroup: 'popup', outlineId: 'newsletter-popup' }),
    ]

    let issues = validateThemeSettingsGroups(settings)

    expect(issues).toEqual([])
  })

  it('should_report_each_violation_with_its_group_index_when_metadata_is_wrong', () => {
    let settings = [
      group({ outlineGroup: 'header' }),
      group({ outlineId: 'footer' }),
      group({ outlineGroup: 'sidebar', outlineId: 'aside' }),
      group({ outlineGroup: 'popup', outlineId: '   ' }),
    ]

    let issues = validateThemeSettingsGroups(settings)

    expect(
      issues.map(({ code, groupIndexes }) => ({ code, groupIndexes }))
    ).toEqual([
      { code: 'missing-outline-id', groupIndexes: [0] },
      { code: 'missing-outline-group', groupIndexes: [1] },
      { code: 'invalid-outline-group', groupIndexes: [2] },
      { code: 'empty-outline-id', groupIndexes: [3] },
    ])
  })

  it('should_list_every_group_sharing_an_id_when_outline_ids_are_duplicated', () => {
    let settings = [
      group({ outlineGroup: 'header', outlineId: 'bar' }),
      group({ outlineGroup: 'footer', outlineId: 'footer' }),
      group({ outlineGroup: 'popup', outlineId: 'bar' }),
    ]

    let issues = validateThemeSettingsGroups(settings)

    expect(issues).toEqual([
      expect.objectContaining({
        code: 'duplicate-outline-id',
        groupIndexes: [0, 2],
        outlineId: 'bar',
      }),
    ])
  })

  it('should_report_nothing_when_settings_are_missing', () => {
    expect(validateThemeSettingsGroups(undefined)).toEqual([])
  })
})

describe('ThemeSettingsGroupSchema', () => {
  it('should_accept_a_group_when_metadata_is_absent_or_paired', () => {
    let untagged = ThemeSettingsGroupSchema.safeParse(group())
    let tagged = ThemeSettingsGroupSchema.safeParse(
      group({ outlineGroup: 'footer', outlineId: 'footer' })
    )

    expect([untagged.success, tagged.success]).toEqual([true, true])
  })

  it('should_reject_a_group_when_a_field_is_unpaired_invalid_or_empty', () => {
    let results = [
      group({ outlineGroup: 'header' }),
      group({ outlineId: 'header' }),
      group({ outlineGroup: 'sidebar', outlineId: 'aside' }),
      group({ outlineGroup: 'header', outlineId: ' ' }),
    ].map((candidate) => ThemeSettingsGroupSchema.safeParse(candidate).success)

    expect(results).toEqual([false, false, false, false])
  })
})

describe('getThemeElementProps', () => {
  it('should_return_the_theme_marker_attribute_when_given_an_outline_id', () => {
    expect(getThemeElementProps('header')).toEqual({
      'data-wv-theme-id': 'header',
    })
  })

  it('should_load_without_zod_or_react_when_imported_by_server_or_client_code', async () => {
    vi.resetModules()
    for (let name of ['zod', 'zod/v4', 'react']) {
      vi.doMock(name, () => {
        throw new Error(`theme-element must not load ${name}`)
      })
    }

    // Dynamic on purpose: the module must load after the throwing mocks.
    let module = await import('../src/theme-element')

    expect(module.getThemeElementProps('footer')).toEqual({
      'data-wv-theme-id': 'footer',
    })
  })
})
