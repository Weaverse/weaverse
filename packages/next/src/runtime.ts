import { Weaverse } from '@weaverse/react'
import {
  collectDeferredItemUpdates,
  ensureNextItemConstructor,
  type WeaverseNextItem,
} from './item'
import { buildWeaverseNextRequestInfo } from './request-info'
import { createWeaverseNextThemeSettingsStore } from './theme-settings-store'
import { TranslationStore } from './translation-store'
import type {
  WeaverseNextClient,
  WeaverseNextLoaderData,
  WeaverseNextPageData,
  WeaverseNextRequestInfo,
  WeaverseNextRuntimeConfig,
  WeaverseNextRuntimeInternal,
  WeaverseNextTranslationChanges,
  WeaverseNextTranslationEntry,
  WeaverseNextTranslationMap,
} from './types'

declare global {
  interface Window {
    __weaverse?: WeaverseNextRuntime
    __weaverses?: Record<string, WeaverseNextRuntime>
  }
}

type StudioBoundRuntime = WeaverseNextRuntime & {
  __weaverseNextStudioBound?: boolean
  __weaverseNextRequestKey?: string
  __weaverseNextLatestData?: WeaverseNextPageData & { rootId: string }
}

function getRuntimeWindow(): Window | undefined {
  return typeof window === 'undefined' ? undefined : window
}

function getRenderablePage(
  data: WeaverseNextLoaderData
): WeaverseNextPageData & { rootId: string } {
  let page = data.page
  let rootId =
    page.rootId ??
    page.items.find((item) => item.type === 'main')?.id ??
    page.items[0]?.id ??
    page.id
  return { ...page, rootId }
}

function getConfigString(
  configs: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  let value = configs?.[key]
  return typeof value === 'string' ? value : undefined
}

function getRecordString(
  record: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  let value = record?.[key]
  return typeof value === 'string' ? value : undefined
}

function resolveProjectId(
  client: WeaverseNextClient | undefined,
  data: WeaverseNextLoaderData,
  fallback: string
): string {
  let projectId = client?.projectId
  if (projectId) {
    return projectId
  }

  let configProjectId = getConfigString(data.configs, 'projectId')
  if (configProjectId) {
    return configProjectId
  }

  return getRecordString(data.project, 'id') ?? fallback
}

function resolveDataContext(config: WeaverseNextRuntimeConfig) {
  if (config.dataContext) {
    return config.dataContext
  }
  if (config.client?.dataContext) {
    return config.client.dataContext
  }
  return {}
}

function getRuntimeKey(pageId: string, requestInfo: WeaverseNextRequestInfo) {
  return `${pageId}:${requestInfo.pathname}:${requestInfo.search}`
}

function registerRuntime(runtime: WeaverseNextRuntime) {
  let runtimeWindow = getRuntimeWindow()
  if (!runtimeWindow) {
    return
  }

  runtimeWindow.__weaverses ??= {}
  runtimeWindow.__weaverses[runtime.pageId] = runtime
  runtimeWindow.__weaverse = runtime
}

/**
 * Lifecycle invariant: every item store rendered by a runtime must point back
 * at that same runtime (`item.weaverse === runtime`).
 *
 * Core keeps `Weaverse.itemInstances` process-wide and keyed by item id only,
 * so a client navigation that recreates the runtime under a new request key
 * (e.g. `/` → `/fr-fr`) reuses the existing stores and merely calls
 * `setData()` on them — their `weaverse` back-reference is never updated and
 * keeps pointing at the previous runtime. Anything an item reads through that
 * reference then stays stale: `WeaverseNextItem.getSnapShot()` reads
 * `this.weaverse.translationMap` (locale sidecar), and `Element` /
 * `requestInfo` consumers read the old locale's runtime until a full reload
 * builds clean instances.
 *
 * Rebind only the items belonging to the freshly rendered page — other
 * runtimes co-located on the same document own their own item ids and must
 * keep their bindings.
 */
function rebindPageItemsToRuntime(runtime: WeaverseNextRuntime) {
  let items = (runtime.data as WeaverseNextPageData | undefined)?.items
  if (!items) {
    return
  }
  for (let { id } of items) {
    let instance = runtime.itemInstances.get(id) as WeaverseNextItem | undefined
    if (instance && instance.weaverse !== runtime) {
      instance.weaverse = runtime
    }
  }
}

/**
 * Browser runtime that adapts a Next.js loader payload to `@weaverse/react`
 * and exposes the navigation, settings, and translation state used by Studio.
 */
