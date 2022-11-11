import React, { forwardRef, useEffect, useState } from 'react'
import type { InstagramElementProps, InstagramMedia } from '~/types'
import Placeholder from './shared/Placeholder'

let INSTAGRAM_API = 'https://graph.instagram.com'

let Instagram = forwardRef<HTMLDivElement, InstagramElementProps>(
  (props, ref) => {
    let { token, username, numberOfImages, imagesPerRow, gap, ...rest } = props
    let [media, setMedia] = useState<InstagramMedia[]>([])
    let [error, setError] = useState(null)

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
              ? 'Connect to Instagram to display photos on your site.'
              : 'Invalid or expired token!'}
          </Placeholder>
        </div>
      )
    }

    let style = {
      '--wv-ig-images-per-row': imagesPerRow,
      '--wv-ig-images-gap': gap + 'px',
    } as React.CSSProperties

    return (
      <div ref={ref} {...rest} style={style}>
        <div className="wv-ig-media-container">
          {media.slice(0, numberOfImages).map((item) => {
            let { id, permalink, caption, media_url } = item
            return (
              <a key={id} href={permalink} target="_blank" rel="noreferrer">
                <img alt={caption} src={media_url} />
              </a>
            )
          })}
        </div>
      </div>
    )
  }
)
export let css = {
  // '@desktop': {
  //   '.wv-ig-media-container': {
  //     overflow: 'hidden',
  //     maxWidth: '100%',
  //     maxHeight: '100%',
  //     display: 'grid',
  //     gridTemplateColumns: 'repeat(var(--wv-ig-images-per-row, 4), 1fr)',
  //     gap: 'var(--wv-ig-images-gap, 0px)',
  //     img: {
  //       // aspectRatio: '1 / 1',
  //       maxWidth: '100%',
  //       maxHeight: '100%',
  //       objectFit: 'cover',
  //     },
  //   },
  // },
}

export let permanentCss = {
  '@desktop': {
    '.wv-ig-media-container': {
      overflow: 'hidden',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(var(--wv-ig-images-per-row, 4), 1fr)',
      gap: 'var(--wv-ig-images-gap, 0px)',
      img: {
        // aspectRatio: '1 / 1',
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
      },
    },
  },
  '@mobile': {
    '.wv-ig-media-container': {
      overflowX: 'auto',
      display: 'flex',
      scrollSnapType: 'x mandatory',
    },
    '.wv-ig-media-container a': {
      scrollSnapAlign: 'start',
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: '100%',
    },
  },
}

Instagram.defaultProps = {
  token: '',
  username: '',
  numberOfImages: 8,
  imagesPerRow: 4,
  gap: 0,
}

export default Instagram
