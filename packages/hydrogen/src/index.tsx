import type { Weaverse } from '@weaverse/core'
import { WeaverseRoot } from '@weaverse/react'
import React, { memo } from 'react'
import { createWeaverseHydrogenContext } from './context'
import type { WeaverseComponentsType } from './types'
import { useStudio } from './utils'
export * from './utils'
export * from './weaverse-loader'

export let WeaverseHydrogenRoot = ({
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

  if (!weaverse?.data) {
    return <div>404</div>
  }
  return (
    <>
      <WeaverseRoot context={weaverse} />
      {weaverse.isDesignMode ? null : <StitchesStyle weaverse={weaverse} />}
    </>
  )
}

/**
 * Stitches or CSS-in-JS framework might not working properly with React/Remix defered hydration
 * but we need to make sure that the stitches instance is working
 * temporarily we will render the stitches css manually
 * in some case it might broken on production if we use production URL to our editor
 * therefore we'll encourage to create tailwind style input instead of stitches
 */
let StitchesStyle = memo(
  ({ weaverse }: { weaverse: Weaverse }) => {
    return (
      <style
        id="stitches"
        key={'stitches'}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: weaverse.stitchesInstance?.getCssText() || '',
        }}
      />
    )
  },
  () => true
)

// let useEnsureStitchesWorking = (weaverse: Weaverse) => {
//   useEffect(() => {
//     let stitchesInstance = weaverse.stitchesInstance
//     if (stitchesInstance && !stitchesInstance.sheet?.sheet?.ownerNode) {
//       console.warn('stitches instance is not working, re-creating it')
//       //this means that the stitches instance is not working
//       // we will re-create it
//       // weaverse.stitchesInstance.reset()
//       // weaverse.triggerUpdate()
//       // weaverse.refreshAllItems()
//     }
//   }, [])
// }
