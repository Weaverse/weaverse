import { Weaverse } from '@weaverse/react'
import { ensureNextItemConstructor } from './item'
import { defaultMainComponent } from './main'
import type { WeaverseNextComponent } from './types'

const MAIN_TYPE = 'main'

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
 *
 * A default `main` root component is always registered first so consumers don't
 * have to register one for basic page-tree rendering. If the consumer registers
 * their own `main`, that one is preferred: we only prepend the default when the
 * provided components don't already include a `main`, so a user-provided `main`
 * never collides with (or is shadowed by) the default.
 */
export function registerWeaverseNextComponents(
  components: WeaverseNextComponent[]
) {
  ensureNextItemConstructor()

  let hasUserMain = components.some(
    (component) => component.schema?.type === MAIN_TYPE
  )
  let effectiveComponents = hasUserMain
    ? components
    : [defaultMainComponent, ...components]

  for (let component of effectiveComponents) {
    let type = component.schema.type
    let element = {
      type,
      Component: component.default,
      schema: component.schema,
      loader: component.loader,
    }

    if (type === MAIN_TYPE && hasUserMain) {
      // `main` is the only built-in default. If a consumer registers their own
      // root component after the default was already installed by another
      // client/test/request, prefer the consumer version by replacing the global
      // registry entry explicitly.
      Weaverse.elementRegistry.set(type, element)
      registeredComponentTypes.add(type)
      continue
    }

    if (type && !registeredComponentTypes.has(type)) {
      Weaverse.registerElement(element)
      registeredComponentTypes.add(type)
    }
  }
}
