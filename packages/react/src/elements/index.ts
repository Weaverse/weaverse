import type { WeaverseElement } from '@weaverse/core'
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

export const Elements: Record<string, WeaverseElement> = {
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
