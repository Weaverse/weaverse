import type {
  WeaverseNextClient,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextLoaderData,
  WeaverseNextRequestContext,
} from './types'
import { generateDataFromSchema } from './utils'

export interface RunComponentLoadersArgs {
  client: WeaverseNextClient
  commerce?: WeaverseNextCommerceContext
  context?: WeaverseNextRequestContext
  /** Page payload to walk; defaults to `client.data`. */
  data?: WeaverseNextLoaderData | null
}

function isItemNode(node: unknown): node is WeaverseNextComponentData {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof (node as WeaverseNextComponentData).type === 'string'
  )
}

function cloneItem(item: WeaverseNextComponentData): WeaverseNextComponentData {
  return {
    ...item,
    children: Array.isArray(item.children)
      ? item.children.map((child) =>
          isItemNode(child) ? cloneItem(child) : { ...child }
        )
      : item.children,
  }
}

/**
 * Walk a serialized page tree and run each registered component's `loader`,
 * attaching the result to the item as `loaderData`.
 *
 * Loaders receive explicit `commerce.storefront` (and `weaverse.storefront` as
 * a compatibility alias via the client). Children are walked recursively when
 * they are inline item objects; flat `items` arrays are covered by the
 * top-level walk.
 *
 * @returns a cloned `data` object with `loaderData` attached to cloned items.
 */
export async function runWeaverseComponentLoaders(
  args: RunComponentLoadersArgs
): Promise<WeaverseNextLoaderData | null> {
  let { client, context, commerce } = args
  let sourceData = args.data ?? client.data
  if (!sourceData) {
    return null
  }
  if (!sourceData.page.items.length) {
    return sourceData
  }

  let data: WeaverseNextLoaderData = {
    ...sourceData,
    page: {
      ...sourceData.page,
      items: sourceData.page.items.map(cloneItem),
    },
  }
  let items = data.page.items

  let componentMap = new Map<string, WeaverseNextComponent>()
  for (let component of client.components) {
    if (component?.schema?.type) {
      componentMap.set(component.schema.type, component)
    }
  }

  let visited = new Set<string>()
  let resolvedContext = context ?? client.requestContext
  let resolvedCommerce = commerce ?? client.commerce

  async function walk(nodes: WeaverseNextComponentData[]) {
    for (let item of nodes) {
      if (!item || visited.has(item.id)) {
        continue
      }
      visited.add(item.id)

      let component = componentMap.get(item.type)
      if (component?.loader) {
        try {
          item.loaderData = await component.loader({
            data: { ...generateDataFromSchema(component.schema), ...item.data },
            weaverse: client,
            context: resolvedContext,
            commerce: resolvedCommerce,
          })
        } catch (error) {
          console.warn('❌ Item loader run failed.', item.type, item.id, error)
        }
      }

      let children = item.children
      if (Array.isArray(children)) {
        let inlineChildren = children.filter(
          isItemNode
        ) as WeaverseNextComponentData[]
        if (inlineChildren.length) {
          await walk(inlineChildren)
        }
      }
    }
  }

  await walk(items)
  return data
}
