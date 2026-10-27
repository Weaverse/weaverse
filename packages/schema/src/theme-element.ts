import type { InspectorGroup } from './validation.js'

// This module is shared by server code, the React hook and the Studio bridge,
// so it must stay free of runtime imports (no zod, no React).

/** Page Outline area a theme settings group can be listed in. */
export type ThemeOutlineGroup = 'header' | 'footer' | 'popup'

/** Every valid {@link ThemeOutlineGroup}, in Page Outline order. */
export const THEME_OUTLINE_GROUPS: readonly ThemeOutlineGroup[] = [
  'header',
  'footer',
  'popup',
]

/**
 * A theme settings group that may be listed in the Studio Page Outline.
 *
 * Both fields are optional and must be set together. A group with neither stays
 * a plain theme settings group.
 */
export interface ThemeSettingsGroup extends InspectorGroup {
  /** Page Outline area for this settings group. Requires `outlineId`. */
  outlineGroup?: ThemeOutlineGroup
  /**
   * Stable machine id shared with the rendered DOM, never a display label.
   * Requires `outlineGroup`.
   */
  outlineId?: string
}

/** DOM attribute that links a rendered element to its settings group. */
export const THEME_ELEMENT_ATTRIBUTE = 'data-wv-theme-id'

/** Studio asks the theme to show the element for an `outlineId`. */
export const THEME_ELEMENT_REVEAL_EVENT = 'weaverse:theme-element-reveal'

/** Studio asks the theme to hide the element for an `outlineId`. */
export const THEME_ELEMENT_HIDE_EVENT = 'weaverse:theme-element-hide'

/** The theme reports that the element for an `outlineId` closed itself. */
export const THEME_ELEMENT_HIDDEN_EVENT = 'weaverse:theme-element-hidden'

/** `detail` of every theme element `CustomEvent`. */
export interface ThemeElementEventDetail {
  /** The `outlineId` the event is about. */
  id: string
}

/** Props that mark the DOM rendered for a theme settings group. */
export interface ThemeElementProps {
  /** The group's `outlineId`. */
  'data-wv-theme-id': string
}

/**
 * Returns the props that mark an element as the rendered DOM of the theme
 * settings group with this `outlineId`. Safe to call in Server Components.
 *
 * @param outlineId - The settings group's `outlineId`.
 */
export function getThemeElementProps(outlineId: string): ThemeElementProps {
  return { [THEME_ELEMENT_ATTRIBUTE]: outlineId }
}

/** Kind of problem found by {@link validateThemeSettingsGroups}. */
export type ThemeSettingsGroupIssueCode =
  | 'missing-outline-id'
  | 'missing-outline-group'
  | 'invalid-outline-group'
  | 'empty-outline-id'
  | 'duplicate-outline-id'

/** One problem with the Page Outline metadata of theme settings groups. */
export interface ThemeSettingsGroupIssue {
  /** Kind of problem. */
  code: ThemeSettingsGroupIssueCode
  /** Indexes in `settings` of every group the problem applies to. */
  groupIndexes: number[]
  /** Human-readable description. */
  message: string
  /** The `outlineId` involved, when there is one. */
  outlineId?: string
}

function isOutlineGroup(value: unknown): value is ThemeOutlineGroup {
  return (THEME_OUTLINE_GROUPS as readonly unknown[]).includes(value)
}

function groupLabel(group: unknown, index: number): string {
  let title = (group as { group?: unknown } | null)?.group
  return typeof title === 'string' && title ? `"${title}"` : `#${index}`
}

/**
 * Checks the Page Outline metadata of every theme settings group.
 *
 * A group is listed in the Page Outline only when no issue names its index:
 * `outlineGroup` and `outlineId` are set together, `outlineGroup` is a valid
 * area, `outlineId` is non-empty after trimming, and no other group in
 * `settings` uses the same `outlineId`.
 *
 * @param settings - The theme schema's `settings` array.
 * @returns One issue per violation; empty when the metadata is valid.
 */
export function validateThemeSettingsGroups(
  settings: readonly unknown[] | null | undefined
): ThemeSettingsGroupIssue[] {
  let issues: ThemeSettingsGroupIssue[] = []
  let indexesById = new Map<string, number[]>()
  for (let [index, group] of (settings ?? []).entries()) {
    let { outlineGroup, outlineId } = (group ?? {}) as {
      outlineGroup?: unknown
      outlineId?: unknown
    }
    let label = groupLabel(group, index)
    let hasGroup = outlineGroup !== undefined
    let hasId = outlineId !== undefined
    if (hasGroup && !hasId) {
      issues.push({
        code: 'missing-outline-id',
        message: `Theme settings group ${label} sets outlineGroup without outlineId`,
        groupIndexes: [index],
      })
    }
    if (hasId && !hasGroup) {
      issues.push({
        code: 'missing-outline-group',
        message: `Theme settings group ${label} sets outlineId without outlineGroup`,
        groupIndexes: [index],
      })
    }
    if (hasGroup && !isOutlineGroup(outlineGroup)) {
      issues.push({
        code: 'invalid-outline-group',
        message: `Theme settings group ${label} has an invalid outlineGroup; expected ${THEME_OUTLINE_GROUPS.join(', ')}`,
        groupIndexes: [index],
      })
    }
    if (hasId && (typeof outlineId !== 'string' || !outlineId.trim())) {
      issues.push({
        code: 'empty-outline-id',
        message: `Theme settings group ${label} has an empty outlineId`,
        groupIndexes: [index],
      })
      continue
    }
    if (typeof outlineId === 'string') {
      let indexes = indexesById.get(outlineId) ?? []
      indexes.push(index)
      indexesById.set(outlineId, indexes)
    }
  }
  for (let [outlineId, groupIndexes] of indexesById) {
    if (groupIndexes.length > 1) {
      issues.push({
        code: 'duplicate-outline-id',
        message: `Theme settings groups ${groupIndexes.map((index) => groupLabel(settings?.[index], index)).join(', ')} share outlineId "${outlineId}"`,
        groupIndexes,
        outlineId,
      })
    }
  }
  return issues
}
