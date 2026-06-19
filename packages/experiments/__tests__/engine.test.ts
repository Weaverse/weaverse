import { describe, expect, it } from 'vitest'
import type { Experiment } from '../src/index'
import {
  assignVariant,
  hashToBucket,
  resolveExperiments,
  stableSeed,
} from '../src/index'

let TWO_WAY: Experiment = {
  id: 'homepage-test',
  variants: [{ id: 'control' }, { id: 'b' }],
}

// Deterministic spread of distinct seeds for distribution assertions.
function sampleSeeds(count: number): string[] {
  let seeds: string[] = []
  for (let i = 0; i < count; i++) {
    seeds.push(stableSeed('visitor', String(i)))
  }
  return seeds
}

function distribution(
  exp: Experiment,
  seeds: string[]
): Record<string, number> {
  let counts: Record<string, number> = {}
  for (let seed of seeds) {
    let id = assignVariant(exp, seed).variant.id
    counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
}

describe('hashToBucket', () => {
  it('should_return_value_in_unit_interval_when_hashing_any_string', () => {
    for (let s of sampleSeeds(500)) {
      let bucket = hashToBucket(s)

      expect(bucket).toBeGreaterThanOrEqual(0)
      expect(bucket).toBeLessThan(1)
    }
  })

  it('should_return_same_bucket_when_called_repeatedly_with_same_key', () => {
    let first = hashToBucket('user-42:homepage-test')
    let second = hashToBucket('user-42:homepage-test')

    expect(second).toBe(first)
  })
})

describe('assignVariant', () => {
  it('should_return_same_variant_when_called_repeatedly_with_same_seed', () => {
    let seed = stableSeed('visitor', 'abc-123')

    let first = assignVariant(TWO_WAY, seed)
    let second = assignVariant(TWO_WAY, seed)

    expect(second.variant.id).toBe(first.variant.id)
    expect(first.experimentId).toBe('homepage-test')
  })

  it('should_split_traffic_evenly_when_weights_are_omitted', () => {
    let counts = distribution(TWO_WAY, sampleSeeds(10_000))

    expect(counts.control / 10_000).toBeGreaterThan(0.45)
    expect(counts.control / 10_000).toBeLessThan(0.55)
  })

  it('should_respect_relative_weights_when_provided', () => {
    let weighted: Experiment = {
      id: 'weighted-test',
      variants: [
        { id: 'control', weight: 4 },
        { id: 'b', weight: 1 },
      ],
    }

    let counts = distribution(weighted, sampleSeeds(10_000))

    expect(counts.b / 10_000).toBeGreaterThan(0.15)
    expect(counts.b / 10_000).toBeLessThan(0.25)
  })

  it('should_always_return_the_only_variant_when_experiment_has_one', () => {
    let single: Experiment = { id: 'rollout', variants: [{ id: 'on' }] }

    for (let seed of sampleSeeds(200)) {
      expect(assignVariant(single, seed).variant.id).toBe('on')
    }
  })

  it('should_change_assignment_when_experiment_seed_salt_differs', () => {
    let seeds = sampleSeeds(300)
    let salted: Experiment = { ...TWO_WAY, seed: 'rerun-2' }

    let baseVector = seeds.map((s) => assignVariant(TWO_WAY, s).variant.id)
    let saltedVector = seeds.map((s) => assignVariant(salted, s).variant.id)

    expect(saltedVector).not.toEqual(baseVector)
  })

  it('should_carry_variant_projectId_through_to_the_assignment', () => {
    let projectMapped: Experiment = {
      id: 'theme-test',
      variants: [
        { id: 'control', projectId: 'proj-a' },
        { id: 'b', projectId: 'proj-b' },
      ],
    }

    let assigned = assignVariant(projectMapped, stableSeed('v', '7'))

    expect(assigned.variant.projectId).toMatch(/^proj-(a|b)$/)
  })

  it('should_throw_when_experiment_has_no_variants', () => {
    let empty: Experiment = { id: 'broken', variants: [] }

    expect(() => assignVariant(empty, 'seed')).toThrow(/variant/i)
  })

  it('should_ignore_non_positive_weights_when_splitting', () => {
    let zeroed: Experiment = {
      id: 'zero-weight',
      variants: [
        { id: 'control', weight: 0 },
        { id: 'b', weight: 1 },
      ],
    }

    let counts = distribution(zeroed, sampleSeeds(2000))

    expect(counts.control ?? 0).toBe(0)
    expect(counts.b).toBe(2000)
  })
})

describe('resolveExperiments', () => {
  it('should_return_one_independent_assignment_per_experiment', () => {
    let experiments: Experiment[] = [
      TWO_WAY,
      { id: 'cta-test', variants: [{ id: 'green' }, { id: 'red' }] },
    ]
    let seed = stableSeed('visitor', 'multi')

    let assignments = resolveExperiments(experiments, seed)

    expect(assignments.map((a) => a.experimentId)).toEqual([
      'homepage-test',
      'cta-test',
    ])
  })

  it('should_assign_experiments_independently_for_same_seed', () => {
    // Two experiments with identical variant ids must not always collapse to
    // the same choice — the experiment id participates in the hash key.
    let a: Experiment = { id: 'exp-a', variants: [{ id: 'x' }, { id: 'y' }] }
    let b: Experiment = { id: 'exp-b', variants: [{ id: 'x' }, { id: 'y' }] }

    let differ = sampleSeeds(300).some((seed) => {
      let [ra] = resolveExperiments([a], seed)
      let [rb] = resolveExperiments([b], seed)
      return ra.variant.id !== rb.variant.id
    })

    expect(differ).toBe(true)
  })
})

describe('stableSeed', () => {
  it('should_produce_same_seed_when_nullish_parts_are_dropped', () => {
    let withGaps = stableSeed('a', null, 'b', undefined)
    let without = stableSeed('a', 'b')

    expect(withGaps).toBe(without)
  })

  it('should_return_non_empty_string_for_at_least_one_part', () => {
    expect(stableSeed('visitor-1').length).toBeGreaterThan(0)
  })
})
