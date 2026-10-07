import { describe, expectTypeOf, it } from 'vitest'
import type { ThemeRoutes } from '../src'

describe('ThemeRoutes', () => {
  it('should_reject_page_types_that_cannot_carry_a_pattern', () => {
    // Arrange
    let routes: ThemeRoutes = { COLLECTION: '/shop/:handle' }

    // Assert — `*` and CUSTOM are not addressable by a single pattern.
    expectTypeOf(routes).toExtend<{ ARTICLE?: string }>()
    // @ts-expect-error CUSTOM pages carry their own full path.
    routes.CUSTOM = '/anything/:handle'
    // @ts-expect-error `*` matches every page type rather than naming one.
    routes['*'] = '/anything/:handle'
  })
})
