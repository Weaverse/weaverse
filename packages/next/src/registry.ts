import { Weaverse } from '@weaverse/react'
import { ensureNextItemConstructor } from './item'
import type { WeaverseNextComponent } from './types'

/**
 * Component lists already pushed into the element registry. Registration is
 * idempotent, but walking the full list allocates on every call — theme
 * component arrays are module-level constants, so register each identity once.
 */
const registeredComponentLists = new WeakSet<WeaverseNextComponent[]>()

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

  if (registeredComponentLists.has(components)) {
    return
  }
  for (let component of components) {
    if (component?.schema?.type) {
      Weaverse.registerElement({
        type: component.schema.type,
        Component: component.default,
        schema: component.schema,
        loader: component.loader,
      })
    }
  }
  registeredComponentLists.add(components)
}
