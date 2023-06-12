import { WeaverseRoot } from '@weaverse/react'
import React from 'react'
import { createWeaverseHydrogenContext } from './context'
import { useStudio } from './hooks/use-studio'
import type { WeaverseHydrogenRootProps } from './types'
export * from './fetch'
export * from './loader'
export * from './types'
export * from '@weaverse/react'

export let WeaverseHydrogenRoot = (props: WeaverseHydrogenRootProps) => {
  let { components, data } = props
  let weaverse = createWeaverseHydrogenContext(data, components)
  useStudio(weaverse)

  if (!weaverse?.data) return <div>No Weaverse data!</div>
  return <WeaverseRoot context={weaverse} />
  // return (
  //   <>
  //     <WeaverseRoot context={weaverse} />
  //     {weaverse.isDesignMode ? null : <StitchesStyle weaverse={weaverse} />}
  //   </>
  // )
}

/**
 * Stitches or CSS-in-JS framework might not working properly with React/Remix defered hydration
 * but we need to make sure that the stitches instance is working
 * temporarily we will render the stitches css manually
 * in some case it might broken on production if we use production URL to our editor
 * therefore we'll encourage to create tailwind style input instead of stitches
 */
// let StitchesStyle = memo(
//   ({ weaverse }: { weaverse: Weaverse }) => {
//     return (
//       <style
//         id="stitches"
//         key={'stitches'}
//         suppressHydrationWarning
//         dangerouslySetInnerHTML={{
//           __html: weaverse.stitchesInstance?.getCssText() || '',
//         }}
//       />
//     )
//   },
//   () => true
// )
