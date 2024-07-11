import { forwardRef, useEffect, useState } from 'react'

import { Components } from '~/components'
import { INSTAGRAM_API } from '~/constant'
import type { InstagramElementProps, InstagramMedia } from '~/types/components'

let Instagram = forwardRef<HTMLDivElement, InstagramElementProps>(
  (props, ref) => {
    let { token, username, numberOfImages, imagesPerRow, gap, ...rest } = props
    let [media, setMedia] = useState<InstagramMedia[]>([])
    let [error, setError] = useState(null)

    useEffect(() => {
      if (token) {
        let params = new URLSearchParams({
          access_token: token,
          fields: 'id,media_type,caption,media_url,permalink,thumbnail_url',
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
          <Components.Placeholder element="Instagram">
            {!token
              ? 'Connect to Instagram to display photos on your site.'
              : 'Invalid or expired token!'}
          </Components.Placeholder>
        </div>
      )
    }

    let style = {
      '--wv-ig-images-per-row': imagesPerRow,
      '--wv-ig-images-gap': `${gap}px`,
    } as React.CSSProperties

    return (
      <div ref={ref} {...rest} style={style}>
        <div className="wv-ig-media-container">
          {media.slice(0, numberOfImages).map((item) => {
            let {
              id,
              permalink,
              caption,
              media_url,
              media_type,
              thumbnail_url,
            } = item
            if (media_type === 'VIDEO') {
              return (
                <video key={id} controls poster={thumbnail_url}>
                  <source src={media_url} type="video/mp4" />
                </video>
              )
            }
            return (
              <a key={id} href={permalink} target="_blank" rel="noreferrer">
                <img alt={caption} src={media_url} />
              </a>
            )
          })}
        </div>
      </div>
    )
  },
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
      video: {
        width: '100%',
        height: '100%',
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
