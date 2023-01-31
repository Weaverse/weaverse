import * as ModalComponents from './modal'
import { Spinner } from './spinner'
import { Icon } from './icons'
import { Tooltip } from './tooltip'
import { Slider } from './slider'
import { Background } from './background'
import { Overlay } from './overlay'
import { Arrows } from './slider/arrows'
import { Dots } from './slider/dots'
import { ResizePlugin } from './slider/resize-plugin'
import { AutoplayPlugin } from './slider/autoplay-plugin'
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
