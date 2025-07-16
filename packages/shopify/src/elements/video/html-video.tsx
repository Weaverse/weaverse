import type { VideoCommonProps } from '~/types/components'

export function HTMLVideo(props: VideoCommonProps) {
  let { src, type, controls, autoPlay, loop, muted } = props
  return (
    <video
      autoPlay={autoPlay}
      controls={controls}
      controlsList="nodownload"
      disablePictureInPicture
      loop={loop}
      muted={muted}
    >
      <source src={src} type={type || 'video/mp4'} />
      <source src={src} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  )
}
