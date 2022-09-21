import type { ElementsMap } from '@weaverse/core'
import * as ProductBox from './product/box'
import * as ProductTitle from './product/title'
import * as ProductPrice from './product/price'
import * as Form from './form'
import * as ProductDescription from './product/description'
import * as ProductAtc from './product/atc'
import * as ProductVariant from './product/variant'
import * as ProductImage from './product/image'
import * as ProductContent from './product/content'
import * as ProductQuantity from './product/quantity'
import * as CustomHTML from './custom-html'
import * as ProductList from '~/elements/product-list'

let elements: ElementsMap = {
  ProductBox: {
    Component: ProductBox.default,
    type: 'product-box',
  },
  ProductContent: {
    Component: ProductContent.default,
    type: 'product.content',
  },
  ProductTitle: {
    Component: ProductTitle.default,
    type: 'product-title',
    defaultCss: ProductTitle.css,
  },
  ProductDescription: {
    Component: ProductDescription.default,
    type: 'product-description',
  },
  ProductPrice: {
    Component: ProductPrice.default,
    type: 'product-price',
  },
  ProductQuantity: {
    Component: ProductQuantity.default,
    type: 'product-quantity',
  },
  ProductAtc: {
    Component: ProductAtc.default,
    type: 'product-atc',
    defaultCss: ProductAtc.css,
  },
  ProductVariant: {
    Component: ProductVariant.default,
    type: 'product-variant',
  },
  ProductImage: {
    Component: ProductImage.default,
    type: 'product-image',
    defaultCss: ProductImage.css,
    permanentCss: ProductImage.permanentCss,
  },
  ProductList: {
    Component: ProductList.default,
    type: 'product-list',
  },
  Form: {
    Component: Form.default,
    type: 'form',
  },
  CustomHTML: {
    Component: CustomHTML.default,
    type: 'custom.html',
    defaultCss: CustomHTML.css,
  },
}
export default elements
