import * as ModalComponents from './_modal'
import { Spinner } from './spinner'
import { Icon } from './_icons'
import { Tooltip } from './tooltip'
import { Slider } from './_slider'
import { Background } from './background'
import { Overlay } from './overlay'
import { Arrows } from './_slider/_arrows'
import { Dots } from './_slider/_dots'
import { ResizePlugin } from './_slider/resize-plugin'
import { AutoplayPlugin } from './_slider/autoplay-plugin'
import Placeholder from './placeholder'

export let Components = {
  Background,
  Icon,
  ModalComponents,
  Overlay,
  Placeholder,
  Spinner,
  Slider,
  Tooltip,
}

export let SliderComponents = {
  Arrows,
  Dots,
  ResizePlugin,
  AutoplayPlugin,
}
