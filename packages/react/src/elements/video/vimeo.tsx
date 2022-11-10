import React from 'react'
import type { VimeoElementProps } from '~/types'

export function Vimeo(props: VimeoElementProps) {
  let { vimeoId, controls, autoPlay, loop, muted } = props
  let params = `autoplay=${autoPlay}&loop=${loop}&controls=${controls}&muted=${muted}`
  let vimeoSrc = `https://player.vimeo.com/video/${vimeoId}?${params}`
  return <iframe src={vimeoSrc} width="100%" height="100%" allowFullScreen />
}
