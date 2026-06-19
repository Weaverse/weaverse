import { describe, expect, it, vi } from 'vitest'
import type { Assignment } from '../src/index'
import { createExposureTracker } from '../src/react'

function assignment(experimentId: string, variantId: string): Assignment {
  return { experimentId, variant: { id: variantId } }
}

describe('createExposureTracker', () => {
  it('should_fire_onExpose_once_per_assignment_on_first_call', () => {
    let onExpose = vi.fn()
    let tracker = createExposureTracker()

    tracker.expose([assignment('a', 'control'), assignment('b', 'x')], onExpose)

    expect(onExpose).toHaveBeenCalledTimes(2)
  })

  it('should_not_refire_for_an_already_exposed_pair', () => {
    let onExpose = vi.fn()
    let tracker = createExposureTracker()
    let assignments = [assignment('a', 'control')]

    tracker.expose(assignments, onExpose)
    tracker.expose(assignments, onExpose)

    expect(onExpose).toHaveBeenCalledTimes(1)
  })

  it('should_refire_when_the_variant_changes_for_the_same_experiment', () => {
    let onExpose = vi.fn()
    let tracker = createExposureTracker()

    tracker.expose([assignment('a', 'control')], onExpose)
    tracker.expose([assignment('a', 'b')], onExpose)

    expect(onExpose).toHaveBeenCalledTimes(2)
    expect(onExpose).toHaveBeenLastCalledWith(assignment('a', 'b'))
  })

  it('should_isolate_dedupe_state_between_separate_trackers', () => {
    let onExpose = vi.fn()
    let first = createExposureTracker()
    let second = createExposureTracker()
    let assignments = [assignment('a', 'control')]

    first.expose(assignments, onExpose)
    second.expose(assignments, onExpose)

    expect(onExpose).toHaveBeenCalledTimes(2)
  })

  it('should_re_expose_when_the_sink_throws_instead_of_marking_seen', () => {
    let tracker = createExposureTracker()
    let calls = 0
    let flaky = () => {
      calls += 1
      if (calls === 1) {
        throw new Error('sink down')
      }
    }
    let assignments = [assignment('a', 'control')]

    // First emit throws before the pair is marked seen…
    expect(() => tracker.expose(assignments, flaky)).toThrow('sink down')
    // …so a later call re-exposes it instead of dropping the event.
    tracker.expose(assignments, flaky)

    expect(calls).toBe(2)
  })
})
