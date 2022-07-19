import type { WeaverseElementMap } from '@weaverse/core'
import * as ProductBox from './product/box'
import * as ProductTitle from './product/title'
import * as Form from './form'

let elements: WeaverseElementMap = {
  ProductBox: {
    Component: ProductBox.default,
    type: 'product-box',
    // schema: {
    //   title: 'Product Details',
    //   parentType: 'layout',
    //   type: 'ProductBox',
    //   flags: {
    //     draggable: true,
    //     resizable: true,
    //     sortable: true,
    //   },
    // },
  },
  ProductTitle: {
    Component: ProductTitle.default,
    type: 'product-title',
    // schema: {
    //   title: 'Product Title',
    //   parentType: 'layout', // TODO
    //   type: 'ProductTitle',
    // },
  },
  Form: {
    Component: Form.default,
    type: 'form',
  },
}
export default elements
