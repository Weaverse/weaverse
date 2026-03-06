# Fix ThemeSettingsStore Max Listeners Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the 100-listener cap from ThemeSettingsStore that silently breaks component subscriptions, optimize Pilot badge components, and add tests.

**Architecture:** ThemeSettingsStore uses a `Set<() => void>` for listeners with React's `useSyncExternalStore` handling cleanup. Remove the hard cap, add an advisory dev-only warning at 500 listeners. Consolidate 6 `useThemeSettings()` calls in badges.tsx into 1 by passing settings as props.

**Tech Stack:** TypeScript, React, Bun test runner (`bun:test`)

---

### Task 1: Write ThemeSettingsStore Tests

**Files:**
- Create: `packages/hydrogen/__tests__/theme-settings-store.test.ts`
- Reference: `packages/hydrogen/src/utils/use-theme-settings-store.ts`

**Step 1: Write the failing tests**

Create `packages/hydrogen/__tests__/theme-settings-store.test.ts`:

```typescript
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test"
import { ThemeSettingsStore } from "../src/utils/use-theme-settings-store"

describe("ThemeSettingsStore", () => {
  let store: ThemeSettingsStore
  let consoleWarnSpy: ReturnType<typeof spyOn>
  let consoleErrorSpy: ReturnType<typeof spyOn>

  beforeEach(() => {
    store = new ThemeSettingsStore({
      theme: { colorText: "#000", colorTextInverse: "#fff" },
    })
    consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {})
    consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    store.destroy()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe("subscribe", () => {
    it("should add a listener and return an unsubscribe function", () => {
      let callCount = 0
      const unsubscribe = store.subscribe(() => {
        callCount++
      })

      store.updateThemeSettings({ colorText: "#111" })
      expect(callCount).toBe(1)

      unsubscribe()
      store.updateThemeSettings({ colorText: "#222" })
      expect(callCount).toBe(1) // Not called after unsubscribe
    })

    it("should support more than 100 listeners without dropping any", () => {
      const listeners: Array<() => void> = []
      let totalCalls = 0

      for (let i = 0; i < 200; i++) {
        store.subscribe(() => {
          totalCalls++
        })
      }

      store.updateThemeSettings({ colorText: "#111" })
      expect(totalCalls).toBe(200)
    })

    it("should return no-op for a destroyed store", () => {
      store.destroy()
      let callCount = 0
      const unsubscribe = store.subscribe(() => {
        callCount++
      })

      // Should have warned
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "ThemeSettingsStore: Cannot subscribe to destroyed store",
      )

      // Unsubscribe should be a no-op function
      unsubscribe()
      expect(callCount).toBe(0)
    })

    it("should warn once when listener count exceeds 500", () => {
      for (let i = 0; i < 501; i++) {
        store.subscribe(() => {})
      }

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      expect(consoleWarnSpy.mock.calls[0][0]).toContain("501 listeners detected")

      // Adding more should NOT warn again
      store.subscribe(() => {})
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("emit", () => {
    it("should notify all listeners on settings update", () => {
      const calls: number[] = []

      store.subscribe(() => calls.push(1))
      store.subscribe(() => calls.push(2))
      store.subscribe(() => calls.push(3))

      store.updateThemeSettings({ colorText: "#111" })
      expect(calls).toEqual([1, 2, 3])
    })

    it("should handle listener errors without stopping other listeners", () => {
      const calls: number[] = []

      store.subscribe(() => calls.push(1))
      store.subscribe(() => {
        throw new Error("listener error")
      })
      store.subscribe(() => calls.push(3))

      store.updateThemeSettings({ colorText: "#111" })
      expect(calls).toEqual([1, 3])
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe("getSnapshot", () => {
    it("should return current settings", () => {
      expect(store.getSnapshot()).toEqual({
        colorText: "#000",
        colorTextInverse: "#fff",
      })

      store.updateThemeSettings({ colorText: "#111" })
      expect(store.getSnapshot()).toEqual({
        colorText: "#111",
        colorTextInverse: "#fff",
      })
    })
  })

  describe("destroy", () => {
    it("should clear all listeners and prevent further updates", () => {
      let callCount = 0
      store.subscribe(() => {
        callCount++
      })

      store.destroy()
      store.updateThemeSettings({ colorText: "#111" })
      expect(callCount).toBe(0)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "ThemeSettingsStore: Cannot update destroyed store",
      )
    })

    it("should be idempotent", () => {
      store.destroy()
      store.destroy() // Should not throw
    })
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `bun test packages/hydrogen/__tests__/theme-settings-store.test.ts`

Expected: Tests related to 200+ listeners and the 500-warning threshold will FAIL because the current code caps at 100 and has no 500-level warning.

**Step 3: Commit failing tests**

```bash
git add packages/hydrogen/__tests__/theme-settings-store.test.ts
git commit -m "test: add ThemeSettingsStore tests (failing - validates issue #431)"
```

---

### Task 2: Remove Listener Cap from ThemeSettingsStore

**Files:**
- Modify: `packages/hydrogen/src/utils/use-theme-settings-store.ts`

**Step 1: Implement the fix**

In `packages/hydrogen/src/utils/use-theme-settings-store.ts`, make these changes:

1. Remove the `MAX_LISTENERS` property (line 20):
   ```
   DELETE: private readonly MAX_LISTENERS = 100
   ADD: private hasWarnedListenerCount = false
   ```

2. Replace the `subscribe` method (lines 51-69) with:
   ```typescript
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

