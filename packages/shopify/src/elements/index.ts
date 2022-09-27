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
import * as ArticleList from '~/elements/article/list'
import * as ArticleBox from '~/elements/article/box'
import * as ArticleTitle from '~/elements/article/title'
import * as ArticleContent from '~/elements/article/content'
import * as ArticleImage from '~/elements/article/image'
import * as ArticleMeta from '~/elements/article/meta'

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
    permanentCss: ProductList.permanentCss,
  },
  ArticleList: {
    Component: ArticleList.default,
    type: 'article-list',
    defaultCss: ArticleList.css,
    permanentCss: ArticleList.permanentCss,
  },
  ArticleBox: {
    Component: ArticleBox.default,
    type: 'article-box',
    defaultCss: ArticleBox.css,
    permanentCss: ArticleBox.permanentCss,
  },
  ArticleTitle: {
    Component: ArticleTitle.default,
    type: 'article-title',
    defaultCss: ArticleTitle.css,
  },
  ArticleContent: {
    Component: ArticleContent.default,
    type: 'article-content',
    defaultCss: ArticleContent.css,
  },
  ArticleMeta: {
    Component: ArticleMeta.default,
    type: 'article-meta',
    defaultCss: ArticleMeta.css,
  },
  ArticleImage: {
    Component: ArticleImage.default,
    type: 'article-image',
    defaultCss: ArticleImage.css,
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
