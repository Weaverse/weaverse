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
 * `itemInstances` maps component instance IDs to their item stores, `data` is
 * the current page data, and `elementRegistry` maps component types (not
 * instance IDs or DOM nodes) to their registered definitions. In Next.js,
 * call it from a Client Component.
 *
 * @typeParam T - Runtime subtype expected by the integration.
 *
 * @category Hooks
 *
 * @example
 * Toggle another component by its instance ID. `setData()` re-renders that
 * component, which hides itself (for example, `if (!isVisible) return null`).
 * `useWeaverse()` does not subscribe to items, so the toggle reads `bar.data`
 * when clicked; to re-render on an item's changes, read it with React's
 * `useSyncExternalStore(item.subscribe, item.getSnapShot, item.getSnapShot)`.
 * ```tsx
 * import { useWeaverse } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
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
 *       Toggle announcement
 *     </button>
 *   )
 * }
 * ```
 *
 * Type `data` to read the page data, for example with `WeaversePageData` in a
 * React Router theme (`WeaverseNextPageData` in Next.js):
 * ```tsx
 * import { useWeaverse, type WeaversePageData } from '@weaverse/hydrogen/react-router'
 *
 * export function PageInfo() {
 *   let { data } = useWeaverse<{ data: WeaversePageData }>()
 *   return <h1>{data.name}</h1>
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
 * The item store exposes `data` (always includes `id` and `type`),
 * `setData(update)` to merge an update and re-render, `triggerUpdate()` to
 * re-render without changing data, `_id`, and `_element` (the DOM node, when
 * mounted).
 *
 * @param id - Optional item ID to look up.
 * @returns The matching item instance, or `null` when it is unavailable.
 *
 * @category Hooks
 *
 * @example
 * Read the current component's data:
 * ```tsx
 * import { useItemInstance } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
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
 * Update another component by its instance ID:
 * ```tsx
 * import { useItemInstance } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
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
 *
 * Find the closest Weaverse item from a DOM node. Weaverse renders each item
 * with a `data-wv-id` attribute:
 * ```tsx
 * import { useItemInstance } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
 * import { useEffect, useState, type RefObject } from 'react'
 *
 * export function useClosestWeaverseItem(ref: RefObject<HTMLElement | null>) {
 *   let [weaverseId, setWeaverseId] = useState('')
 *   let weaverseItem = useItemInstance(weaverseId)
 *
 *   useEffect(() => {
 *     if (!weaverseItem && ref.current) {
 *       let closest = ref.current.closest('[data-wv-id]')
 *       setWeaverseId(closest?.getAttribute('data-wv-id') ?? '')
 *     }
 *   }, [ref, weaverseItem])
 *
 *   return weaverseItem
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
 * import { useParentInstance } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
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
 * A found parent instance must have a `children` array in its data; if it is
 * missing, the hook throws instead of returning an empty array.
 *
 * @param id - Optional parent item ID; defaults to the current rendered item.
 * @returns Child item stores registered in the runtime, or an empty array
 * when the parent instance cannot be found.
 *
 * @category Hooks
 *
 * @example
 * Build carousel navigation from the slides' data. Weaverse passes the
 * rendered child items as `children`, in the same order as the child
 * instances; the carousel shows the active one itself.
 * ```tsx
 * import { useChildInstances } from '@weaverse/hydrogen/react-router' // or '@weaverse/hydrogen/next'
 * import { Children, useState, type ComponentProps } from 'react'
 *
 * export function Carousel({ children, ...rest }: ComponentProps<'div'>) {
 *   let [activeIndex, setActiveIndex] = useState(0)
 *   let slides = useChildInstances()
 *
 *   return (
 *     <div {...rest}>
 *       {Children.map(children, (slide, index) => (
 *         <div hidden={index !== activeIndex}>{slide}</div>
 *       ))}
 *       <nav>
 *         {slides.map((slide, index) => (
 *           <button
 *             key={slide._id}
 *             type="button"
 *             aria-pressed={index === activeIndex}
 *             onClick={() => setActiveIndex(index)}
 *           >
 *             {slide.data.title ?? `Slide ${index + 1}`}
 *           </button>
 *         ))}
 *       </nav>
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
