import type { WeaverseElementMap } from '@weaverse/core'
import {ProductBox} from './product/box'
import {ProductTitle} from './product/title'

let elements: WeaverseElementMap = {
  ProductBox: {
    Component: ProductBox,
    schema: {
      title: 'Product Details',
      type: 'ProductBox',
    }
  },
  ProductTitle: {
    Component: ProductTitle,
    schema: {
      title: 'Product Title',
      type: 'ProductTitle'
    }
  }
}
export default elements
