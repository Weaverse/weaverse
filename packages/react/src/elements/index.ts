import type { WeaverseElement } from '@weaverse/core'
import * as Button from './_button'
import * as Container from './_container'
import * as Countdown from './_countdown'
import * as Image from './_image'
import * as Layout from './_layout'
import * as Map from './_map'
import * as Text from './_text'
import * as Video from './_video'
// import * as Instagram from './Instagram'
// import * as Accordion from './accordion'
// import * as AccordionWrapper from './accordion/AccordionWrapper'
// import * as AccordionContent from './accordion/AccordionContent'
// import * as Tab from './tab'
// import * as TabContent from './tab/TabContent'
import * as Slideshow from './_slideshow'
import * as Slide from './_slideshow/_slide'

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
  // Instagram: {
  //   Component: Instagram.default,
  //   type: 'instagram',
  //   defaultCss: Instagram.css,
  //   permanentCss: Instagram.permanentCss,
  // },
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
  Video: {
    Component: Video.default,
    type: 'video',
    defaultCss: Video.css,
  },
  // Accordion: {
  //   Component: Accordion.default,
  //   type: 'accordion',
  //   defaultCss: Accordion.css,
  // },
  // AccordionWrapper: {
  //   Component: AccordionWrapper.default,
  //   type: 'accordion.wrapper',
  //   defaultCss: AccordionWrapper.css,
  // },
  // AccordionContent: {
  //   Component: AccordionContent.default,
  //   type: 'accordion.content',
  //   defaultCss: AccordionContent.css,
  // },
  // Tab: {
  //   Component: Tab.default,
  //   type: 'tab',
  //   defaultCss: Tab.css,
  // },
  // TabContent: {
  //   Component: TabContent.default,
  //   type: 'tab.content',
  //   defaultCss: TabContent.css,
  // },
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