**Step 2: Run tests to verify they pass**

Run: `bun test packages/hydrogen/__tests__/theme-settings-store.test.ts`

Expected: ALL tests pass.

**Step 3: Commit**

```bash
git add packages/hydrogen/src/utils/use-theme-settings-store.ts
git commit -m "fix: remove ThemeSettingsStore listener cap that silently drops subscriptions (#431)"
```

---

### Task 3: Optimize Pilot Badge Components

**Files:**
- Modify: `templates/pilot/app/components/product/badges.tsx`

**Step 1: Refactor badges.tsx**

Replace the entire file with this refactored version that calls `useThemeSettings()` once in `ProductBadges` and passes settings as props:

```tsx
import { useMoney } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { colord } from "colord";
import type {
  ProductQuery,
  ProductVariantFragment,
} from "storefront-api.generated";
import { cn } from "~/utils/cn";

interface BadgeStyleSettings {
  colorText: string;
  colorTextInverse: string;
  badgeBorderRadius: number;
  badgeTextTransform: string;
}

function Badge({
  text,
  backgroundColor,
  className,
  badgeStyle,
}: {
  text: string;
  backgroundColor: string;
  className?: string;
  badgeStyle: BadgeStyleSettings;
}) {
  let { colorText, colorTextInverse, badgeBorderRadius, badgeTextTransform } =
    badgeStyle;
  return (
    <span
      style={{
        backgroundColor,
        color: colord(backgroundColor).isDark() ? colorTextInverse : colorText,
        borderRadius: `${badgeBorderRadius}px`,
        textTransform: badgeTextTransform,
      }}
      className={cn("px-1.5 py-1 text-sm uppercase", className)}
    >
      {text}
    </span>
  );
}

export function NewBadge({
  publishedAt,
  className,
  badgeStyle,
  newBadgeText,
  newBadgeColor,
  newBadgeDaysOld,
}: {
  publishedAt: string;
  className?: string;
  badgeStyle: BadgeStyleSettings;
  newBadgeText: string;
  newBadgeColor: string;
  newBadgeDaysOld: number;
}) {
  if (isNewArrival(publishedAt, newBadgeDaysOld)) {
    return (
      <Badge
        text={newBadgeText}
        backgroundColor={newBadgeColor}
        className={clsx("new-badge", className)}
        badgeStyle={badgeStyle}
      />
    );
  }
  return null;
}

export function BestSellerBadge({
  className,
  badgeStyle,
  bestSellerBadgeText,
  bestSellerBadgeColor,
}: {
  className?: string;
  badgeStyle: BadgeStyleSettings;
  bestSellerBadgeText: string;
  bestSellerBadgeColor: string;
}) {
  return (
    <Badge
      text={bestSellerBadgeText}
      backgroundColor={bestSellerBadgeColor}
      className={clsx("best-seller-badge", className)}
      badgeStyle={badgeStyle}
    />
  );
}

export function SoldOutBadge({
  className,
  badgeStyle,
  soldOutBadgeText,
  soldOutBadgeColor,
}: {
  className?: string;
  badgeStyle: BadgeStyleSettings;
  soldOutBadgeText: string;
  soldOutBadgeColor: string;
}) {
  return (
    <Badge
      text={soldOutBadgeText}
      backgroundColor={soldOutBadgeColor}
      className={clsx("sold-out-badge", className)}
      badgeStyle={badgeStyle}
    />
  );
}

export function BundleBadge({
  className,
  badgeStyle,
  bundleBadgeText,
  bundleBadgeColor,
}: {
  className?: string;
  badgeStyle: BadgeStyleSettings;
  bundleBadgeText: string;
  bundleBadgeColor: string;
}) {
  return (
    <Badge
      text={bundleBadgeText}
      backgroundColor={bundleBadgeColor}
      className={clsx("bundle-badge", className)}
      badgeStyle={badgeStyle}
    />
  );
}

export function SaleBadge({
  price,
  compareAtPrice,
  className,
  badgeStyle,
  saleBadgeText = "Sale",
  saleBadgeColor,
}: {
  price: MoneyV2;
  compareAtPrice: MoneyV2;
  className?: string;
  badgeStyle: BadgeStyleSettings;
  saleBadgeText?: string;
  saleBadgeColor: string;
}) {
  let { amount, percentage } = calculateDiscount(price, compareAtPrice);
  let discountAmount = useMoney({ amount, currencyCode: price.currencyCode });
  let text = saleBadgeText
    .replace("[amount]", discountAmount.withoutTrailingZeros)
    .replace("[percentage]", percentage);

  if (percentage !== "0") {
    return (
      <Badge
        text={text}
        backgroundColor={saleBadgeColor}
        className={clsx("sale-badge", className)}
        badgeStyle={badgeStyle}
      />
    );
  }
  return null;
}

function calculateDiscount(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (price?.amount && compareAtPrice?.amount) {
    let priceNumber = Number(price.amount);
    let compareAtPriceNumber = Number(compareAtPrice.amount);
    if (compareAtPriceNumber > priceNumber) {
      return {
        amount: String(compareAtPriceNumber - priceNumber),
        percentage: Math.round(
          ((compareAtPriceNumber - priceNumber) / compareAtPriceNumber) * 100,
        ).toString(),
      };
    }
  }
  return { amount: "0", percentage: "0" };
}

function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
}

export function ProductBadges({
  product,
  selectedVariant,
  className = "",
  as: Component = "div",
}: {
  product: NonNullable<ProductQuery["product"]>;
  selectedVariant: ProductVariantFragment;
  className?: string;
  as?: React.ElementType;
}) {
  let themeSettings = useThemeSettings();
  let {
    colorText,
    colorTextInverse,
    badgeBorderRadius,
    badgeTextTransform,
    newBadgeText,
    newBadgeColor,
    newBadgeDaysOld,
    bestSellerBadgeText,
    bestSellerBadgeColor,
    soldOutBadgeText,
    soldOutBadgeColor,
    bundleBadgeText,
    bundleBadgeColor,
    saleBadgeText,
    saleBadgeColor,
  } = themeSettings;

  let badgeStyle: BadgeStyleSettings = {
    colorText,
    colorTextInverse,
    badgeBorderRadius,
    badgeTextTransform,
  };

  if (!(product && selectedVariant)) {
    return null;
  }

  let isBundle = Boolean(product?.isBundle?.requiresComponents);
  let { publishedAt, badges } = product;
  let isBestSellerProduct = badges
    .filter(Boolean)
    .some(({ key, value }) => key === "best_seller" && value === "true");

  let isFragment = Component.toString() === "Symbol(react.fragment)";
  let componentProps = isFragment
    ? {}
    : {
        className: cn(
          "flex items-center gap-2 text-sm empty:hidden",
          className,
        ),
      };

  return (
    <Component {...componentProps}>
      {selectedVariant.availableForSale ? (
        <>
          {isBundle && (
            <BundleBadge
              badgeStyle={badgeStyle}
              bundleBadgeText={bundleBadgeText}
              bundleBadgeColor={bundleBadgeColor}
            />
          )}
          <SaleBadge
            price={selectedVariant.price as MoneyV2}
            compareAtPrice={selectedVariant.compareAtPrice as MoneyV2}
            badgeStyle={badgeStyle}
            saleBadgeText={saleBadgeText}
            saleBadgeColor={saleBadgeColor}
          />
          <NewBadge
            publishedAt={publishedAt}
            badgeStyle={badgeStyle}
            newBadgeText={newBadgeText}
            newBadgeColor={newBadgeColor}
            newBadgeDaysOld={newBadgeDaysOld}
          />
          {isBestSellerProduct && (
            <BestSellerBadge
              badgeStyle={badgeStyle}
              bestSellerBadgeText={bestSellerBadgeText}
              bestSellerBadgeColor={bestSellerBadgeColor}
            />
          )}
        </>
      ) : (
        <SoldOutBadge
          badgeStyle={badgeStyle}
          soldOutBadgeText={soldOutBadgeText}
          soldOutBadgeColor={soldOutBadgeColor}
        />
      )}
    </Component>
  );
}
```

