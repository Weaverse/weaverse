import { Weaverse, type WeaverseItemStore } from '@weaverse/core'
import { useContext } from 'react'
import { WeaverseContext, WeaverseItemContext } from './context'

export type { DataContext } from './utils/data-connector'
// Re-export the data connector utilities
export {
  replaceContentDataConnectors,
  replaceContentDataConnectorsDeep,
} from './utils/data-connector'

/**
 * Returns the active Weaverse runtime from React context.
 *
 * @remarks
 * `itemInstances` maps component instance IDs to their item stores, `data` is
 * the current page data, and `elementRegistry` maps component types (not
 * instance IDs or DOM nodes) to their registered definitions. Pass the
 * integration's runtime type (`WeaverseHydrogen` or `WeaverseNextRuntime`) as
 * `T` for its page data type. In Next.js, call it from a Client Component.
 *
 * @typeParam T - Runtime subtype expected by the integration.
 *
 * @category Hooks
 *
 * @example
 * Toggle another component by its instance ID:
 * ```tsx
 * import { useWeaverse } from '@weaverse/hydrogen' // or '@weaverse/next'
 *
 * export function AnnouncementToggle() {
 *   let { itemInstances } = useWeaverse()
 *   let bar = itemInstances.get('announcement-bar')
 *   if (!bar) return null
 *
 *   return (
 *     <button
 *       type="button"
 *       onClick={() => bar.setData({ isVisible: !bar.data.isVisible })}
 *     >
 *       {bar.data.isVisible ? 'Hide' : 'Show'} announcement
 *     </button>
 *   )
 * }
 * ```
 */
export function useWeaverse<T = Weaverse>() {
  let weaverse = useContext(WeaverseContext)
  return weaverse as T
}

/**
 * Returns a Weaverse item instance by ID, or the current rendered item when no
 * ID is provided.
 *
 * @param id - Optional item ID to look up.
 * @returns The matching item instance, or `null` when it is unavailable.
 *
 * @remarks
 * The item store exposes `data` (always includes `id` and `type`),
 * `setData(update)` to merge an update and re-render, `triggerUpdate()` to
 * re-render without changing data, `_id`, and `_element` (the DOM node, when
 * mounted).
 *
 * @category Hooks
 *
 * @example
 * Read the current component's data:
 * ```tsx
 * import { useItemInstance } from '@weaverse/hydrogen' // or '@weaverse/next'
 *
 * export function ProductDetails() {
 *   let item = useItemInstance()
 *   if (!item) return null
 *
 *   let { product, showPricing } = item.data
 *   return <h2>{showPricing ? `${product.title} – on sale` : product.title}</h2>
 * }
 * ```
 *
 * @example
 * Update another component by its instance ID:
 * ```tsx
 * import { useItemInstance } from '@weaverse/hydrogen' // or '@weaverse/next'
 *
 * export function ResetFilters() {
 *   let productGrid = useItemInstance('product-grid-main')
 *   if (!productGrid) return null
 *
 *   return (
 *     <button
 *       type="button"
 *       onClick={() => productGrid.setData({ activeFilters: [] })}
 *     >
 *       Clear filters
 *     </button>
 *   )
 * }
 * ```
 */
export let useItemInstance = (id?: string) => {
  let { id: currentId } = useContext(WeaverseItemContext)
  let instance = Weaverse.itemInstances.get(id || currentId)
  if (!instance) {
    console.log(`Item instance ${id} not found`)
    return null
  }
  return instance as WeaverseItemStore
}

/**
 * Returns the parent instance of the current rendered item.
 *
 * @returns The parent item instance. At the root, the empty parent ID falls
 * back to the current item instance; returns `null` only when that lookup is
 * unavailable.
 *
 * @category Hooks
 *
 * @example
 * Read loader data and settings from the parent component:
 * ```tsx
 * import { useParentInstance } from '@weaverse/hydrogen' // or '@weaverse/next'
 *
 * export function ReviewItem({ text }: { text: string }) {
 *   let parent = useParentInstance()
 *   let showVerifiedBadge = parent?.data.showVerifiedBadge
 *
 *   return (
 *     <div>
 *       <p>{text}</p>
 *       {showVerifiedBadge && <span>Verified buyer</span>}
 *     </div>
 *   )
 * }
 * ```
 */
export let useParentInstance = () => {
  let { parentId } = useContext(WeaverseItemContext)
  return useItemInstance(parentId || '')
}

/**
 * Returns the direct child instances of an item.
 *
 * @param id - Optional parent item ID; defaults to the current rendered item.
 * @returns Child item stores registered in the runtime, or an empty array
 * when the parent instance cannot be found.
 *
 * @remarks
 * A found parent instance must have a `children` array in its data; if it is
 * missing, the hook throws instead of returning an empty array.
 *
 * @category Hooks
 *
 * @example
 * Show only the active slide of a carousel:
 * ```tsx
 * import { useChildInstances } from '@weaverse/hydrogen' // or '@weaverse/next'
 * import { useEffect, useState } from 'react'
 *
 * export function Carousel() {
 *   let [activeIndex, setActiveIndex] = useState(0)
 *   let slides = useChildInstances()
 *
 *   useEffect(() => {
 *     slides.forEach((slide, index) => {
 *       slide.setData({ isVisible: index === activeIndex })
 *     })
 *   }, [slides, activeIndex])
 *
 *   return (
 *     <div>
 *       {slides.map((slide, index) => (
 *         <button key={slide._id} type="button" onClick={() => setActiveIndex(index)}>
 *           {index + 1}
 *         </button>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export let useChildInstances = (id?: string) => {
  let currentInstance = useItemInstance(id)
  if (!currentInstance) {
    return []
  }
  let { itemInstances } = Weaverse

  let {
    data: { children },
  } = currentInstance
  return children
    .map(({ id }: { id: string }) => itemInstances.get(id))
    .filter(Boolean) as WeaverseItemStore[]
}
