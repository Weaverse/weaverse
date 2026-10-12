import { describe, expect, it } from 'vitest'
import { BasicInputSchema } from '../src'

describe('Image default focal points', () => {
  it.each([
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0.8, y: 0.3 },
  ])('should_preserve_coordinates_when_the_image_default_is_valid: %j', (focalPoint) => {
    let defaultValue = { url: '/hero.jpg', focalPoint }

    let result = BasicInputSchema.parse({
      type: 'image',
      name: 'heroImage',
      defaultValue,
    })

    expect(result.defaultValue).toEqual(defaultValue)
  })

  it.each([
    null,
    'center',
    [0.8, 0.3],
    {},
    { x: 0.8 },
    { x: '0.8', y: 0.3 },
    { x: 0.8, y: '0.3' },
    { x: -0.1, y: 0.3 },
    { x: 1.1, y: 0.3 },
    { x: 0.8, y: -0.1 },
    { x: 0.8, y: 1.1 },
    { x: Number.NaN, y: 0.3 },
    { x: 0.8, y: Number.POSITIVE_INFINITY },
    { x: Number.NEGATIVE_INFINITY, y: 0.3 },
  ])('should_reject_invalid_focal_points_on_image_defaults: %j', (focalPoint) => {
    let input = {
      type: 'image',
      name: 'heroImage',
      defaultValue: { url: '/hero.jpg', focalPoint },
    }

    let result = BasicInputSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should_report_the_coordinate_path_when_a_coordinate_is_invalid', () => {
    let input = {
      type: 'image',
      name: 'heroImage',
      defaultValue: { focalPoint: { x: 2, y: 0.3 } },
    }

    let result = BasicInputSchema.safeParse(input)

    expect(result.error?.issues[0].path).toEqual([
      'defaultValue',
      'focalPoint',
      'x',
    ])
  })

  it.each([
    undefined,
    null,
    '/hero.jpg',
    { url: '/hero.jpg' },
  ])('should_preserve_legacy_defaults_when_no_focal_point_is_present: %j', (defaultValue) => {
    let input = { type: 'image', name: 'heroImage', defaultValue }

    let result = BasicInputSchema.parse(input)

    expect(result.defaultValue).toEqual(defaultValue)
  })

  it('should_leave_unrelated_input_defaults_unvalidated', () => {
    let defaultValue = { focalPoint: 'not image metadata' }

    let result = BasicInputSchema.parse({
      type: 'metaobject',
      name: 'content',
      defaultValue,
    })

    expect(result.defaultValue).toEqual(defaultValue)
  })
})
