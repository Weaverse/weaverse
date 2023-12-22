import { memo } from 'react'
import { useStudio } from '~/hooks/use-studio'
import type { WeaverseHydrogen } from './index'

export let WeaverseEffect = memo(
  ({ context }: { context: WeaverseHydrogen }) => {
    useStudio(context)
    return null
  },
)
