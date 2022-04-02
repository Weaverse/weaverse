import * as BaseElement from './base'
import * as Button from './button'
import * as Flex from './flex'
import * as Grid from './grid'
import * as Text from './text'
import { WeaverseElementMap } from '@weaverse/core'

const elements: WeaverseElementMap = {
  Button: {
    Component: Button.default,
    schema: Button.schema,
  },
  BaseElement: {
    Component: BaseElement.default,
    schema: BaseElement.schema,
  },
  Text: {
    Component: Text.default,
    schema: Text.schema,
  },
  Grid: {
    Component: Grid.default,
    schema: Grid.schema,
  },
  Flex: {
    Component: Flex.default,
    schema: Flex.schema,
  },
}

export default elements
