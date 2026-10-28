import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  getThemeElementId,
  getThemeElementProps,
  type ThemeOutline,
} from '../src'

describe('theme element ids', () => {
  it.each([
    ['Scrolling announcements', 'scrolling-announcements'],
    ['Header', 'header'],
    ['  Newsletter Popup  ', 'newsletter-popup'],
    ['Links & buttons', 'links-buttons'],
    ['--Cart / Drawer!--', 'cart-drawer'],
    ['Product cards 2', 'product-cards-2'],
    ['Đầu trang', 'đầu-trang'],
    ['ヘッダー', 'ヘッダー'],
    ['---', ''],
  ])('should_slug_%j_to_%j_when_deriving_the_group_id', (name, id) => {
    expect(getThemeElementId(name)).toBe(id)
  })

  it('should_mark_the_element_with_the_group_id_when_building_marker_props', () => {
    expect(getThemeElementProps('Scrolling announcements')).toEqual({
      'data-wv-theme-id': 'scrolling-announcements',
    })
  })

  it('should_accept_known_and_custom_area_keys_when_typing_an_outline', () => {
    let outline = {
      header: ['Header'],
      footer: ['Footer'],
      'popups-and-newsletter': ['Newsletter Popup'],
    } satisfies ThemeOutline

    expectTypeOf(outline).toMatchTypeOf<ThemeOutline>()
  })
})
