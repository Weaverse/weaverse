import type { WeaverseElementMap } from '@weaverse/core'
import {ProductBox} from './product/box'
import {ProductTitle} from './product/title'

let elements: WeaverseElementMap = {
  ProductBox: {
    Component: ProductBox,
    schema: {
      title: 'Product Details',
      parentType: "layout",
      type: 'ProductBox',
      flags: {
        draggable: true,
        resizable: true,
        sortable: true
      }
    }
  },
  ProductTitle: {
    Component: ProductTitle,
    schema: {
      title: 'Product Title',
      parentType: "layout", // TODO
      type: 'ProductTitle'
    }
  }
}
export default elements
