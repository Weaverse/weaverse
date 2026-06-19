import type { ElementData } from '@weaverse/react'
import { Weaverse, WeaverseItemStore } from '@weaverse/react'
import type { WeaverseNextComponentData } from './types'
import { generateDataFromSchema } from './utils'

/**
 * Item store that flattens the serialized item's nested `data` field onto the
 * store and seeds schema defaults — same shape Hydrogen produces, so the
 * shared `@weaverse/react` renderer can spread props at the top level.
 */
export class WeaverseNextItem extends WeaverseItemStore {
  constructor(initialData: WeaverseNextComponentData, weaverse: Weaverse) {
    super(initialData as ElementData, weaverse)
    let { data, ...rest } = initialData
    let schemaData = generateDataFromSchema(this.Element?.schema)
    Object.assign(this._store, schemaData, data, rest)
  }
}

/**
 * Register the Next item constructor globally. Idempotent: calling it more than
 * once is safe. Invoked by the renderer before it builds a Weaverse instance.
 */
export function ensureNextItemConstructor() {
  Weaverse.ItemConstructor = WeaverseNextItem
}
