import { WeaverseElementSchema } from '@weaverse/core'
import React from 'react'

let Image = React.forwardRef<HTMLImageElement, any>(function Image(props, ref) {
  let { src, alt, children, ...rest } = props
  return <img ref={ref} {...rest} alt={alt} src={src} />
})

Image.defaultProps = {
  src: 'https://ucarecdn.com/1cdc9d39-ca62-492e-8ec7-f1a86b241a90/',
  alt: 'weaverse image element',
}

export let schema: WeaverseElementSchema = {
  settings: [],
  type: 'image',
  parentType: "layout",
  title: 'Image',
  data: {
    css: {
      '@desktop': {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
      '@mobile': {
        display: 'block'
      }
    },
  },
  flags: {
    resizable: true,
    draggable: true,
    sortable: true,
  }
}
export default Image
