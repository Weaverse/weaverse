import React from 'react'
import { ImageElementProps } from '../types'

let Image = React.forwardRef<HTMLDivElement, ImageElementProps>(
  (props, ref) => {
    let { src, alt, ...rest } = props
    return (
      <div ref={ref} {...rest}>
        <img alt={alt} src={src} />
      </div>
    )
  }
)

Image.defaultProps = {
  src: 'https://ucarecdn.com/1cdc9d39-ca62-492e-8ec7-f1a86b241a90/',
  alt: 'weaverse image element',
  css: {
    '@desktop': {
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
  },
}

export default Image
