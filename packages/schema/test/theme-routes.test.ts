import { describe, expect, expectTypeOf, it } from 'vitest'
import { resolveThemeRoute, type ThemeRoutes } from '../src'

describe('resolveThemeRoute', () => {
  it('should_substitute_every_param_when_all_values_are_supplied', () => {
    // Arrange
    let pattern = '/blogs/:blog/:article'

    // Act
    let resolved = resolveThemeRoute(pattern, {
      blog: 'news',
      article: 'hello-world',
    })

    // Assert
    expect(resolved).toBe('/blogs/news/hello-world')
  })

  it('should_drop_the_blog_segment_when_the_theme_declares_a_single_segment_route', () => {
    // Arrange — Forward addresses an article as /journal/:handle.
    let pattern = '/journal/:handle'

    // Act
    let resolved = resolveThemeRoute(pattern, {
      handle: 'hello-world',
      blog: 'news',
    })

    // Assert
    expect(resolved).toBe('/journal/hello-world')
  })

  it('should_return_null_when_a_param_has_no_value', () => {
    // Arrange
    let pattern = '/blogs/:blog/:article'

    // Act
    let resolved = resolveThemeRoute(pattern, { article: 'hello-world' })

    // Assert
    expect(resolved).toBeNull()
  })

  it('should_return_null_when_the_pattern_is_not_an_absolute_path', () => {
    // Arrange
    let pattern = 'shop/:handle'

    // Act
    let resolved = resolveThemeRoute(pattern, { handle: 'hats' })

    // Assert
    expect(resolved).toBeNull()
  })

  it('should_encode_a_value_that_is_not_url_safe', () => {
    // Arrange
    let pattern = '/shop/:handle'

    // Act
    let resolved = resolveThemeRoute(pattern, { handle: 'summer/sale' })

    // Assert
    expect(resolved).toBe('/shop/summer%2Fsale')
  })

  it('should_keep_a_static_pattern_unchanged_when_it_declares_no_params', () => {
    // Arrange
    let pattern = '/shop'

    // Act
    let resolved = resolveThemeRoute(pattern, {})

    // Assert
    expect(resolved).toBe('/shop')
  })

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
