import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadScript } from '../src/utils'

interface FakeScript {
  defer: boolean
  onerror: ((error?: unknown) => void) | null
  onload: ((value?: unknown) => void) | null
  remove: () => void
  src: string
}

const SCRIPT_SRC_SELECTOR_RE = /^script\[src="(.*)"\]$/

let appendedScripts: FakeScript[]

function createFakeScript(): FakeScript {
  const script: FakeScript = {
    src: '',
    defer: false,
    onload: null,
    onerror: null,
    remove: () => {
      appendedScripts = appendedScripts.filter((s) => s !== script)
    },
  }
  return script
}

beforeEach(() => {
  appendedScripts = []
  vi.stubGlobal('document', {
    querySelector: (selector: string) => {
      const src = selector.match(SCRIPT_SRC_SELECTOR_RE)?.[1]
      return appendedScripts.find((s) => s.src === src) ?? null
    },
    createElement: () => createFakeScript(),
    body: {
      appendChild: (script: FakeScript) => {
        appendedScripts.push(script)
      },
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadScript', () => {
  it('should_share_one_promise_and_resolve_only_after_script_executes', async () => {
    const src = 'https://studio.weaverse.io/static/studio/hydrogen/index.js'
    let first = loadScript(src)
    let second = loadScript(src)

    // Same in-flight promise; only one tag appended.
    expect(second).toBe(first)
    expect(appendedScripts).toHaveLength(1)

    let settled = false
    let tracked = first.then(() => {
      settled = true
    })
    await Promise.resolve()
    // The regression: callers must NOT resolve while the tag merely exists.
    expect(settled).toBe(false)

    appendedScripts[0].onload?.('load-event')
    await expect(first).resolves.toBe('load-event')
    await tracked
    expect(settled).toBe(true)
  })

  it('should_resolve_immediately_for_tags_injected_outside_loadScript', async () => {
    const src = 'https://example.com/preinjected.js'
    const external = createFakeScript()
    external.src = src
    appendedScripts.push(external)

    await expect(loadScript(src)).resolves.toBe(true)
    // No new tag was appended.
    expect(appendedScripts).toHaveLength(1)
  })

  it('should_clear_cache_and_remove_tag_on_error_to_allow_retry', async () => {
    const src = 'https://example.com/flaky.js'
    let first = loadScript(src)
    appendedScripts[0].onerror?.(new Error('network'))
    await expect(first).rejects.toBeInstanceOf(Error)
    expect(appendedScripts).toHaveLength(0)

    // Retry creates a fresh tag and a fresh promise.
    let second = loadScript(src)
    expect(second).not.toBe(first)
    expect(appendedScripts).toHaveLength(1)
    appendedScripts[0].onload?.('load-event')
    await expect(second).resolves.toBe('load-event')
  })
})
