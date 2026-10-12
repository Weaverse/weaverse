import { describe, expectTypeOf, it } from 'vitest'
import type { ThemeRoutes, WeaverseNextThemeSchema } from '../src'

describe('WeaverseNextThemeSchema routes', () => {
  it('should_type_routes_as_theme_routes', () => {
    // Arrange
    let schema: WeaverseNextThemeSchema = {
      routes: { COLLECTION: '/shop/:handle', ARTICLE: '/journal/:handle' },
    }

    // Assert
    expectTypeOf(schema.routes).toEqualTypeOf<ThemeRoutes | undefined>()
    // @ts-expect-error CUSTOM pages carry their own full path.
    schema.routes = { CUSTOM: '/anything/:handle' }
  })
})
