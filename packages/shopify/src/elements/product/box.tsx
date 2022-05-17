import React, { forwardRef, useContext } from 'react'
import { ProductProvider } from './context'
import { ProductBoxProps } from '../../type'
import { WeaverseContext } from '@weaverse/react'

export let ProductBox = forwardRef<any, ProductBoxProps>((props, ref) => {
  let weaverseContext = useContext(WeaverseContext)
  // @ts-ignore
  let product = window.weaverseShopifyProducts[props.productId]

  let { children, productId, ...rest } = props
  return (
    <div {...rest} ref={ref}>
      123
      {product && product.title}
      <ProductProvider value={{}}>{children}</ProductProvider>
    </div>
  )
})
