import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { WeaverseContext } from '../context'
import { InstagramElementProps, InstagramMedia } from '../types'
import Placeholder from './shared/Placeholder'

let INSTAGRAM_API = 'https://graph.instagram.com'

const Instagram = forwardRef<HTMLDivElement, InstagramElementProps>(
  (props, ref) => {
    const { token, username, numberOfImages, imagesPerRow, gap, ...rest } =
      props
    const [media, setMedia] = useState<InstagramMedia[]>([])
    const [error, setError] = useState(null)
    let { isDesignMode } = useContext(WeaverseContext)

    useEffect(() => {
      if (token) {
        let params = new URLSearchParams({
          access_token: token,
          fields: 'id,media_type,caption,media_url,permalink',
        })
        fetch(`${INSTAGRAM_API}/me/media?${params.toString()}`)
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setError(res)
            } else {
              setError(null)
              setMedia([...res.data])
            }
          })
          .catch(setError)
      }
    }, [token])

    if (!token || error) {
      return (
        <div ref={ref} {...rest}>
          <Placeholder element="Instagram">
            {!token
              ? 'Connect your Instagram account to display photos on your site.'
              : 'Invalid or expired token!'}
          </Placeholder>
        </div>
      )
    }

    let style = {
      '--wv-ig-images-per-row': imagesPerRow,
      '--wv-ig-images-gap': gap,
    } as React.CSSProperties

    return (
      <div ref={ref} {...rest} style={style}>
        <div className="wv-ig-medias">
          {media.slice(0, numberOfImages).map((item) => {
            let linkProps
            if (!isDesignMode) {
              linkProps = { href: item.permalink, target: '_blank' }
            }

            return (
              <a key={item.id} {...linkProps}>
                <img alt={item.caption} src={item.media_url} />
              </a>
            )
          })}
        </div>
      </div>
    )
  }
)

Instagram.defaultProps = {
  token: '',
  username: '',
  numberOfImages: 8,
  imagesPerRow: 4,
  gap: 0,
  css: {
    '@desktop': {
      '.wv-ig-medias': {
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(var(--wv-ig-images-per-row, 4), 1fr)',
        gap: 'var(--wv-ig-images-gap, 0px)',
        img: {
          aspectRatio: '1 / 1',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
      },
    },
  },
}

export default Instagram
