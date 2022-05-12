import React, { forwardRef, useContext } from 'react'
import {ProductProvider} from './context'
import { ProductBoxProps } from '../../type'
import { WeaverseContext } from '@weaverse/react'

export let ProductBox = forwardRef<any, ProductBoxProps>((props, ref) => {
  let weaverseContext = useContext(WeaverseContext)
  console.log('ProductContext', props)
  console.log('weaverseContext', weaverseContext)

  let {children, ...rest} = props
  return <div {...rest} ref={ref} >
    <ProductProvider value={{}}>
      {children}
    </ProductProvider>
  </div>
})
