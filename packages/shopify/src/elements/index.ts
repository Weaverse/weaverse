import type { WeaverseElementMap } from '@weaverse/core'
import {ProductBox} from './product/box'

let elements: WeaverseElementMap = {
  ProductBox: {
    Component: ProductBox,
    schema: {
      title: 'Product Details',
      type: 'ProductBox',
    }
  }
}
export default elements
