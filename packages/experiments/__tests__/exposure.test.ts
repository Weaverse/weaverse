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
})
