import type { WeaverseElement } from '@weaverse/react'
import * as ArticleList from '~/elements/article-list'
import * as CollectionList from '~/elements/collection-list'
import * as CustomHTML from './custom-html'
import * as Hotspots from './hotspots'
import * as Form from './form'
import { productElements } from './product'
import * as ProductList from './product-list'
import * as AppBlock from './app-block'
import * as Button from './button'
import * as Container from './container'
import * as Countdown from './countdown'
import * as Image from './image'
import * as Layout from './layout'
import * as Map from './map'
import * as Text from './text'
import * as ScrollingText from './scrolling-text'
import * as Video from './video'
import * as Instagram from './instagram'
import * as Slideshow from './slideshow'
import * as Slide from './slideshow/slide'

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
  AppBlock: {
    Component: AppBlock.default,
    type: 'app-block',
    defaultCss: AppBlock.css,
  },
  Countdown: {
    Component: Countdown.default,
    type: 'countdown',
    defaultCss: Countdown.css,
  },
  Button: {
    Component: Button.default,
    type: 'button',
    defaultCss: Button.css,
  },
  Container: {
    Component: Container.default,
    type: 'container',
    defaultCss: Container.css,
  },
  Image: {
    Component: Image.default,
    type: 'image',
    defaultCss: Image.css,
  },
  Instagram: {
    Component: Instagram.default,
    type: 'instagram',
    defaultCss: Instagram.css,
    permanentCss: Instagram.permanentCss,
  },
  Layout: {
    Component: Layout.default,
    type: 'layout',
    defaultCss: Layout.css,
  },
  Map: {
    Component: Map.default,
    type: 'map',
    defaultCss: Map.css,
  },
  Text: {
    Component: Text.default,
    type: 'text',
    defaultCss: Text.css,
  },
  ScrollingText: {
    Component: ScrollingText.default,
    type: 'scrolling-text',
    defaultCss: ScrollingText.css,
  },
  Video: {
    Component: Video.default,
    type: 'video',
    defaultCss: Video.css,
  },
  Slideshow: {
    Component: Slideshow.default,
    type: 'slideshow',
    defaultCss: Slideshow.css,
  },
  Slide: {
    Component: Slide.default,
    type: 'slide',
    defaultCss: Slide.css,
  },
}

export default elements
