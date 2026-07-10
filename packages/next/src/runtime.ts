import { Weaverse } from '@weaverse/react'
import { ensureNextItemConstructor } from './item'
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

export class WeaverseNextRuntime extends Weaverse {
  pageId: string
  internal: WeaverseNextRuntimeInternal
  requestInfo: WeaverseNextRequestInfo
  isPreviewMode: boolean
  isRevisionPreview: boolean
  sectionType?: string

  // ─── Item-level translation sidecar (design mode only) ─────────────
  /**
   * Translation map received from Builder in design mode, keyed by item ID.
   * `WeaverseNextItem.getSnapShot()` overlays these onto the data handed to
   * components, so translations render without mutating the base `_store`.
   */
  translationMap: WeaverseNextTranslationMap = {}
  translationLocale = ''
  translationLanguageId = ''

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
}

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
    // Published / preview reuse has no draft state, so fresh data still wins.
    if (!(existing.isDesignMode || nextIsDesignMode)) {
      existing.setProjectData(page)
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

  let runtime = new WeaverseNextRuntime(config) as StudioBoundRuntime
  runtime.__weaverseNextRequestKey = requestKey
  runtime.__weaverseNextLatestData = page
  registerRuntime(runtime)
  return runtime
}

export function bindWeaverseNextStudioRuntime(runtime: WeaverseNextRuntime) {
  if (!runtime.isDesignMode) {
    return false
  }

  let studio = getRuntimeWindow()?.weaverseStudio
  if (!studio) {
    return false
  }

  let boundRuntime = runtime as StudioBoundRuntime
  if (!boundRuntime.__weaverseNextStudioBound) {
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
