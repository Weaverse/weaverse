import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { TODO } from '@weaverse/core'
import { WeaverseContext } from '../context'

type InstagramItem = {
  id: string
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM'
  media_url: string
  caption: string
}

const Instagram = forwardRef<HTMLDivElement, TODO>((props, ref) => {
  const { stitchesInstance } = useContext(WeaverseContext)
  const { token, numberOfImages, imagesPerRow, className, ...rest } = props
  const [media, setMedia] = useState<InstagramItem[]>([])
  const [error, setError] = useState(null)
  useEffect(() => {
    const url = `https://graph.instagram.com/me/media?fields=id,media_type,caption,media_url&access_token=${token}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if ('error' in res) {
          setError(res)
        } else {
          setError(null)
          setMedia(res.data)
        }
      })
      .catch(console.error)
  }, [token])
  let itemWidth = 0
  if (ref && 'current' in ref) {
    itemWidth = (ref.current?.offsetWidth || 0) / imagesPerRow
  }

  const css = {
    gridTemplateColumns: `repeat(${imagesPerRow || 1}, 1fr)`,
    '& .wv-instagram-item': {
      height: itemWidth,
    },
  }
  const { className: instagramClass = '' } = stitchesInstance.css(css)()

  return (
    <div className={`${className} ${instagramClass}`} ref={ref} {...rest}>
      {!token
        ? 'Token is empty'
        : error
        ? 'Token was expired or invalid'
        : media?.slice(0, numberOfImages).map((item, key) => {
            return (
              <div key={key} className="wv-instagram-item">
                <img
                  width="100%"
                  height="100%"
                  alt={item.caption}
                  src={item.media_url}
                />
              </div>
            )
          })}
    </div>
  )
})

Instagram.defaultProps = {
  token: '',
  numberOfImages: 12,
  imagesPerRow: 4,
  css: {
    '@desktop': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      '& .wv-instagram-item': {
        width: '100%',
        height: '100%',
        '& img': {
          objectFit: 'cover',
        },
      },
    },
  },
}

export default Instagram
