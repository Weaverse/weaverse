import { describe, expect, it } from 'vitest'
import { InspectorGroupSchema } from '../src'

describe('InspectorGroupSchema', () => {
  it('should_accept_group_when_outline_fields_are_absent', () => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Layout',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
    })

    expect(result.success).toBe(true)
  })

  it.each([
    'header',
    'footer',
    'popup',
  ] as const)('should_accept_%s_when_outline_fields_are_paired', (outlineGroup) => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup,
      outlineId: `${outlineGroup}-main`,
    })

    expect(result.success).toBe(true)
  })

  it('should_reject_group_when_outline_id_is_missing', () => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup: 'header',
    })

    expect(result.success).toBe(false)
  })

  it('should_reject_group_when_outline_group_is_missing', () => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineId: 'header-main',
    })

    expect(result.success).toBe(false)
  })

  it('should_reject_group_when_outline_id_is_empty', () => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup: 'header',
      outlineId: '',
    })

    expect(result.success).toBe(false)
  })

  it('should_reject_group_when_outline_group_is_invalid', () => {
    let result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup: 'sidebar',
      outlineId: 'sidebar-main',
    })

    expect(result.success).toBe(false)
  })
})
