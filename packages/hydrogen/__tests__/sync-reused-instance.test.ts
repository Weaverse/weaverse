import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import type { WeaverseHydrogenParams } from '../src/types'
import { syncReusedInstance } from '../src/utils/sync-reused-instance'
import type { WeaverseHydrogen } from '../src/WeaverseHydrogenRoot'

interface InstanceStub {
  data: { id: string; rootId: string; items: { id: string }[] }
  dataContext: Record<string, unknown> | null
  internal: Record<string, unknown>
  requestInfo: { pathname: string; search: string }
  setProjectData: Mock
  triggerUpdate: Mock
}

function makeInstance(): InstanceStub {
  return {
    data: { id: 'page-1', rootId: 'root', items: [{ id: 'item-1' }] },
    dataContext: { cartCount: 0 },
    internal: { project: { id: 'old' } },
    requestInfo: { pathname: '/products/shirt', search: '' },
    setProjectData: vi.fn(),
    triggerUpdate: vi.fn(),
  }
}

function makeParams(overrides: {
  data?: InstanceStub['data']
  dataContext?: Record<string, unknown>
}): WeaverseHydrogenParams {
  // Only the synced fields matter — the rest of the params surface is
  // irrelevant here, hence the unchecked cast.
  return {
    data: overrides.data ?? {
      id: 'page-1',
      rootId: 'root',
      items: [{ id: 'item-1' }],
    },
    dataContext: overrides.dataContext ?? { cartCount: 0 },
    internal: { project: { id: 'new' } },
    requestInfo: { pathname: '/products/shirt', search: '?fresh=1' },
  } as unknown as WeaverseHydrogenParams
}

function sync(instance: InstanceStub, params: WeaverseHydrogenParams) {
  syncReusedInstance(instance as unknown as WeaverseHydrogen, params)
}

describe('syncReusedInstance', () => {
  it('should_apply_fresh_page_data_and_rerender_when_items_changed', () => {
    let instance = makeInstance()
    let params = makeParams({
      data: { id: 'page-1', rootId: 'root', items: [{ id: 'item-2' }] },
    })

    sync(instance, params)

    expect(instance.setProjectData).toHaveBeenCalledWith(params.data)
    expect(instance.triggerUpdate).toHaveBeenCalledTimes(1)
    // requestInfo/internal always follow the latest loader payload.
    expect(instance.requestInfo).toBe(params.requestInfo)
    expect(instance.internal).toBe(params.internal)
  })

  it('should_apply_fresh_data_context_without_rebuilding_page_data', () => {
    let instance = makeInstance()
    let params = makeParams({ dataContext: { cartCount: 3 } })

    sync(instance, params)

    expect(instance.setProjectData).not.toHaveBeenCalled()
    expect(instance.dataContext).toEqual({ cartCount: 3 })
    expect(instance.triggerUpdate).toHaveBeenCalledTimes(1)
  })

  it('should_not_rerender_when_payload_is_unchanged', () => {
    let instance = makeInstance()

    sync(instance, makeParams({}))

    expect(instance.setProjectData).not.toHaveBeenCalled()
    expect(instance.triggerUpdate).not.toHaveBeenCalled()
  })
})
