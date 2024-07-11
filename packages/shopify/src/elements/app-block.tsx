import type { ElementCSS, WeaverseElementProps } from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import React, { forwardRef, useContext } from 'react'

import { Components } from '~/components'

let { Placeholder, NoHydrate } = Components

export let AppBlock = forwardRef<HTMLDivElement, WeaverseElementProps>(
  (props, ref) => {
    let id = props['data-wv-id']!
    let { isDesignMode } = useContext(WeaverseContext)
    if (isDesignMode) {
      return (
        <div ref={ref} {...props}>
          <Placeholder element="App Block">
            Add an App Block inside Shopify Theme Customizer to show here.
          </Placeholder>
        </div>
      )
    }
    return (
      <div ref={ref} {...props}>
        <NoHydrate
          id={id}
          getHTML={() => `
          {%- unless app_block_index -%}
            {%- assign app_block_index = 0 -%}
          {%- endunless -%}
          {%- assign block = section.blocks[app_block_index] -%}
          {%- if block -%}
            {%- case block.type -%}
              {%- when '@app' -%}
                {%- render block -%}
                {%- assign app_block_index = app_block_index | plus: 1 -%}
            {%- endcase -%}
          {%- endif -%}
        `}
        />
      </div>
    )
  },
)

export let css: ElementCSS = {
  '@desktop': {
    '> *': {
      pointerEvents: 'var(--pointer-events, unset)',
    },
  },
}

AppBlock.defaultProps = {}

export default AppBlock
