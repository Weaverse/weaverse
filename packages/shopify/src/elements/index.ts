import type { WeaverseElement } from '@weaverse/core'
import * as ArticleList from '~/elements/article-list'
import * as CollectionList from '~/elements/collection-list'
import * as CustomHTML from './custom-html'
import * as Hotspots from './hotspots'
import * as Form from './form'
import { productElements } from './product'
import * as ProductList from './product-list'

let elements: Record<string, WeaverseElement> = {
  ...productElements,
  ArticleList: {
    Component: ArticleList.default,
    type: 'article-list',
    defaultCss: ArticleList.css,
  },
  CollectionList: {
    Component: CollectionList.default,
    type: 'collection-list',
    defaultCss: CollectionList.css,
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
  Hotspots: {
    Component: Hotspots.default,
    type: 'hotspots',
    defaultCss: Hotspots.css,
  },
  ProductList: {
    Component: ProductList.default,
    type: 'product-list',
    defaultCss: ProductList.css,
  },
}

export default elements
