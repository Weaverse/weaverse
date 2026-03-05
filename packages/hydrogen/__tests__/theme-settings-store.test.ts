import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test'
import { ThemeSettingsStore } from '../src/utils/use-theme-settings-store'

describe('ThemeSettingsStore', () => {
  let store: ThemeSettingsStore
  let consoleWarnSpy: ReturnType<typeof spyOn>
  let consoleErrorSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    store = new ThemeSettingsStore({
      theme: { colorText: '#000', colorTextInverse: '#fff' },
    })
    consoleWarnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    store.destroy()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('subscribe', () => {
    it('should_add_listener_and_return_unsubscribe_function', () => {
      // Arrange
      let callCount = 0
      let listener = () => {
        callCount++
      }

      // Act
      let unsubscribe = store.subscribe(listener)
      store.updateThemeSettings({ colorText: '#111' })

      // Assert
      expect(callCount).toBe(1)

      // Act - unsubscribe and update again
      unsubscribe()
      store.updateThemeSettings({ colorText: '#222' })

      // Assert - listener should not be called after unsubscribe
      expect(callCount).toBe(1)
    })

    it('should_notify_all_200_listeners_on_update', () => {
      // Arrange
      let callCounts: number[] = []

      for (let i = 0; i < 200; i++) {
        callCounts.push(0)
        store.subscribe(() => {
          callCounts[i]++
        })
      }

      // Act
      store.updateThemeSettings({ colorText: '#333' })

      // Assert - all 200 listeners should be notified
      for (let i = 0; i < 200; i++) {
        expect(callCounts[i]).toBe(1)
      }
    })

    it('should_return_noop_and_warn_when_subscribing_to_destroyed_store', () => {
      // Arrange
      store.destroy()

      // Act
      let listener = () => {}
      let unsubscribe = store.subscribe(listener)

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy.mock.calls[0][0]).toContain(
        'Cannot subscribe to destroyed store'
      )

      // Unsubscribe should be a no-op function
      expect(typeof unsubscribe).toBe('function')
      unsubscribe() // Should not throw
    })
  })

  describe('listener warning threshold', () => {
    it('should_warn_once_at_501_listeners_and_not_warn_again', () => {
      // Arrange - add 500 listeners without warning
      for (let i = 0; i < 500; i++) {
        store.subscribe(() => {})
      }

      // Act - add 501st listener (should warn)
      store.subscribe(() => {})

      // Assert - warning triggered once
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy.mock.calls[0][0]).toContain(
        '501 listeners detected'
      )

      // Act - add more listeners (should NOT warn again)
      store.subscribe(() => {})
      store.subscribe(() => {})

      // Assert - still only one warning
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('emit', () => {
    it('should_notify_all_listeners_in_order', () => {
      // Arrange
      let order: string[] = []
      store.subscribe(() => order.push('first'))
      store.subscribe(() => order.push('second'))
      store.subscribe(() => order.push('third'))

      // Act
      store.updateThemeSettings({ colorText: '#444' })

      // Assert
      expect(order).toEqual(['first', 'second', 'third'])
    })

    it('should_handle_listener_errors_and_continue_notifying_others', () => {
      // Arrange
      let callOrder: string[] = []
      let errorListener = () => {
        callOrder.push('error')
        throw new Error('Listener error')
      }
      let successListener = () => {
        callOrder.push('success')
      }

      store.subscribe(errorListener)
      store.subscribe(successListener)

      // Act
      store.updateThemeSettings({ colorText: '#555' })

      // Assert - both listeners should be called despite error
      expect(callOrder).toEqual(['error', 'success'])
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Listener error')
    })
  })

  describe('getSnapshot', () => {
    it('should_return_current_settings', () => {
      // Arrange
      let initial = store.getSnapshot()

      // Assert - initial settings
      expect(initial).toEqual({
        colorText: '#000',
        colorTextInverse: '#fff',
      })

      // Act
      store.updateThemeSettings({ colorText: '#666' })
      let updated = store.getSnapshot()

      // Assert - updated settings (merged)
      expect(updated).toEqual({
        colorText: '#666',
        colorTextInverse: '#fff',
      })
    })
  })

  describe('destroy', () => {
    it('should_clear_listeners_and_prevent_further_updates', () => {
      // Arrange
      let callCount = 0
      store.subscribe(() => callCount++)

      // Act
      store.destroy()
      store.updateThemeSettings({ colorText: '#777' })

      // Assert - listener not called after destroy
      expect(callCount).toBe(0)
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy.mock.calls[0][0]).toContain(
        'Cannot update destroyed store'
      )
    })

    it('should_be_idempotent_calling_destroy_twice_does_not_throw', () => {
      // Arrange
      store.destroy()

      // Act & Assert - second destroy should not throw
      expect(() => store.destroy()).not.toThrow()
      expect(() => store.destroy()).not.toThrow()
    })
  })
})
