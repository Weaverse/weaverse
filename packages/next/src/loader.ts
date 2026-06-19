import type {
  WeaverseNextClient,
  WeaverseNextCommerceContext,
  WeaverseNextComponent,
  WeaverseNextComponentData,
  WeaverseNextLoaderData,
  WeaverseNextRequestContext,
} from './types'

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

/**
 * Walk a serialized page tree and run each registered component's `loader`,
 * attaching the result to the item as `loaderData`.
 *
 * Loaders receive explicit `commerce.storefront` (and `weaverse.storefront` as
 * a compatibility alias via the client). Children are walked recursively when
 * they are inline item objects; flat `items` arrays are covered by the
 * top-level walk.
 *
 * @returns the same `data` object (mutated in place) for convenience.
 */
export async function runWeaverseComponentLoaders(
  args: RunComponentLoadersArgs
): Promise<WeaverseNextLoaderData | null> {
  let { client, context, commerce } = args
  let data = args.data ?? client.data
  let items = data?.page?.items
  if (!items?.length) {
    return data
  }

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
        item.loaderData = await component.loader({
          data: item.data ?? {},
          weaverse: client,
          context: resolvedContext,
          commerce: resolvedCommerce,
        })
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
