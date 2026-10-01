import { describe, expect, it } from 'vitest'
import { BasicInputSchema } from '../src'

// `image` and `video` share one branch in BasicInputSchema, so exercising the
// branch through `image` covers both.
describe('MediaInputConfigs', () => {
  it('should_accept_both_exclusion_fields_when_declared_on_a_media_input', () => {
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

  it('should_reject_configs_when_prefix_list_is_a_bare_string', () => {
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

  it('should_reject_configs_when_product_file_exclusion_is_not_boolean', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      configs: { excludeProductFiles: 'yes' },
    })

    expect(result.success).toBe(false)
  })

  it('should_accept_the_input_when_configs_are_absent', () => {
    const result = BasicInputSchema.safeParse({
      type: 'image',
      name: 'heroImage',
      label: 'Hero image',
    })

    expect(result.success).toBe(true)
  })
})
