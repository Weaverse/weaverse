import { WeaverseElementSchema } from '@weaverse/core'
import React from 'react'

let Image = React.forwardRef<HTMLImageElement, any>(function Image(props, ref) {
  let { src, alt, children, ...rest } = props
  return <img ref={ref} {...rest} alt={alt} src={src} />
})

Image.defaultProps = {
  src: 'https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png',
  alt: 'weaverse image element',
}

export let schema: WeaverseElementSchema = {
  settings: [],
  type: 'image',
  title: 'Image',
  data: {
    css: {
      '@desktop': {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },
  },
}
export default Image
