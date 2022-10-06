import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '~/context'
import type { VideoElementProps } from '~/types'

let Video = forwardRef<HTMLDivElement, VideoElementProps>((props, ref) => {
  let { isDesignMode } = useContext(WeaverseContext)
  let { src, type, controls, poster, autoPlay, loop, muted, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      <video
        controls={isDesignMode ? false : controls}
        autoPlay={isDesignMode ? false : autoPlay}
        loop={loop}
        muted={true}
        controlsList="nodownload"
        disablePictureInPicture
      >
        <source src={src} type={type || 'video/mp4'} />
        <source src={src} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
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
  },
}

Video.defaultProps = {
  src: 'https://youtu.be/wM-NT6hcw48',
  poster:
    'https://ucarecdn.com/c413b8fe-ceec-4948-9c42-a0434c4ca920/-/preview/-/quality/smart/-/format/auto/',
  loop: false,
  type: 'video/mp4',
  controls: false,
  autoPlay: true,
  muted: true,
}

export default Video
