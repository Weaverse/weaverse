import { useStudio } from './utils'
import React, { useEffect, useState } from 'react'
import type { WeaverseComponentsType } from './types'
import { WeaverseRoot } from '@weaverse/react'
import type { Weaverse } from '@weaverse/core'
import { createWeaverseHydrogenContext } from './context'
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
      <RenderStitchesStyles weaverse={weaverse} />
    </>
  )
}

export function useIsHydrated() {
  const [isHydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return isHydrated
}
let RenderStitchesStyles = ({ weaverse }: { weaverse: Weaverse }) => {
  let h = useIsHydrated()
  return (
    <style
      data-hydrated={h}
      id="stitches"
      dangerouslySetInnerHTML={{
        __html: weaverse.stitchesInstance.getCssText(),
      }}
      suppressHydrationWarning
    />
  )
}
