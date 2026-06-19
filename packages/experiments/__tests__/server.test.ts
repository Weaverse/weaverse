import { describe, expect, it } from 'vitest'
import type { Experiment } from '../src/index'
import { assignVariant } from '../src/index'
import { getExperiments } from '../src/server'

let THEME_TEST: Experiment = {
  id: 'theme-test',
  variants: [
    { id: 'control', projectId: 'proj-control' },
    { id: 'b', projectId: 'proj-b' },
  ],
}

function requestWithCookie(cookie?: string): Request {
  return new Request('https://shop.example/', {
    headers: cookie ? { cookie } : {},
  })
}

describe('getExperiments', () => {
  it('should_mint_a_seed_cookie_when_request_has_none', () => {
    let result = getExperiments(requestWithCookie(), {
      experiments: [THEME_TEST],
    })

    expect(result.setCookie).toBeDefined()
    expect(result.setCookie).toContain('_wv_vid=')
    expect(result.headers.get('Set-Cookie')).toBe(result.setCookie)
  })

  it('should_mark_the_seed_cookie_http_only_and_persistent', () => {
    let result = getExperiments(requestWithCookie(), {
      experiments: [THEME_TEST],
    })

    expect(result.setCookie).toContain('HttpOnly')
    expect(result.setCookie).toContain('Max-Age=')
    expect(result.setCookie).toContain('SameSite=Lax')
  })

  it('should_reuse_existing_seed_cookie_without_minting_a_new_one', () => {
    let result = getExperiments(requestWithCookie('_wv_vid=visitor-123'), {
      experiments: [THEME_TEST],
    })

    expect(result.setCookie).toBeUndefined()
    expect(result.seed).toBe('visitor-123')
    expect(result.headers.get('Set-Cookie')).toBeNull()
  })

  it('should_match_engine_assignment_for_the_resolved_seed', () => {
    let result = getExperiments(requestWithCookie('_wv_vid=visitor-123'), {
      experiments: [THEME_TEST],
    })

    let expected = assignVariant(THEME_TEST, 'visitor-123')
    expect(result.assignments[0].variant.id).toBe(expected.variant.id)
  })

  it('should_keep_the_same_visitor_in_the_same_variant_across_requests', () => {
    let cookie = '_wv_vid=sticky-user'

    let first = getExperiments(requestWithCookie(cookie), {
      experiments: [THEME_TEST],
    })
    let second = getExperiments(requestWithCookie(cookie), {
      experiments: [THEME_TEST],
    })

    expect(second.assignments[0].variant.id).toBe(
      first.assignments[0].variant.id
    )
  })

  it('should_use_a_supplied_seed_without_touching_cookies', () => {
    let result = getExperiments(requestWithCookie('_wv_vid=ignored'), {
      experiments: [THEME_TEST],
      seed: 'customer-42',
    })

    expect(result.seed).toBe('customer-42')
    expect(result.setCookie).toBeUndefined()
    expect(result.assignments[0].variant.id).toBe(
      assignVariant(THEME_TEST, 'customer-42').variant.id
    )
  })

  it('should_map_chosen_variant_to_its_projectId', () => {
    let result = getExperiments(requestWithCookie('_wv_vid=sticky-user'), {
      experiments: [THEME_TEST],
    })

    let chosen = result.assignments[0].variant
    expect(result.projectId).toBe(chosen.projectId)
  })

  it('should_take_projectId_from_the_designated_experiment', () => {
    let layout: Experiment = {
      id: 'layout-test',
      variants: [{ id: 'a' }, { id: 'b' }],
    }

    let result = getExperiments(requestWithCookie('_wv_vid=sticky-user'), {
      experiments: [layout, THEME_TEST],
      projectIdFrom: 'theme-test',
    })

    let themeAssignment = result.assignments.find(
      (a) => a.experimentId === 'theme-test'
    )
    expect(result.projectId).toBe(themeAssignment?.variant.projectId)
    expect(result.projectId).toMatch(/^proj-(control|b)$/)
  })

  it('should_honor_a_custom_cookie_name', () => {
    let result = getExperiments(requestWithCookie(), {
      experiments: [THEME_TEST],
      cookieName: '_exp_id',
    })

    expect(result.setCookie).toContain('_exp_id=')
  })

  it('should_mint_a_fresh_seed_when_cookie_has_malformed_encoding', () => {
    // A client-controlled cookie with invalid percent-encoding must not crash
    // the request: decodeURIComponent('%') throws, so it's treated as absent.
    let run = () =>
      getExperiments(requestWithCookie('_wv_vid=%'), {
        experiments: [THEME_TEST],
      })

    expect(run).not.toThrow()
    let result = run()
    expect(result.setCookie).toContain('_wv_vid=')
  })
})

