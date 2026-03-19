# Fix ThemeSettingsStore Max Listeners Exceeded (Issue #431)

**Date:** 2025-07-15
**Status:** Approved
**Scope:** SDK fix + Pilot template optimization + tests

## Problem

Console warning appears on all Weaverse Hydrogen themes:
```
ThemeSettingsStore: Maximum listeners (100) exceeded. Possible memory leak detected.
```

The `ThemeSettingsStore` class in `packages/hydrogen/src/utils/use-theme-settings-store.ts` has a hard cap of 100 listeners. When exceeded, new subscriptions are silently dropped (returns a no-op cleanup function), causing components to stop receiving theme setting updates.

### Why 100 Is Too Low

In the Pilot template, `useThemeSettings()` is called from 17+ files with 19+ call sites. A product grid with 10 products generates ~60 listeners from badges alone (each `ProductBadges` triggers 6 `useThemeSettings()` calls). Adding header, footer, logo, style, animation, newsletter, slideshow, and link components easily pushes past 100.

### Root Cause

1. **100 listener cap is too low** for real-world usage
2. **Silent subscription drops** when cap is hit — components stop updating
3. **Pilot badges.tsx** calls `useThemeSettings()` 6 times per product card (once in each badge component plus the shared `Badge` component)

React's `useSyncExternalStore` handles cleanup properly on unmount. The `Set` prevents duplicate listeners. The cap only breaks legitimate subscriptions.

## Approach: Remove Cap, Optimize Template

Chose over two alternatives:
- **Nanostores migration**: Too large a change surface, breaks API, higher regression risk
- **Selector pattern**: YAGNI — solving an unmeasured performance problem with massive scope creep

## Changes

### 1. ThemeSettingsStore — Remove Listener Cap

**File:** `packages/hydrogen/src/utils/use-theme-settings-store.ts`

- Remove `MAX_LISTENERS` constant
- Remove the cap check that silently drops subscriptions
- Add a dev-only warning that fires once when listener count exceeds 500 (advisory, never blocks)
- Keep everything else: `Set<() => void>`, `isDestroyed` guards, `emit()` with snapshot copy, `destroy()`, singleton via `window.__weaverseThemeSettingsStore`

```typescript
private hasWarnedListenerCount = false

subscribe = (callback: () => void) => {
  if (this.isDestroyed) {
    console.warn('ThemeSettingsStore: Cannot subscribe to destroyed store')
    return () => {}
  }

  this.listeners.add(callback)

  if (!this.hasWarnedListenerCount && this.listeners.size > 500) {
    this.hasWarnedListenerCount = true
    console.warn(
      `ThemeSettingsStore: ${this.listeners.size} listeners detected. ` +
      'This may indicate a performance issue. Consider using fewer useThemeSettings() calls.'
    )
  }

  return () => {
    this.listeners.delete(callback)
  }
}
```

### 2. Pilot Template — Consolidate Badge useThemeSettings Calls

**File:** `templates/pilot/app/components/product/badges.tsx`

Move the single `useThemeSettings()` call to `ProductBadges` and pass settings as props to child badge components. This reduces 6 subscriptions per product card to 1.

- `ProductBadges` calls `useThemeSettings()` once, destructures all badge-related settings
- Each badge component (`NewBadge`, `SaleBadge`, `BestSellerBadge`, `SoldOutBadge`, `BundleBadge`) receives settings via props
- `Badge` becomes a pure presentational component (already receives style values as props)

### 3. Tests

**File:** `packages/hydrogen/src/utils/__tests__/use-theme-settings-store.test.ts`

Test cases:
- Subscribe adds listener, unsubscribe removes it
- No listener limit: 200+ listeners all receive updates
- Destroyed store: subscribe returns no-op
- Emit notifies all listeners
- Cleanup: unsubscribed listener not called on update

## What's NOT Changing

- `WeaverseHydrogenRoot.tsx` — `useThemeSettings()` and `withWeaverse()` are correct
- `@weaverse/react` or `@weaverse/core` — no changes needed
- Other templates (Aspen, Naturelle) — benefit from SDK fix automatically
- No selector pattern or store library migration
