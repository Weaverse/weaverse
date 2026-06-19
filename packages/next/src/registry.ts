import { Weaverse } from '@weaverse/react'
import { ensureNextItemConstructor } from './item'
import type { WeaverseNextComponent } from './types'

/**
 * Component types already pushed into the element registry. Registration is
 * idempotent by `schema.type`, so callers may pass fresh arrays per request
 * without causing repeated global registry writes.
 */
const registeredComponentTypes = new Set<string>()

/**
 * Register Next adapter components with the shared Weaverse element registry.
 *
 * This mutates global Weaverse runtime state, so callers should run it while
 * creating their app/client wiring, not from a React render body.
 */
export function registerWeaverseNextComponents(
  components: WeaverseNextComponent[]
) {
  ensureNextItemConstructor()

  for (let component of components) {
    let type = component?.schema?.type
    if (type && !registeredComponentTypes.has(type)) {
      Weaverse.registerElement({
        type,
        Component: component.default,
        schema: component.schema,
        loader: component.loader,
      })
      registeredComponentTypes.add(type)
    }
  }
}
