import type { ElementsMap } from '@weaverse/core'
import * as ProductBox from './product/box'
import * as ProductTitle from './product/title'
import * as ProductPrice from './product/price'
import * as Form from './form'
import * as ProductDescription from './product/description'
import * as ProductAtc from './product/atc'
import * as ProductVariant from './product/variant'
import * as ProductImage from '~/elements/product/image'
import * as ProductContent from '~/elements/product/content'

let elements: ElementsMap = {
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
  ProductContent: {
    Component: ProductContent.default,
    type: 'product.content',
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
  ProductDescription: {
    Component: ProductDescription.default,
    type: 'product-description',
  },
  ProductPrice: {
    Component: ProductPrice.default,
    type: 'product-price',
  },
  ProductAtc: {
    Component: ProductAtc.default,
    type: 'product-atc',
  },
  ProductVariant: {
    Component: ProductVariant.default,
    type: 'product-variant',
  },
  ProductImage: {
    Component: ProductImage.default,
    type: 'product-image',
  },
  Form: {
    Component: Form.default,
    type: 'form',
  },
}
export default elements
