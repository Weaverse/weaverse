import * as React from 'react'

export const Text = React.forwardRef((props: any, ref) => {
  let {children, value, ...rest} = props
  return <span ref={ref} {...rest} contentEditable={true} dangerouslySetInnerHTML={{__html: value}}/>
})

Text.defaultProps = {
  value: 'sample text',
  tag: 'span'
}

export let schema = {
  type: 'text',
  inspectors: [{
    binding: 'data',
    key: 'value',
    componentType: 'textarea'
  },
    {
      binding: 'style',
      key: 'color',
      componentType: 'color'
    }
  ]
}
export default Text