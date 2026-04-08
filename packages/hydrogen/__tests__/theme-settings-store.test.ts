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

  describe('updateThemeSettings sync behavior', () => {
    it('should_merge_new_settings_without_losing_existing_keys', () => {
      store.updateThemeSettings({ colorText: '#111' })

      expect(store.getSnapshot()).toEqual({
        colorText: '#111',
        colorTextInverse: '#fff',
      })
    })

    it('should_not_notify_listeners_when_store_is_destroyed', () => {
      let callCount = 0
      store.subscribe(() => callCount++)
      store.destroy()
      store.updateThemeSettings({ colorText: '#111' })

      expect(callCount).toBe(0)
    })

    it('should_produce_new_settings_reference_on_each_update', () => {
      let snapshots: object[] = []
      store.subscribe(() => {
        snapshots.push(store.getSnapshot())
      })

      store.updateThemeSettings({ colorText: '#111' })
      store.updateThemeSettings({ colorText: '#222' })

      expect(snapshots).toHaveLength(2)
      expect(snapshots[0]).not.toBe(snapshots[1])
      expect(snapshots[1]).toEqual({
        colorText: '#222',
        colorTextInverse: '#fff',
      })
    })

    it('should_handle_empty_update_by_preserving_all_settings', () => {
      store.updateThemeSettings({})

      expect(store.getSnapshot()).toEqual({
        colorText: '#000',
        colorTextInverse: '#fff',
      })
    })

    it('should_allow_adding_new_keys_via_update', () => {
      store.updateThemeSettings({ headerHeight: '80px' } as any)

      expect(store.getSnapshot()).toEqual({
        colorText: '#000',
        colorTextInverse: '#fff',
        headerHeight: '80px',
      })
    })
  })

  describe('constructor', () => {
    it('should_handle_undefined_data_gracefully', () => {
      let emptyStore = new ThemeSettingsStore(undefined as any)

      expect(emptyStore.getSnapshot()).toEqual({})
      expect(emptyStore.schema).toBeUndefined()
      expect(emptyStore.publicEnv).toBeUndefined()
      emptyStore.destroy()
    })

    it('should_store_schema_and_publicEnv', () => {
      let schema = { settings: [] } as any
      let publicEnv = { PUBLIC_STORE_DOMAIN: 'test.myshopify.com' } as any
      let fullStore = new ThemeSettingsStore({
        theme: { colorText: '#000' },
        schema,
        publicEnv,
      })

      expect(fullStore.schema).toBe(schema)
      expect(fullStore.publicEnv).toBe(publicEnv)
      fullStore.destroy()
    })

    it('should_shallow_copy_theme_so_mutations_do_not_affect_original', () => {
      let original = { colorText: '#000' }
      let s = new ThemeSettingsStore({ theme: original })

      s.updateThemeSettings({ colorText: '#111' })

      expect(original.colorText).toBe('#000')
      expect(s.getSnapshot().colorText).toBe('#111')
      s.destroy()
    })
  })
})
