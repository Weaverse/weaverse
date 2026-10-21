import type { HydrogenComponent } from '../types'
import MainComponent, { schema as mainSchema } from './main'

/**
 * Built-in components required to render the root of every Weaverse page.
 *
 * @category Components
 */
export let defaultComponents: HydrogenComponent[] = [
  {
    default: MainComponent,
    schema: mainSchema,
  },
]
