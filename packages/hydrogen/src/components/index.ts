import type { WeaverseComponent } from '../types'
import MainComponent, { schema as mainSchema } from './main'

/** Built-in components required to render the root of every Weaverse page. */
export let defaultComponents: WeaverseComponent[] = [
  {
    default: MainComponent,
    schema: mainSchema,
  },
]
