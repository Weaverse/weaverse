import React, { forwardRef, useContext } from 'react'
import type { ThirdPartyProps } from '~/types'
import type { ElementCSS } from '@weaverse/react'
import { Components } from '~/components'
import { WeaverseContext } from '@weaverse/react'

let NoHydrate = Components.NoHydrate
let Placeholder = Components.Placeholder
let ThirdParty = forwardRef<HTMLDivElement, ThirdPartyProps>((props, ref) => {
  const { snippet_code, information, placeholder, ...rest } = props
  const id = rest['data-wv-id'] as string

  const { isDesignMode } = useContext(WeaverseContext)

  if (isDesignMode) {
    return (
      <div ref={ref} {...rest}>
        <Placeholder element={placeholder.name}>
          {placeholder.content}
        </Placeholder>
      </div>
    )
  }

  return (
    <div ref={ref} {...rest}>
      <NoHydrate id={id} getHTML={() => snippet_code} />
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {
    '> *': {
      pointerEvents: 'var(--pointer-events, unset)',
    },
  },
}

export default ThirdParty
