import type { ElementCSS } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'

import { Components } from '~/components'
import type { ThirdPartyProps } from '~/types'

let NoHydrate = Components.NoHydrate
let Placeholder = Components.Placeholder

let ThirdParty = forwardRef<HTMLDivElement, ThirdPartyProps>((props, ref) => {
  let { snippet_code, information, placeholder, ...rest } = props
  let id = rest['data-wv-id'] as string

  let { isDesignMode } = useContext(WeaverseContext)

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
