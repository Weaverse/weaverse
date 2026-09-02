import { describe, expect, it } from 'vitest'
import { BasicInputSchema, MediaInputConfigsSchema } from '../src'

describe('MediaInputConfigs', () => {
  describe('MediaInputConfigsSchema', () => {
    it('should accept both fields when well formed', () => {
      const result = MediaInputConfigsSchema.safeParse({
        excludeFilenamePrefixes: ['thumb_v', 'generated-'],
        excludeProductFiles: true,
      })

      expect(result.success).toBe(true)
    })

    it('should accept an empty prefix list as an explicit show-everything override', () => {
      const result = MediaInputConfigsSchema.safeParse({
        excludeFilenamePrefixes: [],
      })

      expect(result.success).toBe(true)
    })

    it('should accept an absent field so it can inherit the theme value', () => {
      const result = MediaInputConfigsSchema.safeParse({
        excludeProductFiles: true,
      })

      expect(result.success).toBe(true)
    })
  })

  describe('BasicInputSchema', () => {
    it('should validate media configs on an image input', () => {
      const result = BasicInputSchema.safeParse({
        type: 'image',
        name: 'heroImage',
        label: 'Hero image',
        configs: { excludeFilenamePrefixes: ['thumb_v'] },
      })

      expect(result.success).toBe(true)
    })

    it('should validate media configs on a video input', () => {
      const result = BasicInputSchema.safeParse({
        type: 'video',
        name: 'heroVideo',
        label: 'Hero video',
        configs: { excludeProductFiles: true },
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
})
