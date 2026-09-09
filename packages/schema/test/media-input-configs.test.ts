import { describe, expect, it } from 'vitest'
import { BasicInputSchema } from '../src'

// `image` and `video` share one branch in BasicInputSchema, so exercising the
// branch through `image` covers both.
describe('MediaInputConfigs', () => {
  it('should accept both exclusion fields on a media input', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      label: 'Hero image',
      configs: {
        excludeFilenamePrefixes: ['thumb_v', 'generated-'],
        excludeProductFiles: true,
      },
    })

    expect(result.success).toBe(true)
  })

  it('should accept an empty prefix list as an explicit show-everything override', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      configs: { excludeFilenamePrefixes: [] },
    })

    expect(result.success).toBe(true)
  })

  it('should reject a bare string where a prefix list is expected', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      configs: { excludeFilenamePrefixes: 'thumb_v' },
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual([
      'configs',
      'excludeFilenamePrefixes',
    ])
  })

  it('should reject a non-boolean product-file exclusion', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      configs: { excludeProductFiles: 'yes' },
    })

    expect(result.success).toBe(false)
  })

  it('should still accept an image input with no configs', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      label: 'Hero image',
    })

    expect(result.success).toBe(true)
  })
})
