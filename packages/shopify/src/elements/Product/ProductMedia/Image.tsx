import React from 'react'
import type { ProductImageProps } from '~/types'

export function Image(props: ProductImageProps) {
  let { image, width, className, onLoad, onClick } = props
  return (
    <>
      <img
        className={className}
        src={`${image.src}&crop=center&width=${width}`}
        srcSet={`
          ${image.src}&width=550 550w,
          ${image.src}&width=1100 1100w,
          ${image.src}&width=1445 1445w,
          ${image.src}&width=1680 1680w,
          ${image.src}&width=2048 2048w,
          ${image.src} 2256w
        `}
        sizes="(min-width: 1200px) calc((1200px - 10rem) / 2), (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)"
        loading="lazy"
        width={image.width}
        height={image.height}
        alt={image.alt || ''}
        onLoad={onLoad}
        onClick={onClick}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img src="${image.src}&width=${width}" alt="${image.alt}"/>`,
        }}
      />
    </>
  )
}
