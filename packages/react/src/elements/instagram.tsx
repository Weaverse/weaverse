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
  useEffect(() => {
    const url = `https://graph.instagram.com/me/media?fields=id,media_type,caption,media_url&access_token=${token}`
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setMedia(res.data)
      })
  }, [token])
  const css = {
    gridTemplateColumns: `repeat(${imagesPerRow[0] || 1}, 1fr)`,
  }
  const { className: instagramClass = '' } = stitchesInstance.css(css)()
  console.info('9779 instag class', className, instagramClass)
  return (
    <div className={`${className} ${instagramClass}`} ref={ref} {...rest}>
      {!token
        ? 'Token is empty'
        : media.map((item, key) => {
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
  numberOfImages: [12],
  imagesPerRow: [4],
  css: {
    '@desktop': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      '& .wv-instagram-item': {
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
        '& img': {
          objectFit: 'contain',
        },
      },
    },
  },
}

export default Instagram