**Step 2: Check that badges are used correctly at call sites**

Run: `grep -rn "NewBadge\|BestSellerBadge\|SoldOutBadge\|BundleBadge\|SaleBadge\|ProductBadges" templates/pilot/app/ --include="*.tsx" --include="*.ts" | grep -v "badges.tsx"`

Verify that `ProductBadges` is the only external consumer (individual badge components should only be used inside `badges.tsx`). If any external call sites use individual badge components directly, they'll need updating too.

**Step 3: Verify TypeScript compiles**

Run: `pnpm --filter pilot typecheck` (or equivalent)

Expected: No TypeScript errors.

**Step 4: Commit**

```bash
git add templates/pilot/app/components/product/badges.tsx
git commit -m "perf: consolidate useThemeSettings calls in Pilot badge components (#431)

Reduced from 6 useThemeSettings() subscriptions per product card to 1.
ProductBadges now passes theme settings as props to child badge components."
```

---

### Task 4: Final Verification

**Step 1: Run all hydrogen package tests**

Run: `bun test` from `packages/hydrogen/`

Expected: ALL tests pass, including the new ThemeSettingsStore tests.

**Step 2: Verify no other test suites are broken**

Run: `pnpm test` from repo root (if applicable)

Expected: No regressions.

**Step 3: Check for any TypeScript errors across the monorepo**

Run: `pnpm typecheck` (or `pnpm --filter @weaverse/hydrogen typecheck`)

Expected: Clean.
