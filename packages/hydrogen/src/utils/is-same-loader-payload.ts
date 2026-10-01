/**
 * Structural comparison used to detect whether a reused Weaverse instance
 * must adopt a fresh loader payload.
 *
 * `JSON.stringify` cannot do this job on the client:
 *
 * - Route loader data reaches `dataContext` unserialized, so deferred values
 *   are still `Promise`s. React 19 development builds hang an enumerable,
 *   self-referencing `_debugInfo` off those promises, and stringifying one
 *   throws `TypeError: Converting circular structure to JSON` during render
 *   (issue #511).
 * - In production every promise stringifies to `{}`, so a *fresh* deferred
 *   value looks unchanged and the reused instance keeps serving the previous
 *   render's promise. Tokenizing promises to a constant (`'[[promise]]'`) has
 *   the same defect — it is stable by construction, therefore blind to
 *   identity.
 *
 * Semantics, chosen deliberately:
 *
 * - **Promises/thenables are atomic**: compared by identity, never traversed.
 *   A fresh promise is a change; the same promise is not. Debug metadata is
 *   invisible to the comparison.
 * - **Opaque objects are atomic**: anything that is not a plain object, an
 *   array, or `toJSON`-serializable (`Map`, `Set`, `URL`, `RegExp`, streams,
 *   async iterators, cross-realm promises, class instances) is compared by
 *   identity. `JSON.stringify` flattens all of them to `{}`, which would
 *   silently collapse two distinct async values into "unchanged".
 * - **Cyclic graphs are compared coinductively**: a pair already being
 *   compared is assumed equal, so equal self/mutual cycles are equal while a
 *   differing leaf anywhere still reports a change. Nothing throws.
 * - **JSON-visible fields only**: `undefined`/function/symbol properties are
 *   omitted from objects and read as `null` in arrays, and NaN/±Infinity read
 *   as `null` — matching the previous `JSON.stringify` behavior for plain wire
 *   payloads. Key order is irrelevant, which removes the old "false mismatch
 *   costs a re-render" caveat.
 */

/** `JSON.stringify` drops these from objects and nulls them inside arrays. */
function isJsonOmitted(value: unknown): boolean {
  return (
    value === undefined ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  )
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

/** Duck-typed so cross-realm promises and hand-rolled thenables also match. */
function isThenable(value: Record<string, unknown>): boolean {
  return typeof value.then === 'function'
}

function isPlainObject(value: Record<string, unknown>): boolean {
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** Returns the `toJSON()` projection, or the value itself when there is none. */
function toJsonValue(value: Record<string, unknown>): unknown {
  return typeof value.toJSON === 'function'
    ? (value.toJSON as () => unknown)()
    : value
}

/** Maps NaN/±Infinity to `null`, matching how `JSON.stringify` renders them. */
function toFiniteOrNull(value: unknown): unknown {
  return typeof value === 'number' && !Number.isFinite(value) ? null : value
}

/** Compares two loader payloads for JSON-visible structural equality. */
export function isSameLoaderPayload(left: unknown, right: unknown): boolean {
  // Pairs currently being compared, flattened as [a0, b0, a1, b1, ...].
  // Re-entering a pair means a cycle closed on both sides; assuming equality
  // there is what makes equal cyclic graphs compare equal (bisimulation)
  // while a differing leaf anywhere still reports a change.
  //
  // Scoped to the active path rather than every visited pair, so memory stays
  // proportional to graph depth (single digits for loader payloads) instead of
  // node count, and the common all-equal walk allocates one array.
  //
  // Tradeoff: a graph that shares one subtree through many nested parents
  // re-walks it per path. Wire-serialized loader payloads are trees, so this
  // does not arise; memoizing equal pairs instead measured ~2x slower on a
  // realistic 400-item page, which is the case that actually runs per render.
  const activePairs: object[] = []

  function isSame(rawA: unknown, rawB: unknown): boolean {
    if (Object.is(rawA, rawB)) {
      return true
    }
    // `JSON.stringify` renders NaN/±Infinity as `null`; normalizing here keeps
    // a non-finite number equal to the `null` a previous wire payload carried.
    const a = toFiniteOrNull(rawA)
    const b = toFiniteOrNull(rawB)
    if (a === b) {
      // Also accepts 0/-0, which `JSON.stringify` renders identically.
      return true
    }
    if (!(isObjectLike(a) && isObjectLike(b))) {
      return false
    }
    if (isThenable(a) || isThenable(b)) {
      // Identity comparison above already failed: distinct async values.
      return false
    }
    for (let index = 0; index < activePairs.length; index += 2) {
      if (activePairs[index] === a && activePairs[index + 1] === b) {
        return true
      }
    }

    activePairs.push(a, b)
    try {
      return isSameOpenPair(a, b)
    } finally {
      activePairs.length -= 2
    }
  }

  function isSameOpenPair(
    a: Record<string, unknown>,
    b: Record<string, unknown>
  ): boolean {
    const aJson = toJsonValue(a)
    const bJson = toJsonValue(b)
    if (aJson !== a || bJson !== b) {
      return isSame(aJson, bJson)
    }

    if (Array.isArray(a) !== Array.isArray(b)) {
      return false
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return isSameArray(a, b)
    }
    if (!(isPlainObject(a) && isPlainObject(b))) {
      // Opaque object with no JSON projection — identity is the only honest
      // signal, and it already failed.
      return false
    }
    return isSameObject(a, b)
  }

  function isSameArray(a: unknown[], b: unknown[]): boolean {
    if (a.length !== b.length) {
      return false
    }
    for (let index = 0; index < a.length; index++) {
      const aItem = isJsonOmitted(a[index]) ? null : a[index]
      const bItem = isJsonOmitted(b[index]) ? null : b[index]
      if (!isSame(aItem, bItem)) {
        return false
      }
    }
    return true
  }

  function isSameObject(
    a: Record<string, unknown>,
    b: Record<string, unknown>
  ): boolean {
    let aKeyCount = 0
    for (const key of Object.keys(a)) {
      if (isJsonOmitted(a[key])) {
        continue
      }
      aKeyCount++
      // A JSON-visible value never compares equal to an omitted one, so a
      // missing/undefined counterpart falls out of `isSame` as a change.
      if (!isSame(a[key], b[key])) {
        return false
      }
    }
    let bKeyCount = 0
    for (const key of Object.keys(b)) {
      if (!isJsonOmitted(b[key])) {
        bKeyCount++
      }
    }
    return aKeyCount === bKeyCount
  }

  return isSame(left, right)
}
