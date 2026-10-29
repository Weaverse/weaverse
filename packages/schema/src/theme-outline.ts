/**
 * Page Outline areas declared by a theme, keyed by area. Values are settings
 * group names (the `group` field), matched case-insensitively. `header` and
 * `aside` render above the page sections in that order; every other key,
 * `footer` included, renders below them in declaration order.
 *
 * @example
 * outline: {
 *   header: ['Scrolling announcements', 'Header'],
 *   footer: ['Footer'],
 *   'popups-and-newsletter': ['Newsletter Popup'],
 * }
 */
export type ThemeOutline = {
  /** Groups listed above the page sections, first. */
  header?: string[]
  /** Groups listed above the page sections, after `header`. */
  aside?: string[]
  /** Groups listed below the page sections. */
  footer?: string[]
} & Record<string, string[]>

/** Attribute that marks the DOM rendered for a theme settings group. */
export const THEME_ELEMENT_ATTRIBUTE = 'data-wv-theme-id'

/** Props that mark the DOM rendered for a theme settings group. */
export interface ThemeElementProps {
  /** Id of the group, from {@link getThemeElementId}. */
  'data-wv-theme-id': string
}

/**
 * Stable id of a theme settings group: its name in NFC form, lowercased, every
 * run of characters that are not letters, combining marks or digits (any
 * script) replaced by `-`, and `-` trimmed from both ends. `Scrolling
 * announcements` becomes `scrolling-announcements`. A name with no letter,
 * mark or digit yields `''`.
 */
export function getThemeElementId(groupName: string): string {
  return groupName
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Marks the DOM rendered for a theme settings group so Studio can highlight
 * it and select the group when it is clicked. Pure and server-safe.
 *
 * @example
 * <header {...getThemeElementProps('Header')}>
 */
export function getThemeElementProps(groupName: string): ThemeElementProps {
  return { [THEME_ELEMENT_ATTRIBUTE]: getThemeElementId(groupName) }
}
