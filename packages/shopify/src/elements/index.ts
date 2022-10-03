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
import * as ArticleDescription from '~/elements/article/description'
import * as ArticleImage from '~/elements/article/image'
import * as ArticleMeta from '~/elements/article/meta'

import * as CollectionList from '~/elements/collection/list'
import * as CollectionBox from '~/elements/collection/box'
import * as CollectionTitle from '~/elements/collection/title'
import * as CollectionDescription from '~/elements/collection/description'
import * as CollectionImage from '~/elements/collection/image'

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
  ArticleDescription: {
    Component: ArticleDescription.default,
    type: 'article-description',
    defaultCss: ArticleDescription.css,
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
  CollectionList: {
    Component: CollectionList.default,
    type: 'collection-list',
    defaultCss: CollectionList.css,
    permanentCss: CollectionList.permanentCss,
  },
  CollectionBox: {
    Component: CollectionBox.default,
    type: 'collection-box',
    defaultCss: CollectionBox.css,
    permanentCss: CollectionBox.permanentCss,
  },
  CollectionTitle: {
    Component: CollectionTitle.default,
    type: 'collection-title',
    defaultCss: CollectionTitle.css,
  },
  CollectionDescription: {
    Component: CollectionDescription.default,
    type: 'collection-description',
    defaultCss: CollectionDescription.css,
  },
  CollectionImage: {
    Component: CollectionImage.default,
    type: 'collection-image',
    defaultCss: CollectionImage.css,
    permanentCss: CollectionImage.permanentCss,
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
