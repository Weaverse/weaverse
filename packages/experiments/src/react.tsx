/**
 * `@weaverse/experiments/react` — optional React bindings.
 *
 * `react` is an optional peer dependency: importing this entry is the only
 * thing that pulls React in. The agnostic engine (`@weaverse/experiments`) and
 * the request adapter (`@weaverse/experiments/server`) stay React-free.
 */

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef } from 'react'
import type { Assignment } from './index'

export interface ExposureTracker {
  /**
   * Invokes `onExpose` once per `(experimentId, variant.id)` pair across the
   * tracker's lifetime; pairs seen on a previous call are skipped.
   */
  expose(
    assignments: Assignment[],
    onExpose: (assignment: Assignment) => void
  ): void
}

/**
 * Creates a stateful exposure tracker. Kept synchronous and framework-free so
 * the fire-once logic is unit-testable without a DOM; the React component below
 * just drives it from an effect. Re-exposes when a variant changes for the same
 * experiment (the variant id is part of the dedupe key).
 */
export function createExposureTracker(): ExposureTracker {
  let seen = new Set<string>()
  return {
    expose(assignments, onExpose) {
      for (let assignment of assignments) {
        let key = `${assignment.experimentId}:${assignment.variant.id}`
        if (!seen.has(key)) {
          seen.add(key)
          onExpose(assignment)
        }
      }
    },
  }
}

interface ExperimentsContextValue {
  assignments: Assignment[]
}

let ExperimentsContext = createContext<ExperimentsContextValue>({
  assignments: [],
})

export interface WeaverseExperimentsProps {
  children?: ReactNode
  /**
   * Fired once per `(experiment, variant)` when first exposed on the client.
   * Forward it to any analytics sink (GA4, Segment, etc.) — no vendor is bundled.
   */
  onExpose?: (assignment: Assignment) => void
  /** Assignments resolved server-side (e.g. from `getExperiments`). */
  value: Assignment[]
}

/**
 * Provides resolved assignments to descendants and fires exposure events once
 * each. Place near the root, passing the server-resolved `assignments`.
 */
export function WeaverseExperiments({
  value,
  onExpose,
  children,
}: WeaverseExperimentsProps) {
  let tracker = useRef<ExposureTracker | null>(null)
  tracker.current ??= createExposureTracker()

  useEffect(() => {
    if (onExpose) {
      tracker.current?.expose(value, onExpose)
    }
  }, [value, onExpose])

  return (
    <ExperimentsContext.Provider value={{ assignments: value }}>
      {children}
    </ExperimentsContext.Provider>
  )
}

/** Returns the assignment for `experimentId`, or `undefined` if not running. */
export function useExperiment(experimentId: string): Assignment | undefined {
  let { assignments } = useContext(ExperimentsContext)
  return assignments.find(
    (assignment) => assignment.experimentId === experimentId
  )
}

/** Returns all resolved assignments from the nearest provider. */
export function useExperiments(): Assignment[] {
  return useContext(ExperimentsContext).assignments
}
