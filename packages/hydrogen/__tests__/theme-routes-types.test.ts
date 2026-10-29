import { describe, expectTypeOf, it } from 'vitest'
import type { ThemeRoutes, WeaverseThemeSchema } from '../src'

describe('WeaverseThemeSchema routes', () => {
  it('should_type_routes_as_theme_routes', () => {
    // Arrange
    let schema: WeaverseThemeSchema = {
      info: {
        name: 'Routes test',
        version: '1.0.0',
        author: 'Weaverse',
        authorProfilePhoto: '',
        documentationUrl: '',
        supportUrl: '',
      },
      routes: { COLLECTION: '/shop/:handle', ARTICLE: '/journal/:handle' },
    }

    // Assert
    expectTypeOf(schema.routes).toEqualTypeOf<ThemeRoutes | undefined>()
    // @ts-expect-error CUSTOM pages carry their own full path.
    schema.routes = { CUSTOM: '/anything/:handle' }
  })
})
