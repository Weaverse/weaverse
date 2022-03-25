import React from 'react'

let Image = React.forwardRef<HTMLImageElement, any>(function Image(props, ref) {
  return <img ref={ref} src={'https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png'} />
})

Image.defaultProps = {}

export let schema = {
  type: 'image'
}
export default Image