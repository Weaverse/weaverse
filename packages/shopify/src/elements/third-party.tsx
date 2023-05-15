import React, { forwardRef, useContext } from 'react'
import type { ThirdPartyProps } from '~/types'
import { NoHydrate } from '@weaverse/react/src/components/no-hydrate'
import { WeaverseContext } from '@weaverse/react'
import Placeholder from '@weaverse/react/src/components/placeholder'

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

export default ThirdParty
