/**
 * `@weaverse/experiments` — framework-agnostic experimentation engine.
 *
 * Variant assignment is **deterministic**: a stable visitor seed is hashed
 * together with the experiment id, so the same visitor always lands in the
 * same variant without storing the assignment anywhere. Adding more
 * experiments costs no extra storage — only a stable seed (see `/server`).
 *
 * This module has zero dependencies and zero runtime globals; it runs in any
 * JavaScript environment (Node, browsers, Cloudflare Workers, Deno, Bun).
 */

export interface ExperimentVariant {
  /** Stable identifier for the variant, e.g. `'control'` or `'b'`. */
  id: string
  /**
   * Weaverse project to load for this variant. Lets a single experiment drive
   * project-level A/B testing (the variant maps straight to a `projectId`).
   */
  projectId?: string
  /**
   * Relative traffic weight. Omitted variants default to `1` (equal split).
   * Non-positive weights are clamped to `0` (variant never assigned).
   */
  weight?: number
}

export interface Experiment {
  /** Stable identifier, also mixed into the hash so experiments are independent. */
  id: string
  /**
   * Optional salt. Change it to re-randomize assignments for a fresh run of
   * the same experiment id without changing visitor seeds.
   */
  seed?: string
  /** At least one variant. Throws on assignment when empty. */
  variants: ExperimentVariant[]
}

export interface Assignment {
  experimentId: string
  variant: ExperimentVariant
}

// FNV-1a 32-bit: tiny, fast, well-distributed, dependency-free.
const FNV_OFFSET_BASIS = 0x81_1c_9d_c5
const FNV_PRIME = 0x01_00_01_93
// 2^32 — dividing by it keeps the result strictly within [0, 1).
const UINT32_RANGE = 0x1_00_00_00_00

/**
 * Hashes a key to a uniformly-distributed bucket in the half-open unit
 * interval `[0, 1)`. Pure and deterministic: same key → same bucket.
 */
export function hashToBucket(key: string): number {
  let hash = FNV_OFFSET_BASIS
  for (let i = 0; i < key.length; i += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: FNV-1a hashing is defined in terms of XOR
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }
  // biome-ignore lint/suspicious/noBitwiseOperators: coerce signed Math.imul result to a uint32 before normalising
  return (hash >>> 0) / UINT32_RANGE
}

/**
 * Deterministically assigns a `seed` (typically a stable visitor id) to one of
 * the experiment's variants, weighted by `weight`. The experiment id and
 * optional `seed` salt are folded into the hash key so experiments are
 * mutually independent and re-runnable.
 *
 * @throws if the experiment has no variants.
 */
export function assignVariant(
  experiment: Experiment,
  seed: string
): Assignment {
  let { id, variants, seed: salt } = experiment
  if (!variants || variants.length === 0) {
    throw new Error(`Weaverse experiment "${id}" has no variants to assign.`)
  }

  // Omitted weight defaults to 1; provided non-positive weights clamp to 0.
  let total = 0
  for (let variant of variants) {
    total += Math.max(0, variant.weight ?? 1)
  }

  // All-zero weights: nothing to weight by — fall back to the first variant.
  let chosen = total > 0 ? variants[variants.length - 1] : variants[0]

  if (total > 0) {
    let threshold = hashToBucket(`${id}:${salt ?? ''}:${seed}`) * total
    let cumulative = 0
    for (let variant of variants) {
      cumulative += Math.max(0, variant.weight ?? 1)
      if (threshold < cumulative) {
        chosen = variant
        break
      }
    }
  }

  return { experimentId: id, variant: chosen }
}

/**
 * Resolves a batch of experiments for a single seed, returning one assignment
 * per experiment in input order.
 */
export function resolveExperiments(
  experiments: Experiment[],
  seed: string
): Assignment[] {
  return experiments.map((experiment) => assignVariant(experiment, seed))
}

/**
 * Builds a stable seed string from parts, dropping nullish and empty values.
 * Use it to compose a visitor identity from whatever signals are available
 * (first-party id, Shopify visitor token, etc.).
 */
export function stableSeed(...parts: Array<string | null | undefined>): string {
  let kept: string[] = []
  for (let part of parts) {
    if (part !== null && part !== undefined && part !== '') {
      kept.push(part)
    }
  }
  return kept.join(':')
}
