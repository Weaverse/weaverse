import { Weaverse } from '@weaverse/react'
import { ensureNextItemConstructor } from './item'
import { buildWeaverseNextRequestInfo } from './request-info'
import { createWeaverseNextThemeSettingsStore } from './theme-settings-store'
import type {
  WeaverseNextClient,
  WeaverseNextLoaderData,
  WeaverseNextPageData,
  WeaverseNextRequestInfo,
  WeaverseNextRuntimeConfig,
  WeaverseNextRuntimeInternal,
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
  translationMap: Record<string, unknown> = {}
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

    this.internal = {
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
    }
  }

  extractTranslationSidecar = () => undefined
  setTranslationSidecar = (
    map: Record<string, unknown> = {},
    locale = '',
    languageId = ''
  ) => {
    this.translationMap = map
    this.translationLocale = locale
    this.translationLanguageId = languageId
  }
  updateTranslation = () => undefined
  getTranslationChanges = () => undefined
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
