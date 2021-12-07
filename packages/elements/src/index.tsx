import Button from './components/button'
import BaseElement from './components/base'
import {stitches as s, ThemeContext as C, ThemeProvider as P} from './theme'

const elements = {
	Button,
	BaseElement
}
export const ThemeContext = C
export const ThemeProvider = P
export const stitches = s
export default elements