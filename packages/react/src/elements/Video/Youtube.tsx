import React from 'react'
import type { YoutubeElementProps } from '~/types'

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
      src={youtubeSrc}
      width="100%"
      height="100%"
      allowFullScreen
      allow={allow}
    />
  )
}
