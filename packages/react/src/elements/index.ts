import BaseElement from './base'
import Button from './button'
import Text from './text'

const elements: {
  [key: string]: typeof BaseElement
} = {
  Button,
  BaseElement,
  Text,
}
export default elements
