import * as BaseElement from './base'
import * as Button from './button'
import * as Container from './container'
import * as Layout from './layout'
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
  Layout: {
    Component: Layout.default,
    schema: Layout.schema,
  },
  Container: {
    Component: Container.default,
    schema: Container.schema,
  },
}

export default elements
