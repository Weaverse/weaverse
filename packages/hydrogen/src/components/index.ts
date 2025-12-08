import type { HydrogenComponent } from '~/types'
import MainComponent, { schema as mainSchema } from './main'

export let defaultComponents: HydrogenComponent[] = [
  {
    default: MainComponent,
    schema: mainSchema,
  },
]
