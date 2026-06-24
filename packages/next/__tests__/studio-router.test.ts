import { describe, expect, it, vi } from 'vitest'
import {
  createWeaverseNextStudioInternals,
  type WeaverseNextRouterLike,
} from '../src/studio-router'

function createMockRouter(): WeaverseNextRouterLike & {
  push: ReturnType<typeof vi.fn>
  refresh: ReturnType<typeof vi.fn>
  replace: ReturnType<typeof vi.fn>
} {
  return {
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  } as unknown as WeaverseNextRouterLike & {
    push: ReturnType<typeof vi.fn>
    refresh: ReturnType<typeof vi.fn>
    replace: ReturnType<typeof vi.fn>
  }
}

describe('createWeaverseNextStudioInternals', () => {
  describe('navigate', () => {
    it('uses router.push by default', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router)

      navigate('/products/shoe')

      expect(router.push).toHaveBeenCalledTimes(1)
      expect(router.push).toHaveBeenCalledWith('/products/shoe', {
        scroll: true,
      })
      expect(router.replace).not.toHaveBeenCalled()
    })

    it('uses router.replace when the replace option is set', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router, {
        replace: true,
      })

      navigate('/products/shoe')

      expect(router.replace).toHaveBeenCalledTimes(1)
      expect(router.replace).toHaveBeenCalledWith('/products/shoe', {
        scroll: true,
      })
      expect(router.push).not.toHaveBeenCalled()
    })

    it('maps preventScrollReset to scroll: false', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router)

      navigate('/products/shoe', { preventScrollReset: true })

      expect(router.push).toHaveBeenCalledWith('/products/shoe', {
        scroll: false,
      })
    })

    it('keeps scroll: true when preventScrollReset is false', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router)

      navigate('/products/shoe', { preventScrollReset: false })

      expect(router.push).toHaveBeenCalledWith('/products/shoe', {
        scroll: true,
      })
    })

    it('keeps scroll: true for an options object without preventScrollReset', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router)

      navigate('/products/shoe', { other: 'value' })

      expect(router.push).toHaveBeenCalledWith('/products/shoe', {
        scroll: true,
      })
    })

    it('keeps scroll: true when no navigate options are passed', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router)

      navigate('/products/shoe', undefined)

      expect(router.push).toHaveBeenCalledWith('/products/shoe', {
        scroll: true,
      })
    })

    it('maps preventScrollReset to scroll: false when replacing', () => {
      let router = createMockRouter()
      let { navigate } = createWeaverseNextStudioInternals(router, {
        replace: true,
      })

      navigate('/products/shoe', { preventScrollReset: true })

      expect(router.replace).toHaveBeenCalledWith('/products/shoe', {
        scroll: false,
      })
    })
  })

  describe('revalidate', () => {
    it('calls router.refresh', () => {
      let router = createMockRouter()
      let { revalidate } = createWeaverseNextStudioInternals(router)

      revalidate()

      expect(router.refresh).toHaveBeenCalledTimes(1)
      expect(router.push).not.toHaveBeenCalled()
      expect(router.replace).not.toHaveBeenCalled()
    })
  })
})
