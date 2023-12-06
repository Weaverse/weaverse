// create a pixel Component that will be used to track page views
// /api/public/weaverse-pixel?projectId=xxx&pageId=xxx
// The pixel will be removed from the DOM after it is loaded

import { memo } from 'react'

import type { WeaverseHydrogen } from './index'
import { useStudio } from '~/hooks/use-studio'
import { usePixel } from '~/hooks/use-pixel'

export let WeaverseEffect = memo(
  ({ context }: { context: WeaverseHydrogen }) => {
    useStudio(context)
    usePixel(context)
    return null
  },
)
