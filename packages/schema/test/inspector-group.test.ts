import { describe, expect, it } from 'vitest'
import { InspectorGroupSchema } from '../src'

describe('InspectorGroupSchema', () => {
  it('accepts a group without outlineGroup (backward compatible)', () => {
    const result = InspectorGroupSchema.safeParse({
      group: 'Layout',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
    })
    expect(result.success).toBe(true)
  })

  it.each([
    'header',
    'footer',
    'popup',
  ] as const)('accepts outlineGroup: %s', (outlineGroup) => {
    const result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup,
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid outlineGroup value', () => {
    const result = InspectorGroupSchema.safeParse({
      group: 'Header',
      inputs: [{ type: 'text', name: 'title', label: 'Title' }],
      outlineGroup: 'sidebar',
    })
    expect(result.success).toBe(false)
  })
})
