import { memo } from 'react'
import { usePixel } from '~/hooks/use-pixel'
import { useStudio } from '~/hooks/use-studio'
import type { WeaverseHydrogen } from './index'

/*
  Create a pixel component that is used to track page views.
  The pixel will be removed from the DOM after it is loaded.
  API: /api/public/weaverse-pixel?projectId=xxx&pageId=xxx
*/

export let WeaverseEffect = memo(
  ({ context }: { context: WeaverseHydrogen }) => {
    useStudio(context)
    usePixel(context)
    return null
  },
)