export class WeaverseNextRuntime extends Weaverse {
  /** Stable ID of the page owned by this runtime. */
  pageId: string
  /** Mutable callbacks and stores consumed by the Studio bridge. */
  internal: WeaverseNextRuntimeInternal
  /** Path, query, and locale metadata for Studio navigation. */
  requestInfo: WeaverseNextRequestInfo
  /** Whether this runtime renders a component preview. */
  isPreviewMode: boolean
  /** Whether this runtime renders a saved revision. */
  isRevisionPreview: boolean
  /** Component type rendered in section preview mode. */
  sectionType?: string

  // ─── Item-level translation sidecar (design mode only) ─────────────
  /**
   * Translation map received from Builder in design mode, keyed by item ID.
   * `WeaverseNextItem.getSnapShot()` overlays these onto the data handed to
   * components, so translations render without mutating the base `_store`.
   */
  translationMap: WeaverseNextTranslationMap = {}
  /** Locale associated with the item-level translation sidecar. */
  translationLocale = String()
  /** Weaverse language ID used when saving translation changes. */
  translationLanguageId = String()

  /**
   * Fresh page data captured while React was rendering. Runtime reuse happens
   * inside the renderer's render phase (`useMemo`), where applying it through
   * `setProjectData()` would emit item updates to `useSyncExternalStore`
   * subscribers mid-render. The renderer applies it post-commit via
   * `flushRenderPhaseUpdates()`. Never set on design-mode runtimes — the live
   * Studio tree owns the page data there.
   */
  pendingProjectData?: WeaverseNextPageData & { rootId: string }

  /**
   * Reused item instances whose data was refreshed while this runtime was
   * constructed during render (core `initProject()` calls `setData()` on
   * them). Their data is already fresh; only the subscriber notification was
   * deferred to `flushRenderPhaseUpdates()`.
   */
  pendingItemUpdates: WeaverseNextItem[] = []

  /** Create a browser runtime from a loaded page and its request context. */
  constructor(config: WeaverseNextRuntimeConfig) {
    let { client, data } = config
    let page = getRenderablePage(data)
    let configs = data.configs
    let requestContext = client?.requestContext
    let projectId = resolveProjectId(client, data, page.id)

    ensureNextItemConstructor()
    super({
      projectId,
      data: page,
      isDesignMode: requestContext?.isDesignMode ?? false,
      weaverseHost: getConfigString(configs, 'weaverseHost'),
      weaverseVersion: getConfigString(configs, 'weaverseVersion'),
    })

    this.pageId = page.id
    this.dataContext = resolveDataContext(config)
    this.requestInfo = buildWeaverseNextRequestInfo(requestContext)
    this.isDesignMode = requestContext?.isDesignMode ?? false
    this.isPreviewMode = requestContext?.isPreviewMode ?? false
    this.isRevisionPreview = requestContext?.isRevisionPreview ?? false
    this.sectionType = requestContext?.sectionType

    // One store instance backs both the canonical `translationStore` and the
    // deprecated `themeTextStore` alias, so Builder's `updateStaticText()` RPC
    // (which reads `internal.themeTextStore`) mutates the same store the
    // `TranslationProvider` subscribes to.
    let translationStore = config.translationStore ?? new TranslationStore()

    this.internal = {
      merchantOverrides: config.merchantOverrides,
      navigate: config.navigate,
      pageAssignment: data.pageAssignment,
      project: data.project,
      revalidate: config.revalidate,
      themeSettingsStore:
        config.themeSettingsStore ??
        createWeaverseNextThemeSettingsStore({
          schema: client?.themeSchema,
          settings: client?.themeSettings,
        }),
      translationStore,
      themeTextStore: translationStore,
    }

    // Read any item-level translation sidecar the loader attached to the page
    // data. Runs after `super()` has built `this.data` and the item stores.
    this.extractTranslationSidecar()
  }

  /**
   * Pull `translationMap` / `translationLocale` / `translationLanguageId` off
   * the current page data (Builder attaches them in design mode). Unlike
   * Hydrogen, this also clears the sidecar to defaults when the new page data
   * carries none, so a reused runtime / project-data swap can't leave a stale
   * map overlaying the fresh tree.
   */
  extractTranslationSidecar = () => {
    let pageData = this.data as WeaverseNextPageData | undefined
    let translationMap = pageData?.translationMap as
      | WeaverseNextTranslationMap
      | undefined
    if (translationMap) {
      this.translationMap = translationMap
      this.translationLocale = (pageData?.translationLocale as string) || ''
      this.translationLanguageId =
        (pageData?.translationLanguageId as string) || ''
    } else {
      this.translationMap = {}
      this.translationLocale = ''
      this.translationLanguageId = ''
    }
  }

  /**
   * Replace the translation sidecar (Builder pushes this when translation data
   * arrives or the active language changes) and refresh every item so their
   * merged snapshots recompute.
   */
  setTranslationSidecar = (
    map: WeaverseNextTranslationMap = {},
    locale = '',
    languageId = ''
  ) => {
    this.translationMap = map
    this.translationLocale = locale
    this.translationLanguageId = languageId
    this.refreshAllItems()
  }

