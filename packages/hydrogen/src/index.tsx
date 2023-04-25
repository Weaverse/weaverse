import { useStudio } from './utils'
import React, { memo, useEffect } from 'react'
import type { WeaverseComponentsType } from './types'
import { WeaverseRoot } from '@weaverse/react'
import type { Weaverse } from '@weaverse/core'
import { createWeaverseHydrogenContext } from './context'
export * from './utils'
export * from './weaverse-loader'
export let WeaverseHydrogenRoot = memo(
  ({
    components,
    data,
  }: {
    components: WeaverseComponentsType
    data: {
      weaverseData: any
      [key: string]: any
    }
  }) => {
    let weaverse = createWeaverseHydrogenContext(data, components)
    useStudio(weaverse)
    useEnsureStitchesWorking(weaverse)
    if (!weaverse?.data) {
      return <div>404</div>
    }
    return <WeaverseRoot context={weaverse} />
  }
)

let useEnsureStitchesWorking = (weaverse: Weaverse) => {
  useEffect(() => {
    let stitchesInstance = weaverse.stitchesInstance
    if (stitchesInstance && !stitchesInstance.sheet?.sheet?.ownerNode) {
      console.warn('stitches instance is not working, re-creating it')
      //this means that the stitches instance is not working
      // we will re-create it
      delete weaverse.stitchesInstance
      weaverse.initStitches({ root: document })
      weaverse.triggerUpdate()
      weaverse.refreshAllItems()
    }
  }, [])
}

// export function useIsHydrated() {
//   const [isHydrated, setHydrated] = useState<boolean>(false)

//   useEffect(() => {
//     setHydrated(true)
//   }, [])

//   return isHydrated
// }
// let NoHydrate = Components.NoHydrate
// let RenderStitchesStyles = memo(({ weaverse }: { weaverse: Weaverse }) => {
//   // let h = useIsHydrated()
//   useEffect(() => {
//     weaverse.stitchesInstance.reset()
//   }, [])
//   return isBrowser ? null : (
//     <NoHydrate
//       id="weaverse-styles"
//       getHTML={() =>
//         `<style id="stitches">${weaverse.stitchesInstance.getCssText()}</style>`
//       }
//     />
//   )
// })
