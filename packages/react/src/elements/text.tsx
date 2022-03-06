import * as React from 'react'

export const Text = React.forwardRef((props: any, ref) => {
  let {children, ...rest} = props
  return <span ref={ref} {...rest} contentEditable={true} dangerouslySetInnerHTML={{__html: '123123'}}/>
})

Text.defaultProps = {
  style: {},
  type: 'text',
  tag: 'span'
}

export default Text