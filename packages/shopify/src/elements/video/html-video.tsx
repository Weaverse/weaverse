import React from 'react'
import type { VideoCommonProps } from '~/types/components'

export function HTMLVideo(props: VideoCommonProps) {
  let { src, type, controls, autoPlay, loop, muted } = props
  return (
    <video
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controlsList="nodownload"
      disablePictureInPicture
    >
      <source src={src} type={type || 'video/mp4'} />
      <source src={src} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  )
}