  /**
   * Update a single translatable field for one item. Assigns a new per-item
   * entry object so `WeaverseNextItem.getSnapShot()`'s translation-ref cache
   * invalidates, then triggers only that item's subscribers.
   */
  updateTranslation = (
    itemId: string,
    key: string,
    originalValue: string,
    translatedValue: string
  ) => {
    if (!this.translationMap[itemId]) {
      this.translationMap[itemId] = {}
    }
    // New entry reference so the item's snapshot cache detects the change.
    this.translationMap[itemId] = {
      ...this.translationMap[itemId],
      [key]: { originalValue, translatedValue },
    }
    let instance = this.itemInstances.get(itemId)
    if (instance) {
      instance.triggerUpdate()
    }
  }

  /**
   * Collect translation changes for the save flow. Returns `undefined` unless
   * both the locale and language ID are set and at least one entry exists;
   * each entry key is namespaced as `data.<field>` to match Builder.
   */
  getTranslationChanges = (): WeaverseNextTranslationChanges | undefined => {
    let languageId = this.translationLanguageId
    if (!(this.translationLocale && languageId)) {
      return
    }

    let entries: WeaverseNextTranslationEntry[] = []
    for (let [itemId, fields] of Object.entries(this.translationMap)) {
      for (let [key, entry] of Object.entries(fields)) {
        entries.push({
          itemId,
          key: `data.${key}`,
          originalValue: entry.originalValue,
          translatedValue: entry.translatedValue,
        })
      }
    }

    if (entries.length === 0) {
      return
    }
    return { languageId, entries }
  }

  /**
   * Re-extract the translation sidecar whenever project data is replaced (route
   * change / non-design reuse), before rebuilding item stores. Takes the
   * renderable page shape (`rootId` resolved) that `getRenderablePage()` and
   * the reuse branch pass in.
   */
  setProjectData = (data: WeaverseNextPageData & { rootId: string }) => {
    this.data = data
    this.extractTranslationSidecar()
    this.initProject()
  }

  /**
   * Apply updates deferred off the render phase: swap in any pending page data
   * captured on runtime reuse, then notify items whose data was refreshed
   * during construction. The renderer calls this from a layout effect right
   * after commit, so subscribers re-render before paint (no content flash) and
   * without React's setState-in-render warning.
   */
  flushRenderPhaseUpdates = () => {
    let pendingData = this.pendingProjectData
    if (pendingData) {
      this.pendingProjectData = undefined
      this.setProjectData(pendingData)
    }

    let pendingItems = this.pendingItemUpdates
    if (pendingItems.length > 0) {
      this.pendingItemUpdates = []
      for (let item of pendingItems) {
        item.triggerUpdate()
      }
    }
  }
}

/**
 * Create a browser runtime or reuse the runtime already registered for the
 * same page and request. Reuse preserves unsaved Studio state in design mode.
 */