describe('getExperiments — Weaverse Studio preview', () => {
  function studioRequest(previewProjectId: string, cookie?: string): Request {
    let url = `https://shop.example/?weaverseProjectId=${previewProjectId}&isDesignMode=true`
    return new Request(url, { headers: cookie ? { cookie } : {} })
  }

  it('should_pin_the_previewed_project_over_the_hashed_assignment', () => {
    // Same sticky visitor, both preview directions: the seed can only hash to
    // one variant, so at least one of these is a real override — both returning
    // the pinned variant proves Studio wins over the hash.
    let toB = getExperiments(studioRequest('proj-b', '_wv_vid=sticky-user'), {
      experiments: [THEME_TEST],
    })
    let toControl = getExperiments(
      studioRequest('proj-control', '_wv_vid=sticky-user'),
      { experiments: [THEME_TEST] }
    )

    expect(toB.projectId).toBe('proj-b')
    expect(toB.assignments[0].variant.id).toBe('b')
    expect(toControl.projectId).toBe('proj-control')
    expect(toControl.assignments[0].variant.id).toBe('control')
  })

  it('should_not_persist_a_seed_cookie_during_a_preview', () => {
    let result = getExperiments(studioRequest('proj-b'), {
      experiments: [THEME_TEST],
    })

    expect(result.setCookie).toBeUndefined()
    expect(result.headers.get('Set-Cookie')).toBeNull()
  })

  it('should_only_force_the_experiment_that_owns_the_previewed_project', () => {
    let layout: Experiment = {
      id: 'layout-test',
      variants: [{ id: 'a' }, { id: 'b' }],
    }
    let preview = getExperiments(
      studioRequest('proj-b', '_wv_vid=sticky-user'),
      {
        experiments: [layout, THEME_TEST],
      }
    )
    let live = getExperiments(requestWithCookie('_wv_vid=sticky-user'), {
      experiments: [layout, THEME_TEST],
    })

    let themePreview = preview.assignments.find(
      (a) => a.experimentId === 'theme-test'
    )
    expect(themePreview?.variant.id).toBe('b')
    // The unrelated experiment keeps its normal hashed assignment.
    let layoutPreview = preview.assignments.find(
      (a) => a.experimentId === 'layout-test'
    )
    let layoutLive = live.assignments.find(
      (a) => a.experimentId === 'layout-test'
    )
    expect(layoutPreview?.variant.id).toBe(layoutLive?.variant.id)
  })

  it('should_defer_to_studio_for_a_project_outside_any_experiment', () => {
    // Previewing the default project (no matching variant): no variant forced,
    // but the override still steps aside so the SDK loads Studio's project.
    let result = getExperiments(
      studioRequest('proj-default', '_wv_vid=sticky-user'),
      { experiments: [THEME_TEST] }
    )

    expect(result.projectId).toBe('proj-default')
  })

  it('should_keep_the_last_weaverseProjectId_when_the_key_is_duplicated', () => {
    // getRequestQueries keeps the LAST value of a duplicated key; match it so
    // the pin agrees with the SDK's projectId resolver.
    let url =
      'https://shop.example/?weaverseProjectId=proj-control&weaverseProjectId=proj-b'
    let result = getExperiments(new Request(url), { experiments: [THEME_TEST] })

    expect(result.projectId).toBe('proj-b')
    expect(result.assignments[0].variant.id).toBe('b')
  })
})
