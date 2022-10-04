import React, { forwardRef, useContext } from 'react'
import type { ElementCSS} from '@weaverse/react'
import { WeaverseContext } from '@weaverse/react'
import { ProductContext } from '~/elements/context'

let ProductDescription = forwardRef<HTMLDivElement>((props, ref) => {
  let { ...rest } = props
  let { product } = useContext(ProductContext)
  let { ssrMode } = useContext(WeaverseContext)
  return (
    <div ref={ref} {...rest}>
      {ssrMode
        ? `{{ wv_product.description }}`
        : product.body_html || product.description}
    </div>
  )
})

export let css: ElementCSS = {
  '@desktop': {},
}

ProductDescription.defaultProps = {}

export default ProductDescription
