import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '~/context'
import type { VideoElementProps } from '~/types'
import { getVimeoId, getYoutubeEmbedId } from '~/utils'
import { HTMLVideo } from './HTMLVideo'
import { Vimeo } from './Vimeo'
import { Youtube } from './Youtube'

let Video = forwardRef<HTMLDivElement, VideoElementProps>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  let {
    src,
    controls,
    poster,
    autoPlay: originAutoPlay,
    loop,
    muted,
    ...rest
  } = props
  let autoPlay = !isDesignMode && originAutoPlay
  let videoProps = { src, controls, poster, autoPlay, loop, muted }
  let content
  let youtubeId = getYoutubeEmbedId(src)
  let vimeoId = getVimeoId(src)
  // youtube
  if (youtubeId) {
    content = <Youtube {...videoProps} youtubeId={youtubeId} />
    // vimeo
  } else if (vimeoId) {
    content = <Vimeo {...videoProps} vimeoId={vimeoId} />
  } else {
    content = <HTMLVideo {...videoProps} />
  }
  return (
    <div ref={ref} {...rest}>
      {content}
    </div>
  )
})

export let css = {
  '@desktop': {
    video: {
      height: '100%',
      width: '100%',
      aspectRatio: '16 / 9',
    },
    iframe: {
      border: 'none',
    },
  },
  '@mobile': {
    iframe: {
      border: 'none',
    },
  },
}

Video.defaultProps = {
  src: 'https://youtu.be/wM-NT6hcw48',
  poster:
    'https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/-/preview/-/quality/smart/-/format/auto/',
  loop: false,
  controls: false,
  autoPlay: true,
  muted: true,
}

export default Video