export function createWeaverseNextRuntime(
  config: WeaverseNextRuntimeConfig
): WeaverseNextRuntime {
  let requestInfo = buildWeaverseNextRequestInfo(config.client?.requestContext)
  let page = getRenderablePage(config.data)
  let runtimeWindow = getRuntimeWindow()
  let existing = runtimeWindow?.__weaverses?.[page.id] as
    | StudioBoundRuntime
    | undefined
  let requestKey = getRuntimeKey(page.id, requestInfo)

  if (existing?.__weaverseNextRequestKey === requestKey) {
    let nextIsDesignMode = config.client?.requestContext?.isDesignMode ?? false
    // In design mode the live Studio runtime owns the page tree, including
    // unsaved drafts. Reapplying loader `page` data here would clobber those
    // edits, so leave the project data untouched and let
    // `bindWeaverseNextStudioRuntime` push the latest state via `refreshStudio`.
    // Published / preview reuse has no draft state, so fresh data still wins —
    // but this factory runs during React render (the renderer's `useMemo`),
    // and `setProjectData()` → `initProject()` → `setData()` would emit item
    // updates to `useSyncExternalStore` subscribers mid-render (React's
    // setState-in-render warning). Stash the page instead; the renderer
    // applies it post-commit via `flushRenderPhaseUpdates()`.
    if (existing.isDesignMode || nextIsDesignMode) {
      existing.pendingProjectData = undefined
    } else {
      existing.pendingProjectData = page
    }
    // Always capture the latest server payload. In design mode the live tree
    // (`existing.data`) is deliberately left untouched above, so it goes stale
    // after an RSC refresh — `bindWeaverseNextStudioRuntime` must report this
    // fresh payload to `refreshStudio`, not the stale tree, or a revalidation
    // (e.g. resource-picker pick) merges back old per-item `loaderData` and the
    // preview keeps rendering the previous resource. Mirrors Hydrogen, which
    // always passes the fresh loader params to `refreshStudio`.
    existing.__weaverseNextLatestData = page
    existing.dataContext = resolveDataContext(config)
    existing.requestInfo = requestInfo
    existing.projectId = resolveProjectId(config.client, config.data, page.id)
    existing.isDesignMode = nextIsDesignMode
    existing.isPreviewMode =
      config.client?.requestContext?.isPreviewMode ?? false
    existing.isRevisionPreview =
      config.client?.requestContext?.isRevisionPreview ?? false
    existing.sectionType = config.client?.requestContext?.sectionType
    existing.weaverseHost =
      getConfigString(config.data.configs, 'weaverseHost') ??
      existing.weaverseHost
    existing.weaverseVersion =
      getConfigString(config.data.configs, 'weaverseVersion') ??
      existing.weaverseVersion
    existing.internal.pageAssignment = config.data.pageAssignment
    existing.internal.project = config.data.project
    if (config.navigate) {
      existing.internal.navigate = config.navigate
    }
    if (config.revalidate) {
      existing.internal.revalidate = config.revalidate
    }
    if (config.themeSettingsStore) {
      existing.internal.themeSettingsStore = config.themeSettingsStore
    }
    if (config.translationStore) {
      existing.internal.translationStore = config.translationStore
      // Keep the deprecated alias pointing at the same adopted instance.
      existing.internal.themeTextStore = config.translationStore
    }
    // Always assign, including `undefined`, so locale/navigation changes can
    // clear previously attached merchant overrides instead of leaking stale
    // static-text values into the next render.
    existing.internal.merchantOverrides = config.merchantOverrides
    registerRuntime(existing)
    return existing
  }

  // Constructing a fresh runtime also happens during render, and core
  // `initProject()` reuses process-wide item instances holding the same item
  // ids (locale/client navigation recreates the runtime under a new request
  // key) by calling `setData()` on them. Defer those subscriber emits to the
  // renderer's post-commit `flushRenderPhaseUpdates()` as well.
  let [runtime, refreshedItems] = collectDeferredItemUpdates(
    () => new WeaverseNextRuntime(config) as StudioBoundRuntime
  )
  runtime.pendingItemUpdates = refreshedItems
  // Reused stores are still bound to the runtime that built them; rebind before
  // returning so consumers read snapshots through this runtime (see
  // `rebindPageItemsToRuntime`). Rebinding touches no subscriber, so it stays
  // render-phase safe alongside the deferred item updates above.
  rebindPageItemsToRuntime(runtime)
  runtime.__weaverseNextRequestKey = requestKey
  runtime.__weaverseNextLatestData = page
  registerRuntime(runtime)
  return runtime
}

/**
 * Bind a design-mode runtime to the global Builder Studio bridge.
 *
 * @returns `true` when Studio was initialized or refreshed, otherwise `false`.
 */
export function bindWeaverseNextStudioRuntime(runtime: WeaverseNextRuntime) {
  if (!runtime.isDesignMode) {
    return false
  }

  let studio = getRuntimeWindow()?.weaverseStudio
  if (!studio) {
    return false
  }

  let boundRuntime = runtime as StudioBoundRuntime
  // Builder's bridge tracks a single active runtime (`studio.weaverse`). When
  // an already-bound runtime is reused after navigating away and back (Home ->
  // PDP -> Home), the bridge is still on the other URL, and Builder ignores
  // `refreshStudio` for a non-active pageId — Studio would stay disconnected
  // (outline skeleton, publish disabled). Re-init only when the active runtime
  // belongs to a different URL; same-URL co-located runtimes must stay on the
  // refresh path so the SDK does not override Builder's editable-instance
  // choice.
  let activeRuntime = studio.weaverse as WeaverseNextRuntime | undefined
  let activeRequestInfo = activeRuntime?.requestInfo
  let isActiveUrl =
    !activeRequestInfo ||
    (activeRequestInfo.pathname === runtime.requestInfo.pathname &&
      activeRequestInfo.search === runtime.requestInfo.search)
  if (!(boundRuntime.__weaverseNextStudioBound && isActiveUrl)) {
    studio.init?.(runtime)
    boundRuntime.__weaverseNextStudioBound = true
    return true
  }

  // Report the latest server payload (fresh per-item `loaderData`), not the
  // live tree: Builder's `refreshStudio` merges the editor draft's structural
  // edits back on top and only takes the loader payload from this data.
  studio.refreshStudio?.({
    data: boundRuntime.__weaverseNextLatestData ?? runtime.data,
    pageId: runtime.pageId,
    requestInfo: runtime.requestInfo,
  })
  return true
}
