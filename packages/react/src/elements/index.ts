import type { ElementsMap } from '@weaverse/core'
import * as Button from './button'
import * as Container from './container'
import * as Countdown from './countdown'
import * as Image from './image'
import * as Layout from './layout'
import * as Map from './map'
import * as Text from './text'
import * as Video from './video'
import * as Instagram from './instagram'
import * as Accordion from './accordion'
import * as AccordionWrapper from './accordion/AccordionWrapper'
import * as AccordionContent from './accordion/AccordionContent'
import * as Tab from './tab'
import * as TabContent from './tab/TabContent'
import * as Slider from './slider'
import * as SliderContent from './slider/SliderContent'
import Placeholder from '~/elements/shared/Placeholder'

export const SharedComponents = {
  Placeholder,
}
export const Elements: ElementsMap = {
  Countdown: {
    Component: Countdown.default,
    type: 'countdown',
    defaultCss: Countdown.css,
  },
  Button: {
    Component: Button.default,
    type: 'button',
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
  Video: {
    Component: Video.default,
    type: 'video',
    defaultCss: Video.css,
  },
  Accordion: {
    Component: Accordion.default,
    type: 'accordion',
    defaultCss: Accordion.css,
  },
  AccordionWrapper: {
    Component: AccordionWrapper.default,
    type: 'accordion.wrapper',
    defaultCss: AccordionWrapper.css,
  },
  AccordionContent: {
    Component: AccordionContent.default,
    type: 'accordion.content',
    defaultCss: AccordionContent.css,
  },
  Tab: {
    Component: Tab.default,
    type: 'tab',
    defaultCss: Tab.css,
  },
  TabContent: {
    Component: TabContent.default,
    type: 'tab.content',
    defaultCss: TabContent.css,
  },
  Slider: {
    Component: Slider.default,
    type: 'slider',
    defaultCss: Slider.css,
  },
  SliderContent: {
    Component: SliderContent.default,
    type: 'slider.content',
    defaultCss: SliderContent.css,
  },
}
