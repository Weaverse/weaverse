import { WeaverseElementMap } from '@weaverse/core'
import * as Button from './button'
import * as Container from './container'
import * as Countdown from './countdown'
import * as Image from './image'
import * as Layout from './layout'
import * as Map from './map'
import * as Text from './text'
import * as Video from './video'
import * as Instagram from './instagram'

const elements: WeaverseElementMap = {
  Countdown: {
    Component: Countdown.default,
    type: 'countdown',
  },
  Button: {
    Component: Button.default,
    type: 'button',
  },
  Container: {
    Component: Container.default,
    type: 'container',
  },
  Image: {
    Component: Image.default,
    type: 'image',
  },
  Instagram: {
    Component: Instagram.default,
    type: 'instagram',
  },
  Layout: {
    Component: Layout.default,
    type: 'layout',
  },
  Map: {
    Component: Map.default,
    type: 'map',
  },
  Text: {
    Component: Text.default,
    type: 'text',
  },
  Video: {
    Component: Video.default,
    type: 'video',
  },
}

export default elements
