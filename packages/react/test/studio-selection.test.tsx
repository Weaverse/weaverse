import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  StudioSelectionStore,
  StudioSelectionStoreContext,
  useStudioSelection,
} from '../src/studio-selection'

const EMPTY = { selectedItemId: null, selectedThemeGroup: null }

function Probe() {
  let selection = useStudioSelection()
  return <output>{JSON.stringify(selection)}</output>
}

function render(store?: StudioSelectionStore) {
  let html = renderToStaticMarkup(
    store ? (
      <StudioSelectionStoreContext.Provider value={store}>
        <Probe />
      </StudioSelectionStoreContext.Provider>
    ) : (
      <Probe />
    )
  )
  return JSON.parse(
    html.replace(/^<output>|<\/output>$/g, '').replace(/&quot;/g, '"')
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('StudioSelectionStore', () => {
  it('should_notify_once_per_change_and_keep_the_snapshot_when_unchanged', () => {
    // Arrange
    let store = new StudioSelectionStore()
    let listener = vi.fn()
    store.subscribe(listener)

    // Act
    store.setSelection({ selectedItemId: 'item-1', selectedThemeGroup: null })
    let first = store.getSnapshot()
    store.setSelection({ selectedItemId: 'item-1', selectedThemeGroup: null })

    // Assert
    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot()).toBe(first)
    expect(first).toEqual({
      selectedItemId: 'item-1',
      selectedThemeGroup: null,
    })
  })

  it('should_switch_between_item_and_theme_group_in_one_notification', () => {
    // Arrange
    let store = new StudioSelectionStore()
    store.setSelection({ selectedItemId: 'item-1', selectedThemeGroup: null })
    let seen: unknown[] = []
    store.subscribe(() => seen.push(store.getSnapshot()))

    // Act
    store.setSelection({
      selectedItemId: null,
      selectedThemeGroup: 'Newsletter Popup',
    })

    // Assert
    expect(seen).toEqual([
      { selectedItemId: null, selectedThemeGroup: 'Newsletter Popup' },
    ])
  })

  it('should_reject_a_selection_naming_both_an_item_and_a_group', () => {
    // Arrange
    vi.spyOn(console, 'error').mockImplementation(() => {})
    let store = new StudioSelectionStore()
    store.setSelection({ selectedItemId: 'item-1', selectedThemeGroup: null })
    let listener = vi.fn()
    store.subscribe(listener)

    // Act
    store.setSelection({
      selectedItemId: 'item-2',
      selectedThemeGroup: 'Header',
    })

    // Assert
    expect(listener).not.toHaveBeenCalled()
    expect(store.getSnapshot()).toEqual({
      selectedItemId: 'item-1',
      selectedThemeGroup: null,
    })
  })

  it('should_stop_notifying_after_unsubscribe', () => {
    // Arrange
    let store = new StudioSelectionStore()
    let listener = vi.fn()
    let unsubscribe = store.subscribe(listener)

    // Act
    unsubscribe()
    store.setSelection({ selectedItemId: 'item-1', selectedThemeGroup: null })

    // Assert
    expect(listener).not.toHaveBeenCalled()
  })
})

describe('useStudioSelection', () => {
  it('should_render_no_selection_outside_a_weaverse_root', () => {
    expect(render()).toEqual(EMPTY)
  })

  it('should_render_no_selection_on_the_server_even_when_the_store_has_one', () => {
    // Arrange
    let store = new StudioSelectionStore()
    store.setSelection({ selectedItemId: null, selectedThemeGroup: 'Header' })

    // Act
    let selection = render(store)

    // Assert
    expect(selection).toEqual(EMPTY)
  })
})
