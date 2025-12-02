import type { YoutubeElementProps } from '~/types/components'

export function Youtube(props: YoutubeElementProps) {
  let { youtubeId, controls, autoPlay, loop, muted } = props
  let params = new URLSearchParams({
    autoplay: autoPlay ? '1' : '0',
    controls: controls ? '1' : '0',
    loop: loop ? '1' : '0',
    mute: muted ? '1' : '0',
  })
  let youtubeSrc = `https://www.youtube.com/embed/${youtubeId}?playlist=${youtubeId}&${params.toString()}`
  let allow = `accelerometer;${
    autoPlay ? 'autoplay;' : ''
  } clipboard-write; encrypted-media; gyroscope; picture-in-picture`
  return (
    <iframe
      allow={allow}
      height="100%"
      src={youtubeSrc}
      title="Youtube embed video"
      width="100%"
    />
  )
}
