import type { WeaverseElement } from '@weaverse/core'
import * as Form from './_form'
import * as CustomHTML from './custom-html'
// import * as ArticleList from '~/elements/article/list'
import * as ArticleBox from '~/elements/article/box'
import * as ArticleTitle from '~/elements/article/title'
import * as ArticleDescription from '~/elements/article/description'
import * as ArticleImage from '~/elements/article/image'
import * as ArticleMeta from '~/elements/article/meta'
// import * as CollectionList from '~/elements/collection/list'
import * as CollectionBox from '~/elements/collection/box'
import * as CollectionTitle from '~/elements/collection/title'
import * as CollectionDescription from '~/elements/collection/description'
import * as CollectionImage from '~/elements/collection/image'
import { productElements } from './_product'
import * as ProductList from './product-list'

let elements: Record<string, WeaverseElement> = {
  ...productElements,
  // ArticleList: {
  //   Component: ArticleList.default,
  //   type: 'article-list',
  //   defaultCss: ArticleList.css,
  //   permanentCss: ArticleList.permanentCss,
  // },
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
    permanentCss: ArticleImage.permanentCss,
  },
  // CollectionList: {
  //   Component: CollectionList.default,
  //   type: 'collection-list',
  //   defaultCss: CollectionList.css,
  //   permanentCss: CollectionList.permanentCss,
  // },
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
    defaultCss: Form.css,
  },
  CustomHTML: {
    Component: CustomHTML.default,
    type: 'custom.html',
    defaultCss: CustomHTML.css,
  },
  ProductList: {
    Component: ProductList.default,
    type: 'product-list',
    defaultCss: ProductList.css,
  },
}
export default elements
