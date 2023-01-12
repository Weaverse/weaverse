import type { WeaverseElement } from '@weaverse/core'
import * as Button from './Button'
import * as Container from './Container'
import * as Countdown from './Countdown'
import * as Image from './Image'
import * as Layout from './Layout'
import * as Map from './Map'
import * as Text from './Text'
import * as Video from './Video'
// import * as Instagram from './Instagram'
// import * as Accordion from './accordion'
// import * as AccordionWrapper from './accordion/AccordionWrapper'
// import * as AccordionContent from './accordion/AccordionContent'
// import * as Tab from './tab'
// import * as TabContent from './tab/TabContent'
import * as Slideshow from './Slideshow'
import * as Slide from './Slideshow/Slide'

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
