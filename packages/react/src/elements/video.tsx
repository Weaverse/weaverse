import React, { forwardRef, useContext } from 'react'
import { WeaverseContext } from '../context'
import { VideoElementProps } from '../types'

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
        Your browser does not support the video tag.
      </video>
    </div>
  )
})

Video.defaultProps = {
  src: 'https://youtu.be/wM-NT6hcw48',
  poster:
    'https://ucarecdn.com/48d73272-3fe3-43f6-8b5b-22b68fc5a8c8/section.png',
  loop: false,
  type: 'video/mp4',
  controls: false,
  autoPlay: true,
  muted: true,
  css: {
    '@desktop': {
      video: {
        height: '100%',
        width: '100%',
        aspectRatio: '16 / 9',
      },
    },
  },
}

export default Video
